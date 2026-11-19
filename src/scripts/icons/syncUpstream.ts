/**
 * Port the associations of the JetBrains plugin (iconGenerator/*_associations.json) to VS Code,
 * so that VS Code shows the icons PyCharm (with Atom Material Icons) shows.
 *
 * The JetBrains plugin matches with regexes, VS Code only with exact file names, extensions and folder names.
 * Each upstream association carries a list of example names (`fileNames` / `folderNames`), which give the names
 * VS Code can express:
 *   - `*.ext`      -> file extension `ext`
 *   - `name.ext`   -> file name
 *   - anything with a path or an inner wildcard is skipped (not expressible in VS Code)
 *
 * For each of those names, the icon is the one the JetBrains plugin picks (regex + priority, see jetbrainsMatcher),
 * with its default icon packs. A name is emitted when the hand-written associations give it another icon (or none):
 * the JetBrains choice wins. Names that JetBrains does not know keep their hand-written icon.
 * The output files are generated and applied after the hand-written ones: do not edit them by hand.
 *
 * Usage: bun run sync:upstream
 */
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { IconPack } from 'src/@types/config';
import { DARK_FILE_ENDING, HIGH_CONTRAST_FILE_ENDING } from 'src/helpers/constants';
import { fileIcons } from 'src/icons/fileIcons';
import { getDefaultConfig } from 'src/icons/configUtils';
import { folderIcons } from 'src/icons/folderIcons';
import { upstreamFiles } from 'src/icons/files/upstream';
import { upstreamFolders } from 'src/icons/folders/upstream';

import { fileKeys, findAssociation, folderKeys, iconName, loadDefaultAssociations, readAssociations } from './jetbrainsMatcher';

import type { CompiledAssociation, FileKey } from './jetbrainsMatcher';
import type { FileAssociation } from 'src/@types/associations';

type GeneratedEntry = {
  name: string;
  fileExtensions?: string[];
  fileNames?: string[];
  folderNames?: string[];
  light?: boolean;
  highContrast?: boolean;
  enabledFor?: IconPack[];
};

const root = join(__dirname, '..', '..', '..');
const iconGeneratorPath = join(root, 'iconGenerator');
const iconsPath = join(iconGeneratorPath, 'assets', 'icons');

/** Upstream packs that have a VS Code equivalent. Associations of other packs are skipped. */
const PACKS: Record<string, IconPack> = {
  ANGULAR: IconPack.Angular,
  ANGULAR2: IconPack.Angular2,
  CSS: IconPack.Css,
  NEST: IconPack.Nest,
  NEXTJS: IconPack.Next,
  NGRX: IconPack.Ngrx,
  RAILS: IconPack.Rails,
  RECOIL: IconPack.Recoil,
  REDUX: IconPack.Redux,
  TESTS: IconPack.Tests,
};

/** The packs of the default settings: the generated entries correct what the default theme shows */
const DEFAULT_PACKS = new Set<IconPack>(getDefaultConfig().activeIconPacks);

/** Real svg names by lower case name: the json writes `groovyfile` for `groovyFile.svg` (case-sensitive on Linux) */
const svgNames = (folder: string) =>
  new Map(readdirSync(join(iconsPath, folder)).map((file) => [file.toLowerCase(), file.replace(/\.svg$/, '')]));
const fileSvgs = svgNames('files');
const folderSvgs = svgNames('folders');

const hasVariant = (folder: string, name: string, suffix: string) => existsSync(join(iconsPath, folder, `${name}${suffix}.svg`));

const variants = (folder: string, name: string) => ({
  ...(hasVariant(folder, name, HIGH_CONTRAST_FILE_ENDING) && { highContrast: true }),
  ...(hasVariant(folder, name, DARK_FILE_ENDING) && { light: true }),
});

/** Code unit order, not `localeCompare`: the generated file must not depend on the locale of the machine */
const byCodeUnit = (a: string, b: string) => (a < b ? -1 : Number(a > b));

const sorted = (values: Iterable<string>) => [...new Set(values)].sort(byCodeUnit);

/** The pack of an upstream association in VS Code, null when VS Code has no such pack */
const packOf = (association: CompiledAssociation): IconPack | null | undefined =>
  association.iconPack ? (PACKS[association.iconPack] ?? null) : undefined;

