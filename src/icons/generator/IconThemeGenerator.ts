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
  config: AtomConfig;
  iconConfig: IconConfiguration;

  languageGenerator: LanguageJsonGenerator;
  fileGenerator: FileJsonGenerator;
  folderGenerator: FolderJsonGenerator;

  constructor(updatedConfigs?: AtomConfig, updatedJSONConfig: Partial<AtomConfig> = {}) {
    // Initializes the config with the default values and provided changes
    const config = merge({}, this.defaultConfig(), updatedJSONConfig);
    const iconConfig = new IconConfiguration(config);

    this.languageGenerator = new LanguageJsonGenerator(this, config, iconConfig);
    this.fileGenerator = new FileJsonGenerator(this, config, iconConfig);
    this.folderGenerator = new FolderJsonGenerator(this, config, iconConfig);

    this.config = config;
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

      const json = this.iconConfig;
      fs.writeFileSync(path.join(iconJsonPath, iconJsonName), JSON.stringify(json, undefined, 2), 'utf-8');
    } catch (error) {
      throw new Error('Failed to create icon file: ' + error);
    }
  }

  /**
   * Add a file association to the config iconDefinitions
   * @param {string} assocName the association name
   * @returns {IconConfiguration}
   * @private
   */
  public addFileAssociation(assocName: string): IconConfiguration {
    // First generates a hash to append to the icon if custom color, opacity or saturation
    const fileConfigHash = this.getFileConfigHash(this.iconConfig.options ?? {});

    // Then add the icons to the iconDefinitions
    if (this.iconConfig.iconDefinitions) {
      this.iconConfig.iconDefinitions[assocName] = {
        // todo make a languages folder ?
        iconPath: `${FILES_FOLDER_PATH}/${assocName}${fileConfigHash}.svg`,
      };
    }
    return this.iconConfig;
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
      showReloadMessage: true,
      showUpdateMessage: true,
      showWelcomeMessage: true,
    };
  }
}
