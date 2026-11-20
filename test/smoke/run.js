/**
 * Starts a real VS Code with the built extension and runs `suite.js` in it: activation, the Mix Themes page, a
 * regeneration after a change of a setting, and the memory kept after repeated regenerations. It checks the lowest
 * VS Code of `engines.vscode` as well as the latest one.
 *
 * Usage: bun run build, then `node test/smoke/run.js [version] [--with-extensions]` (default `stable`, e.g. `1.95.0`).
 * - The extension runs from a copy (the theme files are rewritten by the test) and with an empty profile.
 * - `--with-extensions` installs the popular themes of COMPAT_EXTENSIONS from the Marketplace next to it (they are
 *   not disabled) and mixes each of them in: the compatibility with other extensions (docs/MAINTENANCE.md).
 * - The output channel of the extension must log no error. Its MEMORY lines and the numbers of the suite are printed,
 *   and written to the job summary in GitHub Actions.
 */
const { downloadAndUnzipVSCode, resolveCliArgsFromVSCodeExecutablePath, runTests } = require('@vscode/test-electron');
const { spawnSync } = require('node:child_process');
const { appendFileSync, cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

const root = join(__dirname, '..', '..');
const args = process.argv.slice(2);
const version = args.find((arg) => !arg.startsWith('--')) ?? 'stable';
const withExtensions = args.includes('--with-extensions');

/**
 * Widely installed themes of each kind the extension mixes: icon themes with SVG icons (Material, vscode-icons) and
 * with a font (file-icons), a color theme and a product icon theme.
 */
const COMPAT_EXTENSIONS = [
  'PKief.material-icon-theme',
  'vscode-icons-team.vscode-icons',
  'file-icons.file-icons',
  'dracula-theme.theme-dracula',
  'miguelsolorio.fluent-icons',
];

/** What the extension reads at runtime is copied, the large read-only folders are linked */
const LINKED = new Set(['assets', 'iconGenerator']);
const SKIPPED = new Set(['.claude', '.git', '.github', '.vscode', '.vscode-test', 'build', 'coverage', 'docs', 'node_modules', 'out', 'src', 'test']);

const OUTPUT_LOG = 'Cool Theme Kit.log';

/** Install the extensions with the CLI of the downloaded VS Code, into the profile of the test */
const installExtensions = (executable, folders) => {
  const [cli] = resolveCliArgsFromVSCodeExecutablePath(executable);
  for (const id of COMPAT_EXTENSIONS) {
    const result = spawnSync(
      cli,
      [
        `--extensions-dir=${folders.extensions}`,
        `--user-data-dir=${folders.user}`,
        // the CLI would otherwise open the shared storage of the user's own VS Code (fork #40)
        `--shared-data-dir=${folders.shared}`,
        '--install-extension',
        id,
        '--force',
      ],
      { encoding: 'utf8', shell: process.platform === 'win32', stdio: 'inherit' },
    );
    if (result.status !== 0) throw new Error(`Could not install ${id} (exit code ${result.status})`);
  }
};

/** The log files of the output channel of the extension, in the logs of the profile */
const findOutputLogs = (folder) => {
  if (!existsSync(folder)) return [];
  return readdirSync(folder, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(OUTPUT_LOG))
    .map((entry) => join(entry.parentPath ?? entry.path, entry.name));
};

const summarize = (report, memoryLines, errors, logFound) => {
  const lines = [`### VS Code ${report?.vscode ?? version}${withExtensions ? ' with other extensions' : ''}`, ''];
  if (report?.memory) {
    const memory = report.memory;
    lines.push(
      '| Measure | Value | Budget |',
      '|---|---|---|',
      `| heap before the cycles (after GC) | ${memory.heapBeforeMb} MB | |`,
      `| heap growth over ${memory.cycles} regeneration cycles and ${memory.panelCycles} Mix Themes pages | ${memory.heapGrowthMb} MB | ${memory.heapGrowthBudgetMb} MB |`,
      `| rss at the end | ${memory.rssMb} MB | |`,
      `| regeneration (setting written → file rewritten) | avg ${memory.regenerateAvgMs} ms, max ${memory.regenerateMaxMs} ms | |`,
    );
  }
  if (report?.extensions?.length) lines.push('', `Other extensions: ${report.extensions.join(', ')}`);
  if (!logFound) lines.push('', `The output log of the extension (${OUTPUT_LOG}) was not found: its errors were not checked.`);
  if (memoryLines.length > 0) lines.push('', '```', ...memoryLines, '```');
  if (errors.length > 0) lines.push('', '**Errors logged by the extension:**', '```', ...errors, '```');
  const text = lines.join('\n');
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n\n`);
};

const main = async () => {
  const work = mkdtempSync(join(tmpdir(), 'afi-smoke-'));
  const extension = join(work, 'extension');
  const folders = { extensions: join(work, 'extensions'), shared: join(work, 'shared'), user: join(work, 'user') };
  const reportPath = join(work, 'report.json');
  for (const entry of readdirSync(root)) {
    if (SKIPPED.has(entry)) continue;
    if (LINKED.has(entry)) symlinkSync(join(root, entry), join(extension, entry), 'junction');
    else cpSync(join(root, entry), join(extension, entry), { recursive: true });
  }

  let failure;
  try {
    const cachePath = process.env.VSCODE_TEST_CACHE ?? join(root, '.vscode-test');
    const vscodeExecutablePath = await downloadAndUnzipVSCode({ cachePath, version });
    if (withExtensions) installExtensions(vscodeExecutablePath, folders);

    await runTests({
      extensionDevelopmentPath: extension,
      extensionTestsEnv: {
        COOL_THEME_KIT_MEMORY: '1',
        SMOKE_EXTENSIONS: withExtensions ? COMPAT_EXTENSIONS.join(',') : '',
        SMOKE_REPORT: reportPath,
      },
      extensionTestsPath: join(__dirname, 'suite.js'),
      launchArgs: [
        ...(withExtensions ? [] : ['--disable-extensions']),
        '--disable-workspace-trust',
        `--user-data-dir=${folders.user}`,
        `--extensions-dir=${folders.extensions}`,
      ],
      vscodeExecutablePath,
    });
  } catch (error) {
    failure = error;
  }

  try {
    const report = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, 'utf8')) : undefined;
    const logs = findOutputLogs(join(folders.user, 'logs'));
    const logLines = logs.flatMap((file) => readFileSync(file, 'utf8').split(/\r?\n/));
    const memoryLines = logLines.filter((line) => line.includes('"MEMORY"'));
    const errors = logLines.filter((line) => line.includes('"ERROR"'));
    summarize(report, memoryLines, errors, logs.length > 0);
    if (!failure && errors.length > 0) failure = new Error(`The extension logged ${errors.length} error(s), see above`);
  } finally {
    for (const entry of LINKED) rmSync(join(extension, entry), { force: true, recursive: false });
    rmSync(work, { force: true, maxRetries: 5, recursive: true });
  }
  if (failure) throw failure;
};

main().catch((error) => {
  console.error(`Smoke test failed on VS Code ${version}${withExtensions ? ' with other extensions' : ''}:`, error);
  process.exitCode = 1;
});
