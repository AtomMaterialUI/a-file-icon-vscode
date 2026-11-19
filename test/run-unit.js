/**
 * Bundles the unit tests with esbuild (aliasing `vscode` to a mock) and runs them with mocha.
 * Usage: bun run test:unit [file filter, e.g. accentColor]
 */
const { buildSync } = require('esbuild');
const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const Mocha = require('mocha');

const root = join(__dirname, '..');
const unitDir = join(__dirname, 'unit');
const outDir = join(root, 'out', 'unit');

const entryPoints = readdirSync(unitDir)
  .filter((file) => file.endsWith('.test.ts') && (!process.argv[2] || file.includes(process.argv[2])))
  .map((file) => join(unitDir, file));

buildSync({
  alias: { vscode: join(__dirname, 'mocks', 'vscode.ts') },
  bundle: true,
  entryPoints,
  external: ['mocha'],
  format: 'cjs',
  logLevel: 'warning',
  outdir: outDir,
  platform: 'node',
  sourcemap: 'inline',
  tsconfig: join(root, 'tsconfig.json'),
});

const mocha = new Mocha({ timeout: 120_000 });
for (const file of entryPoints) {
  mocha.addFile(join(outDir, file.slice(unitDir.length + 1).replace(/\.ts$/, '.js')));
}
mocha.run((failures) => {
  process.exitCode = failures ? 1 : 0;
});
