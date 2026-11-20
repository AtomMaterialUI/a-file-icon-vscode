/**
 * Size budgets of what VS Code loads: the bundle the extension host parses at activation, the theme json files it
 * parses (and keeps) when the theme is selected, and the VSIX users download and unpack.
 * Growing past a budget fails: raise it only in a pull request that says why (docs/MAINTENANCE.md, "Memory").
 *
 * Usage: after `vsce package` (dist/extension.js is then the production bundle): `node test/checks/sizeBudget.js [<vsix>]`.
 * In GitHub Actions the result is also written to the job summary.
 */
const { appendFileSync, existsSync, readFileSync, statSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..', '..');
const KB = 1024;
const MB = 1024 * KB;

/** Budgets with about 20-30 % over the sizes of 2026-11 (bundle 533 KB, VSIX 11.6 MB and 5,602 files) */
const FILE_BUDGETS = [
  { budget: 700 * KB, file: 'dist/extension.js', what: 'production bundle (parsed at activation)' },
  { budget: 64 * KB, file: 'dist/web/extension.js', what: 'web bundle' },
  { budget: 900 * KB, file: 'dist/a-file-icon-vscode-icon-theme.json', what: 'icon theme json (parsed by VS Code)' },
  { budget: 230 * KB, file: 'dist/a-file-icon-vscode-product-icon-theme.json', what: 'Material product icon theme json' },
  { budget: 32 * KB, file: 'dist/cool-islands-product-icon-theme.json', what: 'Islands product icon theme json' },
  { budget: 64 * KB, file: 'dist/cool-islands-dark-color-theme.json', what: 'Cool Islands Dark' },
  { budget: 64 * KB, file: 'dist/cool-islands-light-color-theme.json', what: 'Cool Islands Light' },
];
const VSIX_BUDGET = { bytes: 14 * MB, files: 6500 };

const format = (bytes) => (bytes >= MB ? `${(bytes / MB).toFixed(2)} MB` : `${(bytes / KB).toFixed(1)} KB`);

/** The number of entries of a zip file, from its end of central directory record (a VSIX is a zip, never zip64) */
const zipEntries = (path) => {
  const buffer = readFileSync(path);
  for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 65_557); offset--) {
    if (buffer.readUInt32LE(offset) === 0x06_05_4b_50) return buffer.readUInt16LE(offset + 10);
  }
  throw new Error(`${path} is not a zip file`);
};

const rows = [];
let failed = false;
const check = (what, value, budget, shown = format) => {
  const ok = value <= budget;
  failed ||= !ok;
  rows.push(`| ${what} | ${shown(value)} | ${shown(budget)} | ${ok ? 'ok' : '**over**'} |`);
  if (!ok) console.log(`::error title=Size budget::${what} is ${shown(value)}, over its budget of ${shown(budget)}`);
};

for (const { budget, file, what } of FILE_BUDGETS) {
  const path = join(root, file);
  if (!existsSync(path)) {
    console.log(`::error title=Size budget::${file} is missing: run the build (and vsce package) first`);
    failed = true;
    continue;
  }
  check(`${file} — ${what}`, statSync(path).size, budget);
}

const vsix = process.argv[2];
if (vsix) {
  check('VSIX download', statSync(vsix).size, VSIX_BUDGET.bytes);
  check('VSIX files', zipEntries(vsix), VSIX_BUDGET.files, String);
}

const text = ['### Size budgets', '', '| What | Size | Budget | |', '|---|---|---|---|', ...rows].join('\n');
console.log(text);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n\n`);
if (failed) process.exitCode = 1;
