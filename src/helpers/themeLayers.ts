import { EXTENSION_KEY } from 'src/helpers/constants';

import type { AtomConfig, IconThemeLayer, LayerMode } from 'src/@types/config';

const MODES = new Set<unknown>(['fill', 'off', 'override']);
const mode = (value: unknown): LayerMode => (MODES.has(value) ? (value as LayerMode) : 'fill');

/** Language of the file names and extensions, as declared by the installed extensions and `files.associations` */
export type LanguageLookup = {
  /** lower case extension without the dot -> language id */
  extensions: Record<string, string>;
  /** lower case file name -> language id */
  fileNames: Record<string, string>;
};

/** Another installed file icon theme mixed with this theme */
export type LayerTheme = {
  /** Theme id, as in `workbench.iconTheme` */
  id: string;
  /** Path of the theme json */
  path: string;
  /** Changes when the theme json changes (extension version and modification time of the json) */
  stamp: string;
};

/** A layer with its theme id trimmed and a mode for files and for folders */
export type NormalizedLayer = { files: LayerMode; folders: LayerMode; theme: string };

/**
 * The valid layers of the setting, each theme once (the first one wins). This theme and empty ids are skipped.
 */
export const normalizeLayers = (layers: unknown): NormalizedLayer[] => {
  if (!Array.isArray(layers)) return [];

  const result: NormalizedLayer[] = [];
  const seen = new Set<string>();
  for (const layer of layers as unknown[]) {
    const value = typeof layer === 'string' ? { theme: layer } : (layer as Partial<Exclude<IconThemeLayer, string>>);
    const theme = typeof value?.theme === 'string' ? value.theme.trim() : '';
    if (!theme || theme === EXTENSION_KEY || seen.has(theme)) continue;

    seen.add(theme);
    result.push({ files: mode(value.files), folders: mode(value.folders), theme });
  }
  return result;
};

/** What a key of `iconThemeByName` targets */
export type NameTarget = { kind: 'extension' | 'file' | 'folder'; name: string };

/** `*.ext` and `**.ext` -> extension, `name/` -> folder, anything else -> file name. Lower case. */
export const parseNameKey = (key: string): NameTarget | undefined => {
  const name = key.trim().toLowerCase();
  if (/^\*{1,2}\./.test(name)) {
    const extension = name.replace(/^\*{1,2}\./, '');
    return extension ? { kind: 'extension', name: extension } : undefined;
  }
  if (name.endsWith('/')) {
    const folder = name.replace(/\/+$/, '');
    return folder ? { kind: 'folder', name: folder } : undefined;
  }
  return name ? { kind: 'file', name } : undefined;
};

/** The valid entries of `iconThemeByName`, with their theme id trimmed */
export const normalizeByName = (byName: unknown): Array<{ target: NameTarget; theme: string }> => {
  if (!byName || typeof byName !== 'object') return [];

  return Object.entries(byName as Record<string, unknown>).flatMap(([key, theme]) => {
    const target = parseNameKey(key);
    const id = typeof theme === 'string' ? theme.trim() : '';
    return target && id && id !== EXTENSION_KEY ? [{ target, theme: id }] : [];
  });
};

/** Ids of the installed themes the settings mix with this theme */
export const usedThemeIds = (config: Pick<AtomConfig, 'iconThemeByName' | 'iconThemeLayers'>): string[] => {
  const ids = normalizeLayers(config.iconThemeLayers)
    .filter((layer) => layer.files !== 'off' || layer.folders !== 'off')
    .map((layer) => layer.theme);
  for (const { theme } of normalizeByName(config.iconThemeByName)) ids.push(theme);
  return [...new Set(ids)].sort();
};

/** Fingerprint of the themes mixed with this theme, stored in the theme json to regenerate it when one changes */
export const layerStamp = (themes: LayerTheme[]): string =>
  themes
    .map((theme) => `${theme.id}=${theme.stamp}`)
    .sort()
    .join('|');
