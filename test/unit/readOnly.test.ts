import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { chmodSync, cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME } from 'src/helpers/constants';
import { canWriteIn, isPermissionError, isReadOnlyFailure } from 'src/helpers/readOnly';
import { readThemeState, stampOf, THEME_STATE_FILE, writeThemeState } from 'src/helpers/themeState';
import { initI18next } from 'src/i18n/i18next';
import { configChangeDetector } from 'src/services/ConfigChangeDetector';
import { initThemeFailure, reportThemeFailure } from 'src/services/themeFailure';

import { testState } from '../mocks/vscode';

import type { Memento } from 'vscode';

const repoRoot = join(__dirname, '..', '..');
const LINKED_FOLDERS = ['iconGenerator', 'assets'];
const EVERYONE = '*S-1-1-0';

const permissionError = (code: string) => Object.assign(new Error(`${code}: operation not permitted`), { code });

/**
 * No new file in the folder, as in a system-wide install or a read-only mount (the theme files are only written
 * through a new temporary file). On Windows only adding files and folders is denied: denying more on the files
 * also refuses reading them through Node.
 */
const makeReadOnly = (folder: string) => {
  if (process.platform === 'win32') execFileSync('icacls', [folder, '/deny', `${EVERYONE}:(WD,AD)`], { stdio: 'ignore' });
  else chmodSync(folder, 0o555);
};

const makeWritable = (folder: string) => {
  if (process.platform === 'win32') execFileSync('icacls', [folder, '/remove:d', EVERYONE], { stdio: 'ignore' });
  else chmodSync(folder, 0o755);
};

/** A memento kept in memory, as `context.globalState` */
const memento = (): Memento => {
  const values = new Map<string, unknown>();
  return {
    get: <T>(key: string, fallback?: T) => (values.has(key) ? (values.get(key) as T) : fallback),
    keys: () => [...values.keys()],
    update: async (key: string, value: unknown) => {
      values.set(key, value);
    },
  } as Memento;
};

describe('a read-only install', () => {
  let distribution: string;

  before(async () => {
    await initI18next();
  });

  beforeEach(() => {
    testState.config = {};
    testState.messages = [];
    testState.extensionPath = mkdtempSync(join(tmpdir(), 'afi-readonly-'));
    distribution = join(testState.extensionPath, 'dist');
    for (const file of [JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME]) cpSync(join(repoRoot, 'dist', file), join(distribution, file));
    for (const folder of LINKED_FOLDERS) symlinkSync(join(repoRoot, folder), join(testState.extensionPath, folder), 'junction');
  });

  afterEach(() => {
    makeWritable(distribution);
    for (const folder of LINKED_FOLDERS) rmSync(join(testState.extensionPath, folder), { force: true, recursive: false });
    rmSync(testState.extensionPath, { force: true, recursive: true });
  });

  describe('the helpers', () => {
    it('find the permission error behind the error of a generator', () => {
      for (const code of ['EACCES', 'EPERM', 'EROFS']) assert.ok(isPermissionError(permissionError(code)), code);
      assert.ok(isPermissionError(new Error('Failed to create icon file', { cause: permissionError('EACCES') })));
      assert.equal(isPermissionError(permissionError('ENOENT')), false);
      assert.equal(isPermissionError(new Error('no code')), false);
      assert.equal(isPermissionError('a string'), false);
    });

    it('try the folder itself, and leave nothing in it', () => {
      assert.ok(canWriteIn(distribution));
      assert.deepEqual(readdirSync(distribution).sort(), [JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME].sort());
      // EPERM from a file another window has open is not a read-only install
      assert.equal(isReadOnlyFailure(permissionError('EPERM'), distribution), false);

      makeReadOnly(distribution);
      if (canWriteIn(distribution)) return; // run as an administrator or root: nothing is refused
      assert.ok(isReadOnlyFailure(permissionError('EPERM'), distribution));
      assert.equal(isReadOnlyFailure(permissionError('ENOENT'), distribution), false);
    });
  });

  it('keeps the prebuilt themes, and says so once instead of an error at every change', function () {
    const before = [JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME].map((file) => readFileSync(join(distribution, file), 'utf8'));
    makeReadOnly(distribution);
    if (canWriteIn(distribution)) this.skip();

    const state = memento();
    initThemeFailure(state, '1.2.1');

    // nothing changed: nothing to write, nothing to say
    assert.doesNotThrow(() => configChangeDetector.listenForChanges());

    // a setting that needs a generated theme: it cannot be written
    testState.config = { opacity: 0.8 };
    for (let index = 0; index < 3; index++) {
      try {
        configChangeDetector.listenForChanges();
        assert.fail('the theme was written in a read-only folder');
      } catch (error) {
        reportThemeFailure(error);
      }
    }

    assert.deepEqual(testState.messages.map((message) => message.kind), ['warning']);
    assert.match(testState.messages[0].text, /cannot write in its own folder .*dist/);
    assert.equal(state.get('readOnlyMessageShown'), '1.2.1');
    assert.deepEqual(
      [JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME].map((file) => readFileSync(join(distribution, file), 'utf8')),
      before,
      'the prebuilt themes are untouched',
    );

    // the next start of the same version says nothing; a new version says it again
    initThemeFailure(state, '1.2.1');
    reportThemeFailure(new Error('Failed to create icon file', { cause: permissionError('EPERM') }));
    assert.equal(testState.messages.length, 1);
    initThemeFailure(state, '1.2.2');
    reportThemeFailure(new Error('Failed to create icon file', { cause: permissionError('EPERM') }));
    assert.equal(testState.messages.length, 2);
  });

  it('still shows any other failure', () => {
    initThemeFailure(memento(), '1.2.1');
    reportThemeFailure(new Error('Icon sources not found'));
    reportThemeFailure(permissionError('EPERM')); // the folder can be written: not a read-only install

    assert.deepEqual(testState.messages.map((message) => message.kind), ['error', 'error']);
  });
});

