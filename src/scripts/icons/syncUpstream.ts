/**
 * Port the associations of the JetBrains plugin (iconGenerator/*_associations.json) to VS Code.
 *
 * The JetBrains plugin matches with regexes, VS Code only with exact file names, extensions and folder names.
 * Each upstream association carries a list of example names (`fileNames` / `folderNames`), which are converted:
 *   - `*.ext`      -> file extension `ext`
 *   - `name.ext`   -> file name
 *   - anything with a path or an inner wildcard is skipped (not expressible in VS Code)
 *
 * Only names that are not already claimed by the hand-written associations are emitted, so the manual
 * choices made for VS Code always win. The output files are generated: do not edit them by hand.
 *
 * Usage: bun run sync:upstream
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { IconPack } from 'src/@types/config';
import { DARK_FILE_ENDING, HIGH_CONTRAST_FILE_ENDING } from 'src/helpers/constants';
import { fileIcons } from 'src/icons/fileIcons';
import { folderIcons } from 'src/icons/folderIcons';
import { upstreamFiles } from 'src/icons/files/upstream';
import { upstreamFolders } from 'src/icons/folders/upstream';

/** Hand-written associations only: the previous output of this script must not count as claimed */
const manualFileIcons = fileIcons.icons.filter((icon) => !new Set<unknown>(upstreamFiles).has(icon));

/**
 * Upstream example names that only illustrate a regex (`users_controller.rb` for `.*_controller\.rb$`):
 * they would only match that exact made-up name in VS Code.
 */
const SAMPLE_NAME = /^(my|bla\.|users?_|test_)|materialthemebundle|\\|\d+\.\d+\.\d+/;

type UpstreamAssociation = {
  name: string;
  icon: string;
  pattern?: string;
  fileNames?: string;
  folderNames?: string;
  iconPack?: string;
};

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
  NEST: IconPack.Nest,
  NEXTJS: IconPack.Next,
  NGRX: IconPack.Ngrx,
  RAILS: IconPack.Rails,
  RECOIL: IconPack.Recoil,
  REDUX: IconPack.Redux,
};

const readAssociations = (file: string): UpstreamAssociation[] => {
  const json = JSON.parse(readFileSync(join(iconGeneratorPath, file), 'utf8'));
  const { regex = [], type = [] } = json.associations.associations;
  return [...regex, ...type].map((entry: { value: UpstreamAssociation }) => entry.value);
};

const iconName = (iconPath: string) => iconPath.split('/').pop()!.replace(/\.svg$/, '');

const splitNames = (names?: string) =>
  (names ?? '')
    // some upstream lists are wrapped over several lines, sometimes without a comma
    .split(/[\s,]+/)
    .map((name) => name.toLowerCase())
    .filter((name) => name.length > 0);

const hasVariant = (folder: string, name: string, suffix: string) => existsSync(join(iconsPath, folder, `${name}${suffix}.svg`));

const variants = (folder: string, name: string) => ({
  ...(hasVariant(folder, name, HIGH_CONTRAST_FILE_ENDING) && { highContrast: true }),
  ...(hasVariant(folder, name, DARK_FILE_ENDING) && { light: true }),
});

const sorted = (values: Set<string>) => [...values].sort();

/** Group the converted names by icon, preserving the upstream order of first appearance */
const groupByIcon = <T>(items: Iterable<[string, T]>) => {
  const groups = new Map<string, T[]>();
  for (const [key, value] of items) {
    groups.set(key, [...(groups.get(key) ?? []), value]);
  }
  return groups;
};

/** Map every name of the hand-written associations to its icon */
const claimedBy = (key: 'fileExtensions' | 'fileNames') =>
  new Map(manualFileIcons.flatMap((icon) => (icon[key] ?? []).map((value): [string, string] => [value.toLowerCase(), icon.name])));

