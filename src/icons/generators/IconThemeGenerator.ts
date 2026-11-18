
import { outputFileSync } from 'fs-extra';
import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { getFilesPath, getFoldersOpenPath, getFoldersPath, JSON_FILE_NAME } from 'src/helpers/constants';
import { getFileConfigHash, withDefaults } from 'src/icons/configUtils';
import { IconConfiguration } from 'src/models/IconConfiguration';

import { FileJsonGenerator } from './FileJsonGenerator';
import { folderColorService } from './FolderColorService';
import { FolderJsonGenerator } from './FolderJsonGenerator';
import { LanguageJsonGenerator } from './LanguageJsonGenerator';
import { opacityService } from './OpacityService';
import { saturationService } from './SaturationService';

import type { AtomConfig } from 'src/@types/config';

/**
 * Explicit locations used by the generators. When omitted, they are guessed from `__dirname`.
 */
export type GeneratorPaths = {
  /** Folder receiving the generated theme json and processed icons */
  dist: string;
  /** Root of the iconGenerator submodule */
  iconGenerator: string;
};

export class IconThemeGenerator {
  atomConfig: AtomConfig;
  iconConfig: IconConfiguration;

  languageGenerator: LanguageJsonGenerator;
  fileGenerator: FileJsonGenerator;
  folderGenerator: FolderJsonGenerator;

  constructor(updatedJSONConfig: Partial<AtomConfig> = {}, private readonly paths?: GeneratorPaths) {
    // Initializes the config with the default values and provided changes
    // A shallow merge on purpose: lodash.merge would merge arrays index by index,
    // mixing the user's activeIconPacks with the default ones (#71)
    const atomConfig = withDefaults(updatedJSONConfig);
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
      outputFileSync(join(this.iconPath(), JSON_FILE_NAME), JSON.stringify(json, undefined, 2), 'utf8');
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
   * TODO this logic sucks because the iconPath can be different depending on the execution context
   * if it's npm or if it's vscode :(
   * @returns {string}
   * @private
   */
  private iconPath() {
    if (this.paths) return this.paths.dist;

    let iconJsonPath = __dirname;
    // if executed via script
    if (basename(__dirname) !== 'dist') {
      iconJsonPath = join(__dirname, '..', '..', '..', 'dist');
    }
    return iconJsonPath;
  }

  /**
   * TODO this logic sucks because the iconPath can be different depending on the execution context
   * if it's npm or if it's vscode :(
   * @returns {string}
   * @private
   */
  private iconGeneratorPath() {
    if (this.paths) return this.paths.iconGenerator;

    let iconJsonPath = __dirname;
    // if executed via script
    if (basename(__dirname) !== 'dist') {
      iconJsonPath = join(__dirname, '..', '..', '..', 'dist');
    }
    if (basename(iconJsonPath) === 'dist') {
      iconJsonPath = join(iconJsonPath, '..', 'iconGenerator');
    }
    return iconJsonPath;
  }

  /**
   * Apply filters to the icons and copy them to dist
   * @private
   */
  private prepareIcons() {
    const iconGeneratorPath = join(this.iconGeneratorPath(), 'assets', 'icons');

    const filesPath = getFilesPath(iconGeneratorPath);
    const foldersPath = getFoldersPath(iconGeneratorPath);
    const foldersOpenPath = getFoldersOpenPath(iconGeneratorPath);

    const distributionPath = this.iconPath();

    const distributionFilesPath = getFilesPath(distributionPath);
    const distributionFoldersPath = getFoldersPath(distributionPath);
    const distributionFoldersOpenPath = getFoldersOpenPath(distributionPath);

    this.applyFiltersAndCopy(filesPath, distributionFilesPath);
    this.applyFiltersAndCopy(foldersPath, distributionFoldersPath);
    this.applyFiltersAndCopy(foldersOpenPath, distributionFoldersOpenPath);
  }

  /**
   * Apply filters to the icons and copy them to dist
   * @param {string} source
   * @param destination
   * @private
   */
  private applyFiltersAndCopy(source: string, destination: string) {
    const iconFiles = readdirSync(source);
    const fileConfigHash = getFileConfigHash(this.atomConfig);

    for (const iconFile of iconFiles) {
      // apply color, opacity and saturation
      const hashedFile = iconFile.replace(/(^[^.~]+)(.*)\.svg/, `$1${fileConfigHash}.svg`);
      const filePath = join(source, iconFile);
      const svg = this.applyFilters(filePath);

      outputFileSync(join(destination, hashedFile), svg, 'utf8');
    }
  }

  /**
   * Apply filters to the svg
   * @param {string} filePath
   * @returns {string}
   * @private
   */
  private applyFilters(filePath: string) {
    let svg = readFileSync(filePath, 'utf8');

    // folder color
    svg = folderColorService.applyFolderColor(svg, this.atomConfig.folderColor);

    // Opacity
    svg = opacityService.applyOpacity(svg, this.atomConfig.opacity);

    // Saturation
    svg = saturationService.applySaturation(svg, this.atomConfig.saturation);

    return svg;
  }
}
