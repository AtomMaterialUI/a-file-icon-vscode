import * as assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { registerCommands } from 'src/commands/commands';
import { EXTENSION_KEY } from 'src/helpers/constants';
import { formatDiagnostics } from 'src/helpers/diagnostics';
import { initI18next } from 'src/i18n/i18next';
import { collectDiagnostics, NEW_ISSUE_URL } from 'src/services/DiagnosticsService';

import type { DiagnosticsInput } from 'src/helpers/diagnostics';
import type { ExtensionContext } from 'vscode';

import { registeredCommands, testState } from '../mocks/vscode';

const root = join(__dirname, '..', '..');
const read = (file: string) => readFileSync(join(root, file), 'utf8');

const input = (changes: Partial<DiagnosticsInput> = {}): DiagnosticsInput => ({
  app: { language: 'ko', name: 'Visual Studio Code', version: '1.147.0', web: false },
  editorFont: "'Roboto Mono', 'D2Coding', monospace",
  extensionVersion: '1.4.0',
  home: String.raw`C:\Users\someone`,
  os: { arch: 'x64', platform: 'win32', release: '10.0.26300' },
  settings: [],
  themeExtensions: [],
  themes: { color: 'Cool Islands Dark', icon: EXTENSION_KEY, product: 'cool-islands-product-icons' },
  ...changes,
});

/** Let the notices the command does not wait for run */
const settle = () => new Promise((resolve) => setImmediate(resolve));

