
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { getFilesPath, getFoldersOpenPath, getFoldersPath, JSON_FILE_NAME } from 'src/helpers/constants';
import { findCustomIcon, findCustomOpenFolderIcon, getCustomIconName, isCustomIconPath } from 'src/helpers/customIcons';
import { writeFileAtomic } from 'src/helpers/fsUtils';
import { getFileConfigHash, withDefaults } from 'src/icons/configUtils';
import { IconConfiguration } from 'src/models/IconConfiguration';

import { FileJsonGenerator } from './FileJsonGenerator';
import { folderColorService } from './FolderColorService';
import { FolderJsonGenerator } from './FolderJsonGenerator';
import { filterFontColor } from './FontColorService';
import { LanguageJsonGenerator } from './LanguageJsonGenerator';
import { monochromeService } from './MonochromeService';
import { opacityService } from './OpacityService';
import { saturationService } from './SaturationService';
import { ThemeLayerGenerator } from './ThemeLayerGenerator';

import type { AtomConfig } from 'src/@types/config';
import type { LanguageLookup, LayerTheme } from 'src/helpers/themeLayers';

/** Association values that are paths to custom SVG files */
const customValues = (associations?: Record<string, string>) =>
  Object.values(associations ?? {}).filter((value) => typeof value === 'string' && isCustomIconPath(value));

