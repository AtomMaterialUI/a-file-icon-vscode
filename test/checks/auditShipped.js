/**
 * Security audit of the dependencies, split by what reaches the users.
 *
 * Only the bundles ship in the VSIX (`vsce package --no-dependencies`): the packages esbuild puts into
 * dist/extension.js are the ones users run. An advisory of `high` or `critical` severity for one of them fails;
 * the advisories of the build and test tools (svgo, webfont, eslint, ...) are listed but do not fail, they are
 * updated by Dependabot (see docs/MAINTENANCE.md).
 *
 * Usage: `bun run audit:shipped` (needs the network: it runs `bun audit --json`).
 * In GitHub Actions the result is also written to the job summary.
 */
const { spawnSync } = require('node:child_process');
const { appendFileSync, existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..', '..');
// bun resolves a bare `esbuild` to the esbuild.js of the root (tsconfig baseUrl is "."): load the package itself
const esbuild = require(join(root, 'node_modules', 'esbuild'));
const FAILING = new Set(['critical', 'high']);

/**
 * Advisories accepted for a shipped package, with the reason and the date to look at them again.
 * GHSA id -> reason. Keep it empty unless an advisory does not apply to how the package is used.
 * @type {Record<string, string>}
 */
const ACCEPTED = {};

/** The packages bundled into an entry point, with their versions: name -> versions */
const bundledPackages = (entryPoint) => {
  const result = esbuild.buildSync({
    absWorkingDir: root,
    bundle: true,
    entryPoints: [entryPoint],
    external: ['vscode'],
    format: 'cjs',
    logLevel: 'silent',
    metafile: true,
    outfile: join(root, 'out', 'audit', 'bundle.js'),
    platform: entryPoint.includes('web') ? 'browser' : 'node',
    write: false,
  });

  /** @type {Map<string, Set<string>>} */
  const packages = new Map();
  // the paths of the metafile use / on every platform
  for (const input of Object.keys(result.metafile.inputs)) {
    const parts = input.split('/');
    const index = parts.lastIndexOf('node_modules');
    if (index === -1) continue;
    const name = parts[index + 1].startsWith('@') ? `${parts[index + 1]}/${parts[index + 2]}` : parts[index + 1];
    const folder = join(root, ...parts.slice(0, index + 1), ...name.split('/'));
    const manifest = join(folder, 'package.json');
    const version = existsSync(manifest) ? JSON.parse(readFileSync(manifest, 'utf8')).version : undefined;
    if (!packages.has(name)) packages.set(name, new Set());
    if (version) packages.get(name).add(version);
  }
  return packages;
};

/** Whether a version is in an advisory's range; without bun's semver every installed version counts as affected */
const affects = (version, range) => {
  const semver = globalThis.Bun?.semver;
  if (!semver || !version) return true;
  try {
    return semver.satisfies(version, range);
  } catch {
    return true;
  }
};

const ghsa = (advisory) => /GHSA-[\w-]+/.exec(advisory.url ?? '')?.[0] ?? String(advisory.id);

const runAudit = () => {
  const audit = spawnSync('bun', ['audit', '--json'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, shell: process.platform === 'win32' });
  try {
    return JSON.parse(audit.stdout || '{}');
  } catch {
    console.error(audit.stdout, audit.stderr);
    throw new Error('bun audit did not give a JSON report (is the registry reachable?)');
  }
};

const main = () => {
  const shipped = new Map();
  for (const entry of ['src/extension.ts', 'src/web/extension.ts']) {
    for (const [name, versions] of bundledPackages(entry)) {
      if (!shipped.has(name)) shipped.set(name, new Set());
      for (const version of versions) shipped.get(name).add(version);
    }
  }

  /** @type {Record<string, Array<{ id: number; severity: string; title: string; url: string; vulnerable_versions: string }>>} */
  const report = runAudit();
  const shippedFindings = [];
  const toolCounts = { critical: 0, high: 0, low: 0, moderate: 0 };

  for (const [name, advisories] of Object.entries(report)) {
    if (!Array.isArray(advisories)) continue;
    for (const advisory of advisories) {
      const versions = [...(shipped.get(name) ?? [])];
      const hit = shipped.has(name) && (versions.length === 0 || versions.some((version) => affects(version, advisory.vulnerable_versions)));
      if (hit) shippedFindings.push({ ...advisory, accepted: ACCEPTED[ghsa(advisory)], name, versions });
      else toolCounts[advisory.severity] = (toolCounts[advisory.severity] ?? 0) + 1;
    }
  }

  const failing = shippedFindings.filter((finding) => FAILING.has(finding.severity) && !finding.accepted);
  const lines = [
    '### Dependency audit',
    '',
    `Shipped packages (bundled into dist/): ${[...shipped.keys()].sort().join(', ') || 'none'}`,
    '',
  ];
  if (shippedFindings.length === 0) {
    lines.push('No advisory for a shipped package.');
  } else {
    lines.push('| Package | Severity | Advisory | Status |', '|---|---|---|---|');
    for (const finding of shippedFindings) {
      const status = finding.accepted ? `accepted: ${finding.accepted}` : FAILING.has(finding.severity) ? '**fails**' : 'to update';
      lines.push(`| ${finding.name}@${finding.versions.join(',')} | ${finding.severity} | [${ghsa(finding)}](${finding.url}) ${finding.title} | ${status} |`);
    }
  }
  const tools = Object.entries(toolCounts).filter(([, count]) => count > 0).map(([severity, count]) => `${count} ${severity}`);
  lines.push('', `Build and test tools (not shipped): ${tools.length > 0 ? tools.join(', ') : 'no advisory'}.`);

  const text = lines.join('\n');
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n\n`);

  for (const finding of failing) {
    console.log(`::error title=Vulnerable shipped dependency::${finding.name} ${finding.severity}: ${finding.title} (${finding.url})`);
  }
  if (failing.length > 0) process.exitCode = 1;
};

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}

