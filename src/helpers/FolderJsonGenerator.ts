import type { AtomConfig, IconPack } from 'src/@types/config';
import { FolderTheme } from 'src/@types/config';
import type { FolderAssociation, FolderAssociations, IconAssociations } from 'src/@types/icons';
import type { JsonGenerator } from 'src/helpers/JsonGenerator';
import type { IconConfiguration } from 'src/models/iconConfiguration';
import { folderIcons } from 'src/icons';
import {
  FOLDERS_FOLDER_PATH,
  FOLDERS_OPEN_FOLDER_PATH,
  OPENED_FOLDER_SUFFIX,
  DARK_FILE_ENDING,
  HIGH_CONTRAST_FILE_ENDING,
} from 'src/helpers/constants';
import merge from 'lodash.merge';

export class FolderJsonGenerator {
  constructor(private readonly jsonGenerator: JsonGenerator) {}

  public loadFolderIconAssociations(iconConfig: IconConfiguration, options: AtomConfig): void {
    if (options.folderTheme === FolderTheme.None) return;

    // First, get the folder theme's associations
    const folderThemeAssociations = this.getFolderThemeAssociations(options.folderTheme);

    // first, remove languages by pack
    const enabledAssociations = this.disableAssociationsByPack(
      folderThemeAssociations,
      options.activeIconPacks,
    );

    // next, load custom file associations
    const customAssociations = this.getCustomAssociations(options.foldersAssociations);
    const allFolderAssociations = [...enabledAssociations, ...customAssociations];

    allFolderAssociations.forEach(folderAssoc => {
      if (folderAssoc.disabled) return;

      this.loadFolderAssociation(iconConfig, folderAssoc);
    });

    // next, add the default folder icon
    this.loadDefaultFolderAssociation(iconConfig, folderThemeAssociations);

    // finally, add the root folder icon
    this.loadRootFolderAssociation(iconConfig, folderThemeAssociations);

    // next, generate colored folders
    // this.generateColoredFolders(iconConfig, folderThemeAssociations, options.folderColor);
  }

  /**
   * Find the user's selected folder theme assoc in the folder icons
   * @param {FolderTheme} folderTheme
   * @returns {FolderAssociations}
   * @private
   */
  private getFolderThemeAssociations(folderTheme: FolderTheme): FolderAssociations {
    return folderIcons.find(folder => folder.name.toLowerCase() === folderTheme.toLowerCase()) ?? folderIcons[0];
  }

  /**
   * Disable folder icons that are not relevant to the chosen icon packs
   * @param {FolderAssociations} folderIcons
   * @param {IconPack[]} activeIconPacks
   * @returns {FolderAssociation[]}
   * @private
   */
  private disableAssociationsByPack(folderIcons: FolderAssociations, activeIconPacks: IconPack[]): FolderAssociation[] {
    if (!folderIcons.icons) return [];

    return folderIcons.icons.filter(icon => {
      if (!icon.enabledFor) return true;
      return icon.enabledFor.some(pack => activeIconPacks.includes(pack));
    });
  }

  /**
   * Convert custom icon associations into icons
   * @param {IconAssociations} folderAssociations
   * @returns {FolderAssociation[]}
   * @private
   */
  private getCustomAssociations(folderAssociations?: IconAssociations): FolderAssociation[] {
    if (!folderAssociations) return [];

    // todo check for the expanded syntax
    return Object.entries(folderAssociations).map(([key, value]) => ({
      name: value?.toLowerCase() ?? 'folder',
      folderNames: [key.toLowerCase()],
    }));
  }

  /**
   * Load the folder association
   * @param {IconConfiguration} config
   * @param {FolderAssociation} folderAssoc
   * @private
   */
  private loadFolderAssociation(config: IconConfiguration, folderAssoc: FolderAssociation): void {
    const assocName = folderAssoc.name;

    this.addFolderAssociation(config, assocName);
    // Bonus: add the variant with "." and with "_"
    this.addExtraFolderAssociations(config, assocName, folderAssoc.folderNames);

    // add light variant if needed
    if (folderAssoc.light) {
      // todo check if it indeed works with light/dark
      config.light = merge({}, config.light);
      this.addFolderAssociation(config.light, assocName, DARK_FILE_ENDING);
    }

    // add highContrast variant if needed
    if (folderAssoc.highContrast) {
      // todo check if it indeed works with highContrast
      config.highContrast = merge({}, config.highContrast);
      this.addFolderAssociation(config.highContrast, assocName, HIGH_CONTRAST_FILE_ENDING);
    }

  }

  /**
   * Duplicate folder associations to include variants with . and _
   * @param {IconConfiguration} config
   * @param {string} assocName
   * @param {string[]} folderNames
   * @param suffix
   * @private
   */
  private addExtraFolderAssociations(
    config: IconConfiguration,
    assocName: string,
    folderNames: string[],
    suffix = '',
  ): void {
    if (!folderNames) return;
    const folderAssocName = assocName + suffix;
    const folderOpenAssocName = assocName + OPENED_FOLDER_SUFFIX + suffix;

    folderNames.forEach(folderName => {
      if (!config.folderNames) config.folderNames = {};
      config.folderNames[folderName] = folderAssocName;
      config.folderNames[`.${folderName}`] = folderAssocName;
      config.folderNames[`_${folderName}`] = folderAssocName;

      if (!config.folderNamesExpanded) config.folderNamesExpanded = {};
      config.folderNamesExpanded[folderName] = folderOpenAssocName;
      config.folderNamesExpanded[`.${folderName}`] = folderOpenAssocName;
      config.folderNamesExpanded[`_${folderName}`] = folderOpenAssocName;
    });
  }