/** Hand-written associations active with the JetBrains default packs, in the order the generator applies them */
const manualInGeneratorOrder = <T extends { enabledFor?: IconPack[] }>(icons: T[], generated: unknown[]) => {
  const manual = icons.filter((icon) => !new Set<unknown>(generated).has(icon));
  const active = manual.filter((icon) => !icon.enabledFor || icon.enabledFor.some((pack) => DEFAULT_PACKS.has(pack)));
  return [...active.filter((icon) => !icon.enabledFor), ...active.filter((icon) => icon.enabledFor)];
};

/** Collects the generated entries, one per icon and pack */
class EntryCollector {
  private readonly entries = new Map<string, { name: string; pack?: IconPack; names: Set<string>; extensions: Set<string> }>();

  add(name: string, pack: IconPack | undefined, key: { extension?: string; fileName?: string; folderName?: string }) {
    const id = `${name}|${pack ?? ''}`;
    const entry = this.entries.get(id) ?? { extensions: new Set<string>(), name, names: new Set<string>(), pack };
    if (key.extension) entry.extensions.add(key.extension);
    if (key.fileName) entry.names.add(key.fileName);
    if (key.folderName) entry.names.add(key.folderName);
    this.entries.set(id, entry);
  }

  toFileEntries(): GeneratedEntry[] {
    return this.sortedEntries().map((entry) => ({
      ...(entry.pack && { enabledFor: [entry.pack] }),
      ...(entry.extensions.size > 0 && { fileExtensions: sorted(entry.extensions) }),
      ...(entry.names.size > 0 && { fileNames: sorted(entry.names) }),
      ...variants('files', entry.name),
      name: entry.name,
    }));
  }

  toFolderEntries(): GeneratedEntry[] {
    return this.sortedEntries().map((entry) => ({
      folderNames: sorted(entry.names),
      ...variants('folders', entry.name),
      name: entry.name,
    }));
  }

  private sortedEntries() {
    return [...this.entries.values()].sort((a, b) => a.name.localeCompare(b.name) || (a.pack ?? '').localeCompare(b.pack ?? ''));
  }
}

const syncFiles = (): GeneratedEntry[] => {
  const associations = loadDefaultAssociations(iconGeneratorPath, 'icon_associations.json');

  // icon given to each name by the hand-written associations (the last one wins, as in the generator)
  const manual = manualInGeneratorOrder<FileAssociation>(fileIcons.icons, upstreamFiles);
  const manualNames = new Map<string, string>();
  const manualExtensions = new Map<string, string>();
  for (const icon of manual) {
    for (const name of icon.fileNames ?? []) manualNames.set(name.toLowerCase(), icon.name);
    for (const extension of icon.fileExtensions ?? []) manualExtensions.set(extension.toLowerCase(), icon.name);
  }

  // extensions given by the generated entries, which replace the hand-written ones
  const generatedExtensions = new Map<string, string>();

  /** Icon VS Code shows for a file name: exact name, then longest extension (generated or hand-written) */
  const currentIcon = (fileName: string) => {
    if (manualNames.has(fileName)) return manualNames.get(fileName);
    const parts = fileName.split('.');
    for (let index = 1; index < parts.length; index++) {
      const extension = parts.slice(index).join('.');
      const icon = generatedExtensions.get(extension) ?? manualExtensions.get(extension);
      if (icon) return icon;
    }
    return;
  };

  /** The svg of the icon JetBrains shows for this name, and its pack; undefined when there is none or not ported */
  const jetbrainsIcon = (matchedName: string) => {
    const winner = findAssociation(associations, matchedName);
    const name = winner && fileSvgs.get(`${iconName(winner.icon)}.svg`.toLowerCase());
    const pack = winner && packOf(winner);
    return name && pack !== null ? { name, pack } : undefined;
  };

  // the example names of the JetBrains associations, then every name of the hand-written associations;
  // names with a folder (`.github/build.yaml`) never match in VS Code
  const keys: FileKey[] = [
    ...fileKeys(readAssociations(iconGeneratorPath, 'icon_associations.json')),
    ...[...manualNames.keys()].map((fileName) => ({ fileName, matchedName: fileName })),
    ...[...manualExtensions.keys()].map((extension) => ({ extension, matchedName: `file.${extension}` })),
  ].filter(({ matchedName }) => !matchedName.includes('/'));

  const collector = new EntryCollector();

  // extensions first: a file name is compared with what its extension gives once corrected
  const extensions = new Set(keys.flatMap(({ extension }) => (extension ? [extension] : [])));
  for (const extension of extensions) {
    const icon = jetbrainsIcon(`file.${extension}`);
    if (!icon || currentIcon(`file.${extension}`) === icon.name) continue;
    collector.add(icon.name, icon.pack, { extension });
    // a pack entry only applies when the pack is on
    if (!icon.pack || DEFAULT_PACKS.has(icon.pack)) generatedExtensions.set(extension, icon.name);
  }

  // VS Code also applies an extension to the dot file of that name (`pre-commit-config.yaml` to
  // `.pre-commit-config.yaml`), which JetBrains may match with another association: check it as a file name too
  // An extension is not applied to the file of that exact name: `test.js` gets the `js` icon in VS Code and `czrc`
  // none, while JetBrains matches them with `.*\.?(test|spec)\.js` and `^\.?czrc$`: check them as file names too
  const fileNames = new Set([
    ...keys.flatMap(({ fileName }) => (fileName ? [fileName] : [])),
    ...[...extensions].map((extension) => `.${extension}`),
    ...extensions,
  ]);
  for (const fileName of fileNames) {
    const icon = jetbrainsIcon(fileName);
    if (!icon || currentIcon(fileName) === icon.name) continue;
    collector.add(icon.name, icon.pack, { fileName });
  }

  return collector.toFileEntries();
};

