import { RELATIVE_DIST_FILES_FOLDER_PATH } from 'src/helpers/constants';
import { getFileConfigHash } from 'src/icons/configUtils';

import type { IconConfiguration } from 'src/models/IconConfiguration';
import type { AtomConfig } from 'src/@types/config';

export abstract class AbstractJsonGenerator {
  protected constructor(protected readonly atomConfig: AtomConfig, protected readonly iconConfig: IconConfiguration) {}

  /**
   * Define the icon `<name><suffix>` from the processed svg of the files folder
   * (the hash changes when color, opacity, saturation or monochrome are customized)
   */
  protected addFileIconDefinition(name: string, suffix = ''): void {
    if (!this.iconConfig.iconDefinitions) return;

    this.iconConfig.iconDefinitions[`${name}${suffix}`] = {
      iconPath: `${RELATIVE_DIST_FILES_FOLDER_PATH}/${name}${suffix}${getFileConfigHash(this.atomConfig)}.svg`,
    };
  }
}