  /**
   * Add the folder association to the config
   * @param {IconConfiguration} config
   * @param {string} assocName
   * @param {string} suffix
   * @private
   */
  private addFolderAssociation(config: IconConfiguration, assocName: string, suffix = ''): void {
    if (!config.iconDefinitions) return;
    // First generates a hash to append to the icon if custom color, opacity or saturation
    const fileConfigHash = this.jsonGenerator.getFileConfigHash(config.options ?? {});

    // Add the folders and foldersExpanded icons
    config.iconDefinitions[`${assocName}${suffix}`] = {
      iconPath: `${FOLDERS_FOLDER_PATH}/${assocName}${suffix}${fileConfigHash}.svg`,
    };
    config.iconDefinitions[`${assocName}${OPENED_FOLDER_SUFFIX}${suffix}`] = {
      iconPath: `${FOLDERS_OPEN_FOLDER_PATH}/${assocName}${suffix}${fileConfigHash}.svg`,
    };
  }

  /**
   * Add the default folder icon association
   * @param {IconConfiguration} config
   * @param folderTheme
   * @private
   */
  private loadDefaultFolderAssociation(config: IconConfiguration, folderTheme: FolderAssociations): void {
    const defaultIconName = folderTheme.defaultIcon.name;
    if (!defaultIconName) return;

    const defaultIconExpandedName = defaultIconName + OPENED_FOLDER_SUFFIX;

    this.addFolderAssociation(config, defaultIconName);
    config.folder = defaultIconName;
    config.folderExpanded = defaultIconExpandedName;

    if (folderTheme.defaultIcon.light) {
      this.addFolderAssociation(config, defaultIconName, DARK_FILE_ENDING);
      // Replace the default folder with the variant with the '_dark' suffix
      config.folder = defaultIconName + DARK_FILE_ENDING;
      config.folderExpanded = defaultIconExpandedName + DARK_FILE_ENDING;

      // Add the original icon to the light config
      if (!config.light) config.light = {};
      config.light.folder = defaultIconName;
      config.light.folderExpanded = defaultIconExpandedName;
    }

    if (folderTheme.defaultIcon.highContrast) {
      this.addFolderAssociation(config, defaultIconName, HIGH_CONTRAST_FILE_ENDING);

      // Add the original icon to the hc config
      if (!config.highContrast) config.highContrast = {};
      config.highContrast.folder = defaultIconName + HIGH_CONTRAST_FILE_ENDING;
      config.highContrast.folderExpanded = defaultIconExpandedName + HIGH_CONTRAST_FILE_ENDING;
    }
  }

  /**
   * Add the root folder icon association
   * @param config
   * @param folderTheme
   * @private
   */
  private loadRootFolderAssociation(config: IconConfiguration, folderTheme: FolderAssociations): void {
    const rootFolderName = folderTheme.rootFolder?.name;
    if (!rootFolderName) {
      // todo check this
      // config.rootFolder = config.folder;
      // config.rootFolderExpanded = config.folderExpanded;
      return;
    }

    const rootFolderExpandedName = folderTheme.rootFolder?.name + OPENED_FOLDER_SUFFIX;

    // todo check if those `addFolderAssociations` are needed
    // this.addFolderAssociation(config, rootFolderName);
    config.rootFolder = rootFolderName;
    config.rootFolderExpanded = rootFolderExpandedName;

    if (folderTheme.rootFolder?.light) {
      // this.addFolderAssociation(config, folderTheme.rootFolder?.name, DARK_FILE_ENDING);
      // Replace the default folder with the variant with the '_dark' suffix
      config.rootFolder = rootFolderName + DARK_FILE_ENDING;
      config.rootFolderExpanded = rootFolderExpandedName + DARK_FILE_ENDING;

      // Add the original icon to the light config
      if (!config.light) config.light = {};
      config.light.rootFolder = rootFolderName;
      config.light.rootFolderExpanded = rootFolderExpandedName;
    }

    if (folderTheme.rootFolder?.highContrast) {
      // this.addFolderAssociation(config, rootFolderName, HIGH_CONTRAST_FILE_ENDING);

      // Add the original icon to the hc config
      if (!config.highContrast) config.highContrast = {};
      config.highContrast.rootFolder = rootFolderName + HIGH_CONTRAST_FILE_ENDING;
      config.highContrast.rootFolderExpanded = rootFolderExpandedName + HIGH_CONTRAST_FILE_ENDING;
    }
  }

  // private generateColoredFolders(
  //   iconConfig: IconConfiguration,
  //   folderTheme: FolderAssociations,
  //   folderColor?: string,
  // ): void {
  //   if (!folderColor) return;
  //
  //   const folderName = folderTheme.defaultIcon.name;
  //   const openFolderName = folderName + OPENED_FOLDER_SUFFIX;
  //
  //   const folderPath = iconConfig.iconDefinitions?.[folderName]?.iconPath;
  //   const openFolderPath = iconConfig.iconDefinitions?.[openFolderName]?.iconPath;
  //
  //   if (!folderPath || !openFolderPath) return;
  //
  //   const folderSvg = fs.readFileSync(folderPath, 'utf8');
  //   const folderOpenSvg = fs.readFileSync(openFolderPath, 'utf8');
  // }
}