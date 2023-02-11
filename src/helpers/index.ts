import type { IconConfiguration }          from '../models/index';
import { extensions, workspace, commands } from 'vscode';
import { showConfirmToReloadMessage }      from './../messages/reload';
import path                                from 'path';
import { readFileSync }                    from 'fs';
import { JSON_FILE_NAME }                  from 'src/helpers/constants';

/** Get configuration of vs code. */
export const getConfig = (section?: string) => {
  return workspace.getConfiguration(section);
};

/** Get list of configuration entries of package.json */
export const getConfigProperties = (): Record<string, unknown> => {
  return extensions.getExtension('atommaterial.a-file-icon-vscode')?.packageJSON
    ?.contributes?.configuration?.properties;
};

/** Update configuration of vs code. */
export const setConfig = (
  section: string,
  value: any,
  global = false,
) => {
  return getConfig().update(section, value, global);
};

export const getThemeConfig = (section: string) => {
  return getConfig('a-file-icon-vscode').inspect(section);
};

/** Set the config of the theme. */
export const setThemeConfig = (
  section: string,
  value: any,
  global = false,
) => {
  return getConfig('a-file-icon-vscode').update(section, value, global);
};

/**
 * Checks if the theme is the active icon theme
 * @param{boolean} global false by default
 */
export const isThemeActivated = (global = false): boolean => {
  return global
    ? getConfig().inspect('workbench.iconTheme')?.globalValue ===
      'a-file-icon-vscode'
    : getConfig().inspect('workbench.iconTheme')?.workspaceValue ===
      'a-file-icon-vscode';
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
  extensions.getExtension('atommaterial.a-file-icon-vscode')?.extensionPath ??
  '';

/** Get the configuration of the icons as JSON Object */
export const getMaterialIconsJSON = (): IconConfiguration => {
  const iconJSONPath = path.join(getExtensionPath(), 'dist', JSON_FILE_NAME);

  try {
    const data = readFileSync(iconJSONPath, 'utf8');
    return JSON.parse(data);
  }
  catch (error) {
    console.error(error);
    return {};
  }
};

/** Reload vs code window */
export const promptToReload = async () => {
  const result = await showConfirmToReloadMessage();
  if (result) {
    reloadWindow();
  }
};

const reloadWindow = () => {
  return commands.executeCommand('workbench.action.reloadWindow');
};

/** Capitalize the first letter of a string */
export const capitalizeFirstLetter = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);
