/**
 * Get the default config
 * @returns {AtomConfig}
 * @private
 */
import type { AtomConfig } from 'src/@types/config';
import { FolderTheme, IconPack } from 'src/@types/config';
import { DEFAULT_FOLDER_COLOR, DEFAULT_OPACITY, DEFAULT_SATURATION } from 'src/helpers/constants';
import { getHash } from 'src/helpers/utils';

/**
 * Return the default config
 * @returns {AtomConfig}
 */
export const defaultConfig = (): AtomConfig => {
  return {
    activeIconPacks: [IconPack.Rails, IconPack.Angular, IconPack.React, IconPack.Phalcon],
    folderColor: DEFAULT_FOLDER_COLOR,
    folderTheme: FolderTheme.Specific,
    hidesExplorerArrows: false,
    opacity: DEFAULT_OPACITY,
    saturation: DEFAULT_SATURATION,
    showReloadMessage: true,
    showUpdateMessage: true,
    showWelcomeMessage: true,
  };
};

/**
 * Generates a hash of the current config
 */
export const getFileConfigHash = (config: AtomConfig): string => {
  const defaults = defaultConfig();
  let fileConfigString = '';

  if (
    config.saturation !== defaults.saturation ||
    config.opacity !== defaults.opacity ||
    config.folderColor !== defaults.folderColor
  ) {
    fileConfigString += `~${getHash(JSON.stringify(config))}`;
  }
  return fileConfigString;
};
