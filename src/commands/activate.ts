import { configService } from 'src/helpers/ConfigService';
import { logger } from 'src/helpers/LoggingService';

/** Activate the icon theme by changing the settings for the iconTheme. */
export const activateIcons = async () => {
  logger.info('Activating icon theme');
  return configService.activateIcons();
};