const syncFiles = (): GeneratedEntry[] => {
  const claimedNames = claimedBy('fileNames');
  const claimedExtensions = claimedBy('fileExtensions');

  /** Icon VS Code currently shows for a file name: exact name first, then the longest matching extension */
  const resolve = (fileName: string) => {
    if (claimedNames.has(fileName)) return claimedNames.get(fileName);
    const parts = fileName.split('.');
    for (let index = 1; index < parts.length; index++) {
      const icon = claimedExtensions.get(parts.slice(index).join('.'));
      if (icon) return icon;
    }
    return;
  };

  /** Keep an upstream file name only if it changes what VS Code shows, without overriding a dot-file rule */
  const isUseful = (fileName: string, icon: string) => {
    const current = resolve(fileName);
    if (current === icon || claimedNames.has(fileName)) return false;
    // `.eslintrc`-like names are matched as an extension by VS Code: that is an explicit choice, keep it
    return !(current && /^\.[^.]+$/.test(fileName));
  };

  const entries = new Map<string, { names: Set<string>; extensions: Set<string>; packs: Set<IconPack> }>();
  // Upstream lists both a light and dark association for some icons: first association for a name wins
  const seen = new Set<string>();

  for (const assoc of readAssociations('icon_associations.json')) {
    if (assoc.iconPack && !PACKS[assoc.iconPack]) continue;

    const name = iconName(assoc.icon);
    if (!existsSync(join(iconsPath, 'files', `${name}.svg`))) continue;

    const entry = entries.get(name) ?? { extensions: new Set(), names: new Set(), packs: new Set() };
    if (assoc.iconPack) entry.packs.add(PACKS[assoc.iconPack]);

    // `.*\.(service|socket)$` lists its extensions as `.service,.socket`
    const isExtensionPattern = (assoc.pattern ?? '').startsWith(String.raw`.*\.`);

    for (const hint of splitNames(assoc.fileNames)) {
      if (hint.includes('/') || SAMPLE_NAME.test(hint)) continue;

      const extension = /^\*\.([^*]+)$/.exec(hint)?.[1] ?? (isExtensionPattern ? /^\.([^.*]+)$/.exec(hint)?.[1] : undefined);
      if (extension) {
        if (claimedExtensions.has(extension) || seen.has(`*.${extension}`)) continue;
        seen.add(`*.${extension}`);
        entry.extensions.add(extension);
      } else if (!hint.includes('*')) {
        if (!isUseful(hint, name) || seen.has(hint)) continue;
        seen.add(hint);
        entry.names.add(hint);
      }
    }

    entries.set(name, entry);
  }

  return [...entries.entries()]
    .filter(([, entry]) => entry.names.size > 0 || entry.extensions.size > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, entry]) => ({
      ...(entry.packs.size > 0 && { enabledFor: sorted(entry.packs as Set<string>) as IconPack[] }),
      ...(entry.extensions.size > 0 && { fileExtensions: sorted(entry.extensions) }),
      ...(entry.names.size > 0 && { fileNames: sorted(entry.names) }),
      ...variants('files', name),
      name,
    }));
};

const syncFolders = (): GeneratedEntry[] => {
  const specific = folderIcons.find((theme) => theme.name === 'specific');
  const manual = (specific?.icons ?? []).filter((icon) => !new Set<unknown>(upstreamFolders).has(icon));
  const claimed = new Set(manual.flatMap((icon) => icon.folderNames).map((n) => n.toLowerCase()));
  const seen = new Set<string>();

  // the generator adds the `.name` and `_name` variants by itself
  const pairs = readAssociations('folder_associations.json').flatMap((assoc) => {
    const name = iconName(assoc.icon);
    const exists = existsSync(join(iconsPath, 'folders', `${name}.svg`)) && existsSync(join(iconsPath, 'foldersOpen', `${name}.svg`));
    if (!exists) return [];

    return splitNames(assoc.folderNames)
      // `.github` / `_github` -> `github`, but keep `__pycache__` intact
      .map((hint) => hint.replace(/^[._](?=[^._])/, ''))
      .filter((hint) => hint.length > 0 && !/[*/]/.test(hint))
      .filter((hint) => {
        if (claimed.has(hint) || seen.has(hint)) return false;
        seen.add(hint);
        return true;
      })
      .map((hint): [string, string] => [name, hint]);
  });

  return [...groupByIcon(pairs).entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, folderNames]) => ({
      folderNames: [...new Set(folderNames)].sort(),
      ...variants('folders', name),
      name,
    }));
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
 * GENERATED by src/scripts/icons/syncUpstream.ts from the iconGenerator submodule. Do not edit by hand:
 * add or override associations in the hand-written files instead, then run \`bun run sync:upstream\`.
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
