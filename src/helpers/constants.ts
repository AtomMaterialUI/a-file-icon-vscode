import { path } from 'app-root-path';

export const ICON_THEME_KEY = 'workbench.iconTheme';
export const EXTENSION_KEY = 'a-file-icon-vscode';
export const PUBLISHER_ID = 'atommaterial';
export const EXTENSION_ID = `${PUBLISHER_ID}.${EXTENSION_KEY}`;
export const VERSION_KEY = `${EXTENSION_KEY}.version`;

export const DEFAULT_FOLDER_COLOR = '#90a4ae';
export const DEFAULT_OPACITY = 0.5;
export const DEFAULT_SATURATION = 0.5;

export const FULLICON_FOLDER_PATH = `${path}/iconGenerator/assets/icons`;
export const FULL_FILES_FOLDER_PATH = `${FULLICON_FOLDER_PATH}/files`;
export const FULL_FOLDERS_FOLDER_PATH = `${FULLICON_FOLDER_PATH}/folders`;
export const FULL_FOLDERS_OPEN_FOLDER_PATH = `${FULLICON_FOLDER_PATH}/foldersOpen`;

export const ICON_FOLDER_PATH = `./../iconGenerator/assets/icons`;
export const FILES_FOLDER_PATH = `${ICON_FOLDER_PATH}/files`;
export const FOLDERS_FOLDER_PATH = `${ICON_FOLDER_PATH}/folders`;
export const FOLDERS_OPEN_FOLDER_PATH = `${ICON_FOLDER_PATH}/foldersOpen`;

export const DIST_PATH = `${path}/dist`;
export const DIST_FILES_FOLDER_PATH = `${DIST_PATH}/files`;
export const DIST_FOLDERS_FOLDER_PATH = `${DIST_PATH}/folders`;
export const DIST_FOLDERS_OPEN_FOLDER_PATH = `${DIST_PATH}/foldersOpen`;

export const RELATIVE_DIST = `./../dist`;
export const RELATIVE_DIST_FILES_FOLDER_PATH = `${RELATIVE_DIST}/files`;
export const RELATIVE_DIST_FOLDERS_FOLDER_PATH = `${RELATIVE_DIST}/folders`;
export const RELATIVE_DIST_FOLDERS_OPEN_FOLDER_PATH = `${RELATIVE_DIST}/foldersOpen`;

export const DARK_FILE_ENDING = '_dark';
export const HIGH_CONTRAST_FILE_ENDING = '_highContrast';
export const WILDCARD_PATTERN = new RegExp(/^\*{1,2}\./);
export const OPENED_FOLDER_SUFFIX = '-open';
