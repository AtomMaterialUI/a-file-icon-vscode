import { RELATIVE_DIST_FILES_FOLDER_PATH } from 'src/helpers/constants';
import { getFileConfigHash } from 'src/icons/configUtils';

import type { IconConfiguration } from 'src/models/IconConfiguration';
import type { AtomConfig } from 'src/@types/config';

export abstract class AbstractJsonGenerator {
  /** Bundled file icon names by their lower case name */
  private fileIconNames = new Map<string, string>();

  protected constructor(protected readonly atomConfig: AtomConfig, protected readonly iconConfig: IconConfiguration) {}

  /** Names (without `.svg`) of the bundled file icons, used to resolve the icon names typed in the settings */
  public setFileIconNames(names: Iterable<string>) {
    this.fileIconNames = new Map([...names].map((name) => [name.toLowerCase(), name]));
  }

  /**
   * The real name of a bundled file icon typed in any case (`githubactions` -> `githubActions`).
   * Svg names are case-sensitive on Linux, so a lower-cased name would point to a missing file there.
   */
  protected resolveFileIconName(value: string): string {
    return this.fileIconNames.get(value.toLowerCase()) ?? value.toLowerCase();
  }

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
