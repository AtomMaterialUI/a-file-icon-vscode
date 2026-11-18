/**
 * Emulates how the JetBrains plugin (Atom Material Icons, `a-file-icon-idea`) picks the icon of a file or folder
 * from the iconGenerator association json: among the enabled regex associations whose pattern matches the whole
 * name (case-insensitive), the one with the highest priority wins, the first one on a tie.
 * Patterns containing `/` match the full path in JetBrains. VS Code only sees names, so they are tested against the
 * path of a file at the root of a project: `.*\/(config|settings)\.json` applies, `.*\/tests\/.*\.py` does not.
 *
 * Source: `RegexAssociation.matches` and `DefaultAssociations.findMatchingAssociation` in a-file-icon-idea.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type UpstreamAssociation = {
  name: string;
  icon: string;
  pattern?: string;
  priority?: number | string;
  fileNames?: string;
  folderNames?: string;
  iconPack?: string;
};

export type CompiledAssociation = UpstreamAssociation & { priority: number; regex: RegExp };

/** Packs of the JetBrains plugin that are off by default (`AtomSettingsConfig`): every other pack is on */
export const JETBRAINS_PACKS_OFF_BY_DEFAULT = new Set(['ANGULAR']);

export const readAssociations = (iconGeneratorPath: string, file: string): UpstreamAssociation[] => {
  const json = JSON.parse(readFileSync(join(iconGeneratorPath, file), 'utf8'));
  const { regex = [], type = [] } = json.associations.associations;
  return [...regex, ...type].map((entry: { value: UpstreamAssociation }) => entry.value);
};

/** The regex associations active by default in the JetBrains plugin, compiled */
export const loadDefaultAssociations = (iconGeneratorPath: string, file: string): CompiledAssociation[] =>
  readAssociations(iconGeneratorPath, file).flatMap((association) => {
    if (!association.pattern) return [];
    if (association.iconPack && JETBRAINS_PACKS_OFF_BY_DEFAULT.has(association.iconPack)) return [];
    try {
      const regex = new RegExp(`^(?:${association.pattern})$`, 'i');
      return [{ ...association, priority: Number(association.priority ?? 100), regex }];
    } catch {
      // Java-only regex syntax
      return [];
    }
  });

/** The association the JetBrains plugin uses for this file or folder name, if any */
export const findAssociation = (associations: CompiledAssociation[], name: string): CompiledAssociation | undefined => {
  let best: CompiledAssociation | undefined;
  for (const association of associations) {
    const target = association.pattern?.includes('/') ? `/project/${name}` : name;
    if ((!best || association.priority > best.priority) && association.regex.test(target)) best = association;
  }
  return best;
};

/** `/icons/files/foo.svg` -> `foo` */
export const iconName = (iconPath: string) => iconPath.split('/').pop()!.replace(/\.svg$/, '');

/**
 * Upstream example names that only illustrate a regex (`users_controller.rb` for `.*_controller\.rb$`):
 * they would only match that exact made-up name in VS Code.
 */
export const SAMPLE_NAME = /^(my|bla\.|users?_|test_)|materialthemebundle|\\|\d+\.\d+\.\d+/;

export const splitNames = (names?: string) =>
  (names ?? '')
    // some upstream lists are wrapped over several lines, sometimes without a comma
    .split(/[\s,]+/)
    .map((name) => name.toLowerCase())
    .filter((name) => name.length > 0);

/** A file name or extension VS Code can express, and the file name JetBrains matches for it */
export type FileKey = { extension?: string; fileName?: string; matchedName: string };

/**
 * The file names and extensions VS Code can express, from the example names of the associations:
 * `*.ext` -> extension `ext`, `name.ext` -> file name. Names with a path or an inner wildcard are skipped.
 */
export const fileKeys = (associations: UpstreamAssociation[]): FileKey[] => {
  const keys = new Map<string, FileKey>();
  for (const association of associations) {
    // `.*\.(service|socket)$` lists its extensions as `.service,.socket`
    const isExtensionPattern = (association.pattern ?? '').startsWith(String.raw`.*\.`);

    for (const hint of splitNames(association.fileNames)) {
      if (hint.includes('/') || SAMPLE_NAME.test(hint)) continue;

      const extension = /^\*\.([^*]+)$/.exec(hint)?.[1] ?? (isExtensionPattern ? /^\.([^.*]+)$/.exec(hint)?.[1] : undefined);
      if (!extension && hint.includes('*')) continue;

      const id = extension ? `*.${extension}` : hint;
      if (keys.has(id)) continue;
      // the name JetBrains matches: any file of that extension, or the file name itself
      keys.set(id, extension ? { extension, matchedName: `file.${extension}` } : { fileName: hint, matchedName: hint });
    }
  }
  return [...keys.values()];
};

/** A folder name VS Code can express (without its `.` / `_` prefix), and the name JetBrains matches for it */
export type FolderKey = { folderName: string; matchedName: string };

export const folderKeys = (associations: UpstreamAssociation[]): FolderKey[] => {
  const keys = new Map<string, FolderKey>();
  for (const association of associations) {
    for (const hint of splitNames(association.folderNames)) {
      if (/[*/]/.test(hint)) continue;
      // the generator adds the `.name` and `_name` variants by itself: `.github` / `_github` -> `github`,
      // but keep `__pycache__` intact
      const folderName = hint.replace(/^[._](?=[^._])/, '');
      if (folderName.length === 0 || keys.has(folderName)) continue;
      keys.set(folderName, { folderName, matchedName: hint });
    }
  }
  return [...keys.values()];
};