describe('the theme state with several windows', () => {
  let distribution: string;

  beforeEach(() => {
    testState.config = {};
    testState.extensionPath = mkdtempSync(join(tmpdir(), 'afi-windows-'));
    distribution = join(testState.extensionPath, 'dist');
    for (const file of [JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME]) cpSync(join(repoRoot, 'dist', file), join(distribution, file));
    for (const folder of LINKED_FOLDERS) symlinkSync(join(repoRoot, folder), join(testState.extensionPath, folder), 'junction');
  });

  afterEach(() => {
    for (const folder of LINKED_FOLDERS) rmSync(join(testState.extensionPath, folder), { force: true, recursive: false });
    rmSync(testState.extensionPath, { force: true, recursive: true });
  });

  it('is written whole, and what one window writes keeps what the other wrote', () => {
    const icons = join(distribution, JSON_FILE_NAME);
    const product = join(distribution, JSON_PRODUCT_FILE_NAME);
    for (let index = 0; index < 20; index++) {
      writeThemeState(distribution, { icon: { ...stampOf(icons)!, layerThemes: `window-a-${index}` } });
      writeThemeState(distribution, { product: { ...stampOf(product)!, atomConfig: { arrowTheme: undefined } } });
    }

    const state = readThemeState(distribution);
    assert.equal(state.icon?.layerThemes, 'window-a-19');
    assert.ok(state.product);
    assert.deepEqual(readdirSync(distribution).filter((file) => file.endsWith('.tmp')), [], 'no temporary file left');
    assert.doesNotThrow(() => JSON.parse(readFileSync(join(distribution, THEME_STATE_FILE), 'utf8')));
  });

  it('follows the window that wrote last: the other one regenerates at its next start', () => {
    // window B (opacity 0.8) regenerates after window A (default settings)
    configChangeDetector.listenForChanges();
    testState.config = { opacity: 0.8 };
    configChangeDetector.listenForChanges();
    assert.equal(readThemeState(distribution).icon?.atomConfig?.opacity, 0.8);

    // window A starts again with its settings: the state does not hide B's theme from it
    testState.config = {};
    configChangeDetector.listenForChanges();
    const theme = JSON.parse(readFileSync(join(distribution, JSON_FILE_NAME), 'utf8')) as { atomConfig?: { opacity?: number } };
    assert.equal(theme.atomConfig?.opacity, 1);
    assert.equal(readThemeState(distribution).icon?.atomConfig?.opacity, 1);
  });
});
