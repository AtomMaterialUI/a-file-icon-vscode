import merge from 'lodash.merge';
import { FolderTheme } from 'src/@types/config';
import {
  DARK_FILE_ENDING,
  FOLDER_PREFIX,
  HIGH_CONTRAST_FILE_ENDING,
  OPENED_FOLDER_SUFFIX,
  RELATIVE_DIST_FOLDERS_FOLDER_PATH,
  RELATIVE_DIST_FOLDERS_OPEN_FOLDER_PATH,
} from 'src/helpers/constants';
import { getFileConfigHash } from 'src/icons/configUtils';
import { AbstractJsonGenerator } from 'src/icons/generators/AbstractJsonGenerator';
import { folderIcons } from 'src/icons/index';

import type { AtomConfig } from 'src/@types/config';
import type { FolderAssociation, FolderAssociations, IconAssociations } from 'src/@types/associations';
import type { IconConfiguration } from 'src/models/IconConfiguration';

export class FolderJsonGenerator extends AbstractJsonGenerator {
  constructor(override readonly atomConfig: AtomConfig, override readonly iconConfig: IconConfiguration) {
    super(atomConfig, iconConfig);
  }

  /**
   * Load folder icon associations in the theme
   */
  public loadFolderIconAssociations() {
    // Early return if no folder theme
    if (this.atomConfig.folderTheme === FolderTheme.None) return;

    // First, get the folder theme's associations
    const folderThemeAssociations = this.getFolderThemeAssociations(this.atomConfig.folderTheme);

    // first, remove languages by pack
    const enabledAssociations = this.disableAssociationsByPack(folderThemeAssociations);

    // next, load custom file associations
    const customAssociations = this.getCustomAssociations(this.atomConfig.foldersAssociations);
    const allFolderAssociations = [...enabledAssociations, ...customAssociations];

    // next, load the folder associations inside the json
    for (const folderAssoc of allFolderAssociations) {
      if (folderAssoc.disabled) continue;

      this.loadFolderAssociation(folderAssoc);
    }

    // next, add the default folder icon
    this.loadDefaultFolderAssociation(folderThemeAssociations);

    // add the root folder icon
    this.loadRootFolderAssociation(folderThemeAssociations);
  }

  /**
   * Find the user's selected folder theme assoc in the folder icons
   * @param {FolderTheme} folderTheme
   * @returns {FolderAssociations}
   * @private
   */
  private getFolderThemeAssociations(folderTheme: FolderTheme): FolderAssociations {
    return folderIcons.find((folder) => folder.name.toLowerCase() === folderTheme.toLowerCase()) ?? folderIcons[0];
  }