const syncFolders = (): GeneratedEntry[] => {
  const associations = loadDefaultAssociations(iconGeneratorPath, 'folder_associations.json');

  const specific = folderIcons.find((theme) => theme.name === 'specific');
  const manual = manualInGeneratorOrder(specific?.icons ?? [], upstreamFolders);
  const manualFolders = new Map<string, string>();
  for (const icon of manual) {
    for (const name of icon.folderNames) manualFolders.set(name.toLowerCase(), icon.name);
  }

  const collector = new EntryCollector();
  // the example names of the JetBrains associations, then every name of the hand-written associations
  const keys = [
    ...folderKeys(readAssociations(iconGeneratorPath, 'folder_associations.json')),
    ...[...manualFolders.keys()].map((folderName) => ({ folderName, matchedName: folderName })),
  ];
  const seen = new Set<string>();

  for (const { folderName, matchedName } of keys) {
    if (seen.has(folderName)) continue;
    seen.add(folderName);

    const winner = findAssociation(associations, matchedName);
    if (!winner) continue;

    // a folder without an expanded variant uses its closed icon (IconThemeGenerator)
    const name = folderSvgs.get(`${iconName(winner.icon)}.svg`.toLowerCase());
    if (!name) continue;
    if ((manualFolders.get(folderName) ?? 'folder') === name) continue;

    collector.add(name, undefined, { folderName });
  }

  return collector.toFolderEntries();
};

/** Serialize as TypeScript in the style of the hand-written files (unquoted keys, single quotes, IconPack enum) */
const toTs = (exportName: string, entries: GeneratedEntry[]) => {
  const packNames = new Map(Object.entries(IconPack).map(([key, value]) => [value as string, key]));
  const body = JSON.stringify(entries, (key, value) => {
    if (key === 'enabledFor') return (value as string[]).map((pack) => `@@IconPack.${packNames.get(pack)}@@`);
    if (typeof value === 'string' && value.includes("'")) throw new Error(`Unsupported quote in ${value}`);
    return value;
  }, 2)
    .replaceAll(/"(\w+)":/g, '$1:')
    .replaceAll(/"@@(IconPack\.\w+)@@"/g, '$1')
    .replaceAll('"', "'");

  const usesPacks = body.includes('IconPack.');
  return `/**
 * GENERATED by src/scripts/icons/syncUpstream.ts from the iconGenerator submodule. Do not edit by hand.
 * These associations are applied after the hand-written ones: they give each name the icon of the JetBrains plugin.
 * Run \`bun run sync:upstream\` after changing the hand-written associations or updating iconGenerator.
 */
${usesPacks ? "import { IconPack } from 'src/@types/config';\n\n" : ''}export const ${exportName} = ${body};
`;
};

const files = syncFiles();
const folders = syncFolders();

writeFileSync(join(root, 'src', 'icons', 'files', 'upstream.ts'), toTs('upstreamFiles', files));
writeFileSync(join(root, 'src', 'icons', 'folders', 'upstream.ts'), toTs('upstreamFolders', folders));

const count = (entries: GeneratedEntry[], key: 'fileExtensions' | 'fileNames' | 'folderNames') =>
  entries.reduce((total, entry) => total + (entry[key]?.length ?? 0), 0);

console.log(
  `upstream files: ${files.length} icons, ${count(files, 'fileNames')} file names, ${count(files, 'fileExtensions')} extensions`,
);
console.log(`upstream folders: ${folders.length} icons, ${count(folders, 'folderNames')} folder names`);