describe('Copy Diagnostics', () => {
  it('lists the versions and the selected themes in a Markdown table', () => {
    const text = formatDiagnostics(input({ themeExtensions: ['zhuangtongfa.material-theme@3.19.0', 'PKief.material-icon-theme@5.40.0'] }));
    assert.match(text, /^<!-- Cool Theme Kit: Copy Diagnostics\./);
    assert.match(text, /\| Cool Theme Kit \| 1\.4\.0 \|/);
    assert.match(text, /\| Editor \| Visual Studio Code 1\.147\.0 \(desktop\) \|/);
    assert.match(text, /\| OS \| win32 x64 10\.0\.26300 \|/);
    assert.match(text, /\| Color theme \| Cool Islands Dark \|/);
    assert.match(text, /\| Editor font \| 'Roboto Mono', 'D2Coding', monospace \|/);
    assert.match(text, /\| Theme extensions \| PKief\.material-icon-theme@5\.40\.0, zhuangtongfa\.material-theme@3\.19\.0 \|/);
    assert.match(text, /Settings of Cool Theme Kit: all defaults\./);
  });

  it('says where VS Code runs, and what is not set', () => {
    const text = formatDiagnostics(
      input({ app: { language: 'en', name: 'Code - OSS', remote: 'wsl', version: '1.95.0', web: true }, editorFont: undefined, extensionVersion: undefined }),
    );
    assert.match(text, /\| Editor \| Code - OSS 1\.95\.0 \(web, remote: wsl\) \|/);
    assert.match(text, /\| Cool Theme Kit \| \(none\) \|/);
    assert.match(text, /\| Editor font \| \(none\) \|/);
    assert.match(text, /\| Theme extensions \| \(none\) \|/);
  });

  it('gives the changed settings as JSON, with the scope of each', () => {
    const text = formatDiagnostics(
      input({
        settings: [
          { key: `${EXTENSION_KEY}.opacity`, scope: 'user', value: 0.8 },
          { key: `${EXTENSION_KEY}.iconThemeByName`, scope: 'workspace', value: { '*.md': 'vscode-icons' } },
        ],
      }),
    );
    const json = /```json\n([\s\S]+?)\n```/.exec(text)?.[1];
    assert.deepEqual(JSON.parse(json ?? ''), {
      [`${EXTENSION_KEY}.iconThemeByName (workspace)`]: { '*.md': 'vscode-icons' },
      [`${EXTENSION_KEY}.opacity (user)`]: 0.8,
    });
  });

  // the diagnostics go to a public issue: the user name in the paths of custom SVG files is not needed to reproduce
  it('writes the home folder as ~, with either kind of slash', () => {
    const svg = String.raw`C:\Users\someone\icons\my.svg`;
    const text = formatDiagnostics(
      input({
        editorFont: 'C:/Users/someone/fonts | Mono',
        settings: [{ key: `${EXTENSION_KEY}.filesAssociations`, scope: 'user', value: { 'a.txt': svg } }],
      }),
    );
    assert.doesNotMatch(text, /someone/);
    assert.match(text, /"a\.txt": "~\\\\icons\\\\my\.svg"/);
    // a pipe would end the cell of the table
    assert.match(text, /\| Editor font \| ~\/fonts \\\| Mono \|/);
    assert.doesNotMatch(formatDiagnostics(input({ home: '' })), /~/);
  });

  describe('in VS Code', () => {
    before(async () => {
      await initI18next();
      registerCommands({} as ExtensionContext);
    });

    beforeEach(() => {
      testState.sections = new Set([EXTENSION_KEY, 'editor', 'workbench']);
      testState.config = {
        [`${EXTENSION_KEY}.opacity`]: 0.8,
        'editor.fontFamily': "'JetBrains Mono', monospace",
        'workbench.colorTheme': 'Cool Islands Light',
        'workbench.iconTheme': EXTENSION_KEY,
      };
      testState.packageJSON = JSON.parse(read('package.json')) as Record<string, unknown>;
      testState.extensions = [
        { extensionPath: '', id: 'PKief.material-icon-theme', packageJSON: { contributes: { iconThemes: [{ id: 'material-icon-theme' }] }, version: '5.40.0' } },
        { extensionPath: '', id: 'vscode.theme-defaults', packageJSON: { contributes: { themes: [{ id: 'Dark Modern' }] }, version: '1.0.0' } },
        { extensionPath: '', id: 'ms-python.python', packageJSON: { contributes: { commands: [] }, version: '2026.1.0' } },
        { extensionPath: '', id: 'woogajjangka.cool-icon-vscode', packageJSON: { contributes: { themes: [{}] }, version: '1.4.0' } },
      ];
      testState.messages = [];
      testState.answers = [];
      testState.clipboard = '';
      testState.opened = [];
    });

    after(() => {
      testState.sections = new Set();
      testState.config = {};
      testState.packageJSON = {};
      testState.extensions = [];
      testState.messages = [];
      testState.answers = [];
    });

    it('reads the settings, themes and theme extensions of this window', () => {
      const text = collectDiagnostics();
      assert.match(text, /\| Color theme \| Cool Islands Light \|/);
      assert.match(text, /\| Product icon theme \| \(none\) \|/);
      assert.match(text, /\| Editor font \| 'JetBrains Mono', monospace \|/);
      // other extensions with themes only: not the built-in ones, not this one
      assert.match(text, /\| Theme extensions \| PKief\.material-icon-theme@5\.40\.0 \|/);
      assert.match(text, new RegExp(String.raw`"${EXTENSION_KEY}\.opacity \(user\)": 0\.8`));
      assert.doesNotMatch(text, /monochrome/);
      if (homedir().length > 1) assert.ok(!text.includes(homedir()));
    });

    it('copies them to the clipboard and opens the bug report form when asked', async () => {
      testState.answers = ['Open a Bug Report'];
      await registeredCommands.get(`${EXTENSION_KEY}.copyDiagnostics`)?.();
      await settle();
      assert.match(testState.clipboard, /\| Cool Theme Kit \|/);
      assert.match(testState.messages[0]?.text ?? '', /in the clipboard/);
      assert.deepEqual(testState.opened, [NEW_ISSUE_URL]);
    });

    it('opens nothing when the notice is closed', async () => {
      await registeredCommands.get(`${EXTENSION_KEY}.copyDiagnostics`)?.();
      await settle();
      assert.notEqual(testState.clipboard, '');
      assert.deepEqual(testState.opened, []);
    });
  });

  // the form the notice opens must exist, and must ask for what the command gives
  it('opens a bug report form that asks for the diagnostics', () => {
    const template = new URL(NEW_ISSUE_URL).searchParams.get('template') ?? '';
    const form = read(join('.github', 'ISSUE_TEMPLATE', template));
    const title = (JSON.parse(read('package.nls.json')) as Record<string, string>)['command.copyDiagnostics'];
    assert.ok(form.includes(`Cool Theme Kit: ${title}`), 'the form names the command');
    assert.match(form, /id: diagnostics/);
  });
});
