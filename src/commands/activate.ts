import { configService } from 'src/services/ConfigService';
import { logger } from 'src/services/LoggingService';

/** Activate the icon theme by changing the settings for the iconTheme. */
export const activateIcons = async () => {
  logger.info('Activating icon theme');
  return configService.activateIcons();
};
