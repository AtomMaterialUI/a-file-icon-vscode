import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { EXTENSION_ID, EXTENSION_KEY, JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME } from 'src/helpers/constants';
import { usedThemeIds } from 'src/helpers/themeLayers';
import { isInsideFolder } from 'src/helpers/themePaths';
import { env, Uri, extensions, workspace } from 'vscode';

import type { AtomConfig } from 'src/@types/config';
import type { LanguageLookup, LayerTheme } from 'src/helpers/themeLayers';
import type { GeneratorPaths } from 'src/icons/generators/IconThemeGenerator';
import type { IconConfiguration } from 'src/models/IconConfiguration';
import type { ProductConfiguration } from 'src/models/ProductConfiguration';

type ContributedIconTheme = { id?: unknown; path?: unknown };
type ContributedLanguage = { extensions?: unknown; filenames?: unknown; id?: unknown };

const strings = (value: unknown): string[] => (Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []);

/**
 * Open a browser to the given url
 * @param {string} url
 */
export const openBrowser = (url: string) => {
  env.openExternal(Uri.parse(url));
};

/** Return the path of the extension in the file system. */
export const getExtensionPath = () => {
  return extensions.getExtension(EXTENSION_ID)?.extensionPath ?? '';
};

/**
 * Paths used to regenerate the theme inside the installed extension
 */
export const getGeneratorPaths = (): GeneratorPaths => {
  const extensionPath = getExtensionPath();
  return {
    dist: join(extensionPath, 'dist'),
    iconGenerator: join(extensionPath, 'iconGenerator'),
  };
};

/**
 * Get the icon-theme.json file
 * @returns {any}
 */
export const getIconThemeFile = (): IconConfiguration => {
  const iconJSONPath = join(getExtensionPath(), 'dist', JSON_FILE_NAME);

  try {
    const data = readFileSync(iconJSONPath, 'utf8');
    return JSON.parse(data);
  }
  catch (error) {
    console.error(error);
    throw new Error('Failed to read icon-theme.json file');

  }
};

/**
 * Get the product-theme.json file
 */
export const getProductThemeFile = (): ProductConfiguration => {
  const iconJSONPath = join(getExtensionPath(), 'dist', JSON_PRODUCT_FILE_NAME);

  try {
    const data = readFileSync(iconJSONPath, 'utf8');
    return JSON.parse(data);
  }
  catch (error) {
    console.error(error);
    throw new Error('Failed to read product-theme.json file');
  }
};
/**
 * The installed file icon theme with the given id (`workbench.iconTheme` value), to mix with this theme.
 * Undefined when the id is empty, is this theme, or no installed extension contributes it (a theme file outside the
 * folder of its extension is not used).
 */
export const findIconTheme = (id: string): LayerTheme | undefined => {
  if (!id || id === EXTENSION_KEY) return undefined;

  for (const extension of extensions.all) {
    if (extension.id.toLowerCase() === EXTENSION_ID.toLowerCase()) continue;

    const themes: ContributedIconTheme[] = extension.packageJSON?.contributes?.iconThemes ?? [];
    const theme = Array.isArray(themes) ? themes.find((item) => item?.id === id && typeof item.path === 'string') : undefined;
    if (!theme) continue;

    const path = join(extension.extensionPath, theme.path as string);
    if (!isInsideFolder(extension.extensionPath, path)) continue;
    try {
      const modified = Math.trunc(statSync(path).mtimeMs);
      return { extensionPath: extension.extensionPath, id, path, stamp: `${extension.id}@${extension.packageJSON?.version ?? ''}:${modified}` };
    } catch {
      // the extension has not generated its theme yet
      return undefined;
    }
  }
  return undefined;
};

/** A file icon theme contributed by another installed extension */
export type InstalledIconTheme = { extensionPath: string; id: string; label: string; path: string };

/**
 * The file icon themes of the other installed extensions, which can be mixed with this theme.
 * A label still written as a `%key%` of the extension's translations shows the theme id instead. A theme file outside
 * the folder of its extension is left out.
 */
export const listIconThemes = (): InstalledIconTheme[] => {
  const result: InstalledIconTheme[] = [];
  for (const extension of extensions.all) {
    if (extension.id.toLowerCase() === EXTENSION_ID.toLowerCase()) continue;

    const themes: Array<ContributedIconTheme & { label?: unknown }> = extension.packageJSON?.contributes?.iconThemes ?? [];
    if (!Array.isArray(themes)) continue;

    for (const theme of themes) {
      if (typeof theme?.id !== 'string' || typeof theme.path !== 'string' || theme.id === EXTENSION_KEY) continue;
      if (result.some((item) => item.id === theme.id)) continue;

      const path = join(extension.extensionPath, theme.path);
      if (!isInsideFolder(extension.extensionPath, path)) continue;
      const label = typeof theme.label === 'string' && !/^%.*%$/.test(theme.label) ? theme.label : theme.id;
      result.push({ extensionPath: extension.extensionPath, id: theme.id, label, path });
    }
  }
  return result.sort((a, b) => a.label.localeCompare(b.label));
};

/** The installed file icon themes the settings mix with this theme; the ones not installed are left out */
export const findLayerThemes = (config: Pick<AtomConfig, 'iconThemeByName' | 'iconThemeLayers'>): LayerTheme[] =>
  usedThemeIds(config)
    .map((id) => findIconTheme(id))
    .filter((theme): theme is LayerTheme => theme !== undefined);

/**
 * The language of the file names and extensions declared by the installed extensions and by `files.associations`
 * (simple `*.ext` and exact name patterns), to know which names this theme shows with a language icon.
 */
export const getLanguageLookup = (): LanguageLookup => {
  const lookup: LanguageLookup = { extensions: {}, fileNames: {} };

  for (const extension of extensions.all) {
    const languages: ContributedLanguage[] = extension.packageJSON?.contributes?.languages ?? [];
    if (!Array.isArray(languages)) continue;

    for (const language of languages) {
      if (typeof language?.id !== 'string') continue;
      for (const name of strings(language.extensions)) lookup.extensions[name.replace(/^\./, '').toLowerCase()] = language.id;
      for (const name of strings(language.filenames)) lookup.fileNames[name.toLowerCase()] = language.id;
    }
  }

  const associations = workspace.getConfiguration('files').get<Record<string, unknown>>('associations') ?? {};
  for (const [pattern, language] of Object.entries(associations)) {
    if (typeof language !== 'string') continue;

    const extension = /^\*\.([^*?/[\]{}]+)$/.exec(pattern)?.[1];
    if (extension) lookup.extensions[extension.toLowerCase()] = language;
    else if (/^[^*?/[\]{}]+$/.test(pattern)) lookup.fileNames[pattern.toLowerCase()] = language;
  }

  return lookup;
};
