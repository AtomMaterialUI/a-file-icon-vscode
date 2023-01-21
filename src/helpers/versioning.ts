import { Memento, extensions, workspace } from 'vscode';
import { isThemeActivated } from '.';
import { ThemeStatus } from '../models/helpers/themeStatus';

/** Get configuration of vs code. */
export const getConfig = (section?: string) => {
  return workspace.getConfiguration(section);
};

export const versionKey = 'a-file-icon.version';

/**
 * Check the current status of the theme
 * @param state Global state of context (Memento API)
 */
export const checkThemeStatus = async (
  state: Memento
): Promise<ThemeStatus> => {
  try {
    // get the version from the state
    const stateVersion = state.get(versionKey);
    const packageVersion = getCurrentExtensionVersion();

    // check if the theme was used before
    if (stateVersion === undefined || typeof stateVersion !== 'string') {
      await updateExtensionVersionInMemento(state);
      return themeIsAlreadyActivated()
        ? ThemeStatus.updated
        : ThemeStatus.neverUsedBefore;
    }
    // compare the version in the state with the package version
    else if (packageVersion && isGreaterVersion(packageVersion, stateVersion)) {
      await updateExtensionVersionInMemento(state);
      return ThemeStatus.updated;
    } else {
      return ThemeStatus.current;
    }
  } catch (error) {
    console.error(error);
    return ThemeStatus.current;
  }
};

/**
 * Compares two version numbers (e.g. 1.0.0 with 1.0.1)
 * @param a version b
 * @param b version a
 * @returns true if version `a` is greater than version `b`
 */
const isGreaterVersion = (a: string, b: string): boolean => {
  return (
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }) === 1
  );
};

/** Check if the theme was used before */
const themeIsAlreadyActivated = () => {
  return isThemeActivated() || isThemeActivated(true);
};

/** Update the version number to the current version in the memento. */
const updateExtensionVersionInMemento = (state: Memento) => {
  const currentVersion = getCurrentExtensionVersion();
  if (currentVersion) {
    return state.update(versionKey, currentVersion);
  }
};

/** Get the current version of the extension */
const getCurrentExtensionVersion = (): string | undefined => {
  return extensions.getExtension('atommaterial.a-file-icon-vscode')?.packageJSON
    .version;
};
