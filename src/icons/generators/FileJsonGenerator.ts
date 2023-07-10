import merge from 'lodash.merge';
import { FileMappingType } from 'src/@types/config';
import {
  DARK_FILE_ENDING,
  HIGH_CONTRAST_FILE_ENDING,
  RELATIVE_DIST_FILES_FOLDER_PATH,
  WILDCARD_PATTERN,
} from 'src/helpers/constants';
import { getFileConfigHash } from 'src/icons/configUtils';
import { AbstractJsonGenerator } from 'src/icons/generators/AbstractJsonGenerator';
import { fileIcons } from 'src/icons/index';

import type { AtomConfig } from 'src/@types/config';
import type { FileAssociation, FileAssociations } from 'src/@types/associations';
import type { IconConfiguration } from 'src/models/IconConfiguration';

export class FileJsonGenerator extends AbstractJsonGenerator {
  constructor(override readonly atomConfig: AtomConfig, override readonly iconConfig: IconConfiguration) {
    super(atomConfig, iconConfig);
  }

  /**
   * Load the file icon definitions onto the icon configuration object.
   * @private
   */
  public loadFileIconAssociations() {
    // first, remove languages by pack
    const enabledAssociations = this.disableAssociationsByPack(fileIcons);

    // next, load custom file associations
    const customAssociations = this.getCustomAssociations();
    const allFileAssociations = [...enabledAssociations, ...customAssociations];

    for (const fileAssoc of allFileAssociations) {
      if (fileAssoc.disabled) continue;

      this.loadFileAssociation(fileAssoc);
    }

    // next, add the default file icon
    this.loadDefaultFileAssociation();
  }

  /**
   * Load a file association from the fileIcons.ts onto the config
   * @param {FileAssociation} fileAssoc the association to parse and add
   * @private
   */
  private loadFileAssociation(fileAssoc: FileAssociation): void {
    const assocName = fileAssoc.name;
    // Add regular file association
    this.addFileAssociation(assocName);

    // add light variant if needed
    if (fileAssoc.light) {
      // todo check if it indeed works with light/dark
      this.iconConfig.light = merge({}, this.iconConfig.light);
      this.addFileAssociation(assocName, DARK_FILE_ENDING);
    }

    // add highContrast variant if needed
    if (fileAssoc.highContrast) {
      // todo check if it indeed works with highContrast
      this.iconConfig.highContrast = merge({}, this.iconConfig.highContrast);
      this.addFileAssociation(assocName, HIGH_CONTRAST_FILE_ENDING);
    }

    // next, load the file extensions and file names
    this.mapIconsToAssociations(fileAssoc, FileMappingType.FileExtensions);
    this.mapIconsToAssociations(fileAssoc, FileMappingType.FileNames);
  }

  /**
   * Add a file association to the icon configuration
   * @param {string} assocName the association name
   * @param {string} suffix an optional suffix (dark, light, etc)
   * @private
   */
  private addFileAssociation(assocName: string, suffix = ''): void {
    if (!this.iconConfig.iconDefinitions) return;

    // First generates a hash to append to the icon if custom color, opacity or saturation
    const fileConfigHash = getFileConfigHash(this.atomConfig);

    // Then add the file association
    this.iconConfig.iconDefinitions[`${assocName}${suffix}`] = {
      iconPath: `${RELATIVE_DIST_FILES_FOLDER_PATH}/${assocName}${suffix}${fileConfigHash}.svg`,
    };
  }

  /**
   * Disable file associations by icon pack
   * @param {FileAssociations} fileIcons
   * @private
   */
  private disableAssociationsByPack(fileIcons: FileAssociations): FileAssociation[] {
    if (!fileIcons.icons) return [];

    return fileIcons.icons.filter((icon) => {
      if (!icon.enabledFor) return true;

      return icon.enabledFor.some((pack) => this.atomConfig.activeIconPacks.includes(pack));
    });
  }

  /**
   * Gets the user's custom file associations, with wildcards removed
   * @returns {FileAssociation[]}
   * @private
   */
  private getCustomAssociations(): FileAssociation[] {
    const fileAssociations = this.atomConfig.filesAssociations;
    if (!fileAssociations) return [];

    return Object.entries(fileAssociations).map(([key, value]) => ({
      icon: {
        fileExtensions: [key.toLowerCase().replace(WILDCARD_PATTERN, '')],
        fileNames: [key.toLowerCase()],
        name: value.toLowerCase(),
      },
      name: key.toLowerCase(),
    }));
  }

