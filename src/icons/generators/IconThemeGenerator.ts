import merge from 'lodash.merge';
import type { AtomConfig } from 'src/@types/config';
import { IconConfiguration } from 'src/models/iconConfiguration';
import { DIST_PATH } from 'src/helpers/constants';
import { LanguageJsonGenerator } from 'src/icons/generators/LanguageJsonGenerator';
import { FileJsonGenerator } from 'src/icons/generators/FileJsonGenerator';
import { FolderJsonGenerator } from 'src/icons/generators/FolderJsonGenerator';
import { validateOpacityValue, validateSaturationValue, validateHEXColorCode, iconJsonName } from 'src/icons/index';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { defaultConfig } from 'src/icons/configUtils';

export class IconThemeGenerator {
  atomConfig: AtomConfig;
  iconConfig: IconConfiguration;

  languageGenerator: LanguageJsonGenerator;
  fileGenerator: FileJsonGenerator;
  folderGenerator: FolderJsonGenerator;

  constructor(updatedConfigs?: AtomConfig, updatedJSONConfig: Partial<AtomConfig> = {}) {
    // Initializes the config with the default values and provided changes
    const atomConfig = merge({}, defaultConfig(), updatedJSONConfig);
    const iconConfig = new IconConfiguration(atomConfig);

    this.languageGenerator = new LanguageJsonGenerator(atomConfig, iconConfig);
    this.fileGenerator = new FileJsonGenerator(atomConfig, iconConfig);
    this.folderGenerator = new FolderJsonGenerator(atomConfig, iconConfig);

    this.atomConfig = atomConfig;
    this.iconConfig = iconConfig;
  }

  /**
   * Create the atom config to be serialized to json
   * @param {AtomConfig} updatedConfigs
   * @param {Partial<AtomConfig>} updatedJSONConfig the new configuration to be merged with the default config
   */
  createJsonTheme(updatedConfigs?: AtomConfig, updatedJSONConfig: Partial<AtomConfig> = {}) {
    this.generateJsonConfig();

    if (updatedConfigs) {
      this.validateConfig(updatedConfigs);
    }

    try {
      const json = this.iconConfig;
      writeFileSync(join(DIST_PATH, iconJsonName), JSON.stringify(json, undefined, 2), 'utf-8');
    } catch (error) {
      throw new Error('Failed to create icon file: ' + error);
    }
  }

  /**
   * Validate configuration
   * @param {AtomConfig} updatedConfigs
   * @private
   */
  private validateConfig(updatedConfigs: AtomConfig): void {
    if (updatedConfigs?.opacity && !validateOpacityValue(updatedConfigs?.opacity)) {
      throw Error('Atom Material Icons: Invalid opacity value!');
    }
    if (updatedConfigs?.saturation && !validateSaturationValue(updatedConfigs?.saturation)) {
      throw Error('Atom Material Icons: Invalid saturation value!');
    }
    if (updatedConfigs?.folderColor && !validateHEXColorCode(updatedConfigs?.folderColor)) {
      throw Error('Atom Material Icons: Invalid folder color value!');
    }
  }

  /**
   * Generate the theme json from the files
   * @private
   */
  private generateJsonConfig() {
    // Load language icons onto the config
    this.languageGenerator.loadLanguageIconAssociations();

    // Load file icons onto the config
    this.fileGenerator.loadFileIconAssociations();

    // Load folder icons onto the config
    this.folderGenerator.loadFolderIconAssociations();
  }
}