  /**
   * Disable folder icons that are not relevant to the chosen icon packs
   * @param {FolderAssociations} folderIcons
   * @returns {FolderAssociation[]}
   * @private
   */
  private disableAssociationsByPack(folderIcons: FolderAssociations): FolderAssociation[] {
    if (!folderIcons.icons) return [];

    return folderIcons.icons.filter((icon) => {
      if (!icon.enabledFor) return true;

      return icon.enabledFor.some((pack) => this.atomConfig.activeIconPacks.includes(pack));
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

    return Object.entries(folderAssociations).map(([key, value]) => ({
      folderNames: [key.toLowerCase()],
      name: value?.toLowerCase() ?? 'folder',
    }));
  }

  /**
   * Load the folder association
   * @param {FolderAssociation} folderAssoc
   * @private
   */
  private loadFolderAssociation(folderAssoc: FolderAssociation) {
    const assocName = folderAssoc.name;

    this.addFolderAssociation(assocName);
    // Bonus: add the variant with "." and with "_"
    this.addExtraFolderAssociations(assocName, folderAssoc.folderNames);

    // add light variant if needed
    if (folderAssoc.light) {
      this.iconConfig.light = merge({}, this.iconConfig.light);
      this.addFolderAssociation(assocName, DARK_FILE_ENDING);
    }

    // add highContrast variant if needed
    if (folderAssoc.highContrast) {
      this.iconConfig.highContrast = merge({}, this.iconConfig.highContrast);
      this.addFolderAssociation(assocName, HIGH_CONTRAST_FILE_ENDING);
    }
  }

  /**
   * Duplicate folder associations to include variants with . and _
   * @param {string} assocName
   * @param {string[]} folderNames
   * @param suffix
   * @private
   */
  private addExtraFolderAssociations(assocName: string, folderNames: string[], suffix = '') {
    if (!folderNames) return;

    const folderAssocName = `${FOLDER_PREFIX}${assocName}${suffix}`;
    const folderOpenAssocName = `${FOLDER_PREFIX}${assocName}${OPENED_FOLDER_SUFFIX}${suffix}`;

    for (const folderName of folderNames) {
      // Folder
      if (!this.iconConfig.folderNames) {
        this.iconConfig.folderNames = {};
      }

      this.iconConfig.folderNames[folderName] = folderAssocName;
      this.iconConfig.folderNames[`.${folderName}`] = folderAssocName;
      this.iconConfig.folderNames[`_${folderName}`] = folderAssocName;

      // Open folder
      if (!this.iconConfig.folderNamesExpanded) {
        this.iconConfig.folderNamesExpanded = {};
      }

      this.iconConfig.folderNamesExpanded[folderName] = folderOpenAssocName;
      this.iconConfig.folderNamesExpanded[`.${folderName}`] = folderOpenAssocName;
      this.iconConfig.folderNamesExpanded[`_${folderName}`] = folderOpenAssocName;
    }
  }

  /**
   * Add the folder association to the config
   * @param {string} assocName
   * @param {string} suffix
   * @private
   */
  private addFolderAssociation(assocName: string, suffix = '') {
    if (!this.iconConfig.iconDefinitions) return;

    // First generates a hash to append to the icon if custom color, opacity or saturation
    const fileConfigHash = getFileConfigHash(this.atomConfig);

    // Add the folders and foldersExpanded icons
    this.iconConfig.iconDefinitions[`${FOLDER_PREFIX}${assocName}${suffix}`] = { // folder-<name>
      iconPath: `${RELATIVE_DIST_FOLDERS_FOLDER_PATH}/${assocName}${suffix}${fileConfigHash}.svg`,
    };
    this.iconConfig.iconDefinitions[`${FOLDER_PREFIX}${assocName}${OPENED_FOLDER_SUFFIX}${suffix}`] = { // folder-<name>-open
      iconPath: `${RELATIVE_DIST_FOLDERS_OPEN_FOLDER_PATH}/${assocName}${suffix}${fileConfigHash}.svg`,
    };
  }

  /**
   * Add the default folder icon association
   * @param folderTheme
   * @private
   */
  private loadDefaultFolderAssociation(folderTheme: FolderAssociations) {
    const assocName = folderTheme.defaultIcon.name;

    const defaultFolderIconName = FOLDER_PREFIX + assocName; // folder-<name>
    const defaultFolderIconExpandedName = FOLDER_PREFIX + assocName + OPENED_FOLDER_SUFFIX; // folder-<name>-open
    if (!defaultFolderIconName) return;

    // Add default icons
    this.addFolderAssociation(assocName);
    this.iconConfig.folder = defaultFolderIconName;
    this.iconConfig.folderExpanded = defaultFolderIconExpandedName;

    // Light support
    if (folderTheme.defaultIcon.light) {
      this.addFolderAssociation(assocName, DARK_FILE_ENDING);
      // Replace the default folder with the variant with the '_dark' suffix
      this.iconConfig.folder = defaultFolderIconName + DARK_FILE_ENDING;
      this.iconConfig.folderExpanded = defaultFolderIconExpandedName + DARK_FILE_ENDING;

      // Add the original icon to the light config
      if (!this.iconConfig.light) {
        this.iconConfig.light = {};
      }
      this.iconConfig.light.folder = defaultFolderIconName;
      this.iconConfig.light.folderExpanded = defaultFolderIconExpandedName;
    }

    // High contrast
    if (folderTheme.defaultIcon.highContrast) {
      this.addFolderAssociation(assocName, HIGH_CONTRAST_FILE_ENDING);

      // Add the original icon to the hc config
      if (!this.iconConfig.highContrast) {
        this.iconConfig.highContrast = {};
      }
      this.iconConfig.highContrast.folder = defaultFolderIconName + HIGH_CONTRAST_FILE_ENDING;
      this.iconConfig.highContrast.folderExpanded = defaultFolderIconExpandedName + HIGH_CONTRAST_FILE_ENDING;
    }
  }

  /**
   * Add the root folder icon association
   * @param folderTheme
   * @private
   */
  private loadRootFolderAssociation(folderTheme: FolderAssociations) {
    const rootFolderName = FOLDER_PREFIX + folderTheme.rootFolder?.name; // folder-<name>
    const rootFolderExpandedName = FOLDER_PREFIX + folderTheme.rootFolder?.name + OPENED_FOLDER_SUFFIX; // folder-<name>-open
    if (!rootFolderName) {
      this.iconConfig.rootFolder = this.iconConfig.folder;
      this.iconConfig.rootFolderExpanded = this.iconConfig.folderExpanded;
      return;
    }

    // todo check if those `addFolderAssociations` are needed
    // this.addFolderAssociation(config, rootFolderName);
    this.iconConfig.rootFolder = rootFolderName;
    this.iconConfig.rootFolderExpanded = rootFolderExpandedName;

    if (folderTheme.rootFolder?.light) {
      // this.addFolderAssociation(config, folderTheme.rootFolder?.name, DARK_FILE_ENDING);
      // Replace the default folder with the variant with the '_dark' suffix
      this.iconConfig.rootFolder = rootFolderName + DARK_FILE_ENDING;
      this.iconConfig.rootFolderExpanded = rootFolderExpandedName + DARK_FILE_ENDING;

      // Add the original icon to the light config
      if (!this.iconConfig.light) {
        this.iconConfig.light = {};
      }
      this.iconConfig.light.rootFolder = rootFolderName;
      this.iconConfig.light.rootFolderExpanded = rootFolderExpandedName;
    }

    if (folderTheme.rootFolder?.highContrast) {
      // this.addFolderAssociation(config, rootFolderName, HIGH_CONTRAST_FILE_ENDING);

      // Add the original icon to the hc config
      if (!this.iconConfig.highContrast) {
        this.iconConfig.highContrast = {};
      }
      this.iconConfig.highContrast.rootFolder = rootFolderName + HIGH_CONTRAST_FILE_ENDING;
      this.iconConfig.highContrast.rootFolderExpanded = rootFolderExpandedName + HIGH_CONTRAST_FILE_ENDING;
    }
  }
}
