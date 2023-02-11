import { getHash } from 'src/helpers/utils';
import { getDefaultIconOptions } from '../icons';
import type { IconJsonOptions } from '../models';

/**
 * Generate a config hashed string that is appended to each icon file name.
 * @param options
 */
export const getFileConfigHash = (options: IconJsonOptions): string => {
  try {
    const defaults = getDefaultIconOptions();
    let fileConfigString = '';
    if (
      options.saturation !== defaults.saturation ||
      options.opacity !== defaults.opacity ||
      options.folders?.color !== defaults.folders.color
    ) {
      fileConfigString += `~${getHash(JSON.stringify(options))}`;
    }
    return fileConfigString;
  }
  catch (error) {
    console.error(error);
    return '';
  }
};