/** The installed icon themes mixed with this theme, and the languages of the file names and extensions */
export type ThemeLayers = { languages: LanguageLookup; themes: LayerTheme[] };

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

  /**
   * @param updatedJSONConfig the settings, missing ones get their default value
   * @param paths where to read the icons and write the theme
   * @param layers the installed icon themes the settings mix with this theme, and the languages of the names
   */
  constructor(
    updatedJSONConfig: Partial<AtomConfig> = {},
    private readonly paths?: GeneratorPaths,
    private readonly layers?: ThemeLayers,
  ) {
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
      writeFileAtomic(join(this.iconPath(), JSON_FILE_NAME), JSON.stringify(json, undefined, 2));
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
    const fileIconNames = this.prepareIcons();
    for (const generator of [this.languageGenerator, this.fileGenerator]) {
      generator.setFileIconNames(fileIconNames);
    }

    // Load language icons onto the config
    this.languageGenerator.loadLanguageIconAssociations();

    // Load file icons onto the config
    this.fileGenerator.loadFileIconAssociations();

    // Load folder icons onto the config
    this.folderGenerator.loadFolderIconAssociations();

    // Last, mix the other installed icon themes
    this.loadThemeLayers();
  }

  /**
   * Mix the other installed icon themes of `iconThemeLayers` and `iconThemeByName` with this theme.
   * Their fingerprint is stored in the json to regenerate the theme when one of them changes.
   * @private
   */
  private loadThemeLayers() {
    const distributionPath = this.iconPath();
    this.iconConfig.layerThemes = '';

    if (!this.layers?.themes.length) {
      ThemeLayerGenerator.clean(distributionPath);
      return;
    }

    const generator = new ThemeLayerGenerator(
      this.atomConfig,
      this.iconConfig,
      this.layers.themes,
      this.layers.languages,
      distributionPath,
      getFileConfigHash(this.atomConfig),
      (svg) => this.filterSvg(svg),
      (color) => filterFontColor(color, this.atomConfig),
    );
    // a theme that cannot be read (being rewritten) is left out, so the fingerprint differs and it is read again
    this.iconConfig.layerThemes = generator.apply();
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
   * @returns the names of the bundled file icons, without `.svg`
   * @private
   */
  private prepareIcons(): string[] {
    const iconGeneratorPath = join(this.iconGeneratorPath(), 'assets', 'icons');

    const filesPath = getFilesPath(iconGeneratorPath);
    // A package built without the iconGenerator submodule cannot regenerate anything (#73)
    if (!existsSync(filesPath)) {
      throw new Error(`Icon sources not found in ${iconGeneratorPath}: the extension package is incomplete`);
    }
    const foldersPath = getFoldersPath(iconGeneratorPath);
    const foldersOpenPath = getFoldersOpenPath(iconGeneratorPath);

    const distributionPath = this.iconPath();

    const distributionFilesPath = getFilesPath(distributionPath);
    const distributionFoldersPath = getFoldersPath(distributionPath);
    const distributionFoldersOpenPath = getFoldersOpenPath(distributionPath);

    this.applyFiltersAndCopy(filesPath, distributionFilesPath);
    this.applyFiltersAndCopy(foldersPath, distributionFoldersPath);
    this.applyFiltersAndCopy(foldersOpenPath, distributionFoldersOpenPath);
    this.copyMissingOpenFolders(foldersPath, foldersOpenPath, distributionFoldersOpenPath);

    // icons of this fork that are not in iconGenerator (assets/icons/NOTICE.md), next to the submodule
    const extraFilesPath = getFilesPath(join(this.iconGeneratorPath(), '..', 'assets', 'icons'));
    const extraFiles = existsSync(extraFilesPath) ? readdirSync(extraFilesPath) : [];
    if (extraFiles.length > 0) this.applyFiltersAndCopy(extraFilesPath, distributionFilesPath);

    this.copyCustomIcons(distributionPath);

    return [...readdirSync(filesPath), ...extraFiles].map((file) => file.replace(/\.svg$/, ''));
  }

  /**
   * A folder icon without an expanded variant (`plastic`) keeps its closed icon when expanded,
   * instead of pointing the theme to a missing file.
   * @private
   */
  private copyMissingOpenFolders(foldersPath: string, foldersOpenPath: string, destination: string) {
    const fileConfigHash = getFileConfigHash(this.atomConfig);
    const openIcons = new Set(readdirSync(foldersOpenPath));

    for (const iconFile of readdirSync(foldersPath)) {
      if (openIcons.has(iconFile)) continue;

      const hashedFile = iconFile.replace(/(^[^.~]+)(.*)\.svg/, `$1${fileConfigHash}.svg`);
      writeFileAtomic(join(destination, hashedFile), this.applyFilters(join(foldersPath, iconFile)));
    }
  }

  /**
   * Copy the user's custom SVG icons next to the bundled ones, with the same filters.
   * Missing files are skipped: the generators then drop their association.
   * @private
   */
  private copyCustomIcons(distributionPath: string) {
    const fileConfigHash = getFileConfigHash(this.atomConfig);

    // language icons are file icons too
    const fileValues = [
      ...customValues(this.atomConfig.filesAssociations),
      ...customValues(this.atomConfig.languagesAssociations),
    ];
    for (const value of fileValues) {
      const source = findCustomIcon(value);
      if (!source) continue;
      const target = `${getCustomIconName(value)}${fileConfigHash}.svg`;
      writeFileAtomic(join(getFilesPath(distributionPath), target), this.applyFilters(source));
    }

    for (const value of customValues(this.atomConfig.foldersAssociations)) {
      const source = findCustomIcon(value);
      if (!source) continue;
      const target = `${getCustomIconName(value)}${fileConfigHash}.svg`;
      writeFileAtomic(join(getFoldersPath(distributionPath), target), this.applyFilters(source));
      writeFileAtomic(join(getFoldersOpenPath(distributionPath), target), this.applyFilters(findCustomOpenFolderIcon(source)));
    }
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

      writeFileAtomic(join(destination, hashedFile), svg);
    }
  }

  /**
   * Apply filters to the svg
   * @param {string} filePath
   * @returns {string}
   * @private
   */
  private applyFilters(filePath: string) {
    return this.filterSvg(readFileSync(filePath, 'utf8'));
  }

  /** The filters of {@link applyFilters}, for the content of an svg file */
  private filterSvg(content: string) {
    let svg = content;

    // folder color
    svg = folderColorService.applyFolderColor(svg, this.atomConfig.folderColor);

    // Monochrome
    svg = monochromeService.applyMonochrome(svg, this.atomConfig.monochrome, this.atomConfig.monochromeColor);

    // Opacity
    svg = opacityService.applyOpacity(svg, this.atomConfig.opacity);

    // Saturation
    svg = saturationService.applySaturation(svg, this.atomConfig.saturation);

    return svg;
  }
}
