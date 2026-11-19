import { strict as assert } from 'node:assert';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME } from 'src/helpers/constants';
import { writeFileAtomic } from 'src/helpers/fsUtils';
import { configChangeDetector } from 'src/services/ConfigChangeDetector';
import { configService } from 'src/services/ConfigService';

import { ConfigurationTarget, testState, workspace } from '../mocks/vscode';

import type { IconConfiguration } from 'src/models/IconConfiguration';

const repoRoot = join(__dirname, '..', '..');

/** Icon sources of the extension: the iconGenerator submodule and the icons of this fork */
const LINKED_FOLDERS = ['iconGenerator', 'assets'];

/**
 * Creates a fake installed extension: a copy of the built `dist` theme files and junctions to the icons.
 */
const createExtensionDirectory = (): string => {
  const extensionPath = mkdtempSync(join(tmpdir(), 'afi-test-'));
  for (const file of [JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME]) {
    cpSync(join(repoRoot, 'dist', file), join(extensionPath, 'dist', file));
  }
  for (const folder of LINKED_FOLDERS) {
    symlinkSync(join(repoRoot, folder), join(extensionPath, folder), 'junction');
  }
  return extensionPath;
};

/** Content of the svg the theme uses for the given icon definition */
const readIcon = (theme: IconConfiguration, definition: string) => {
  const iconPath = theme.iconDefinitions?.[definition]?.iconPath;
  assert.ok(iconPath, `${definition} icon definition missing`);
  return readFileSync(join(testState.extensionPath, 'dist', iconPath), 'utf8');
};

/** existsSync with the exact case of the file name, as on Linux, even on Windows and macOS */
const existsWithCase = (path: string) => existsSync(path) && readdirSync(dirname(path)).includes(basename(path));

const readTheme = (): IconConfiguration =>
  JSON.parse(readFileSync(join(testState.extensionPath, 'dist', JSON_FILE_NAME), 'utf8'));

/** Simulates VS Code applying the given user settings and firing onDidChangeConfiguration */
const applySettings = (settings: Record<string, unknown>) => {
  testState.config = { ...testState.config, ...settings };
  configChangeDetector.listenForChanges();
};

