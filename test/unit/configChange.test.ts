import { strict as assert } from 'node:assert';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, statSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME } from 'src/helpers/constants';
import { configChangeDetector } from 'src/services/ConfigChangeDetector';

import { testState } from '../mocks/vscode';

import type { IconConfiguration } from 'src/models/IconConfiguration';

const repoRoot = join(__dirname, '..', '..');

/**
 * Creates a fake installed extension: a copy of the built `dist` theme files and a junction to the icons.
 */
const createExtensionDirectory = (): string => {
  const extensionPath = mkdtempSync(join(tmpdir(), 'afi-test-'));
  for (const file of [JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME]) {
    cpSync(join(repoRoot, 'dist', file), join(extensionPath, 'dist', file));
  }
  symlinkSync(join(repoRoot, 'iconGenerator'), join(extensionPath, 'iconGenerator'), 'junction');
  return extensionPath;
};

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
    // remove the junction first so the real icons are never touched
    rmSync(join(testState.extensionPath, 'iconGenerator'), { force: true, recursive: false });
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
      assert.equal(theme.fileExtensions?.foo, 'typescript');
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
});
