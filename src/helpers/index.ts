import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { iconJsonName } from '../icons/index';
import { IconConfiguration } from '../models/index';
import * as reloadMessages from './../messages/reload';

/** Get configuration of vs code. */
export const getConfig = (section?: string) => {
  return vscode.workspace.getConfiguration(section);
};

/** Get list of configuration entries of package.json */
export const getConfigProperties = (): { [config: string]: unknown } => {
  return vscode.extensions.getExtension('mallowigi.a-file-icon')?.packageJSON
    ?.contributes?.configuration?.properties;
};

/** Update configuration of vs code. */
export const setConfig = (
  section: string,
  value: any,
  global: boolean = false
) => {
  return getConfig().update(section, value, global);
};

export const getThemeConfig = (section: string) => {
  return getConfig('a-file-icon').inspect(section);
};

/** Set the config of the theme. */
export const setThemeConfig = (
  section: string,
  value: any,
  global: boolean = false
) => {
  return getConfig('a-file-icon').update(section, value, global);
};

/**
 * Checks if the theme is the active icon theme
 * @param{boolean} global false by default
 */
export const isThemeActivated = (global: boolean = false): boolean => {
  return global
    ? getConfig().inspect('workbench.iconTheme')?.globalValue === 'a-file-icon'
    : getConfig().inspect('workbench.iconTheme')?.workspaceValue ===
        'a-file-icon';
};

/** Checks if the theme is not the active icon theme */
export const isThemeNotVisible = (): boolean => {
  const config = getConfig().inspect('workbench.iconTheme');
  return (
    (!isThemeActivated(true) && !config?.workspaceValue) || // no workspace and not global
    (!isThemeActivated() && !!config?.workspaceValue)
  );
};

/** Return the path of the extension in the file system. */
export const getExtensionPath = () =>
  vscode.extensions.getExtension('mallowigi.a-file-icon')?.extensionPath ?? '';

/** Get the configuration of the icons as JSON Object */
export const getMaterialIconsJSON = (): IconConfiguration => {
  const iconJSONPath = path.join(getExtensionPath(), 'dist', iconJsonName);

  try {
    const data = fs.readFileSync(iconJSONPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return {};
  }
};

/** Reload vs code window */
export const promptToReload = async () => {
  const result = await reloadMessages.showConfirmToReloadMessage();
  if (result) reloadWindow();
};

const reloadWindow = () => {
  return vscode.commands.executeCommand('workbench.action.reloadWindow');
};

/** Capitalize the first letter of a string */
export const capitalizeFirstLetter = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);

/** TitleCase all words in a string */
export const toTitleCase = (value: string) => {
  return value.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
  );
};
