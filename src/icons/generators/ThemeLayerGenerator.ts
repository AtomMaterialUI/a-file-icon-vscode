import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { FolderTheme } from 'src/@types/config';
import { RELATIVE_DIST, WILDCARD_PATTERN } from 'src/helpers/constants';
import { writeFileAtomic } from 'src/helpers/fsUtils';
import { layerStamp, normalizeByName, normalizeLayers } from 'src/helpers/themeLayers';

import type { AtomConfig } from 'src/@types/config';
import type { LanguageLookup, LayerTheme } from 'src/helpers/themeLayers';
import type { IconConfiguration } from 'src/models/IconConfiguration';

/** Folder of `dist` receiving the icons taken from the other themes */
const LAYERS_FOLDER = 'layers';
/** Folders of earlier versions, removed when the theme is generated */
const OLD_FOLDERS = ['fallback'];
/** Prefix of the icon definitions taken from another theme, so they never replace one of this theme */
const DEFINITION_PREFIX = 'layer-';

type NameMap = Record<string, string>;
type MapKey =
  | 'fileExtensions'
  | 'fileNames'
  | 'folderNames'
  | 'folderNamesExpanded'
  | 'languageIds'
  | 'rootFolderNames'
  | 'rootFolderNamesExpanded';
type DefaultKey = 'file' | 'folder' | 'folderExpanded' | 'rootFolder' | 'rootFolderExpanded';
type Section = Partial<Record<DefaultKey, string>> & Partial<Record<MapKey, NameMap>>;
type ThemeJson = Section & {
  highContrast?: Section;
  iconDefinitions?: Record<string, { iconPath?: unknown }>;
  light?: Section;
};
type Variant = 'highContrast' | 'light';
type Category = 'files' | 'folders';

/** Where a theme found the icon of a name: an entry of one of its maps, or one of its default icons */
type Hit = { key?: string; map: DefaultKey | MapKey };

const VARIANTS: Variant[] = ['light', 'highContrast'];
const MAPS: Record<Category, MapKey[]> = {
  files: ['fileNames', 'fileExtensions', 'languageIds'],
  folders: ['folderNames', 'folderNamesExpanded', 'rootFolderNames', 'rootFolderNamesExpanded'],
};
const DEFAULTS: Record<Category, DefaultKey[]> = {
  files: ['file'],
  folders: ['folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded'],
};
/** VS Code shows the closed folder icon of a name when the theme has no expanded one */
const CLOSED_MAP: Partial<Record<MapKey, MapKey>> = {
  folderNamesExpanded: 'folderNames',
  rootFolderNamesExpanded: 'rootFolderNames',
};

/** `a.b.c` -> `b.c`, `c` and `.eslintrc` -> `eslintrc`: the extensions VS Code looks up for a file name */
const extensionsOf = (fileName: string): string[] => {
  const parts = fileName.split('.');
  return parts.slice(1).map((_, index) => parts.slice(index + 1).join('.'));
};

/** Last segment of a name: VS Code also accepts names with their parent folders (`.github/workflows`) */
const lastSegment = (name: string) => name.slice(name.lastIndexOf('/') + 1);

/** The lower case names of the user's associations, without the `*.` and `**.` of the extensions */
const names = (associations?: Record<string, string>) =>
  new Set(Object.keys(associations ?? {}).map((key) => key.toLowerCase().replace(WILDCARD_PATTERN, '')));

/** A section with lower case names, as VS Code compares them */
const lowerSection = (section?: Section): Section => {
  const result: Section = {};
  if (!section || typeof section !== 'object') return result;

  for (const map of [...MAPS.files, ...MAPS.folders]) {
    const entries = Object.entries(section[map] ?? {}).filter(([, value]) => typeof value === 'string');
    result[map] = Object.fromEntries(entries.map(([key, value]) => [key.toLowerCase(), value]));
  }
  for (const key of [...DEFAULTS.files, ...DEFAULTS.folders]) {
    if (typeof section[key] === 'string') result[key] = section[key];
  }
  return result;
};

/** Finds the icon another theme shows for a name, the way VS Code does */
class LayerReader {
  private readonly sections: Record<Variant | 'base', Section>;

