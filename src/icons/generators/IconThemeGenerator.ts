import { readdirSync, readFileSync } from 'fs';
import { outputFileSync } from 'fs-extra';
import merge from 'lodash.merge';
import { join } from 'path';
import type { AtomConfig } from 'src/@types/config';
import {
  DIST_PATH,
  getFilesPath,
  getFoldersOpenPath,
  getFoldersPath,
  ICON_GENERATOR_PATH,
  JSON_FILE_NAME,
} from 'src/helpers/constants';
import { getExtensionPath } from 'src/helpers/vscodeUtils';
import { defaultConfig } from 'src/icons/configUtils';
import { IconConfiguration } from 'src/models/iconConfiguration';
import { FileJsonGenerator } from './FileJsonGenerator';
import { folderColorService } from './FolderColorService';
import { FolderJsonGenerator } from './FolderJsonGenerator';
import { LanguageJsonGenerator } from './LanguageJsonGenerator';
import { opacityService } from './OpacityService';
import { saturationService } from './SaturationService';

export class IconThemeGenerator {
  atomConfig: AtomConfig;
  iconConfig: IconConfiguration;

  languageGenerator: LanguageJsonGenerator;
  fileGenerator: FileJsonGenerator;
  folderGenerator: FolderJsonGenerator;

  constructor(updatedJSONConfig: Partial<AtomConfig> = {}) {
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
   */
  createJsonTheme() {
    // Update this.iconConfig
    this.generateJsonConfig();

    try {
      const json = this.iconConfig;
      outputFileSync(join(getExtensionPath(), DIST_PATH, JSON_FILE_NAME), JSON.stringify(json, undefined, 2), 'utf-8');
    }
    catch (error) {
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
    const iconGeneratorPath = join(getExtensionPath(), ICON_GENERATOR_PATH);

    const filesPath = getFilesPath(iconGeneratorPath);
    const foldersPath = getFoldersPath(iconGeneratorPath);
    const foldersOpenPath = getFoldersOpenPath(iconGeneratorPath);

    const distPath = join(getExtensionPath(), DIST_PATH);

    const distFilesPath = getFilesPath(distPath);
    const distFoldersPath = getFoldersPath(distPath);
    const distFoldersOpenPath = getFoldersOpenPath(distPath);

    this.applyFiltersAndCopy(filesPath, distFilesPath);
    this.applyFiltersAndCopy(foldersPath, distFoldersPath);
    this.applyFiltersAndCopy(foldersOpenPath, distFoldersOpenPath);
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
