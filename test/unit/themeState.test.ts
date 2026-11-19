import { strict as assert } from 'node:assert';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME } from 'src/helpers/constants';
import { currentState, readThemeState, stampOf, THEME_STATE_FILE, writeThemeState } from 'src/helpers/themeState';
import { configChangeDetector } from 'src/services/ConfigChangeDetector';

import { testState } from '../mocks/vscode';

const repoRoot = join(__dirname, '..', '..');
const LINKED_FOLDERS = ['iconGenerator', 'assets'];

/** A fake installed extension: a copy of the built theme files and junctions to the icons */
const createExtensionDirectory = (): string => {
  const extensionPath = mkdtempSync(join(tmpdir(), 'afi-state-'));
  for (const file of [JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME]) cpSync(join(repoRoot, 'dist', file), join(extensionPath, 'dist', file));
  for (const folder of LINKED_FOLDERS) symlinkSync(join(repoRoot, folder), join(extensionPath, folder), 'junction');
  return extensionPath;
};

const dist = () => join(testState.extensionPath, 'dist');
const file = (name: string) => join(dist(), name);

/**
 * Make a theme file unreadable as json while the state still knows it: the file is replaced, and the state is written again
 * for the new file with what it held. (Putting the old modification time back is not exact on every file system.)
 */
const corruptKnownFile = (name: string, key: 'icon' | 'product') => {
  const known = readThemeState(dist())[key]!;
  writeFileSync(file(name), 'not json at all');
  writeThemeState(dist(), { [key]: { ...known, ...stampOf(file(name)) } });
};

describe('theme state', () => {
  before(() => {
    assert.ok(existsSync(join(repoRoot, 'dist', JSON_FILE_NAME)), 'run `bun run build` first');
  });

  beforeEach(() => {
    testState.config = {};
    testState.extensionPath = createExtensionDirectory();
  });

  afterEach(() => {
    // remove the junctions first so the real icons are never touched
    for (const folder of LINKED_FOLDERS) rmSync(join(testState.extensionPath, folder), { force: true, recursive: false });
    rmSync(testState.extensionPath, { force: true, recursive: true });
  });

  describe('the helpers', () => {
    it('read nothing from a missing or broken state file', () => {
      assert.deepEqual(readThemeState(dist()), {});
      writeFileSync(file(THEME_STATE_FILE), '{ not json');
      assert.deepEqual(readThemeState(dist()), {});
      writeFileSync(file(THEME_STATE_FILE), '[1]');
      assert.deepEqual(readThemeState(dist()), {});
    });

    it('merge what is written into the state, and give a state only for the file it was written for', () => {
      const icons = file(JSON_FILE_NAME);
      const stamp = stampOf(icons)!;
      writeThemeState(dist(), { icon: { ...stamp, layerThemes: 'a=1' } });
      writeThemeState(dist(), { product: { ...stampOf(file(JSON_PRODUCT_FILE_NAME))!, atomConfig: { arrowTheme: undefined } } });

      const state = readThemeState(dist());
      assert.equal(state.icon?.layerThemes, 'a=1');
      assert.ok(state.product);
      assert.equal(currentState(state.icon, icons)?.layerThemes, 'a=1');

      writeFileSync(icons, `${readFileSync(icons, 'utf8')} `);
      assert.equal(currentState(state.icon, icons), undefined, 'the file changed');
      assert.equal(currentState(state.icon, file('missing.json')), undefined, 'the file is gone');
      assert.equal(currentState(undefined, icons), undefined);
    });

    it('do not fail in a folder that cannot be written', () => {
      assert.doesNotThrow(() => writeThemeState(join(testState.extensionPath, 'dist', JSON_FILE_NAME, 'not-a-folder'), {}));
    });
  });

  describe('the detector', () => {
    it('writes the state at the first start, with the settings the theme files were generated with', () => {
      assert.equal(existsSync(file(THEME_STATE_FILE)), false);
      configChangeDetector.listenForChanges();

      const state = readThemeState(dist());
      assert.ok(currentState(state.icon, file(JSON_FILE_NAME)), 'icons');
      assert.ok(currentState(state.product, file(JSON_PRODUCT_FILE_NAME)), 'product icons');
      const theme = JSON.parse(readFileSync(file(JSON_FILE_NAME), 'utf8')) as { atomConfig?: unknown; layerThemes?: string };
      assert.deepEqual(state.icon?.atomConfig, theme.atomConfig);
      assert.equal(state.icon?.layerThemes ?? '', theme.layerThemes ?? '');
    });

    it('does not read the theme files while the state knows them', () => {
      configChangeDetector.listenForChanges();
      corruptKnownFile(JSON_FILE_NAME, 'icon');
      corruptKnownFile(JSON_PRODUCT_FILE_NAME, 'product');

      assert.doesNotThrow(() => configChangeDetector.listenForChanges());
    });

    it('reads the theme file again when it is not the one the state was written for', () => {
      configChangeDetector.listenForChanges();
      writeFileSync(file(JSON_FILE_NAME), 'not json at all');

      assert.throws(() => configChangeDetector.listenForChanges(), /Failed to read icon-theme\.json/);
    });

    it('works without the state file, and writes it again', () => {
      configChangeDetector.listenForChanges();
      rmSync(file(THEME_STATE_FILE));
      configChangeDetector.listenForChanges();

      assert.ok(currentState(readThemeState(dist()).icon, file(JSON_FILE_NAME)));
    });

    it('follows the settings: a change regenerates the theme and the state, and the next start changes nothing', () => {
      configChangeDetector.listenForChanges();
      const before = statSync(file(JSON_FILE_NAME)).mtimeMs;

      testState.config = { ...testState.config, opacity: 0.8 };
      configChangeDetector.listenForChanges();

      const state = readThemeState(dist());
      assert.equal(state.icon?.atomConfig?.opacity, 0.8);
      assert.ok(currentState(state.icon, file(JSON_FILE_NAME)));
      assert.ok(currentState(state.product, file(JSON_PRODUCT_FILE_NAME)));
      const theme = JSON.parse(readFileSync(file(JSON_FILE_NAME), 'utf8')) as { atomConfig?: { opacity?: number } };
      assert.equal(theme.atomConfig?.opacity, 0.8);
      assert.ok(statSync(file(JSON_FILE_NAME)).mtimeMs >= before);

      const written = statSync(file(JSON_FILE_NAME)).mtimeMs;
      const stateWritten = statSync(file(THEME_STATE_FILE)).mtimeMs;
      configChangeDetector.listenForChanges();
      assert.equal(statSync(file(JSON_FILE_NAME)).mtimeMs, written);
      assert.equal(statSync(file(THEME_STATE_FILE)).mtimeMs, stateWritten, 'nothing changed: nothing is written');
    });
  });
});
