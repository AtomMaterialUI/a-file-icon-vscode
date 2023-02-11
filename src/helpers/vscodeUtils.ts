import { readFileSync } from 'fs';
import { join } from 'path';
import { EXTENSION_ID, JSON_FILE_NAME } from 'src/helpers/constants';
import { env, Uri, extensions } from 'vscode';

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
export const getIconThemeFile = () => {
  const iconJSONPath = join(getExtensionPath(), 'dist', JSON_FILE_NAME);

  try {
    const data = readFileSync(iconJSONPath, 'utf8');
    return JSON.parse(data);
  }
  catch (error) {
    console.error(error);
    return {};
  }
};