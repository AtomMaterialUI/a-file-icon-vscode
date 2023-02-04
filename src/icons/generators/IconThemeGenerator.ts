import merge from 'lodash.merge';
import type { AtomConfig } from 'src/@types/config';
import { IconConfiguration } from 'src/models/iconConfiguration';
import {
  DIST_PATH,
  DIST_FILES_FOLDER_PATH,
  FULL_FILES_FOLDER_PATH,
  FULL_FOLDERS_FOLDER_PATH,
  FULL_FOLDERS_OPEN_FOLDER_PATH,
  DIST_FOLDERS_FOLDER_PATH,
  DIST_FOLDERS_OPEN_FOLDER_PATH,
} from 'src/helpers/constants';
import { LanguageJsonGenerator } from 'src/icons/generators/LanguageJsonGenerator';
import { FileJsonGenerator } from 'src/icons/generators/FileJsonGenerator';
import { FolderJsonGenerator } from 'src/icons/generators/FolderJsonGenerator';
import { iconJsonName } from 'src/icons/index';
import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { outputFileSync } from 'fs-extra';
import { defaultConfig } from 'src/icons/configUtils';
import { opacityService } from 'src/icons/generators/OpacityService';
import { saturationService } from 'src/icons/generators/SaturationService';
import { folderColorService } from 'src/icons/generators/FolderColorService';

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

    try {
      const json = this.iconConfig;
      outputFileSync(join(DIST_PATH, iconJsonName), JSON.stringify(json, undefined, 2), 'utf-8');
    } catch (error) {
      throw new Error('Failed to create icon file: ' + error);
    }
  }

  /**
   * Generate the theme json from the files
   * @private
   */
  private generateJsonConfig() {
    // Apply filters and copy icons to dist
    this.prepareIcons();

    // Load language icons onto the config
    this.languageGenerator.loadLanguageIconAssociations();

    // Load file icons onto the config
    this.fileGenerator.loadFileIconAssociations();

    // Load folder icons onto the config
    this.folderGenerator.loadFolderIconAssociations();
  }

  /**
   * Apply filters to the icons and copy them to dist
   * @private
   */
  private prepareIcons() {
    this.applyFiltersAndCopy(FULL_FILES_FOLDER_PATH, DIST_FILES_FOLDER_PATH);
    this.applyFiltersAndCopy(FULL_FOLDERS_FOLDER_PATH, DIST_FOLDERS_FOLDER_PATH);
    this.applyFiltersAndCopy(FULL_FOLDERS_OPEN_FOLDER_PATH, DIST_FOLDERS_OPEN_FOLDER_PATH);
  }

  /**
   * Apply filters to the icons and copy them to dist
   * @param {string} source
   * @param {string} dest
   * @private
   */
  private applyFiltersAndCopy(source: string, dest: string) {
    const iconFiles = readdirSync(source);
    iconFiles.forEach((iconFile) => {
      // apply color, opacity and saturation
      const filePath = join(source, iconFile);
      const svg = this.applyFilters(filePath);

      outputFileSync(join(dest, iconFile), svg, 'utf-8');
    });
  }

  /**
   * Apply filters to the svg
   * @param {string} filePath
   * @returns {string}
   * @private
   */
  private applyFilters(filePath: string) {
    let svg = readFileSync(filePath, 'utf-8');

    // folder color
    svg = folderColorService.applyFolderColor(svg, this.atomConfig.folderColor);

    // Opacity
    svg = opacityService.applyOpacity(svg, this.atomConfig.opacity);

    // Saturation
    svg = saturationService.applySaturation(svg, this.atomConfig.saturation);

    return svg;
  }
}
