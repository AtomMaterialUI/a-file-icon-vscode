/**
 * Starts a real VS Code with the built extension and runs `suite.js` in it: activation, the Mix Themes page, and a
 * regeneration after a change of a setting. It checks the lowest VS Code of `engines.vscode` as well as the latest one.
 *
 * Usage: bun run build, then `node test/smoke/run.js [version]` (default `stable`, e.g. `1.95.0`).
 * The extension runs from a copy (the theme files are rewritten by the test) and with an empty profile.
 */
const { runTests } = require('@vscode/test-electron');
const { cpSync, mkdtempSync, readdirSync, rmSync, symlinkSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

const root = join(__dirname, '..', '..');
const version = process.argv[2] ?? 'stable';

/** What the extension reads at runtime is copied, the large read-only folders are linked */
const LINKED = new Set(['assets', 'iconGenerator']);
const SKIPPED = new Set(['.claude', '.git', '.github', '.vscode', '.vscode-test', 'build', 'docs', 'node_modules', 'out', 'src', 'test']);

const main = async () => {
  const work = mkdtempSync(join(tmpdir(), 'afi-smoke-'));
  const extension = join(work, 'extension');
  for (const entry of readdirSync(root)) {
    if (SKIPPED.has(entry)) continue;
    if (LINKED.has(entry)) symlinkSync(join(root, entry), join(extension, entry), 'junction');
    else cpSync(join(root, entry), join(extension, entry), { recursive: true });
  }

  try {
    await runTests({
      cachePath: process.env.VSCODE_TEST_CACHE ?? join(root, '.vscode-test'),
      extensionDevelopmentPath: extension,
      extensionTestsPath: join(__dirname, 'suite.js'),
      launchArgs: ['--disable-extensions', '--disable-workspace-trust', `--user-data-dir=${join(work, 'user')}`, `--extensions-dir=${join(work, 'extensions')}`],
      version,
    });
  } finally {
    for (const entry of LINKED) rmSync(join(extension, entry), { force: true, recursive: false });
    rmSync(work, { force: true, maxRetries: 5, recursive: true });
  }
};

main().catch((error) => {
  console.error(`Smoke test failed on VS Code ${version}:`, error);
  process.exitCode = 1;
});
