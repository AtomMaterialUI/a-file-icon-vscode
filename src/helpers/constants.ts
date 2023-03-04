export const ICON_THEME_KEY = 'workbench.iconTheme';
export const EXTENSION_KEY = 'a-file-icon-vscode';
export const PUBLISHER_ID = 'atommaterial';
export const FONT_NAME = `${EXTENSION_KEY}.woff`;
export const EXTENSION_ID = `${PUBLISHER_ID}.${EXTENSION_KEY}`;
export const VERSION_KEY = `${EXTENSION_KEY}.version`;
export const JSON_FILE_NAME = `${EXTENSION_KEY}-icon-theme.json`;
export const JSON_PRODUCT_FILE_NAME = `${EXTENSION_KEY}-product-icon-theme.json`;

export const DEFAULT_FOLDER_COLOR = '#90a4ae';
export const DEFAULT_OPACITY = 1;
export const DEFAULT_SATURATION = 1;

export const FOLDER_PREFIX = 'folder-';
export const ICON_GENERATOR_PATH = 'iconGenerator/assets/icons';
export const FILES_SUBPATH = 'files';
export const FOLDERS_SUBPATH = 'folders';
export const FOLDERS_OPEN_SUBPATH = 'foldersOpen';
export const DIST_PATH = 'dist';

export const getFilesPath = (prefix: string) => `${prefix}/${FILES_SUBPATH}`;
export const getFoldersPath = (prefix: string) => `${prefix}/${FOLDERS_SUBPATH}`;
export const getFoldersOpenPath = (prefix: string) => `${prefix}/${FOLDERS_OPEN_SUBPATH}`;

export const ICON_FOLDER_PATH = `./../iconGenerator/assets/icons`;
export const FILES_FOLDER_PATH = getFilesPath(ICON_FOLDER_PATH);
export const FOLDERS_FOLDER_PATH = getFoldersPath(ICON_FOLDER_PATH);
export const FOLDERS_OPEN_FOLDER_PATH = getFoldersOpenPath(ICON_FOLDER_PATH);

export const RELATIVE_DIST = `./../dist`;
export const RELATIVE_DIST_FILES_FOLDER_PATH = getFilesPath(RELATIVE_DIST);
export const RELATIVE_DIST_FOLDERS_FOLDER_PATH = getFoldersPath(RELATIVE_DIST);
export const RELATIVE_DIST_FOLDERS_OPEN_FOLDER_PATH = getFoldersOpenPath(RELATIVE_DIST);

export const DARK_FILE_ENDING = '_dark';
export const HIGH_CONTRAST_FILE_ENDING = '_highContrast';
export const WILDCARD_PATTERN = new RegExp(/^\*{1,2}\./);
export const OPENED_FOLDER_SUFFIX = '-open';