  constructor(
    readonly theme: LayerTheme,
    readonly json: ThemeJson,
    private readonly languages: LanguageLookup,
  ) {
    this.sections = {
      base: lowerSection(json),
      highContrast: lowerSection(json.highContrast),
      light: lowerSection(json.light),
    };
  }

  /** The names of one of its maps */
  keys(map: MapKey): string[] {
    return Object.keys(this.sections.base[map] ?? {});
  }

  /** The definition of a hit in a section */
  lookup(section: Variant | 'base', hit: Hit): string | undefined {
    const value = hit.key === undefined ? this.sections[section][hit.map] : (this.sections[section][hit.map] as NameMap | undefined)?.[hit.key];
    return typeof value === 'string' ? value : undefined;
  }

  /** The hit for a name of one of the maps of this theme, as the other theme resolves it */
  hitFor(map: MapKey, key: string): Hit | undefined {
    switch (map) {
      case 'fileNames': {
        return this.hit(map, key) ?? this.hitFile(lastSegment(key));
      }
      case 'fileExtensions': {
        return this.hitExtension(key);
      }
      case 'languageIds': {
        return this.hit(map, key);
      }
      default: {
        return this.hitFolder(map, key);
      }
    }
  }

  /** By file name, then by its extensions (the longest first), then by its language */
  hitFile(fileName: string): Hit | undefined {
    const extensions = extensionsOf(fileName);
    const language = this.languages.fileNames[fileName] ?? extensions.map((extension) => this.languages.extensions[extension]).find(Boolean);

    return (
      this.hit('fileNames', fileName) ??
      extensions.map((extension) => this.hit('fileExtensions', extension)).find(Boolean) ??
      (language === undefined ? undefined : this.hit('languageIds', language))
    );
  }

  /** A file with the extension and no specific name */
  hitExtension(extension: string): Hit | undefined {
    const extensions = [extension, ...extensionsOf(extension)];
    const language = extensions.map((item) => this.languages.extensions[item]).find(Boolean);

    return (
      extensions.map((item) => this.hit('fileExtensions', item)).find(Boolean) ??
      (language === undefined ? undefined : this.hit('languageIds', language))
    );
  }

  hitFolder(map: MapKey, key: string): Hit | undefined {
    const closed = CLOSED_MAP[map];
    return (
      this.hit(map, key) ??
      this.hit(map, lastSegment(key)) ??
      (closed && (this.hit(closed, key) ?? this.hit(closed, lastSegment(key))))
    );
  }

  hitDefault(key: DefaultKey): Hit | undefined {
    return this.lookup('base', { map: key }) ? { map: key } : undefined;
  }

  private hit(map: MapKey, key: string): Hit | undefined {
    return this.sections.base[map]?.[key] ? { key, map } : undefined;
  }
}

/**
 * Mixes other installed file icon themes with this theme (`iconThemeLayers`, `iconThemeByName`).
 * From the strongest to the weakest:
 * 1. `iconThemeByName`: the icon a theme shows for that name;
 * 2. `override` layers (the first listed wins): their icon for every name they give an icon to, except the names
 *    of the user's own associations;
 * 3. this theme;
 * 4. `fill` layers (the first listed wins): only the names left with the default file or folder icon.
 * Only svg icons can be used: they get the same filters as the icons of this theme.
 */
export class ThemeLayerGenerator {
  /** theme id + definition id -> definition id in this theme ('' when its svg cannot be used) */
  private readonly definitions = new Map<string, string>();
  private readonly readers = new Map<string, LayerReader | undefined>();
  private readonly written = new Set<string>();

  constructor(
    private readonly atomConfig: AtomConfig,
    private readonly iconConfig: IconConfiguration,
    private readonly themes: LayerTheme[],
    private readonly languages: LanguageLookup,
    private readonly distributionPath: string,
    private readonly fileConfigHash: string,
    private readonly applyFilters: (svgPath: string) => string,
  ) {}

  /** Remove the icons of the themes no longer used */
  static clean(distributionPath: string, keep: Set<string> = new Set()) {
    for (const folder of OLD_FOLDERS) rmSync(join(distributionPath, folder), { force: true, recursive: true });

    const folder = join(distributionPath, LAYERS_FOLDER);
    if (!existsSync(folder)) return;

    for (const file of readdirSync(folder)) {
      if (!keep.has(file)) rmSync(join(folder, file), { force: true });
    }
  }

