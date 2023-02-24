import { readdir } from 'node:fs';
import { join, parse } from 'node:path';
import { DARK_FILE_ENDING, HIGH_CONTRAST_FILE_ENDING, OPENED_FOLDER_SUFFIX } from 'src/helpers/constants';

import { fileIcons, folderIcons, languageIcons } from './../../../icons';
import { green, red } from './../../helpers/painter';

import type { DefaultIcon, FolderIcon } from 'src/@types/iconTypes';
import type { FolderAssociations } from 'src/@types/associations';

/**
 * Defines the folder where all icon files are located.
 */
const folderPath = join('icons');

/**
 * Defines an array with all icons that can be found in the file system.
 */
const availableIcons: Record<string, string> = {};

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

  checkUsageOfAllIcons();
  handleErrors();
};

const checkUsageOfAllIcons = () => {
  const usedFileIcons: string[] = getAllUsedFileIcons();
  const usedFolderIcons: string[] = getAllUsedFolderIcons();
  const usedLanguageIcons: string[] = getAllUsedLanguageIcons();

  for (const icon of [...usedFileIcons, ...usedFolderIcons, ...usedLanguageIcons]) {
    delete availableIcons[icon];
  }
};

const handleErrors = () => {
  const amountOfUnusedIcons = Object.keys(availableIcons).length;
  if (amountOfUnusedIcons === 0) {
    console.log('> Atom Material Icons:', green('Passed icon usage checks!'));
  }
  else {
    console.log('> Atom Material Icons: ' + red(`${amountOfUnusedIcons} unused icon(s):`));
    for (const icon of Object.keys(availableIcons)) {
      console.log(red(`- ${availableIcons[icon]}`));
    }
    throw new Error('Found unused icon files!');
  }
};

// read from the file system

const getAllUsedFileIcons = (): string[] => {
  return [
    fileIcons.defaultIcon.name,
    fileIcons.defaultIcon.light ? fileIcons.defaultIcon.name + DARK_FILE_ENDING : '',
    fileIcons.defaultIcon.highContrast ? fileIcons.defaultIcon.name + HIGH_CONTRAST_FILE_ENDING : '',
    ...fileIcons.icons.map((icon) => icon.name),
    ...fileIcons.icons.filter((icon) => icon.light).map((icon) => icon.name + DARK_FILE_ENDING),
    ...fileIcons.icons.filter((icon) => icon.highContrast).map((icon) => icon.name + HIGH_CONTRAST_FILE_ENDING),
  ].filter((f) => f !== '');
};

const getAllUsedFolderIcons = (): string[] => {
  const icons = folderIcons
    .map((theme) => (theme.name === 'none' ? [] : getAllFolderIcons(theme)))
    .reduce((a, b) => [...a, ...b]);
  return icons
    .map((icon) => {
      return [
        icon.name,
        icon.name + OPENED_FOLDER_SUFFIX,
        icon.light ? icon.name + DARK_FILE_ENDING : '',
        icon.light ? icon.name + OPENED_FOLDER_SUFFIX + DARK_FILE_ENDING : '',
        icon.highContrast ? icon.name + HIGH_CONTRAST_FILE_ENDING : '',
        icon.highContrast ? icon.name + OPENED_FOLDER_SUFFIX + HIGH_CONTRAST_FILE_ENDING : '',
      ];
    })
    .filter((icon) => icon !== undefined)
    .reduce((a, b) => [...a, ...b]);
};

const getAllFolderIcons = (theme: FolderAssociations): Array<DefaultIcon | FolderIcon> => {
  const icons = theme.icons || [];
  const allFolderIcons = [theme.defaultIcon, ...icons];
  if (theme.rootFolder) {
    allFolderIcons.push(theme.rootFolder);
  }
  return allFolderIcons;
};

const getAllUsedLanguageIcons = (): string[] => {
  return [
    ...languageIcons.map((lang) => lang.icon.name),
    ...languageIcons.filter((lang) => lang.icon.light).map((lang) => lang.icon.name + DARK_FILE_ENDING),
    ...languageIcons
      .filter((lang) => lang.icon.highContrast)
      .map((lang) => lang.icon.name + HIGH_CONTRAST_FILE_ENDING),
  ];
};

export const checkIconUsage = () => readdir(folderPath, fsReadAllIconFiles);
