import { iconPackManager } from 'src/helpers/IconPackManager';
import { logger } from 'src/helpers/LoggingService';

/** Command to toggle the icons packs */
export const toggleIconPacks = async () => {
  logger.info('Open toggle icon pack popup');
  await iconPackManager.toggleIconPacks();
};

