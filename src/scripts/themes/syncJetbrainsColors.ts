/**
 * Generate the base color themes (`themes/cool-islands-*.base.json`) from the Islands themes of the JetBrains IDEs
 * (JetBrains/intellij-community, Apache License 2.0): the UI themes with their parents, the editor color schemes with
 * their parents, and the colors the language plugins add to the bundled schemes (Python, Markdown, YAML, shell, XML).
 * The maps in src/themes/jetbrains*Map.ts say which JetBrains color each VS Code color takes.
 * The generated files are not edited by hand.
 *
 * Usage: bun run sync:colors              the commit pinned in themes/jetbrains-source.json
 *        bun run sync:colors -- --latest  the latest commit of master; the pin only moves when a theme changes
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkedCommit, checkedDate } from 'src/scripts/jetbrainsSource';
import { COLOR_THEMES, extensionRoot, THEMES_FOLDER } from 'src/themes/colorThemes';
import { convertJetbrainsTheme } from 'src/themes/convertJetbrainsTheme';
import { parseAdditionalAttributes, parseSchemes, resolveScheme, resolveUiTheme } from 'src/themes/jetbrainsTheme';

import type { SchemeData, UiThemeJson } from 'src/themes/jetbrainsTheme';

type Source = { commit: string; date?: string; license: string; repository: string };

const REPOSITORY = 'JetBrains/intellij-community';
const THEMES = 'platform/platform-resources/src/themes';

const UI_THEME_FILES = [
  `${THEMES}/darcula.theme.json`,
  `${THEMES}/intellijlaf.theme.json`,
  `${THEMES}/expUI/expUI_dark.theme.json`,
  `${THEMES}/expUI/expUI_light.theme.json`,
  `${THEMES}/expUI/expUI_light_with_light_header.theme.json`,
  `${THEMES}/islands/ManyIslandsDark.theme.json`,
  `${THEMES}/islands/ManyIslandsLight.theme.json`,
];

const SCHEME_FILES = [
  'platform/platform-resources/src/DefaultColorSchemesManager.xml',
  `${THEMES}/expUI/expUI_darkScheme.xml`,
  `${THEMES}/expUI/expUI_lightScheme.xml`,
  `${THEMES}/islands/IslandSchemeDark.xml`,
];

/** `<additionalTextAttributes scheme=… file=…>` of the plugins bundled with PyCharm */
const ADDITIONAL_FILES: Array<{ path: string; scheme: string }> = [
  { path: 'python/python-code-insight/resources/colorSchemes/PythonDefault.xml', scheme: 'Default' },
  { path: 'python/python-code-insight/resources/colorSchemes/PythonDarcula.xml', scheme: 'Darcula' },
  { path: 'plugins/markdown/core/resources/colorSchemes/MarkdownDefault.xml', scheme: 'Default' },
  { path: 'plugins/markdown/core/resources/colorSchemes/MarkdownDarcula.xml', scheme: 'Darcula' },
  { path: 'plugins/yaml/backend/resources/colorSchemes/YAMLDefault.xml', scheme: 'Default' },
  { path: 'plugins/yaml/backend/resources/colorSchemes/YAMLDarcula.xml', scheme: 'Darcula' },
  { path: 'plugins/sh/core/resources/colors/ShDefault.xml', scheme: 'Default' },
  { path: 'plugins/sh/core/resources/colors/ShDarcula.xml', scheme: 'Darcula' },
  { path: 'xml/xml-ui-common/resources/colorSchemes/XmlDarcula.xml', scheme: 'Darcula' },
];

const root = extensionRoot(__dirname);
const themesPath = join(root, THEMES_FOLDER);
const sourcePath = join(themesPath, 'jetbrains-source.json');

const download = async (commit: string, path: string): Promise<string> => {
  const response = await fetch(`https://raw.githubusercontent.com/${REPOSITORY}/${commit}/${path}`);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.text();
};

const latestCommit = async (): Promise<{ commit: string; date: string }> => {
  const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/commits/master`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'theme-sync-script' },
  });
  if (!response.ok) throw new Error(`Latest commit: HTTP ${response.status}`);
  const body = (await response.json()) as { commit: { committer: { date: string } }; sha: string };
  return { commit: checkedCommit(body.sha), date: checkedDate(body.commit.committer.date) };
};

const generate = async (commit: string) => {
  const uiThemes = await Promise.all(UI_THEME_FILES.map(async (path) => JSON.parse(await download(commit, path)) as UiThemeJson));
  const schemeFiles = await Promise.all(SCHEME_FILES.map((path) => download(commit, path)));
  const schemes: SchemeData[] = schemeFiles.flatMap((xml) => parseSchemes(xml));
  const additional: Parameters<typeof resolveScheme>[2] = {};
  for (const { path, scheme } of ADDITIONAL_FILES) {
    (additional[scheme] ??= []).push(parseAdditionalAttributes(await download(commit, path)));
  }

  const outputs = new Map<string, string>();
  for (const info of COLOR_THEMES) {
    const ui = resolveUiTheme(uiThemes, info.jetbrains);
    if (!ui.editorScheme) throw new Error(`${info.jetbrains} has no editor scheme`);
    const scheme = resolveScheme(schemes, ui.editorScheme, additional);
    const { theme, unresolved } = convertJetbrainsTheme(info.label, ui, scheme);
    console.log(`${info.label}: UI ${ui.chain.join(' > ')}, editor ${scheme.chain.join(' > ')}`);
    console.log(`  ${Object.keys(theme.colors).length} colors, ${theme.tokenColors.length} token rules, ${Object.keys(theme.semanticTokenColors).length} semantic rules`);
    if (unresolved.length > 0) console.log(`  left to the VS Code defaults: ${unresolved.join(', ')}`);
    outputs.set(info.base, `${JSON.stringify(theme, undefined, 2)}\n`);
  }
  return outputs;
};

/** The text of a file, or undefined when there is none: read once, no separate existence check (CodeQL js/file-system-race) */
const readIfExists = (path: string): string | undefined => {
  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
};

const main = async () => {
  const pinned = JSON.parse(readFileSync(sourcePath, 'utf8')) as Source;
  const latest = process.argv.includes('--latest') ? await latestCommit() : undefined;
  const commit = checkedCommit(latest?.commit ?? pinned.commit);
  console.log(`${REPOSITORY}@${commit}`);

  const outputs = await generate(commit);
  let changed = false;
  for (const [file, content] of outputs) {
    const path = join(themesPath, file);
    if (readIfExists(path) === content) continue;
    writeFileSync(path, content);
    changed = true;
    console.log(`wrote ${THEMES_FOLDER}/${file}`);
  }
  // Pin the new commit only when it changed a theme: master moves every hour
  if (latest && changed) {
    writeFileSync(sourcePath, `${JSON.stringify({ ...pinned, commit, date: latest.date }, undefined, 2)}\n`);
    console.log(`pinned ${commit}`);
  }
  if (!changed) console.log('themes unchanged');
};

// ts-node runs the scripts as CommonJS, which has no top-level await
// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