describe('ConfigChangeDetector', () => {
  before(() => {
    assert.ok(existsSync(join(repoRoot, 'dist', JSON_FILE_NAME)), 'run `bun run build` first');
  });

  beforeEach(() => {
    testState.config = {};
    testState.extensionPath = createExtensionDirectory();
  });

  afterEach(() => {
    // remove the junctions first so the real icons are never touched
    for (const folder of LINKED_FOLDERS) {
      rmSync(join(testState.extensionPath, folder), { force: true, recursive: false });
    }
    rmSync(testState.extensionPath, { force: true, recursive: true });
  });

  describe('foldersAssociations (#74)', () => {
    it('applies a custom folder association', () => {
      applySettings({ foldersAssociations: { claude: 'tools' } });

      assert.equal(readTheme().folderNames?.claude, 'folder-tools');
      assert.equal(readTheme().folderNamesExpanded?.claude, 'folder-tools-open');
    });

    it('keeps the custom folder association when another setting changes', () => {
      applySettings({ foldersAssociations: { claude: 'tools' } });
      applySettings({ opacity: 0.8 });

      assert.equal(readTheme().folderNames?.claude, 'folder-tools');
    });
  });

  describe('filesAssociations (#74)', () => {
    it('maps a custom extension and file name to the chosen icon', () => {
      applySettings({ filesAssociations: { '*.foo': 'typescript', 'special.txt': 'docker' } });

      const theme = readTheme();
      // the svg is typeScript.svg: the name typed in lower case is resolved to it
      assert.equal(theme.fileExtensions?.foo, 'typeScript');
      assert.equal(theme.fileNames?.['special.txt'], 'docker');
    });

    it('overrides a built-in file name association', () => {
      applySettings({ filesAssociations: { 'package.json': 'docker' } });

      assert.equal(readTheme().fileNames?.['package.json'], 'docker');
    });
  });

  describe('Korean names', () => {
    it('writes Korean file, extension and folder names in NFC, the form of the names in the explorer', () => {
      const decomposed = (text: string) => text.normalize('NFD');
      applySettings({
        filesAssociations: { [decomposed('*.한글')]: 'typescript', [decomposed('보고서.md')]: 'docker' },
        foldersAssociations: { [decomposed('도구')]: 'tools' },
      });

      const theme = readTheme();
      assert.equal(theme.fileNames?.['보고서.md'], 'docker');
      assert.equal(theme.fileExtensions?.['한글'], 'typeScript');
      assert.equal(theme.folderNames?.['도구'], 'folder-tools');
      assert.equal(theme.fileNames?.[decomposed('보고서.md')], undefined);
    });
  });

  describe('languagesAssociations', () => {
    it('maps a language id to the chosen icon', () => {
      applySettings({ languagesAssociations: { mylang: 'rust' } });

      assert.equal(readTheme().languageIds?.mylang, 'rust');
    });
  });

  describe('upstream icons', () => {
    it('includes associations synced from the JetBrains plugin', () => {
      applySettings({ opacity: 0.9 });

      const theme = readTheme();
      assert.equal(theme.fileNames?.['uv.lock'], 'uv');
      assert.equal(theme.fileExtensions?.typ, 'typst');
      assert.equal(theme.folderNames?.turborepo, 'folder-turborepo');
      for (const icon of ['uv', 'typst']) {
        const iconPath = theme.iconDefinitions?.[icon]?.iconPath;
        assert.ok(iconPath && existsSync(join(testState.extensionPath, 'dist', iconPath)), `${icon} svg missing`);
      }
    });
  });

  describe('activeIconPacks (#71)', () => {
    it('enables only the selected pack', () => {
      applySettings({ activeIconPacks: ['ngrx'] });

      const theme = readTheme();
      assert.equal(theme.fileNames?.['reducer.ts'], 'ngrx-reducers');
      assert.equal(theme.fileExtensions?.['component.ts'], undefined, 'angular pack should be disabled');
    });

    it('disables every pack when the list is empty', () => {
      applySettings({ activeIconPacks: [] });

      assert.equal(readTheme().fileExtensions?.['component.ts'], undefined);
    });
  });

  describe('saturation (#70)', () => {
    it('writes desaturated icons and points the theme at them', () => {
      applySettings({ saturation: 0 });

      const theme = readTheme();
      const iconName = theme.fileExtensions?.ts;
      assert.ok(iconName, 'no icon for .ts files');
      const iconPath = theme.iconDefinitions?.[iconName]?.iconPath;
      assert.ok(iconPath, `${iconName} icon definition missing`);
      const svgPath = join(testState.extensionPath, 'dist', iconPath);
      assert.ok(existsSync(svgPath), `${iconPath} was not written`);
      assert.match(readFileSync(svgPath, 'utf8'), /feColorMatrix type=.saturate. values=.0./);
    });

    it('keeps saturation when another setting changes', () => {
      applySettings({ saturation: 0.3 });
      applySettings({ folderColor: '#ff0000' });

      assert.equal(readTheme().atomConfig?.saturation, 0.3);
    });
  });

  describe('change detection', () => {
    it('does not rewrite the theme when nothing changed', () => {
      applySettings({ opacity: 0.5 });
      const themePath = join(testState.extensionPath, 'dist', JSON_FILE_NAME);
      const before = statSync(themePath).mtimeMs;

      applySettings({});

      assert.equal(statSync(themePath).mtimeMs, before);
    });

    // writing the thousands of icons again blocked the extension host for seconds (fork #28)
    it('does not write the icons again when a setting that does not change them changes', () => {
      applySettings({ opacity: 0.5 });
      const iconPath = readTheme().iconDefinitions?.[readTheme().fileExtensions?.ts ?? '']?.iconPath;
      assert.ok(iconPath, 'no icon for .ts files');
      const svgPath = join(testState.extensionPath, 'dist', iconPath);
      const past = new Date('2020-01-01');
      utimesSync(svgPath, past, past);

      applySettings({ filesAssociations: { 'keys.txt': 'secret' } });

      assert.equal(readTheme().iconDefinitions?.[readTheme().fileExtensions?.ts ?? '']?.iconPath, iconPath);
      assert.equal(statSync(svgPath).mtimeMs, past.getTime());
    });

    it('removes the icons written for previous filter settings', () => {
      const filesFolder = join(testState.extensionPath, 'dist', 'files');
      const hashed = () => readdirSync(filesFolder).filter((file) => file.includes('~'));

      applySettings({ opacity: 0.5 });
      const first = hashed();
      assert.ok(first.length > 0, 'no icon written for the opacity');

      applySettings({ opacity: 0.6 });
      const second = hashed();
      assert.ok(second.length > 0, 'no icon written for the new opacity');
      assert.ok(first.every((file) => !second.includes(file)), 'the icons were not renamed');
      assert.equal(second.length, first.length, 'the icons of the previous opacity are left');

      applySettings({ opacity: 1 });
      assert.deepEqual(hashed(), []);
    });
  });

  describe('theme integrity', () => {
    /** Mappings of the current theme whose svg does not exist (with the exact case) */
    const findBrokenMappings = () => {
      const theme = readTheme();
      const broken: string[] = [];
      for (const [variant, config] of [['base', theme], ['light', theme.light], ['highContrast', theme.highContrast]] as const) {
        for (const key of ['file', 'folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded'] as const) {
          const icon = config?.[key];
          if (typeof icon === 'string') checkIcon(theme, icon, `${variant}.${key}`, broken);
        }
        for (const key of ['fileExtensions', 'fileNames', 'languageIds', 'folderNames', 'folderNamesExpanded'] as const) {
          for (const [entry, icon] of Object.entries(config?.[key] ?? {})) {
            checkIcon(theme, icon, `${variant}.${key}.${entry}`, broken);
          }
        }
      }
      return broken;
    };

    const checkIcon = (theme: IconConfiguration, icon: string, label: string, broken: string[]) => {
      const iconPath = theme.iconDefinitions?.[icon]?.iconPath;
      if (!iconPath || !existsWithCase(join(testState.extensionPath, 'dist', iconPath))) {
        broken.push(`${label} -> ${icon}`);
      }
    };

    it('points every mapping to an icon definition whose svg exists', () => {
      applySettings({ opacity: 0.9 });

      assert.deepEqual(findBrokenMappings(), []);
    });

    it('does the same with every icon pack and the classic folders', () => {
      const packs = ['angular', 'angular2', 'css', 'nest', 'next', 'ngrx', 'phalcon', 'rails', 'react', 'recoil', 'redux', 'tests', 'volt', 'vue', 'vuex'];
      applySettings({ activeIconPacks: packs, folderTheme: 'classic' });

      assert.deepEqual(findBrokenMappings(), []);
    });
  });

  describe('light theme variants', () => {
    it('uses the _dark icon in dark themes and the plain icon in light themes', () => {
      applySettings({ opacity: 0.9 });

      const theme = readTheme();
      assert.equal(theme.fileExtensions?.['test.js'], 'testjs_dark');
      assert.equal(theme.light?.fileExtensions?.['test.js'], 'testjs');
      assert.equal(theme.languageIds?.csound, 'csound_dark');
      assert.equal(theme.light?.languageIds?.csound, 'csound');
    });
  });

  describe('language icons', () => {
    it('defines language icons that no file association uses', () => {
      applySettings({ opacity: 0.9 });

      const theme = readTheme();
      assert.equal(theme.languageIds?.bower, 'bower');
      assert.equal(theme.languageIds?.gruntfile, 'gruntfile');
      assert.equal(theme.languageIds?.dtd, 'markup');
    });

    it('finds a bundled icon typed in another case (svg names are case-sensitive on Linux)', () => {
      applySettings({
        filesAssociations: { '*.foo': 'githubactions' },
        languagesAssociations: { mylang: 'GROOVYFILE' },
      });

      const theme = readTheme();
      assert.equal(theme.fileExtensions?.foo, 'githubActions');
      assert.equal(theme.languageIds?.mylang, 'groovyFile');
    });

    it('keeps the case of custom language ids', () => {
      applySettings({ languagesAssociations: { MyLang: 'rust' } });

      assert.equal(readTheme().languageIds?.MyLang, 'rust');
    });

    it('accepts a custom SVG file', () => {
      const directory = mkdtempSync(join(tmpdir(), 'afi-lang-'));
      try {
        writeFileSync(join(directory, 'lang.svg'), '<svg xmlns="http://www.w3.org/2000/svg"><path fill="#abcdef"/></svg>');
        applySettings({ languagesAssociations: { mylang: join(directory, 'lang.svg') } });

        const theme = readTheme();
        const name = theme.languageIds?.mylang ?? '';
        assert.match(name, /^custom-lang-/);
        assert.match(readIcon(theme, name), /#abcdef/);
      } finally {
        rmSync(directory, { force: true, recursive: true });
      }
    });
  });

  describe('PyCharm icon pack', () => {
    it('gives every Python file the PyCharm Python icon, like PyCharm', () => {
      applySettings({ opacity: 0.9 });

      const theme = readTheme();
      for (const extension of ['py', 'pyi', 'test.py']) {
        assert.equal(theme.fileExtensions?.[extension], 'pycharm-python_dark', extension);
        assert.equal(theme.light?.fileExtensions?.[extension], 'pycharm-python', extension);
      }
      for (const name of ['manage.py', '__init__.py']) {
        assert.equal(theme.fileNames?.[name], 'pycharm-python_dark', name);
      }
      assert.equal(theme.languageIds?.python, 'pycharm-python_dark');
      assert.match(readIcon(theme, 'pycharm-python_dark'), /#548AF7/);
    });

    it('keeps the Atom icons when the pack is disabled', () => {
      applySettings({ activeIconPacks: ['angular', 'rails', 'tests'] });

      const theme = readTheme();
      assert.equal(theme.fileExtensions?.py, 'python');
      assert.equal(theme.fileNames?.['manage.py'], 'djangoconfig');
    });

    it('lets a custom association win', () => {
      applySettings({ filesAssociations: { 'manage.py': 'docker' } });

      assert.equal(readTheme().fileNames?.['manage.py'], 'docker');
    });
  });

  describe('Tests icon pack', () => {
    it('shows the test icons by default', () => {
      applySettings({ opacity: 0.9 });

      assert.equal(readTheme().fileExtensions?.['test.ts'], 'testts');
      assert.equal(readTheme().fileExtensions?.['spec.go'], 'testgo');
    });

    it('hides them when the pack is disabled', () => {
      applySettings({ activeIconPacks: ['angular'] });

      assert.equal(readTheme().fileExtensions?.['test.ts'], undefined);
    });
  });

  describe('CSS icon pack', () => {
    it('replaces the css icon, including its light variant', () => {
      applySettings({ activeIconPacks: ['css'] });

      const theme = readTheme();
      assert.equal(theme.fileExtensions?.css, 'css2');
      assert.equal(theme.light?.fileExtensions?.css, undefined);
    });

    it('keeps the base css icon when disabled', () => {
      applySettings({ opacity: 0.9 });

      assert.notEqual(readTheme().fileExtensions?.css, 'css2');
    });
  });

  describe('monochrome', () => {
    it('recolors the icons with the hue of the chosen color', () => {
      applySettings({ monochrome: true, monochromeColor: '#ff0000' });

      const theme = readTheme();
      const svg = readIcon(theme, theme.fileExtensions?.ts ?? '');
      const colors = [...svg.matchAll(/fill="#([\dA-Fa-f]{6})"/g)].map(([, hex]) => hex.toLowerCase());
      assert.ok(colors.length > 0, 'no fill color in the ts icon');
      for (const hex of colors) {
        // red hue: the green and blue channels are equal
        assert.equal(hex.slice(2, 4), hex.slice(4, 6), `#${hex} is not a shade of red`);
      }
    });

    it('ignores the color while disabled', () => {
      applySettings({ monochromeColor: '#ff0000' });

      assert.equal(readTheme().atomConfig?.monochrome, false);
    });
  });

  describe('hideFileIcons', () => {
    it('removes the file icons and keeps the folder icons', () => {
      applySettings({ hideFileIcons: true });

      const theme = readTheme();
      assert.equal(theme.file, undefined);
      assert.deepEqual(theme.fileExtensions, {});
      assert.deepEqual(theme.languageIds ?? {}, {});
      assert.equal(theme.folderNames?.src, 'folder-src');
    });
  });

  describe('custom SVG icons', () => {
    let iconsDirectory = '';

    beforeEach(() => {
      iconsDirectory = mkdtempSync(join(tmpdir(), 'afi-icons-'));
      writeFileSync(join(iconsDirectory, 'foo.svg'), '<svg xmlns="http://www.w3.org/2000/svg"><path fill="#123456"/></svg>');
      writeFileSync(join(iconsDirectory, 'foo-open.svg'), '<svg xmlns="http://www.w3.org/2000/svg"><path fill="#654321"/></svg>');
    });

    afterEach(() => rmSync(iconsDirectory, { force: true, recursive: true }));

    it('copies a custom file icon and associates it', () => {
      applySettings({ filesAssociations: { '*.foo': join(iconsDirectory, 'foo.svg') } });

      const theme = readTheme();
      const name = theme.fileExtensions?.foo ?? '';
      assert.match(name, /^custom-foo-/);
      assert.match(readIcon(theme, name), /#123456/);
    });

    it('uses the -open sibling for expanded folders', () => {
      applySettings({ foldersAssociations: { recipes: join(iconsDirectory, 'foo.svg') } });

      const theme = readTheme();
      assert.match(readIcon(theme, theme.folderNames?.recipes ?? ''), /#123456/);
      assert.match(readIcon(theme, theme.folderNamesExpanded?.recipes ?? ''), /#654321/);
    });

    it('ignores a missing file', () => {
      applySettings({ filesAssociations: { '*.foo': join(iconsDirectory, 'missing.svg') } });

      assert.equal(readTheme().fileExtensions?.foo, undefined);
    });
  });

  describe('iconThemeLayers, iconThemeByName', () => {
    const SVG = (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="${color}" d="M0 0h16v16H0z"/></svg>`;

    /** A fake installed icon theme extension, like PKief.material-icon-theme */
    const fallbackTheme = {
      fileExtensions: { 'foo.zzq2': 'fb-file', py: 'fb-python', 'test.py': 'fb-python', zzq: 'fb-file' },
      fileNames: {
        'gone.zzz': 'fb-missing',
        'package.json': 'fb-file',
        'pic.zzz': 'fb-png',
        'sub/zz-unknown2': 'fb-file',
        'zz-unknown': 'fb-file',
        zzbuildfile: 'fb-file',
        zzbuildfile2: 'fb-file',
      },
      folderNames: { '.github/fb-sub': 'fb-folder', 'fb-folder': 'fb-folder', src: 'fb-folder' },
      folderNamesExpanded: { 'fb-folder': 'fb-folder-open', src: 'fb-folder-open' },
      iconDefinitions: {
        'fb-file': { iconPath: './../icons/fb-file.svg' },
        'fb-file-light': { iconPath: './../icons/fb-file-light.svg' },
        'fb-folder': { iconPath: './../icons/fb-folder.svg' },
        'fb-folder-open': { iconPath: './../icons/fb-folder-open.svg' },
        'fb-lang': { iconPath: './../icons/fb-lang.svg' },
        'fb-missing': { iconPath: './../icons/fb-missing.svg' },
        'fb-png': { iconPath: './../icons/fb-png.png' },
        'fb-python': { iconPath: './../icons/fb-python.svg' },
      },
      languageIds: { 'fb-lang': 'fb-lang', python: 'fb-python' },
      light: { fileNames: { 'zz-unknown': 'fb-file-light' } },
    };

    /** Folders of the fake installed themes */
    let themePaths: string[] = [];
    /** Json of the last installed fake theme */
    let fallbackJson: string;

    /**
     * Installs a fake icon theme extension next to the others, its svg icons filled with the given color.
     * The first one also declares that zzbuildfile is a Python file: this theme shows it with its Python language icon.
     */
    const installTheme = (themeId = 'material-icon-theme', json: object = fallbackTheme, color = '#123456') => {
      const themePath = mkdtempSync(join(tmpdir(), 'afi-layer-'));
      themePaths.push(themePath);
      fallbackJson = join(themePath, 'dist', 'material-icons.json');
      for (const name of Object.keys(fallbackTheme.iconDefinitions).filter((key) => !['fb-missing', 'fb-png'].includes(key))) {
        writeFileAtomic(join(themePath, 'icons', `${name}.svg`), SVG(color));
      }
      writeFileAtomic(join(themePath, 'icons', 'fb-png.png'), 'not an svg');
      writeFileAtomic(fallbackJson, JSON.stringify(json));

      if (testState.extensions.length === 0) {
        testState.extensions.push({
          extensionPath: themePath,
          id: 'test.languages',
          packageJSON: { contributes: { languages: [{ filenames: ['ZZBuildFile'], id: 'python' }] } },
        });
      }
      testState.extensions.push({
        extensionPath: themePath,
        id: `test.${themeId}`,
        packageJSON: {
          contributes: { iconThemes: [{ id: themeId, path: './dist/material-icons.json' }] },
          version: '5.0.0',
        },
      });
    };
    const installFallbackTheme = (themeId = 'material-icon-theme') => installTheme(themeId);

    /** The theme generated with the default settings and without any other theme */
    const ownTheme = () => {
      testState.extensions = [];
      applySettings({ opacity: 0.99 });
      applySettings({ opacity: undefined });
      return readTheme();
    };

    /** Color of the svg of the icon the theme gives to a name of one of its maps */
    const colorOf = (theme: IconConfiguration, definition: string | undefined) =>
      /fill="(#\w+)"/.exec(readIcon(theme, definition ?? ''))?.[1];

    beforeEach(() => {
      testState.extensions = [];
    });

    afterEach(() => {
      testState.extensions = [];
      for (const themePath of themePaths) rmSync(themePath, { force: true, recursive: true });
      themePaths = [];
    });

    it('gives the names this theme does not know the icon of a fill layer', () => {
      installFallbackTheme();
      configChangeDetector.listenForChanges();
      const theme = readTheme();

      const definition = theme.fileNames?.['zz-unknown'];
      assert.ok(definition, 'zz-unknown not mapped');
      assert.equal(readIcon(theme, definition), SVG('#123456'));
      assert.equal(theme.fileNames?.['sub/zz-unknown2'], definition);
      assert.equal(theme.fileNames?.zzbuildfile2, definition);
      assert.equal(theme.fileExtensions?.zzq, definition);
      assert.equal(theme.fileExtensions?.['foo.zzq2'], definition);
      assert.ok(theme.languageIds?.['fb-lang']);
      // the light variant of the layer
      assert.ok(theme.light?.fileNames?.['zz-unknown']);
      assert.notEqual(theme.light?.fileNames?.['zz-unknown'], definition);
    });

    it('keeps the icon of this theme for every name it knows, by name, extension or language', () => {
      const own = ownTheme();
      installFallbackTheme();
      configChangeDetector.listenForChanges();
      const theme = readTheme();

      assert.equal(theme.fileNames?.['package.json'], own.fileNames?.['package.json']);
      assert.equal(theme.fileExtensions?.py, own.fileExtensions?.py);
      assert.equal(theme.fileExtensions?.['test.py'], own.fileExtensions?.['test.py']);
      assert.equal(theme.languageIds?.python, own.languageIds?.python);
      // a Python file by its name keeps the Python language icon of this theme
      assert.equal(theme.fileNames?.zzbuildfile, undefined);
      assert.equal(theme.folderNames?.src, own.folderNames?.src);
      assert.equal(theme.folderNamesExpanded?.src, own.folderNamesExpanded?.src);
      assert.equal(theme.file, own.file);
      assert.equal(theme.folder, own.folder);
    });

    it('gives the folders this theme does not know the icons of a fill layer', () => {
      installFallbackTheme();
      configChangeDetector.listenForChanges();
      const theme = readTheme();

      assert.ok(theme.folderNames?.['fb-folder']);
      assert.ok(theme.folderNames?.['.github/fb-sub']);
      assert.ok(theme.folderNamesExpanded?.['fb-folder']);
      assert.notEqual(theme.folderNamesExpanded?.['fb-folder'], theme.folderNames?.['fb-folder']);
    });

    it('adds no folder with the classic folder theme and no file with hidden file icons', () => {
      installFallbackTheme();
      applySettings({ folderTheme: 'classic', hideFileIcons: true });
      const theme = readTheme();

      assert.equal(theme.folderNames?.['fb-folder'], undefined);
      assert.equal(theme.fileNames?.['zz-unknown'], undefined);
      assert.equal(theme.languageIds?.['fb-lang'], undefined);
    });

    it('skips the icons that are missing or are not svg files', () => {
      installFallbackTheme();
      configChangeDetector.listenForChanges();
      const theme = readTheme();

      assert.equal(theme.fileNames?.['gone.zzz'], undefined);
      assert.equal(theme.fileNames?.['pic.zzz'], undefined);
      for (const definition of Object.values(theme.iconDefinitions ?? {})) {
        assert.ok(existsSync(join(testState.extensionPath, 'dist', definition.iconPath ?? '')), definition.iconPath);
      }
    });

    it('applies the filters of this theme to the icons of the other themes', () => {
      installFallbackTheme();
      applySettings({ opacity: 0.5 });
      const theme = readTheme();

      const icon = readIcon(theme, theme.fileNames?.['zz-unknown'] ?? '');
      assert.notEqual(icon, SVG('#123456'));
      assert.match(icon, /opacity/);
    });

    it('removes the icons of the other themes when the layers are emptied', () => {
      installFallbackTheme();
      configChangeDetector.listenForChanges();
      assert.ok(readTheme().fileNames?.['zz-unknown']);

      applySettings({ iconThemeLayers: [] });
      const theme = readTheme();
      assert.equal(theme.fileNames?.['zz-unknown'], undefined);
      assert.ok(!Object.keys(theme.iconDefinitions ?? {}).some((key) => key.startsWith('layer-')));
      assert.deepEqual(readdirSync(join(testState.extensionPath, 'dist', 'layers')), []);
    });

    it('uses another installed theme given by its id, and ignores an id that is not installed', () => {
      installFallbackTheme('other-icons');
      configChangeDetector.listenForChanges();
      assert.equal(readTheme().fileNames?.['zz-unknown'], undefined);

      applySettings({ iconThemeLayers: ['not-installed', { theme: 'other-icons' }] });
      assert.ok(readTheme().fileNames?.['zz-unknown']);
    });

    it('fills with the first listed theme first', () => {
      installTheme('first', fallbackTheme, '#111111');
      installTheme('second', { ...fallbackTheme, fileNames: { 'zz-second': 'fb-file', 'zz-unknown': 'fb-file' } }, '#222222');
      applySettings({ iconThemeLayers: ['first', 'second'] });
      const theme = readTheme();

      assert.equal(colorOf(theme, theme.fileNames?.['zz-unknown']), '#111111');
      // the names only the second one knows
      assert.equal(colorOf(theme, theme.fileNames?.['zz-second']), '#222222');
    });

    it('gives the icons of an override layer to every name it knows, and keeps the folders when they are off', () => {
      const own = ownTheme();
      installTheme('material-icon-theme', { ...fallbackTheme, file: 'fb-file', folder: 'fb-folder' });
      applySettings({ iconThemeLayers: [{ files: 'override', folders: 'off', theme: 'material-icon-theme' }] });
      const theme = readTheme();

      const python = theme.fileExtensions?.py;
      assert.ok(python?.startsWith('layer-'), python);
      assert.equal(theme.fileExtensions?.['test.py'], python);
      assert.equal(theme.languageIds?.python, python);
      assert.ok(theme.fileNames?.['package.json']?.startsWith('layer-'));
      // a name only this theme knows keeps its icon
      assert.equal(theme.fileExtensions?.ts, own.fileExtensions?.ts);
      assert.ok(theme.file?.startsWith('layer-'));
      // folders off
      assert.equal(theme.folderNames?.src, own.folderNames?.src);
      assert.equal(theme.folderNames?.['fb-folder'], undefined);
      assert.equal(theme.folder, own.folder);
    });

    it('gives the folder icons of an override layer, its default ones too', () => {
      installTheme('material-icon-theme', { ...fallbackTheme, folder: 'fb-folder', folderExpanded: 'fb-folder-open' });
      applySettings({ iconThemeLayers: [{ files: 'off', folders: 'override', theme: 'material-icon-theme' }] });
      const theme = readTheme();

      assert.ok(theme.folderNames?.src?.startsWith('layer-'));
      assert.ok(theme.folderNamesExpanded?.src?.startsWith('layer-'));
      assert.notEqual(theme.folderNamesExpanded?.src, theme.folderNames?.src);
      assert.equal(theme.folder, theme.folderNames?.src);
      assert.equal(theme.folderExpanded, theme.folderNamesExpanded?.src);
      // files off
      assert.equal(theme.fileNames?.['zz-unknown'], undefined);
    });

    it('removes the light variant of this theme for a name an override layer gives its icon to', () => {
      const own = ownTheme();
      const extension = Object.keys(own.light?.fileExtensions ?? {}).find((key) => !key.includes('.'));
      assert.ok(extension, 'no light variant in this theme');
      installTheme('material-icon-theme', { ...fallbackTheme, fileExtensions: { [extension]: 'fb-python' } });
      applySettings({ iconThemeLayers: [{ files: 'override', theme: 'material-icon-theme' }] });
      const theme = readTheme();

      assert.ok(theme.fileExtensions?.[extension]?.startsWith('layer-'));
      assert.equal(theme.light?.fileExtensions?.[extension], undefined);
    });

    it('keeps the user associations over an override layer, and the first listed override wins', () => {
      installTheme('first', fallbackTheme, '#111111');
      installTheme('second', fallbackTheme, '#222222');
      applySettings({
        filesAssociations: { '*.py': 'json' },
        iconThemeLayers: [{ files: 'override', theme: 'first' }, { files: 'override', theme: 'second' }],
      });
      const theme = readTheme();

      assert.ok(!theme.fileExtensions?.py?.startsWith('layer-'), theme.fileExtensions?.py);
      assert.equal(colorOf(theme, theme.fileNames?.['package.json']), '#111111');
      assert.equal(colorOf(theme, theme.fileNames?.['zz-unknown']), '#111111');
    });

    it('gives a name the icon of the theme of iconThemeByName, over every layer', () => {
      installTheme('first', { ...fallbackTheme, file: 'fb-python', folderNames: { src: 'fb-folder' }, folderNamesExpanded: {} }, '#111111');
      installTheme('second', fallbackTheme, '#222222');
      applySettings({
        iconThemeByName: {
          '*.ts': 'first',
          'nothing.here': 'first',
          'package.json': 'first',
          'src/': 'first',
          'zz-unknown': 'first',
        },
        iconThemeLayers: [{ files: 'override', theme: 'second' }],
      });
      const theme = readTheme();

      assert.equal(colorOf(theme, theme.fileNames?.['zz-unknown']), '#111111');
      assert.equal(colorOf(theme, theme.fileNames?.['package.json']), '#111111');
      // no icon for the name in that theme: its default file icon
      assert.equal(colorOf(theme, theme.fileExtensions?.ts), '#111111');
      assert.equal(theme.fileExtensions?.ts, theme.fileNames?.['nothing.here']);
      assert.equal(colorOf(theme, theme.folderNames?.src), '#111111');
      // the expanded folder falls back to the closed one
      assert.equal(theme.folderNamesExpanded?.src, theme.folderNames?.src);
    });

    it('regenerates the theme when a layer theme changes', () => {
      installFallbackTheme();
      configChangeDetector.listenForChanges();
      assert.equal(readTheme().fileNames?.['zz-later'], undefined);

      writeFileAtomic(fallbackJson, JSON.stringify({ ...fallbackTheme, fileNames: { ...fallbackTheme.fileNames, 'zz-later': 'fb-file' } }));
      const later = new Date(statSync(fallbackJson).mtimeMs + 10_000);
      utimesSync(fallbackJson, later, later);
      configChangeDetector.listenForChanges();

      assert.ok(readTheme().fileNames?.['zz-later']);
    });

    it('gives the svg files of a usesCurrentColor theme the text color of the dark and of the light themes', () => {
      // like the built-in VS Code Modern theme: no light variants, every svg drawn with the color of the text
      installTheme('vscode-modern-icons', { ...fallbackTheme, usesCurrentColor: true }, 'currentColor');
      applySettings({ iconThemeLayers: ['vscode-modern-icons'] });
      let theme = readTheme();

      assert.equal(colorOf(theme, theme.fileExtensions?.zzq), '#cccccc');
      assert.equal(colorOf(theme, theme.light?.fileExtensions?.zzq), '#3b3b3b', 'a light variant made from the base icon');
      assert.equal(colorOf(theme, theme.light?.fileNames?.['zz-unknown']), '#3b3b3b', 'the light variant of the theme, toned');
      assert.equal(theme.highContrast?.fileExtensions?.zzq, undefined, 'high contrast themes take the base icon');

      // the filters of this theme apply on top
      applySettings({ opacity: 0.5 });
      theme = readTheme();
      const icon = readIcon(theme, theme.fileExtensions?.zzq ?? '');
      assert.match(icon, /opacity="0.5"/);
      assert.equal(colorOf(theme, theme.fileExtensions?.zzq), '#cccccc');
      assert.ok(!icon.includes('currentColor'));
    });

    describe('font icon themes (Seti)', () => {
      /** Like the built-in vs-seti theme: glyphs of one font, a light variant, no folder icons */
      const setiTheme = {
        file: '_default',
        fileExtensions: { zzq: '_zz' },
        fileNames: { 'zz-named': '_named' },
        fonts: [{ id: 'seti', size: '150%', src: [{ format: 'woff', path: './seti.woff' }], style: 'normal', weight: 'normal' }],
        iconDefinitions: {
          _default: { fontCharacter: String.raw`\E023`, fontColor: '#d4d7d6' },
          _named: { fontCharacter: String.raw`\E002`, fontColor: '#ff0000', fontSize: '120%' },
          _no_font: { fontCharacter: String.raw`\E004`, fontId: 'missing' },
          _zz: { fontCharacter: String.raw`\E001`, fontColor: '#519aba' },
          _zz_light: { fontCharacter: String.raw`\E001`, fontColor: '#498ba7' },
        },
        light: { fileExtensions: { zzq: '_zz_light' } },
      };
      let fontPath: string;

      const installSeti = (json: object = setiTheme, font = 'woff font v1') => {
        const themePath = mkdtempSync(join(tmpdir(), 'afi-seti-'));
        themePaths.push(themePath);
        const jsonPath = join(themePath, 'icons', 'vs-seti-icon-theme.json');
        fontPath = join(themePath, 'icons', 'seti.woff');
        writeFileAtomic(fontPath, font);
        writeFileAtomic(jsonPath, JSON.stringify(json));
        testState.extensions.push({
          extensionPath: themePath,
          id: 'vscode.theme-seti',
          packageJSON: { contributes: { iconThemes: [{ id: 'vs-seti', path: './icons/vs-seti-icon-theme.json' }] }, version: '10.0.0' },
        });
      };

      /** The copy of the font of a glyph definition, as the theme json gives it */
      const fontOf = (theme: IconConfiguration, definition: string | undefined) => {
        const fontId = theme.iconDefinitions?.[definition ?? '']?.fontId;
        return theme.fonts?.find((font) => font.id === fontId);
      };

      it('gives the names this theme does not know a glyph of a fill layer, with its font copied', () => {
        installSeti();
        applySettings({ iconThemeLayers: ['vs-seti'] });
        const theme = readTheme();

        const definition = theme.iconDefinitions?.[theme.fileExtensions?.zzq ?? ''];
        assert.deepEqual(definition, { fontCharacter: String.raw`\E001`, fontColor: '#519aba', fontId: 'layer-vs-seti-seti', fontSize: '150%' });
        assert.equal(theme.iconDefinitions?.[theme.fileNames?.['zz-named'] ?? '']?.fontSize, '120%');
        assert.equal(theme.iconDefinitions?.[theme.light?.fileExtensions?.zzq ?? '']?.fontColor, '#498ba7');

        const font = fontOf(theme, theme.fileExtensions?.zzq);
        assert.equal(theme.fonts?.length, 1);
        assert.equal(font?.src.length, 1);
        assert.equal(font?.src[0].format, 'woff');
        assert.equal(readFileSync(join(testState.extensionPath, 'dist', font?.src[0].path ?? ''), 'utf8'), 'woff font v1');
        // the svg icons of this theme are kept
        assert.ok(theme.iconDefinitions?.[theme.fileExtensions?.ts ?? '']?.iconPath);
        assert.ok(theme.iconDefinitions?.[theme.file ?? '']?.iconPath);
      });

      it('skips the glyphs of a font the theme does not have, and the fonts whose file is missing', () => {
        installSeti({ ...setiTheme, fileNames: { 'zz-no-font': '_no_font' } });
        rmSync(fontPath);
        applySettings({ iconThemeLayers: ['vs-seti'] });
        const theme = readTheme();

        assert.equal(theme.fileNames?.['zz-no-font'], undefined);
        assert.equal(theme.fileExtensions?.zzq, undefined);
        assert.equal(theme.fonts, undefined);
      });

      it('gives the default glyph of an override layer, and the color filters to the glyphs', () => {
        installSeti();
        applySettings({ iconThemeLayers: [{ files: 'override', theme: 'vs-seti' }], saturation: 0 });
        const theme = readTheme();

        assert.equal(theme.iconDefinitions?.[theme.file ?? '']?.fontCharacter, String.raw`\E023`);
        const color = theme.iconDefinitions?.[theme.fileExtensions?.zzq ?? '']?.fontColor ?? '';
        assert.match(color, /^#([\da-f]{2})\1\1$/, color);

        applySettings({ monochrome: true, monochromeColor: '#ff0000', saturation: 1 });
        const red = readTheme().iconDefinitions?.[readTheme().fileNames?.['zz-named'] ?? '']?.fontColor;
        assert.equal(red, '#ff0000');
      });

      it('renames the copy of the font when it changes, and removes the fonts when the layers are emptied', () => {
        installSeti();
        applySettings({ iconThemeLayers: ['vs-seti'] });
        const before = fontOf(readTheme(), readTheme().fileExtensions?.zzq)?.src[0].path;

        writeFileAtomic(fontPath, 'woff font v2');
        const jsonPath = join(dirname(fontPath), 'vs-seti-icon-theme.json');
        const later = new Date(statSync(jsonPath).mtimeMs + 10_000);
        utimesSync(jsonPath, later, later);
        configChangeDetector.listenForChanges();
        const after = fontOf(readTheme(), readTheme().fileExtensions?.zzq)?.src[0].path;
        assert.ok(after && after !== before, `${before} -> ${after}`);
        assert.equal(readdirSync(join(testState.extensionPath, 'dist', 'layers')).length, 1);

        applySettings({ iconThemeLayers: [] });
        assert.equal(readTheme().fonts, undefined);
        assert.deepEqual(readdirSync(join(testState.extensionPath, 'dist', 'layers')), []);
      });
    });
  });
});

describe('writeFileAtomic', () => {
  it('writes the content without leaving temporary files', () => {
    const directory = mkdtempSync(join(tmpdir(), 'afi-write-'));
    try {
      writeFileAtomic(join(directory, 'nested', 'theme.json'), '{"a":1}');
      writeFileAtomic(join(directory, 'nested', 'theme.json'), '{"a":2}');

      assert.equal(readFileSync(join(directory, 'nested', 'theme.json'), 'utf8'), '{"a":2}');
      assert.deepEqual(readdirSync(join(directory, 'nested')), ['theme.json']);
    } finally {
      rmSync(directory, { force: true, recursive: true });
    }
  });
});

describe('ConfigService.setConfigValue (#73)', () => {
  afterEach(() => {
    workspace.workspaceFolders = undefined;
  });

  it('writes to the user settings when no folder is opened', () => {
    configService.folderColor = '#ff0000';

    assert.equal(testState.lastTarget, ConfigurationTarget.Global);
  });

  it('writes to the workspace settings when a folder is opened', () => {
    workspace.workspaceFolders = [{}];
    configService.folderColor = '#ff0000';

    assert.equal(testState.lastTarget, ConfigurationTarget.Workspace);
  });
});
