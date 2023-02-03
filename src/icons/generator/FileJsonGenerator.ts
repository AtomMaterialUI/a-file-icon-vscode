import type { AtomConfig, IconPack } from 'src/@types/config';
import type { IconThemeGenerator } from 'src/icons/generator/IconThemeGenerator';
import type { IconConfiguration } from 'src/models/iconConfiguration';
import merge from 'lodash.merge';
import { fileIcons } from 'src/icons/index';
import type { FileAssociations, FileAssociation, IconAssociations } from 'src/@types/icons';
import {
  WILDCARD_PATTERN,
  FILES_FOLDER_PATH,
  DARK_FILE_ENDING,
  HIGH_CONTRAST_FILE_ENDING,
} from 'src/helpers/constants';
import { FileMappingType } from 'src/helpers/enums';

export class FileJsonGenerator {
  constructor(private readonly jsonGenerator: IconThemeGenerator) {}

  /**
   * Load the file icon definitions onto the icon configuration object.
   * @param config
   * @param {AtomConfig} options atom config
   * @returns {IconConfiguration} a new icon configuration object with the file icons loaded
   * @private
   */
  public loadFileIconAssociations(config: IconConfiguration, options: AtomConfig): void {
    // first, remove languages by pack
    const enabledAssociations = this.disableAssociationsByPack(fileIcons, options.activeIconPacks);

    // next, load custom file associations
    const customAssociations = this.getCustomAssociations(options.filesAssociations);
    const allFileAssociations = [...enabledAssociations, ...customAssociations];

    allFileAssociations.forEach((fileAssoc) => {
      if (fileAssoc.disabled) {
        return;
      }

      this.loadFileAssociation(config, fileAssoc);
    });

    // next, add the default file icon
    this.loadDefaultFileAssociation(config);
  }

  /**
   * Load a file association from the fileIcons.ts onto the config
   * @param {IconConfiguration} config the config to add onto
   * @param {FileAssociation} fileAssoc the association to parse and add
   * @private
   */
  private loadFileAssociation(config: IconConfiguration, fileAssoc: FileAssociation): void {
    const assocName = fileAssoc.name;
    // Add regular file association
    this.addFileAssociation(config, assocName);

    // add light variant if needed
    if (fileAssoc.light) {
      // todo check if it indeed works with light/dark
      config.light = merge({}, config.light);
      this.addFileAssociation(config.light, assocName, DARK_FILE_ENDING);
    }

    // add highContrast variant if needed
    if (fileAssoc.highContrast) {
      // todo check if it indeed works with highContrast
      config.highContrast = merge({}, config.highContrast);
      this.addFileAssociation(config.highContrast, assocName, HIGH_CONTRAST_FILE_ENDING);
    }

    // next, load the file extensions and file names
    this.mapIconsToAssociations(config, fileAssoc, FileMappingType.FileExtensions);
    this.mapIconsToAssociations(config, fileAssoc, FileMappingType.FileNames);
  }

  /**
   * Add a file association to the icon configuration
   * @param {IconConfiguration} config the config to populate
   * @param {string} assocName the association name
   * @param {string} suffix an optional suffix (dark, light, etc)
   * @private
   */
  private addFileAssociation(config: IconConfiguration, assocName: string, suffix = ''): void {
    if (!config.iconDefinitions) {
      return;
    }
    // First generates a hash to append to the icon if custom color, opacity or saturation
    const fileConfigHash = this.jsonGenerator.getFileConfigHash(config.options ?? {});

    // Then add the file association
    config.iconDefinitions[`${assocName}${suffix}`] = {
      iconPath: `${FILES_FOLDER_PATH}/${assocName}${suffix}${fileConfigHash}.svg`,
    };
  }

  /**
   * Disable file associations by icon pack
   * @param {FileAssociations} fileIcons
   * @param {IconPack[]} activeIconPacks
   * @private
   */
  private disableAssociationsByPack(fileIcons: FileAssociations, activeIconPacks: IconPack[]): FileAssociation[] {
    if (!fileIcons.icons) {
      return [];
    }

    return fileIcons.icons.filter((icon) => {
      if (!icon.enabledFor) {
        return true;
      }
      return icon.enabledFor.some((pack) => activeIconPacks.includes(pack));
    });
  }

  /**
   * Gets the user's custom file associations, with wildcards removed
   * @param {IconAssociations} fileAssociations
   * @returns {FileAssociation[]}
   * @private
   */
  private getCustomAssociations(fileAssociations?: IconAssociations): FileAssociation[] {
    if (!fileAssociations) {
      return [];
    }

    return Object.entries(fileAssociations).map(([key, value]) => ({
      name: key.toLowerCase(),
      icon: {
        name: value.toLowerCase(),
        fileNames: [key.toLowerCase()],
        fileExtensions: [key.toLowerCase().replace(WILDCARD_PATTERN, '')],
      },
    }));
  }

  /**
   * Map the icons to the file associations
   * @param {IconConfiguration} config
   * @param {FileAssociation} fileAssoc
   * @param {FileMappingType} FileExtensions
   * @private
   */
  private mapIconsToAssociations(
    config: IconConfiguration,
    fileAssoc: FileAssociation,
    FileExtensions: FileMappingType
  ): void {
    switch (FileExtensions) {
      case FileMappingType.FileExtensions:
        this.mapFileExtensions(config, fileAssoc);
        break;
      case FileMappingType.FileNames:
        this.mapFileNames(config, fileAssoc);
        break;
      default:
        break;
    }
  }

