import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { FolderTheme } from 'src/@types/config';
import { RELATIVE_DIST } from 'src/helpers/constants';
import { writeFileAtomic } from 'src/helpers/fsUtils';

import type { AtomConfig } from 'src/@types/config';
import type { IconConfiguration } from 'src/models/IconConfiguration';

/** Prefix of the icon definitions taken from the fallback theme, so they never replace one of this theme */
const DEFINITION_PREFIX = 'fallback-';

type NameMap = Record<string, string>;
type Section = {
  fileExtensions?: NameMap;
  fileNames?: NameMap;
  folderNames?: NameMap;
  folderNamesExpanded?: NameMap;
  languageIds?: NameMap;
  rootFolderNames?: NameMap;
  rootFolderNamesExpanded?: NameMap;
};
type ThemeJson = Section & {
  highContrast?: Section;
  iconDefinitions?: Record<string, { iconPath?: unknown }>;
  light?: Section;
};
type MapKey = keyof Section;

const FILE_MAPS: MapKey[] = ['fileNames', 'fileExtensions', 'languageIds'];
const FOLDER_MAPS: MapKey[] = ['folderNames', 'folderNamesExpanded', 'rootFolderNames', 'rootFolderNamesExpanded'];

/** `a.b.c` -> `b.c`, `c` and `.eslintrc` -> `eslintrc`: the extensions VS Code looks up for a file name */
const extensionsOf = (fileName: string): string[] => {
  const parts = fileName.split('.');
  return parts.slice(1).map((_, index) => parts.slice(index + 1).join('.'));
};

/** Last segment of a name: VS Code also accepts names with their parent folders (`.github/workflows`) */
const lastSegment = (name: string) => name.slice(name.lastIndexOf('/') + 1);

/** Folder of `dist` receiving the icons taken from the fallback theme */
export const FALLBACK_FOLDER = 'fallback';

/** Language of the file names and extensions, as declared by the installed extensions and `files.associations` */
export type LanguageLookup = {
  /** lower case extension without the dot -> language id */
  extensions: Record<string, string>;
  /** lower case file name -> language id */
  fileNames: Record<string, string>;
};

/** Another installed file icon theme, used for the names this theme does not know */
export type FallbackTheme = {
  /** Theme id, as in `workbench.iconTheme` */
  id: string;
  /** Path of the theme json */
  path: string;
  /** Changes when the theme json changes (extension version and modification time of the json) */
  stamp: string;
  /** Languages of the names, so a name this theme shows through its language keeps that icon */
  languages?: LanguageLookup;
};

/**
 * Adds the associations of another icon theme for the file names, extensions, languages and folder names
 * this theme does not know, so they get the icon of that theme instead of the default file or folder icon.
 * This theme always wins: a name it shows with its own icon (by name, extension or language) is never replaced.
 */
export class FallbackThemeGenerator {
  /** fallback definition id -> definition id in this theme ('' when its svg cannot be used) */
  private readonly definitions = new Map<string, string>();
  private readonly written = new Set<string>();

  constructor(
    private readonly atomConfig: AtomConfig,
    private readonly iconConfig: IconConfiguration,
    private readonly fallback: FallbackTheme,
    private readonly distributionPath: string,
    private readonly fileConfigHash: string,
    private readonly applyFilters: (svgPath: string) => string,
  ) {}

  /** Remove the icons of a previous fallback theme */
  static clean(distributionPath: string, keep: Set<string> = new Set()) {
    const folder = join(distributionPath, FALLBACK_FOLDER);
    if (!existsSync(folder)) return;

    for (const file of readdirSync(folder)) {
      if (!keep.has(file)) rmSync(join(folder, file), { force: true });
    }
  }

  /**
   * Add the associations of the fallback theme.
   * A fallback theme that cannot be read is ignored: this theme works without it.
   * @returns false when the fallback theme could not be read
   */
  apply(): boolean {
    let theme: ThemeJson;
    try {
      theme = JSON.parse(readFileSync(this.fallback.path, 'utf8'));
    } catch {
      FallbackThemeGenerator.clean(this.distributionPath);
      return false;
    }

    const maps = [
      // JetBrains "Hide file icons": no file icon, not even from another theme
      ...(this.atomConfig.hideFileIcons ? [] : FILE_MAPS),
      // the classic and none folder themes have no specific folder icons on purpose
      ...(this.atomConfig.folderTheme === FolderTheme.Specific ? FOLDER_MAPS : []),
    ];

    const isKnown = this.knownNames();
    for (const map of maps) {
      for (const [key, definition] of Object.entries(theme[map] ?? {})) {
        const name = key.toLowerCase();
        if (isKnown(map, name)) continue;

        const target = this.definition(theme, definition);
        if (!target) continue;

        this.set(this.iconConfig, map, name, target);
        this.addVariant('light', theme.light?.[map]?.[key], theme, map, name);
        this.addVariant('highContrast', theme.highContrast?.[map]?.[key], theme, map, name);
      }
    }

    FallbackThemeGenerator.clean(this.distributionPath, this.written);
    return true;
  }

