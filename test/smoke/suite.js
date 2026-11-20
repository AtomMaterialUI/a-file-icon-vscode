/**
 * Runs inside the VS Code started by `run.js`: the checks a user notices first when the extension does not work with
 * their VS Code, the memory the extension keeps after repeated regenerations, and (with `--with-extensions`) the
 * mixing of the themes of other installed extensions.
 */
const assert = require('node:assert/strict');
const { existsSync, readdirSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { setFlagsFromString } = require('node:v8');
const { runInNewContext } = require('node:vm');
const vscode = require('vscode');

const EXTENSION_ID = 'woogajjangka.cool-icon-vscode';
const KEY = 'a-file-icon-vscode';

/**
 * Memory budget: what the extension host keeps more after the cycles than before them (after a garbage collection).
 * A theme json kept by mistake on each regeneration is 1 to 5 MB, so a leak goes over it within the cycles.
 * Measured on CI (Linux and Windows, 1.95.0 and stable, with and without other theme extensions): 0.2 to 0.8 MB.
 */
const HEAP_GROWTH_BUDGET_MB = 3;
const CYCLES = 4;
const PANEL_CYCLES = 3;
/** Regenerations rewrite the ~2,500 icons when the opacity changes: slow on Windows (fork #28) */
const REGENERATE_TIMEOUT = 90_000;

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
/** A theme file of another extension: JSON, or JSON with comments that cannot be read here (undefined) */
const tryReadJson = (path) => {
  try {
    return readJson(path);
  } catch {
    return undefined;
  }
};

const step = async (name, run) => {
  const started = Date.now();
  await run();
  console.log(`  ok  ${name} (${Date.now() - started} ms)`);
};

let gc;
/** The heap kept by the extension host, in MB, after a full garbage collection */
const keptHeap = () => {
  if (!gc) {
    setFlagsFromString('--expose-gc');
    gc = runInNewContext('gc');
  }
  gc();
  gc();
  return process.memoryUsage().heapUsed / 1024 / 1024;
};
const round = (value) => Math.round(value * 10) / 10;

const findTab = () => vscode.window.tabGroups.all.flatMap((group) => group.tabs).find((item) => item.input instanceof vscode.TabInputWebview);

exports.run = async () => {
  console.log(`VS Code ${vscode.version}`);
  const extension = vscode.extensions.getExtension(EXTENSION_ID);
  assert.ok(extension, `${EXTENSION_ID} is not loaded`);
  const distribution = join(extension.extensionPath, 'dist');
  const iconTheme = () => readJson(join(distribution, `${KEY}-icon-theme.json`));
  const darkTheme = () => readJson(join(distribution, 'cool-islands-dark-color-theme.json'));
  const productTheme = () => readJson(join(distribution, 'cool-islands-product-icon-theme.json'));
  const report = { extensions: [], vscode: vscode.version };

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
    const tab = await waitFor('the Mix Themes tab', findTab);
    await vscode.window.tabGroups.close(tab);
  });

  const settings = () => vscode.workspace.getConfiguration(KEY);

  await step('regenerates the icon theme after a change of a setting', async () => {
    await settings().update('opacity', 0.8, vscode.ConfigurationTarget.Global);
    await waitFor('the icon theme with the new opacity', () => iconTheme().atomConfig?.opacity === 0.8, REGENERATE_TIMEOUT);
  });

  await step('regenerates the color themes with an accent color', async () => {
    await settings().update('accentColor', '#79cb60', vscode.ConfigurationTarget.Global);
    await waitFor('the accent color in Cool Islands Dark', () => darkTheme().colors?.['button.background']?.toLowerCase().startsWith('#79cb60'));
  });

  await step('goes back to the defaults', async () => {
    await settings().update('opacity', undefined, vscode.ConfigurationTarget.Global);
    await settings().update('accentColor', undefined, vscode.ConfigurationTarget.Global);
    await waitFor('the default icon theme', () => iconTheme().atomConfig?.opacity === 1, REGENERATE_TIMEOUT);
  });

  const others = (process.env.SMOKE_EXTENSIONS ?? '').split(',').filter(Boolean);
  if (others.length > 0) await compatibility(others, { darkTheme, iconTheme, productTheme, report, settings });

  await step(`keeps no memory after ${CYCLES} regeneration cycles and ${PANEL_CYCLES} Mix Themes pages`, async () => {
    const heapBefore = keptHeap();
    const times = [];
    const timed = async (what, write, check) => {
      const started = Date.now();
      await write();
      await waitFor(what, check, REGENERATE_TIMEOUT);
      times.push(Date.now() - started);
    };

    for (let cycle = 0; cycle < CYCLES; cycle++) {
      const opacity = cycle % 2 ? 0.9 : 0.8;
      const accent = cycle % 2 ? '#e06c75' : '#79cb60';
      await timed('the new opacity', () => settings().update('opacity', opacity, vscode.ConfigurationTarget.Global), () => iconTheme().atomConfig?.opacity === opacity);
      await timed('the new accent', () => settings().update('accentColor', accent, vscode.ConfigurationTarget.Global), () =>
        darkTheme().colors?.['button.background']?.toLowerCase().startsWith(accent),
      );
    }
    await timed('the default opacity', () => settings().update('opacity', undefined, vscode.ConfigurationTarget.Global), () => iconTheme().atomConfig?.opacity === 1);
    await settings().update('accentColor', undefined, vscode.ConfigurationTarget.Global);

    for (let cycle = 0; cycle < PANEL_CYCLES; cycle++) {
      await vscode.commands.executeCommand(`${KEY}.openThemeMixer`);
      await vscode.window.tabGroups.close(await waitFor('the Mix Themes tab', findTab));
    }
    // the debounced regeneration of the last reset, and the closed pages, settle first
    await sleep(2000);

    const heapAfterCycles = keptHeap();
    const growth = heapAfterCycles - heapBefore;
    report.memory = {
      cycles: CYCLES,
      heapBeforeMb: round(heapBefore),
      heapGrowthBudgetMb: HEAP_GROWTH_BUDGET_MB,
      heapGrowthMb: round(growth),
      panelCycles: PANEL_CYCLES,
      regenerateAvgMs: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length),
      regenerateMaxMs: Math.max(...times),
      rssMb: round(process.memoryUsage().rss / 1024 / 1024),
    };
    assert.ok(growth < HEAP_GROWTH_BUDGET_MB, `the heap grew by ${round(growth)} MB (budget ${HEAP_GROWTH_BUDGET_MB} MB)`);
  });

  if (process.env.SMOKE_REPORT) writeFileSync(process.env.SMOKE_REPORT, JSON.stringify(report, null, 2));
};

