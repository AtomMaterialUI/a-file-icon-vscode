import { iconPackManager } from 'src/services/IconPackManager';
import { logger } from 'src/services/LoggingService';

/** Command to toggle the icons packs */
export const toggleIconPacks = async () => {
  logger.info('Open toggle icon pack popup');
  await iconPackManager.openQuickPicker();
};

