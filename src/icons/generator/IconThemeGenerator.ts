import merge from 'lodash.merge';
import type { AtomConfig } from 'src/@types/config';
import { IconPack, FolderTheme } from 'src/@types/config';
import { IconConfiguration } from 'src/models/iconConfiguration';
import { DEFAULT_FOLDER_COLOR, FILES_FOLDER_PATH } from 'src/helpers/constants';
import { getHash } from 'src/helpers/utils';
import { LanguageJsonGenerator } from 'src/icons/generator/LanguageJsonGenerator';
import { FileJsonGenerator } from 'src/icons/generator/FileJsonGenerator';
import { FolderJsonGenerator } from 'src/icons/generator/FolderJsonGenerator';
import { validateOpacityValue, validateSaturationValue, validateHEXColorCode, iconJsonName } from 'src/icons/index';
import path from 'path';
import fs from 'fs';

export class IconThemeGenerator {
  languageGenerator: LanguageJsonGenerator = new LanguageJsonGenerator(this);
  fileGenerator: FileJsonGenerator = new FileJsonGenerator(this);
  folderGenerator: FolderJsonGenerator = new FolderJsonGenerator(this);

  /**
   * Create the atom config to be serialized to json
   * @param {AtomConfig} updatedConfigs
   * @param {Partial<AtomConfig>} updatedJSONConfig the new configuration to be merged with the default config
   */
  createJsonTheme(updatedConfigs?: AtomConfig, updatedJSONConfig: Partial<AtomConfig> = {}) {
    // Initializes the config with the default values and provided changes
    const config = merge({}, this.defaultConfig(), updatedJSONConfig);

    const json = this.generateJsonConfig(config);
    if (updatedConfigs) {
      this.validateConfig(updatedConfigs);
    }

    try {
      let iconJsonPath = __dirname;
      // if executed via script
      if (path.basename(__dirname) !== 'dist') {
        iconJsonPath = path.join(__dirname, '..', '..', '..', 'dist');
      }

      // if (!updatedConfigs || updatedConfigs.opacity) {
      //   this.generateOpacityIcons(config, updatedConfigs?.opacity);
      // }
      //
      // if (!updatedConfigs || updatedConfigs.saturation) {
      //   this.generateSaturatedIcons(config, updatedConfigs?.saturation);
      // }
      //
      // this.renameIcons(iconJsonPath, options);
    } catch (e) {
      console.error(`Failed to update icons: ${e}`);
    }

    try {
      let iconJsonPath = __dirname;
      // if executed via script
      if (path.basename(__dirname) !== 'dist') {
        iconJsonPath = path.join(__dirname, '..', '..', 'dist');
      }
      fs.writeFileSync(path.join(iconJsonPath, iconJsonName), JSON.stringify(json, undefined, 2), 'utf-8');
    } catch (error) {
      throw new Error('Failed to create icon file: ' + error);
    }

    return json;
  }

  /**
   * Add a file association to the config iconDefinitions
   * @param {IconConfiguration} config the config to populate
   * @param {string} assocName the association name
   * @returns {IconConfiguration}
   * @private
   */
  public addFileAssociation(config: IconConfiguration, assocName: string): IconConfiguration {
    // First generates a hash to append to the icon if custom color, opacity or saturation
    const fileConfigHash = this.getFileConfigHash(config.options ?? {});

    // Then add the icons to the iconDefinitions
    if (config.iconDefinitions) {
      config.iconDefinitions[assocName] = {
        // todo make a languages folder ?
        iconPath: `${FILES_FOLDER_PATH}/${assocName}${fileConfigHash}.svg`,
      };
    }
    return config;
  }

  /**
   * Generates a hash of the current config
   */
  public getFileConfigHash(options: Partial<AtomConfig>): string {
    const defaults = this.defaultConfig();
    let fileConfigString = '';

    if (
      options.saturation !== defaults.saturation ||
      options.opacity !== defaults.opacity ||
      options.folderColor !== defaults.folderColor
    ) {
      fileConfigString += `~${getHash(JSON.stringify(options))}`;
    }
    return fileConfigString;
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
   * @param {AtomConfig} options
   * @returns {IconConfiguration}
   * @private
   */
  private generateJsonConfig(options: AtomConfig): IconConfiguration {
    const iconConfig = new IconConfiguration(options);

    // Load language icons onto the config
    this.languageGenerator.loadLanguageIconAssociations(iconConfig, options);

    // Load file icons onto the config
    this.fileGenerator.loadFileIconAssociations(iconConfig, options);

    // Load folder icons onto the config
    this.folderGenerator.loadFolderIconAssociations(iconConfig, options);

    return iconConfig;
  }

  /**
   * Get the default config
   * @returns {AtomConfig}
   * @private
   */
  private defaultConfig(): AtomConfig {
    return {
      activeIconPacks: [IconPack.Rails, IconPack.Angular, IconPack.React, IconPack.Phalcon],
      folderColor: DEFAULT_FOLDER_COLOR,
      folderTheme: FolderTheme.Specific,
      hidesExplorerArrows: false,
      opacity: 1,
      saturation: 1,
      showReloadMessage: false,
      showUpdateMessage: false,
      showWelcomeMessage: false,
    };
  }
}

export const jsonGenerator = new IconThemeGenerator();