  /**
   * Whether this theme already gives an icon to the name, taken before any association of the fallback theme
   * is added: by file name, by one of its extensions (the most specific wins in VS Code, `test.py` -> `py`), by its
   * language, or by folder name.
   */
  private knownNames(): (map: MapKey, name: string) => boolean {
    const keys = (map?: NameMap) => new Set(Object.keys(map ?? {}));
    const fileNames = keys(this.iconConfig.fileNames);
    const fileExtensions = keys(this.iconConfig.fileExtensions);
    const languageIds = keys(this.iconConfig.languageIds);
    const folderNames = new Set([...keys(this.iconConfig.folderNames), ...keys(this.iconConfig.folderNamesExpanded)]);
    const rootFolderNames = new Set([
      ...keys(this.iconConfig.rootFolderNames),
      ...keys(this.iconConfig.rootFolderNamesExpanded),
    ]);
    const languages = this.fallback.languages ?? { extensions: {}, fileNames: {} };

    const isKnownFile = (fileName: string) => {
      const extensions = extensionsOf(fileName);
      if (fileNames.has(fileName) || extensions.some((extension) => fileExtensions.has(extension))) return true;

      const language = languages.fileNames[fileName] ?? extensions.map((extension) => languages.extensions[extension]).find(Boolean);
      return language !== undefined && languageIds.has(language);
    };

    return (map, name) => {
      switch (map) {
        case 'fileNames': {
          return isKnownFile(lastSegment(name));
        }
        case 'fileExtensions': {
          return isKnownFile(`file.${name}`);
        }
        case 'languageIds': {
          return languageIds.has(name);
        }
        case 'folderNames':
        case 'folderNamesExpanded': {
          return folderNames.has(lastSegment(name));
        }
        case 'rootFolderNames':
        case 'rootFolderNamesExpanded': {
          return rootFolderNames.has(lastSegment(name));
        }
      }
    };
  }

  /** Map the name in the light or high contrast section, when the fallback theme has a variant for it */
  private addVariant(variant: 'highContrast' | 'light', definition: string | undefined, theme: ThemeJson, map: MapKey, name: string) {
    if (!definition) return;

    const target = this.definition(theme, definition);
    if (!target) return;

    this.iconConfig[variant] ??= {};
    this.set(this.iconConfig[variant], map, name, target);
  }

  private set(section: Section, map: MapKey, name: string, definition: string) {
    section[map] ??= {};
    section[map][name] = definition;
  }

  /**
   * The definition of this theme for a definition of the fallback theme, with its svg copied to `dist/fallback`
   * through the same filters as the icons of this theme. Only svg files can be filtered: other icons are skipped.
   */
  private definition(theme: ThemeJson, definition: unknown): string | undefined {
    if (typeof definition !== 'string') return undefined;

    const known = this.definitions.get(definition);
    if (known !== undefined) return known || undefined;

    const iconPath = theme.iconDefinitions?.[definition]?.iconPath;
    const source = typeof iconPath === 'string' ? resolve(dirname(this.fallback.path), iconPath) : '';
    if (!/\.svg$/i.test(source) || !existsSync(source)) {
      this.definitions.set(definition, '');
      return undefined;
    }

    const safeName = definition.replaceAll(/[^\w.-]/g, '_');
    const file = `${safeName}${this.fileConfigHash}.svg`;
    writeFileAtomic(join(this.distributionPath, FALLBACK_FOLDER, file), this.applyFilters(source));
    this.written.add(file);

    const id = `${DEFINITION_PREFIX}${safeName}`;
    this.iconConfig.iconDefinitions ??= {};
    this.iconConfig.iconDefinitions[id] = { iconPath: `${RELATIVE_DIST}/${FALLBACK_FOLDER}/${file}` };
    this.definitions.set(definition, id);
    return id;
  }
}