  /**
   * Map the icons to the file associations
   * @param {FileAssociation} fileAssoc
   * @param {FileMappingType} FileExtensions
   * @private
   */
  private mapIconsToAssociations(fileAssoc: FileAssociation, FileExtensions: FileMappingType) {
    switch (FileExtensions) {
      case FileMappingType.FileExtensions: {
        this.mapFileExtensions(fileAssoc);
        break;
      }
      case FileMappingType.FileNames: {
        this.mapFileNames(fileAssoc);
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Map file extensions to their respective icons
   * @param {FileAssociation} fileAssoc
   * @private
   */
  private mapFileExtensions(fileAssoc: FileAssociation): void {
    // Make sure we have the file extensions...
    if (!fileAssoc.fileExtensions) return;

    for (const fileExtension of fileAssoc.fileExtensions) {
      // Skip the association if there is a custom assoc
      if (this.shouldOverwriteFileNames(fileExtension)) continue;

      // First, add the file extension
      if (!this.iconConfig.fileExtensions) {
        this.iconConfig.fileExtensions = {};
      }
      this.iconConfig.fileExtensions[fileExtension] = fileAssoc.name;

      // Then add the light variant if needed
      if (fileAssoc.light) {
        if (!this.iconConfig.light) {
          this.iconConfig.light = {};
        }
        if (!this.iconConfig.light.fileExtensions) {
          this.iconConfig.light.fileExtensions = {};
        }

        // Replace the original extension to icon with the '_dark' suffix
        this.iconConfig.fileExtensions[fileExtension] = `${fileAssoc.name}${DARK_FILE_ENDING}`;
        // And add the light variant to the light config
        this.iconConfig.light.fileExtensions[fileExtension] = `${fileAssoc.name}${DARK_FILE_ENDING}`;
      }

      // Then add the highContrast variant if needed
      if (fileAssoc.highContrast) {
        if (!this.iconConfig.highContrast) {
          this.iconConfig.highContrast = {};
        }
        if (!this.iconConfig.highContrast.fileExtensions) {
          this.iconConfig.highContrast.fileExtensions = {};
        }

        // And add the highContrast variant to the highContrast config
        this.iconConfig.highContrast.fileExtensions[fileExtension] = `${fileAssoc.name}${HIGH_CONTRAST_FILE_ENDING}`;
      }
    }
  }

  /**
   * Map file extensions to their respective icons
   * @param {FileAssociation} fileAssoc
   * @private
   */
  private mapFileNames(fileAssoc: FileAssociation): void {
    // Make sure we have the file names...
    if (!fileAssoc.fileNames) return;

    for (const fileName of fileAssoc.fileNames) {
      // Skip the association if there is a custom assoc
      if (this.shouldOverwriteFileNames(fileName)) continue;

      // First, add the file extension
      if (!this.iconConfig.fileNames) {
        this.iconConfig.fileNames = {};
      }
      this.iconConfig.fileNames[fileName] = fileAssoc.name;

      // Then add the light variant if needed
      if (fileAssoc.light) {
        if (!this.iconConfig.light) {
          this.iconConfig.light = {};
        }
        if (!this.iconConfig.light.fileNames) {
          this.iconConfig.light.fileNames = {};
        }

        // Replace the original extension to icon with the '_dark' suffix
        this.iconConfig.fileNames[fileName] = `${fileAssoc.name}${DARK_FILE_ENDING}`;
        // And add the light variant to the light config
        this.iconConfig.light.fileNames[fileName] = `${fileAssoc.name}${DARK_FILE_ENDING}`;
      }

      // Then add the highContrast variant if needed
      if (fileAssoc.highContrast) {
        if (!this.iconConfig.highContrast) {
          this.iconConfig.highContrast = {};
        }
        if (!this.iconConfig.highContrast.fileNames) {
          this.iconConfig.highContrast.fileNames = {};
        }

        // Replace the original extension to icon with the '_highContrast' suffix
        this.iconConfig.fileNames[fileName] = `${fileAssoc.name}${HIGH_CONTRAST_FILE_ENDING}`;
        // And add the highContrast variant to the highContrast config
        this.iconConfig.highContrast.fileNames[fileName] = `${fileAssoc.name}${HIGH_CONTRAST_FILE_ENDING}`;
      }
    }
  }

  /**
   * Add the default file association to the config
   * @private
   */
  private loadDefaultFileAssociation() {
    this.addFileAssociation(fileIcons.defaultIcon.name);
    this.iconConfig.file = fileIcons.defaultIcon.name;

    if (fileIcons.defaultIcon.light) {
      this.addFileAssociation(fileIcons.defaultIcon.name, DARK_FILE_ENDING);
      // Replace the default file with the variant with the '_dark' suffix
      this.iconConfig.file = fileIcons.defaultIcon.name + DARK_FILE_ENDING;

      // Add the original icon to the light config
      if (!this.iconConfig.light) {
        this.iconConfig.light = {};
      }
      this.iconConfig.light.file = fileIcons.defaultIcon.name;
    }

    if (fileIcons.defaultIcon.highContrast) {
      this.addFileAssociation(fileIcons.defaultIcon.name, HIGH_CONTRAST_FILE_ENDING);

      // Add the original icon to the hc config
      if (!this.iconConfig.highContrast) {
        this.iconConfig.highContrast = {};
      }
      this.iconConfig.highContrast.file = fileIcons.defaultIcon.name + HIGH_CONTRAST_FILE_ENDING;
    }
  }

  /**
   * Checks if the custom file associations should overwrite the defined file associations.
   * Only associations with two asterisks in the wildcard should be able to overwrite
   * @param {string} extension
   * @returns {Boolean}
   * @private
   */
  private shouldOverwriteFileNames(extension: string): boolean {
    const customFileAssociations = this.iconConfig.atomConfig?.filesAssociations ?? {};

    return Object.keys(customFileAssociations).some((key) => {
      // overwrite is enabled if there are two asterisks in the wildcard
      if (!/^\*{2}\./.test(key)) {
        return false;
      }

      // check if the file name contains the particular file extension
      // (e.g. extension ".md" in "Readme.md" should be overwritten with the *.md icon)
      const customFileExtension = key.replace(WILDCARD_PATTERN, '.');
      return extension.toLowerCase().includes(customFileExtension.toLowerCase());
    });
  }
}
