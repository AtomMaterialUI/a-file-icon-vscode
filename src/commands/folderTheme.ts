import { logger } from 'src/services';
import { folderThemeManager } from 'src/services/FolderThemeManager';

/** Command to toggle the folder icons. */
export const changeFolderTheme = async () => {
  logger.info('Open select folder theme popup');
  await folderThemeManager.openSelectThemePopup();
};