/** The themes the other extensions contribute: icon themes, color themes, product icon themes */
const contributedThemes = (ids, kind) =>
  ids.flatMap((id) => {
    const other = vscode.extensions.getExtension(id);
    return (other?.packageJSON.contributes?.[kind] ?? []).map((theme) => ({
      extension: id,
      id: theme.id ?? theme.label,
      path: join(other.extensionPath, theme.path),
      uiTheme: theme.uiTheme,
    }));
  });

/** Mix the themes of the other extensions in, as the users of those extensions do, then go back to the defaults */
const compatibility = async (ids, { darkTheme, iconTheme, productTheme, report, settings }) => {
  const global = vscode.ConfigurationTarget.Global;

  await step(`loads next to ${ids.join(', ')}`, async () => {
    for (const id of ids) assert.ok(vscode.extensions.getExtension(id), `${id} is not installed`);
    report.extensions = ids.map((id) => `${id}@${vscode.extensions.getExtension(id).packageJSON.version}`);
  });

  const iconThemes = contributedThemes(ids, 'iconThemes');
  if (iconThemes.length > 0) {
    await step(`mixes the icon themes ${iconThemes.map((theme) => theme.id).join(', ')}`, async () => {
      await settings().update('iconThemeLayers', iconThemes.map((theme) => ({ files: 'fill', folders: 'fill', theme: theme.id })), global);
      const mixed = () => new Set((iconTheme().layerThemes ?? '').split('|').map((entry) => entry.split('=')[0]));
      await waitFor('every icon theme in the mixed theme', () => iconThemes.every((theme) => mixed().has(theme.id)), REGENERATE_TIMEOUT);

      const layers = join(vscode.extensions.getExtension(EXTENSION_ID).extensionPath, 'dist', 'layers');
      assert.ok(existsSync(layers) && readdirSync(layers).length > 0, 'no icon was copied to dist/layers');
      const definitions = Object.values(iconTheme().iconDefinitions ?? {});
      assert.ok(definitions.some((definition) => definition.iconPath?.includes('layers/')), 'no icon definition uses a mixed icon');
      // a theme drawn with a font (file-icons) brings its font
      const fontThemes = iconThemes.filter((theme) => (tryReadJson(theme.path)?.fonts ?? []).length > 0);
      if (fontThemes.length > 0) {
        const fonts = iconTheme().fonts ?? [];
        assert.ok(fonts.some((font) => font.src?.some((source) => source.path?.includes('layers/'))), `the fonts of ${fontThemes.map((theme) => theme.id)} were not copied`);
      }
    });
  }

  const darkColorTheme = contributedThemes(ids, 'themes').find((theme) => theme.uiTheme === 'vs-dark');
  if (darkColorTheme) {
    await step(`mixes the color theme ${darkColorTheme.id} into Cool Islands Dark`, async () => {
      const before = darkTheme().colors?.['editor.background'];
      const expected = tryReadJson(darkColorTheme.path)?.colors?.['editor.background']?.toLowerCase();
      await settings().update('colorThemeLayers', [{ syntax: 'fill', theme: darkColorTheme.id, ui: 'override' }], global);
      await waitFor(`the editor background of ${darkColorTheme.id}`, () => {
        const background = darkTheme().colors?.['editor.background']?.toLowerCase();
        return expected ? background === expected : background !== before?.toLowerCase();
      }, REGENERATE_TIMEOUT);
    });
  }

  const productIconTheme = contributedThemes(ids, 'productIconThemes')[0];
  if (productIconTheme) {
    await step(`mixes the product icon theme ${productIconTheme.id}`, async () => {
      await settings().update('productIconThemeLayers', [{ mode: 'override', theme: productIconTheme.id }], global);
      await waitFor(`the fonts of ${productIconTheme.id}`, () =>
        (productTheme().fonts ?? []).some((font) => font.src?.some((source) => source.path?.includes('layers/product'))),
      REGENERATE_TIMEOUT);
    });
  }

  await step('goes back to the defaults after mixing', async () => {
    for (const key of ['iconThemeLayers', 'colorThemeLayers', 'productIconThemeLayers']) await settings().update(key, undefined, global);
    await waitFor('the product icon theme without other fonts', () =>
      (productTheme().fonts ?? []).every((font) => !font.src?.some((source) => source.path?.includes('layers/product'))),
    REGENERATE_TIMEOUT);
  });
};
