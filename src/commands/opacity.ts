import { logger } from 'src/services';
import { opacityManager } from 'src/services/OpacityManager';

/** Command to set the opacity */
export const changeOpacity = async () => {
  logger.info('Open opacity selection popup');
  await opacityManager.openQuickPicker();
};
