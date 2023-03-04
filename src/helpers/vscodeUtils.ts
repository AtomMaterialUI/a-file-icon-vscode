import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EXTENSION_ID, JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME } from 'src/helpers/constants';
import { env, Uri, extensions } from 'vscode';

import type { IconConfiguration } from 'src/models/IconConfiguration';
import type { ProductConfiguration } from 'src/models/ProductConfiguration';

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