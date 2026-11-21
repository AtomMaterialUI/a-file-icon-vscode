import * as assert from 'node:assert/strict';
import { registerCommands } from 'src/commands/commands';
import { EDITOR_FONT_FAMILY, UI_FONT_FAMILY } from 'src/helpers/fonts';
import { initI18next } from 'src/i18n/i18next';
import { FontCheckService } from 'src/services/FontCheckService';

import type { ExtensionContext } from 'vscode';

import { ConfigurationTarget, registeredCommands, testState } from '../mocks/vscode';

const OFFER = /goes with the fonts of the JetBrains IDEs/;
const REPLACE = /Replace the fonts of your user settings/;
const MISSING = /these are not installed/;

/** An extension context with only what the font service reads: its global state */
const fakeContext = () => {
  const state = new Map<string, unknown>();
  const context = {
    globalState: {
      get: <T>(key: string) => state.get(key) as T | undefined,
      update: async (key: string, value: unknown) => {
        state.set(key, value);
      },
    },
  };
  return { context: context as unknown as ExtensionContext, state };
};

/** The notices other than the missing-fonts one, which depends on the fonts of the machine */
const notices = () => testState.messages.filter((message) => !MISSING.test(message.text));

/** Let the notices the service does not wait for run */
const settle = () => new Promise((resolve) => setImmediate(resolve));

describe('FontCheckService: the JetBrains fonts are opt-in', () => {
  before(async () => {
    await initI18next();
  });

  beforeEach(() => {
    testState.config = {};
    testState.messages = [];
    testState.answers = [];
    testState.sections = new Set(['editor', 'markdown.preview', 'workbench']);
  });

  after(() => {
    testState.sections = new Set();
    testState.config = {};
    testState.messages = [];
    testState.answers = [];
  });

  it('offers the fonts once to a user of Cool Islands, and writes them to the user settings when accepted', async () => {
    testState.config['workbench.colorTheme'] = 'Cool Islands Dark';
    testState.answers = ['Use the JetBrains Fonts'];
    const { context, state } = fakeContext();

    await new FontCheckService().check(context);
    await settle();

    assert.match(notices()[0].text, OFFER);
    assert.equal(state.get('fontOfferShown'), true);
    assert.equal(testState.config['editor.fontFamily'], EDITOR_FONT_FAMILY);
    assert.equal(testState.config['markdown.preview.fontFamily'], UI_FONT_FAMILY);
    assert.equal(testState.lastTarget, ConfigurationTarget.Global);

    // once, whatever the answer
    testState.messages = [];
    await new FontCheckService().check(context);
    assert.equal(notices().length, 0);
  });

  it('changes no font when the offer is declined', async () => {
    testState.config['workbench.colorTheme'] = 'Cool Islands Light';
    testState.answers = ['No, Thanks'];
    const { context, state } = fakeContext();

    await new FontCheckService().check(context);

    assert.match(notices()[0].text, OFFER);
    assert.equal(state.get('fontOfferShown'), true);
    assert.equal(testState.config['editor.fontFamily'], undefined);
  });

  it('does not offer the fonts with another color theme, a font of the user, or the notices turned off', async () => {
    const cases: Array<Record<string, unknown>> = [
      { 'workbench.colorTheme': 'Default Dark Modern' },
      { 'editor.fontFamily': 'D2Coding', 'workbench.colorTheme': 'Cool Islands Dark' },
      { showFontMessage: false, 'workbench.colorTheme': 'Cool Islands Dark' },
    ];
    for (const config of cases) {
      testState.config = { ...config };
      testState.messages = [];
      const { context, state } = fakeContext();
      await new FontCheckService().check(context);
      assert.equal(notices().length, 0, JSON.stringify(config));
      assert.equal(state.get('fontOfferShown'), undefined, JSON.stringify(config));
    }
  });

  it('offers the fonts when Cool Islands is selected later', async () => {
    testState.config['workbench.colorTheme'] = 'Default Dark Modern';
    const { context } = fakeContext();
    const service = new FontCheckService();
    await service.check(context);
    assert.equal(notices().length, 0);

    testState.config['workbench.colorTheme'] = 'Cool Islands Dark';
    await service.colorThemeChanged();
    assert.match(notices()[0].text, OFFER);
  });

  it('asks before replacing a font of the user, and keeps it when not confirmed', async () => {
    testState.config['editor.fontFamily'] = 'D2Coding';

    await new FontCheckService().use();
    assert.match(notices()[0].text, REPLACE);
    assert.match(notices()[0].text, /D2Coding/);
    assert.equal(testState.config['editor.fontFamily'], 'D2Coding');

    testState.messages = [];
    testState.answers = ['Replace'];
    await new FontCheckService().use();
    await settle();
    assert.equal(testState.config['editor.fontFamily'], EDITOR_FONT_FAMILY);
    assert.equal(testState.config['markdown.preview.fontFamily'], UI_FONT_FAMILY);
  });

  it('does not ask again when the settings already hold the JetBrains fonts (other spaces included)', async () => {
    testState.config['editor.fontFamily'] = EDITOR_FONT_FAMILY.replaceAll(', ', ',  ');

    await new FontCheckService().use();
    await settle();

    assert.equal(notices().length, 0);
    assert.equal(testState.config['editor.fontFamily'], EDITOR_FONT_FAMILY);
  });

  it('removes only the font lists it wrote', async () => {
    testState.config['editor.fontFamily'] = EDITOR_FONT_FAMILY;
    testState.config['markdown.preview.fontFamily'] = 'Pretendard';

    await new FontCheckService().remove();
    await settle();

    assert.equal(testState.config['editor.fontFamily'], undefined);
    assert.equal(testState.config['markdown.preview.fontFamily'], 'Pretendard');
    assert.match(notices()[0].text, /were removed from the user settings/);

    testState.messages = [];
    await new FontCheckService().remove();
    await settle();
    assert.match(notices()[0].text, /no JetBrains fonts of Cool Theme Kit to remove/);
  });
});

