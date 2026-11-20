/**
 * Runs inside the VS Code started by `run.js`: the checks a user notices first when the extension does not work with
 * their VS Code.
 */
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vscode = require('vscode');

const EXTENSION_ID = 'woogajjangka.cool-icon-vscode';
const KEY = 'a-file-icon-vscode';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Wait until `check` returns a truthy value */
const waitFor = async (what, check, timeout = 20_000) => {
  const end = Date.now() + timeout;
  for (;;) {
    let value;
    try {
      value = check();
    } catch {
      value = undefined;
    }
    if (value) return value;
    if (Date.now() > end) throw new Error(`Timed out waiting for ${what}`);
    await sleep(200);
  }
};

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

const step = async (name, run) => {
  const started = Date.now();
  await run();
  console.log(`  ok  ${name} (${Date.now() - started} ms)`);
};

exports.run = async () => {
  console.log(`VS Code ${vscode.version}`);
  const extension = vscode.extensions.getExtension(EXTENSION_ID);
  assert.ok(extension, `${EXTENSION_ID} is not loaded`);
  const distribution = join(extension.extensionPath, 'dist');

  await step('activates', async () => {
    await extension.activate();
    assert.ok(extension.isActive);
  });

  await step('registers the commands of package.json', async () => {
    const registered = new Set(await vscode.commands.getCommands(true));
    const contributed = extension.packageJSON.contributes.commands.map((command) => command.command);
    assert.deepEqual(contributed.filter((command) => !registered.has(command)), []);
  });

  await step('opens the Mix Themes page', async () => {
    await vscode.commands.executeCommand(`${KEY}.openThemeMixer`);
    const tab = await waitFor('the Mix Themes tab', () =>
      vscode.window.tabGroups.all.flatMap((group) => group.tabs).find((item) => item.input instanceof vscode.TabInputWebview),
    );
    await vscode.window.tabGroups.close(tab);
  });

  const settings = () => vscode.workspace.getConfiguration(KEY);

  await step('regenerates the icon theme after a change of a setting', async () => {
    await settings().update('opacity', 0.8, vscode.ConfigurationTarget.Global);
    await waitFor('the icon theme with the new opacity', () => readJson(join(distribution, `${KEY}-icon-theme.json`)).atomConfig?.opacity === 0.8);
  });

  await step('regenerates the color themes with an accent color', async () => {
    await settings().update('accentColor', '#79cb60', vscode.ConfigurationTarget.Global);
    await waitFor('the accent color in Cool Islands Dark', () =>
      readJson(join(distribution, 'cool-islands-dark-color-theme.json')).colors?.['button.background']?.toLowerCase().startsWith('#79cb60'),
    );
  });

  await step('goes back to the defaults', async () => {
    await settings().update('opacity', undefined, vscode.ConfigurationTarget.Global);
    await settings().update('accentColor', undefined, vscode.ConfigurationTarget.Global);
    await waitFor('the default icon theme', () => readJson(join(distribution, `${KEY}-icon-theme.json`)).atomConfig?.opacity === 1);
  });
};