  /**
   * Add the associations of the other themes. A theme that cannot be read is ignored: this theme works without it.
   * @returns the fingerprint of the themes that could be read
   */
  apply(): string {
    // read them all, so the fingerprint does not depend on what is used
    for (const theme of this.themes) this.reader(theme.id);

    const layers = normalizeLayers(this.atomConfig.iconThemeLayers);
    for (const category of this.categories()) {
      for (const layer of layers.filter((item) => item[category] === 'override').reverse()) {
        const reader = this.reader(layer.theme);
        if (reader) this.override(reader, category);
      }
      for (const layer of layers.filter((item) => item[category] === 'fill')) {
        const reader = this.reader(layer.theme);
        if (reader) this.fill(reader, category);
      }
    }
    this.applyByName();

    ThemeLayerGenerator.clean(this.distributionPath, this.written);

    const read = this.themes.filter((theme) => this.readers.get(theme.id));
    return layerStamp(read);
  }

  /**
   * JetBrains "Hide file icons": no file icon, not even from another theme.
   * The classic and none folder themes have no specific folder icons on purpose.
   */
  private categories(): Category[] {
    return [
      ...(this.atomConfig.hideFileIcons ? [] : (['files'] as const)),
      ...(this.atomConfig.folderTheme === FolderTheme.Specific ? (['folders'] as const) : []),
    ];
  }

  private reader(id: string): LayerReader | undefined {
    if (this.readers.has(id)) return this.readers.get(id);

    const theme = this.themes.find((item) => item.id === id);
    let reader: LayerReader | undefined;
    if (theme) {
      try {
        reader = new LayerReader(theme, JSON.parse(readFileSync(theme.path, 'utf8')), this.languages);
      } catch {
        // being rewritten, or not a json: read again next time (the fingerprint differs)
      }
    }
    this.readers.set(id, reader);
    return reader;
  }

  /** The icon of the other theme wins for the names it gives an icon to, and its default icons too */
  private override(reader: LayerReader, category: Category) {
    const isUserName = this.userNames(category);

    for (const map of MAPS[category]) {
      // the names this theme gives an icon to, as the other theme shows them
      for (const key of Object.keys(this.iconConfig[map] ?? {})) {
        if (!isUserName(map, key)) this.set(reader, map, key, reader.hitFor(map, key));
      }
      // the names the other theme gives an icon to
      for (const key of reader.keys(map)) {
        if (!isUserName(map, key)) this.set(reader, map, key, { key, map });
      }
    }

    for (const key of DEFAULTS[category]) this.setDefault(reader, key);
  }

  /** The other theme only gives an icon to the names left with the default icon */
  private fill(reader: LayerReader, category: Category) {
    const isKnown = this.knownNames();

    for (const map of MAPS[category]) {
      for (const key of reader.keys(map)) {
        if (!isKnown(map, key)) this.set(reader, map, key, { key, map });
      }
    }
  }

  /** `iconThemeByName`: the icon the theme shows for that name, its default icon when it has none */
  private applyByName() {
    const categories = new Set(this.categories());

    for (const { target, theme } of normalizeByName(this.atomConfig.iconThemeByName)) {
      const reader = this.reader(theme);
      if (!reader) continue;

      switch (target.kind) {
        case 'file': {
          if (categories.has('files')) this.set(reader, 'fileNames', target.name, reader.hitFile(lastSegment(target.name)) ?? reader.hitDefault('file'));
          break;
        }
        case 'extension': {
          if (categories.has('files')) this.set(reader, 'fileExtensions', target.name, reader.hitExtension(target.name) ?? reader.hitDefault('file'));
          break;
        }
        case 'folder': {
          if (!categories.has('folders')) break;
          this.set(reader, 'folderNames', target.name, reader.hitFolder('folderNames', target.name) ?? reader.hitDefault('folder'));
          this.set(
            reader,
            'folderNamesExpanded',
            target.name,
            reader.hitFolder('folderNamesExpanded', target.name) ?? reader.hitDefault('folderExpanded') ?? reader.hitDefault('folder'),
          );
          break;
        }
      }
    }
  }

