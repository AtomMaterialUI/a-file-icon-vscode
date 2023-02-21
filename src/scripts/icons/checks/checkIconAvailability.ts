import { readdir } from 'node:fs';
import { join, parse } from 'node:path';
import { DARK_FILE_ENDING, HIGH_CONTRAST_FILE_ENDING, OPENED_FOLDER_SUFFIX } from 'src/helpers/constants';
import { similarity } from 'src/helpers/utils';


import { green, red } from '../../helpers/painter';
import { fileIcons, folderIcons, languageIcons } from './../../../icons';

import type { DefaultIcon, FileIcon, FolderIcon } from '../../../models/index';
import type { FolderAssociations } from 'src/@types/icons';

/**
 * Defines the folder where all icon files are located.
 */
const folderPath = join('iconGenerator', 'assets', 'icons');

/**
 * Defines an array with all icons that can be found in the file system.
 */
const availableIcons: Record<string, string> = {};

/**
 * Save the misconfigured icons.
 */
const wrongIconNames: Record<string, string[]> = {
  fileIcons: [],
  folderIcons: [],
  languageIcons: [],
};

/**
 * Get all icon file names from the file system.
 */
const fsReadAllIconFiles = (error: NodeJS.ErrnoException | null, files: string[]) => {
  if (error) {
    throw new Error(error.message);
  }

  for (const file of files) {
    const fileName = file;
    const iconName = parse(file).name;
    availableIcons[iconName] = fileName;
  }

  // check icon configurations
  checkFileIcons();
  checkFolderIcons();
  checkLanguageIcons();

  // show error messages
  handleErrors();
};

/**
 * Check if the file icons from the configuration are available on the file system.
 */
const checkFileIcons = () => {
  for (const icon of [...fileIcons.icons, fileIcons.defaultIcon]) {
    isIconAvailable(icon, IconType.fileIcons, IconColor.default);
    isIconAvailable(icon, IconType.fileIcons, IconColor.light);
    isIconAvailable(icon, IconType.fileIcons, IconColor.highContrast);
  }
};

const isIconAvailable = (
  icon: DefaultIcon | FileIcon | FolderIcon,
  iconType: IconType,
  iconColor: IconColor,
  hasOpenedFolder?: boolean,
) => {
  let iconName = `${icon.name}${hasOpenedFolder ? OPENED_FOLDER_SUFFIX : ''}`;
  if (icon.light && iconColor === IconColor.light) {
    iconName += DARK_FILE_ENDING;
  }
  if (icon.highContrast && iconColor === IconColor.highContrast) {
    iconName += HIGH_CONTRAST_FILE_ENDING;
  }

  if (!availableIcons[iconName] && !wrongIconNames[iconType].includes(iconName)) {
    wrongIconNames[iconType].push(iconName);
  }
};

/**
 * Check if the folder icons from the configuration are available on the file system.
 */
const checkFolderIcons = () => {
  for (const icon of folderIcons
    .map((theme) => (theme.name === 'none' ? [] : getAllFolderIcons(theme)))
    .reduce((a, b) => [...a, ...b])) {
    if (icon) {
      isIconAvailable(icon, IconType.folderIcons, IconColor.default);
      isIconAvailable(icon, IconType.folderIcons, IconColor.default, true);
      isIconAvailable(icon, IconType.folderIcons, IconColor.light);
      isIconAvailable(icon, IconType.folderIcons, IconColor.light, true);
      isIconAvailable(icon, IconType.folderIcons, IconColor.highContrast);
      isIconAvailable(icon, IconType.folderIcons, IconColor.highContrast, true);
    }
  }
};

const getAllFolderIcons = (theme: FolderAssociations) => {
  const icons = theme.icons ?? [];
  return [theme.defaultIcon, theme.rootFolder, ...icons].filter((icon) => icon !== undefined); // filter undefined root folder icons
};

/**
 * Check if the language icons from the configuration are available on the file system.
 */
const checkLanguageIcons = () => {
  for (const lang of languageIcons) {
    const icon = lang.icon;
    isIconAvailable(icon, IconType.languageIcons, IconColor.default);
    isIconAvailable(icon, IconType.languageIcons, IconColor.light);
    isIconAvailable(icon, IconType.languageIcons, IconColor.highContrast);
  }
};

/**
 * Show error messages in the terminal.
 */
const handleErrors = () => {
  const amountOfErrors =
          wrongIconNames.fileIcons.length + wrongIconNames.folderIcons.length + wrongIconNames.languageIcons.length;
  if (amountOfErrors > 0) {
    console.log('> Atom Material Icons:', red(`Found ${amountOfErrors} error(s) in the icon configuration!`));
  }
  else {
    console.log('> Atom Material Icons:', green('Passed icon availability checks!'));
  }
  logIconInformation(wrongIconNames.fileIcons, 'File icons');
  logIconInformation(wrongIconNames.folderIcons, 'Folder icons');
  logIconInformation(wrongIconNames.languageIcons, 'Language icons');

  if (amountOfErrors > 0) {
    throw new Error('Found some wrong file definitions in the icon configuration.');
  }
};

const logIconInformation = (wrongIcons: string[], title: string) => {
  if (wrongIcons.length === 0) {
    return;
  }
  console.log(`\n${title}:\n--------------------------------`);
  for (const icon of wrongIcons) {
    const suggestion = Object.keys(availableIcons).find((i) => {
      return similarity(icon, i) > 0.75;
    });
    const suggestionString = suggestion ? ` (Did you mean ${green(suggestion)}?)` : '';
    const isWrongLightVersion = icon.endsWith(DARK_FILE_ENDING);
    const isWrongLightVersionString = isWrongLightVersion
      ? ` (There is no light icon for ${green(icon.slice(0, -6))}! Set the light option to false!)`
      : '';
    const isWrongHighContrastVersion = icon.endsWith(HIGH_CONTRAST_FILE_ENDING);
    const isWrongHighContrastVersionString = isWrongHighContrastVersion
      ? ` (There is no high contrast icon for ${green(icon.slice(0, -13))}! Set the highContrast option to false!)`
      : '';
    console.log(
      red(`Icon not found: ${icon}.svg`) +
      `${suggestionString}${isWrongLightVersionString}${isWrongHighContrastVersionString}`,
    );
  }
};

enum IconType {
  fileIcons     = 'fileIcons',
  folderIcons   = 'folderIcons',
  languageIcons = 'languageIcons',
}

enum IconColor {
  default      = 'default',
  light        = 'light',
  highContrast = 'highContrast',
}

// read from the file system
export const checkIconAvailability = () => readdir(folderPath, fsReadAllIconFiles);