  /**
   * Map file extensions to their respective icons
   * @param config
   * @param {FileAssociation} fileAssoc
   * @private
   */
  private mapFileExtensions(config: IconConfiguration, fileAssoc: FileAssociation): void {
    // Make sure we have the file extensions...
    if (!fileAssoc.fileExtensions) {
      return;
    }

    fileAssoc.fileExtensions.forEach((fileExtension) => {
      // Skip the association if there is a custom assoc
      if (this.shouldOverwriteFileNames(config, fileExtension)) {
        return;
      }

      // First, add the file extension
      if (!config.fileExtensions) {
        config.fileExtensions = {};
      }
      config.fileExtensions[fileExtension] = fileAssoc.name;

      // Then add the light variant if needed
      if (fileAssoc.light) {
        if (!config.light) {
          config.light = {};
        }
        if (!config.light.fileExtensions) {
          config.light.fileExtensions = {};
        }

        // Replace the original extension to icon with the '_dark' suffix
        config.fileExtensions[fileExtension] = `${fileAssoc.name}${DARK_FILE_ENDING}`;
        // And add the light variant to the light config
        config.light.fileExtensions[fileExtension] = `${fileAssoc.name}${DARK_FILE_ENDING}`;
      }

      // Then add the highContrast variant if needed
      if (fileAssoc.highContrast) {
        if (!config.highContrast) {
          config.highContrast = {};
        }
        if (!config.highContrast.fileExtensions) {
          config.highContrast.fileExtensions = {};
        }

        // And add the highContrast variant to the highContrast config
        config.highContrast.fileExtensions[fileExtension] = `${fileAssoc.name}${HIGH_CONTRAST_FILE_ENDING}`;
      }
    });
  }

  /**
   * Map file extensions to their respective icons
   * @param config
   * @param {FileAssociation} fileAssoc
   * @private
   */
  private mapFileNames(config: IconConfiguration, fileAssoc: FileAssociation): void {
    // Make sure we have the file names...
    if (!fileAssoc.fileNames) {
      return;
    }

    fileAssoc.fileNames.forEach((fileName) => {
      // Skip the association if there is a custom assoc
      if (this.shouldOverwriteFileNames(config, fileName)) {
        return;
      }

      // First, add the file extension
      if (!config.fileNames) {
        config.fileNames = {};
      }
      config.fileNames[fileName] = fileAssoc.name;

      // Then add the light variant if needed
      if (fileAssoc.light) {
        if (!config.light) {
          config.light = {};
        }
        if (!config.light.fileNames) {
          config.light.fileNames = {};
        }

        // Replace the original extension to icon with the '_dark' suffix
        config.fileNames[fileName] = `${fileAssoc.name}${DARK_FILE_ENDING}`;
        // And add the light variant to the light config
        config.light.fileNames[fileName] = `${fileAssoc.name}${DARK_FILE_ENDING}`;
      }

      // Then add the highContrast variant if needed
      if (fileAssoc.highContrast) {
        if (!config.highContrast) {
          config.highContrast = {};
        }
        if (!config.highContrast.fileNames) {
          config.highContrast.fileNames = {};
        }

        // Replace the original extension to icon with the '_highContrast' suffix
        config.fileNames[fileName] = `${fileAssoc.name}${HIGH_CONTRAST_FILE_ENDING}`;
        // And add the highContrast variant to the highContrast config
        config.highContrast.fileNames[fileName] = `${fileAssoc.name}${HIGH_CONTRAST_FILE_ENDING}`;
      }
    });
  }

  /**
   * Add the default file association to the config
   * @param {IconConfiguration} config
   * @private
   */
  private loadDefaultFileAssociation(config: IconConfiguration): void {
    this.addFileAssociation(config, fileIcons.defaultIcon.name);
    config.file = fileIcons.defaultIcon.name;

    if (fileIcons.defaultIcon.light) {
      this.addFileAssociation(config, fileIcons.defaultIcon.name, DARK_FILE_ENDING);
      // Replace the default file with the variant with the '_dark' suffix
      config.file = fileIcons.defaultIcon.name + DARK_FILE_ENDING;

      // Add the original icon to the light config
      if (!config.light) {
        config.light = {};
      }
      config.light.file = fileIcons.defaultIcon.name;
    }

    if (fileIcons.defaultIcon.highContrast) {
      this.addFileAssociation(config, fileIcons.defaultIcon.name, HIGH_CONTRAST_FILE_ENDING);

      // Add the original icon to the hc config
      if (!config.highContrast) {
        config.highContrast = {};
      }
      config.highContrast.file = fileIcons.defaultIcon.name + HIGH_CONTRAST_FILE_ENDING;
    }
  }

  /**
   * Checks if the custom file associations should overwrite the defined file associations.
   * Only associations with two asterisks in the wildcard should be able to overwrite
   * @param {IconConfiguration} config
   * @param {string} extension
   * @returns {Boolean}
   * @private
   */
  private shouldOverwriteFileNames(config: IconConfiguration, extension: string): Boolean {
    const customFileAssociations = config.options?.filesAssociations ?? {};

    return Object.keys(customFileAssociations).some((key) => {
      // overwrite is enabled if there are two asterisks in the wildcard
      if (!/^\*{2}\./.test(key)) {
        return false;
      }

      // check if the file name contains the particular file extension
      // (e.g. extension ".md" in "Readme.md" should be overwritten with the *.md icon)
      const customFileExtension = key.replace(WILDCARD_PATTERN, '.');
      return extension.toLowerCase().indexOf(customFileExtension.toLowerCase()) > -1;
    });
  }
}