  /**
   * The names of the user's own associations (`filesAssociations`, `languagesAssociations`, `foldersAssociations`),
   * which an `override` layer does not replace.
   */
  private userNames(category: Category): (map: MapKey, key: string) => boolean {
    if (category === 'folders') {
      const folders = names(this.atomConfig.foldersAssociations);
      return (_, key) => folders.has(key) || folders.has(lastSegment(key));
    }

    const files = names(this.atomConfig.filesAssociations);
    const languages = names(this.atomConfig.languagesAssociations);
    return (map, key) => (map === 'languageIds' ? languages.has(key) : files.has(key));
  }

  /**
   * Whether a theme already gives an icon to the name, taken before the associations of the layer are added: by file
   * name, by one of its extensions (the most specific wins in VS Code, `test.py` -> `py`), by its language, or by folder
   * name.
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

    const isKnownFile = (fileName: string) => {
      const extensions = extensionsOf(fileName);
      if (fileNames.has(fileName) || extensions.some((extension) => fileExtensions.has(extension))) return true;

      const language = this.languages.fileNames[fileName] ?? extensions.map((extension) => this.languages.extensions[extension]).find(Boolean);
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

  /**
   * Map the name to the icon of the other theme, with its light and high contrast variants for that same entry.
   * A variant of this theme for the name is removed when the other theme has none, so its icon shows there too.
   * Nothing changes when the other theme has no usable svg for it.
   */
  private set(reader: LayerReader, map: MapKey, key: string, hit: Hit | undefined) {
    const base = hit && this.definition(reader, reader.lookup('base', hit));
    if (!base) return;

    this.iconConfig[map] ??= {};
    this.iconConfig[map][key] = base;

    for (const variant of VARIANTS) {
      const definition = this.definition(reader, reader.lookup(variant, hit));
      if (definition) {
        this.iconConfig[variant] ??= {};
        this.iconConfig[variant][map] ??= {};
        this.iconConfig[variant][map][key] = definition;
      } else {
        delete this.iconConfig[variant]?.[map]?.[key];
      }
    }
  }

  private setDefault(reader: LayerReader, key: DefaultKey) {
    const hit = reader.hitDefault(key);
    const base = hit && this.definition(reader, reader.lookup('base', hit));
    if (!base) return;

    this.iconConfig[key] = base;
    for (const variant of VARIANTS) {
      const definition = this.definition(reader, reader.lookup(variant, { map: key }));
      if (definition) {
        this.iconConfig[variant] ??= {};
        this.iconConfig[variant][key] = definition;
      } else if (this.iconConfig[variant]) {
        delete this.iconConfig[variant][key];
      }
    }
  }

  /**
   * The definition of this theme for a definition of the other theme, with its svg copied to `dist/layers`
   * through the same filters as the icons of this theme. Only svg files can be filtered: other icons are skipped.
   */
  private definition(reader: LayerReader, definition: string | undefined): string | undefined {
    if (!definition) return undefined;

    const cacheKey = `${reader.theme.id}\n${definition}`;
    const known = this.definitions.get(cacheKey);
    if (known !== undefined) return known || undefined;

    const iconPath = reader.json.iconDefinitions?.[definition]?.iconPath;
    const source = typeof iconPath === 'string' ? resolve(dirname(reader.theme.path), iconPath) : '';
    if (!/\.svg$/i.test(source) || !existsSync(source)) {
      this.definitions.set(cacheKey, '');
      return undefined;
    }

    const safeName = `${reader.theme.id}_${definition}`.replaceAll(/[^\w.-]/g, '_');
    const file = `${safeName}${this.fileConfigHash}.svg`;
    writeFileAtomic(join(this.distributionPath, LAYERS_FOLDER, file), this.applyFilters(source));
    this.written.add(file);

    const id = `${DEFINITION_PREFIX}${safeName}`;
    this.iconConfig.iconDefinitions ??= {};
    this.iconConfig.iconDefinitions[id] = { iconPath: `${RELATIVE_DIST}/${LAYERS_FOLDER}/${file}` };
    this.definitions.set(cacheKey, id);
    return id;
  }
}
