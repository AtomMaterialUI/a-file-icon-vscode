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

  describe('fallbackIconTheme', () => {
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

    let fallbackPath: string;
    let fallbackJson: string;

    const installFallbackTheme = (themeId = 'material-icon-theme') => {
      fallbackPath = mkdtempSync(join(tmpdir(), 'afi-fallback-'));
      fallbackJson = join(fallbackPath, 'dist', 'material-icons.json');
      for (const name of Object.keys(fallbackTheme.iconDefinitions).filter((key) => !['fb-missing', 'fb-png'].includes(key))) {
        writeFileAtomic(join(fallbackPath, 'icons', `${name}.svg`), SVG('#123456'));
      }
      writeFileAtomic(join(fallbackPath, 'icons', 'fb-png.png'), 'not an svg');
      writeFileAtomic(fallbackJson, JSON.stringify(fallbackTheme));

      testState.extensions = [
        {
          extensionPath: fallbackPath,
          id: 'PKief.material-icon-theme',
          packageJSON: {
            contributes: { iconThemes: [{ id: themeId, path: './dist/material-icons.json' }] },
            version: '5.0.0',
          },
        },
        // declares that zzbuildfile is a Python file: this theme shows it with its Python language icon
        {
          extensionPath: fallbackPath,
          id: 'test.languages',
          packageJSON: { contributes: { languages: [{ filenames: ['ZZBuildFile'], id: 'python' }] } },
        },
      ];
    };

    /** The theme generated with the default settings and without any fallback theme */
    const ownTheme = () => {
      testState.extensions = [];
      applySettings({ opacity: 0.99 });
      applySettings({ opacity: undefined });
      return readTheme();
    };

    beforeEach(() => {
      testState.extensions = [];
    });

    afterEach(() => {
      testState.extensions = [];
      if (fallbackPath) rmSync(fallbackPath, { force: true, recursive: true });
    });

    it('gives the names this theme does not know the icon of the fallback theme', () => {
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
      // the light variant of the fallback theme
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

    it('gives the folders this theme does not know the icons of the fallback theme', () => {
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
        assert.ok(existsSync(join(testState.extensionPath, 'dist', definition.iconPath)), definition.iconPath);
      }
    });

    it('applies the filters of this theme to the icons of the fallback theme', () => {
      installFallbackTheme();
      applySettings({ opacity: 0.5 });
      const theme = readTheme();

      const icon = readIcon(theme, theme.fileNames?.['zz-unknown'] ?? '');
      assert.notEqual(icon, SVG('#123456'));
      assert.match(icon, /opacity/);
    });

    it('removes the fallback icons when the setting is emptied', () => {
      installFallbackTheme();
      configChangeDetector.listenForChanges();
      assert.ok(readTheme().fileNames?.['zz-unknown']);

      applySettings({ fallbackIconTheme: '' });
      const theme = readTheme();
      assert.equal(theme.fileNames?.['zz-unknown'], undefined);
      assert.ok(!Object.keys(theme.iconDefinitions ?? {}).some((key) => key.startsWith('fallback-')));
      assert.deepEqual(readdirSync(join(testState.extensionPath, 'dist', 'fallback')), []);
    });

    it('uses another installed theme given by its id, and ignores an id that is not installed', () => {
      installFallbackTheme('other-icons');
      configChangeDetector.listenForChanges();
      assert.equal(readTheme().fileNames?.['zz-unknown'], undefined);

      applySettings({ fallbackIconTheme: 'other-icons' });
      assert.ok(readTheme().fileNames?.['zz-unknown']);
    });

    it('regenerates the theme when the fallback theme changes', () => {
      installFallbackTheme();
      configChangeDetector.listenForChanges();
      assert.equal(readTheme().fileNames?.['zz-later'], undefined);

      writeFileAtomic(fallbackJson, JSON.stringify({ ...fallbackTheme, fileNames: { ...fallbackTheme.fileNames, 'zz-later': 'fb-file' } }));
      const later = new Date(statSync(fallbackJson).mtimeMs + 10_000);
      utimesSync(fallbackJson, later, later);
      configChangeDetector.listenForChanges();

      assert.ok(readTheme().fileNames?.['zz-later']);
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
