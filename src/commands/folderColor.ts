import { logger } from 'src/services';
import { folderColorManager } from 'src/services/FolderColorManager';

/** Command to toggle the folder icons. */
export const changeFolderColor = async () => {
  logger.info('Open select folder color popup');
  await folderColorManager.openQuickPicker();
};