describe('commands of the walkthrough', () => {
  before(async () => {
    await initI18next();
    registeredCommands.clear();
    registerCommands(fakeContext().context);
  });

  beforeEach(() => {
    testState.config = {};
    testState.messages = [];
    testState.answers = [];
    testState.sections = new Set(['editor', 'markdown.preview', 'workbench']);
  });

  after(() => {
    testState.sections = new Set();
    testState.config = {};
  });

  const run = (name: string, ...parameters: unknown[]) => {
    const command = registeredCommands.get(`a-file-icon-vscode.${name}`);
    assert.ok(command, name);
    return command(...parameters);
  };

  it('useTheme selects each theme of the kit in the user settings', async () => {
    await run('useTheme', 'dark');
    assert.equal(testState.config['workbench.colorTheme'], 'Cool Islands Dark');
    await run('useTheme', 'light');
    assert.equal(testState.config['workbench.colorTheme'], 'Cool Islands Light');
    await run('useTheme', 'icons');
    assert.equal(testState.config['workbench.iconTheme'], 'a-file-icon-vscode');
    await run('useTheme', 'product');
    assert.equal(testState.config['workbench.productIconTheme'], 'cool-islands-product-icons');
    assert.equal(testState.lastTarget, ConfigurationTarget.Global);
  });

  it('useTheme ignores an unknown kind', async () => {
    await run('useTheme', 'neon');
    await run('useTheme');
    assert.deepEqual(testState.config, {});
  });

  it('useJetBrainsFonts and removeJetBrainsFonts write and remove the font lists', async () => {
    await run('useJetBrainsFonts');
    await settle();
    assert.equal(testState.config['editor.fontFamily'], EDITOR_FONT_FAMILY);

    await run('removeJetBrainsFonts');
    await settle();
    assert.equal(testState.config['editor.fontFamily'], undefined);
    assert.equal(testState.config['markdown.preview.fontFamily'], undefined);
  });
});
