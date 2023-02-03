import { path } from 'app-root-path';

export const ICON_THEME_KEY = 'workbench.iconTheme';
export const EXTENSION_KEY = 'a-file-icon-vscode';
export const PUBLISHER_ID = 'atommaterial';
export const EXTENSION_ID = `${PUBLISHER_ID}.${EXTENSION_KEY}`;
export const VERSION_KEY = `${EXTENSION_KEY}.version`;
export const DEFAULT_FOLDER_COLOR = '#90a4ae';
export const FULLICON_FOLDER_PATH = `${path}/iconGenerator/assets/icons`;
export const ICON_FOLDER_PATH = `./../iconGenerator/assets/icons`;
export const FILES_FOLDER_PATH = `${ICON_FOLDER_PATH}/files`;
export const FOLDERS_FOLDER_PATH = `${ICON_FOLDER_PATH}/folders`;
export const FOLDERS_OPEN_FOLDER_PATH = `${ICON_FOLDER_PATH}/foldersOpen`;
export const DARK_FILE_ENDING = '_dark';
export const HIGH_CONTRAST_FILE_ENDING = '_highContrast';
export const WILDCARD_PATTERN = new RegExp(/^\*{1,2}\./);
export const OPENED_FOLDER_SUFFIX = '-open';
