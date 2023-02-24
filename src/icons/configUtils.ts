/**
 * Get the default config
 * @returns {AtomConfig}
 * @private
 */
import { FolderTheme, IconPack, ArrowTheme } from 'src/@types/config';
import { DEFAULT_FOLDER_COLOR, DEFAULT_OPACITY, DEFAULT_SATURATION } from 'src/helpers/constants';
import { getHash } from 'src/helpers/utils';

import type { AtomConfig } from 'src/@types/config';

/**
 * Return the default config
 * @returns {AtomConfig}
 */
export const getDefaultConfig = (): AtomConfig => {
  return {
    activeIconPacks: [IconPack.Rails, IconPack.Angular, IconPack.React, IconPack.Phalcon],
    arrowTheme: ArrowTheme.Material,
    folderColor: DEFAULT_FOLDER_COLOR,
    folderTheme: FolderTheme.Specific,
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
  const defaults = getDefaultConfig();
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
