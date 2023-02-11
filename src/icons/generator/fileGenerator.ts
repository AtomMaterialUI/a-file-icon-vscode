import merge                                                                               from 'lodash.merge';
import {
  getFileConfigHash,
}                                                                                          from '../../helpers/fileConfig';
import type { FileIcon, FileIcons, IconAssociations, IconJsonOptions }                     from '../../models/index';
import { IconConfiguration }                                                               from '../../models/index';
import { DARK_FILE_ENDING, HIGH_CONTRAST_FILE_ENDING, WILDCARD_PATTERN, ICON_FOLDER_PATH } from 'src/helpers/constants';

/**
 * Get all file icons that can be used in this theme.
 */
export const loadFileIconDefinitions = (
  fileIcons_: FileIcons[],
  config: IconConfiguration,
  options: IconJsonOptions,
): IconConfiguration => {
  config = merge({}, config);
  const fileIcons = fileIcons_[0];
  const enabledIcons = disableIconsByPack(fileIcons, options.activeIconPack ?? '');
  const customIcons = getCustomIcons(options.files?.associations);
  const allFileIcons = [...enabledIcons, ...customIcons];

  allFileIcons.forEach((icon) => {
    if (icon.disabled) {
      return;
    }
    config = merge({}, config, setIconDefinition(config, icon.name));

    if (icon.light) {
      config = merge({}, config, setIconDefinition(config, icon.name, DARK_FILE_ENDING));
    }
    if (icon.highContrast) {
      config = merge({}, config, setIconDefinition(config, icon.name, HIGH_CONTRAST_FILE_ENDING));
    }

    if (icon.fileExtensions) {
      config = merge({}, config, mapSpecificFileIcons(icon, FileMappingType.FileExtensions));
    }
    if (icon.fileNames) {
      config = merge({}, config, mapSpecificFileIcons(icon, FileMappingType.FileNames, options.files?.associations));
    }
  });

  // set default file icon
  config = merge({}, config, setIconDefinition(config, fileIcons.defaultIcon.name));
  config.file = fileIcons.defaultIcon.name;

  if (fileIcons.defaultIcon.light && config.light) {
    config = merge({}, config, setIconDefinition(config, fileIcons.defaultIcon.name, DARK_FILE_ENDING));
    if (config.light) {
      config.file = fileIcons.defaultIcon.name + DARK_FILE_ENDING;
      config.light.file = fileIcons.defaultIcon.name;
    }
  }

  if (fileIcons.defaultIcon.highContrast) {
    config = merge({}, config, setIconDefinition(config, fileIcons.defaultIcon.name, HIGH_CONTRAST_FILE_ENDING));
    if (config.highContrast) {
      config.highContrast.file = fileIcons.defaultIcon.name + HIGH_CONTRAST_FILE_ENDING;
    }
  }

  return config;
};

/**
 * Map the file extensions and the filenames to the related icons.
 */
const mapSpecificFileIcons = (
  icon: FileIcon,
  mappingType: FileMappingType,
  customFileAssociation: IconAssociations = {},
) => {
  const config = new IconConfiguration();
  const iconMappingType = icon[mappingType as keyof FileIcon] as string[];
  if (iconMappingType === undefined) {
    return;
  }
  iconMappingType.forEach((name) => {
    // if the custom file extension should also overwrite the file names
    const shouldOverwriteFileNames = Object.keys(customFileAssociation).some((key) => {
      // overwrite is enabled if there are two asterisks in the wildcard
      if (!/^\*{2}\./.test(key)) {
        return false;
      }
      const fileExtension = key.replace(WILDCARD_PATTERN, '.');

      // check if the file name contains the particular file extension
      // (e.g. extension ".md" in "Readme.md" -> then overwrite it with the *.md icon)
      return name.toLowerCase().indexOf(fileExtension.toLowerCase()) !== -1;
    });

    // if overwrite is enabled then do not continue to set the icons for file names containing the file extension
    const configMappingType = config[mappingType];
    const configLightMappingType = config.light?.[mappingType];
    const configHighContrastMappingType = config.highContrast?.[mappingType];

    if (shouldOverwriteFileNames || !configMappingType || !configLightMappingType || !configHighContrastMappingType) {
      return;
    }

    configMappingType[name] = icon.name;
    if (icon.light) {
      configMappingType[name] = `${icon.name}${DARK_FILE_ENDING}`;
      configLightMappingType[name] = `${icon.name}`;
    }
    if (icon.highContrast) {
      configHighContrastMappingType[name] = `${icon.name}${HIGH_CONTRAST_FILE_ENDING}`;
    }
  });
  return config;
};

/**
 * Disable all file icons that are in a pack which is disabled.
 */
const disableIconsByPack = (fileIcons: FileIcons, activatedIconPack: string): FileIcon[] => {
  return fileIcons.icons.filter((icon) => {
    return !icon.enabledFor ? true : icon.enabledFor.some((p) => p === activatedIconPack);
  });
};

const setIconDefinition = (config: IconConfiguration, iconName: string, appendix = '') => {
  const obj: Partial<IconConfiguration> = { iconDefinitions: {} };
  if (config.atomConfig) {
    const fileConfigHash = getFileConfigHash(config.atomConfig);
    obj.iconDefinitions![`${iconName}${appendix}`] = {
      iconPath: `${ICON_FOLDER_PATH}/files/${iconName}${appendix}${fileConfigHash}.svg`,
    };
  }
  return obj;
};

const getCustomIcons = (fileAssociations: IconAssociations | undefined) => {
  if (!fileAssociations) {
    return [];
  }

  const icons: FileIcon[] = Object.keys(fileAssociations).map((fa) => {
    const icon: Partial<FileIcon> = {
      name: fileAssociations[fa].toLowerCase(),
    };
    if (WILDCARD_PATTERN.test(fa)) {
      icon.fileExtensions = [fa.toLowerCase().replace(WILDCARD_PATTERN, '')];
    }
    else {
      icon.fileNames = [fa.toLowerCase()];
    }
    return icon as FileIcon;
  });
  return icons;
};

const enum FileMappingType {
  FileExtensions = 'fileExtensions',
  FileNames      = 'fileNames',
}
