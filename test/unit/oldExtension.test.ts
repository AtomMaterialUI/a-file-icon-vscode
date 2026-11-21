import * as assert from 'node:assert/strict';
import { EXTENSION_ID } from 'src/helpers/constants';
import { initI18next } from 'src/i18n/i18next';
import { OLD_EXTENSION_ID, offerToUninstallOldExtension } from 'src/services/OldExtensionService';

import { testState } from '../mocks/vscode';

/** Let the notices the offer does not wait for run */
const settle = () => new Promise((resolve) => setImmediate(resolve));

describe('the old extension id', () => {
  before(async () => {
    await initI18next();
  });

  beforeEach(() => {
    testState.answers = [];
    testState.executed = [];
    testState.extensions = [];
    testState.messages = [];
  });

  after(() => {
    testState.extensions = [];
  });

  it('is not the id of this extension', () => {
    assert.notEqual(OLD_EXTENSION_ID, EXTENSION_ID);
    assert.equal(EXTENSION_ID, 'woogajjangka.cool-theme-kit');
  });

  it('says nothing when the old extension is not installed', async () => {
    testState.extensions = [{ extensionPath: '', id: 'PKief.material-icon-theme', packageJSON: {} }];
    await offerToUninstallOldExtension();
    assert.deepEqual(testState.messages, []);
    assert.deepEqual(testState.executed, []);
  });

  it('uninstalls the old extension when the user agrees', async () => {
    testState.extensions = [{ extensionPath: '', id: 'WoogaJJangka.cool-icon-vscode', packageJSON: {} }];
    testState.answers = ['Uninstall the Old One'];
    await offerToUninstallOldExtension();
    await settle();
    assert.deepEqual(testState.executed, [['workbench.extensions.uninstallExtension', 'WoogaJJangka.cool-icon-vscode']]);
    assert.deepEqual(
      testState.messages.map(({ kind }) => kind),
      ['warning', 'information'],
    );
    assert.match(testState.messages[0].text, /woogajjangka\.cool-icon-vscode/);
  });

  it('keeps the old extension when the notice is closed', async () => {
    testState.extensions = [{ extensionPath: '', id: OLD_EXTENSION_ID, packageJSON: {} }];
    await offerToUninstallOldExtension();
    assert.equal(testState.messages.length, 1);
    assert.deepEqual(testState.executed, []);
  });
});
