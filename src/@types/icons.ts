import type { IconPack } from './config';

/**
 * Represents a file association. A file association can have a list of
 * file extensions, file names and settings such as whether it has a light variant,
 * a high contrast variant, an icon pack, or should be disabled by the user
 */
type BasicFileAssociation = {
  /**
   * Name of the icon, e.g. 'javascript'
   */
  name: string;

  /**
   * Define if there is a light icon available.
   */
  light?: boolean;

  /**
   * Define if there is a high contrast icon available.
   */
  highContrast?: boolean;

  /**
   * Define if the icon should be disabled.
   */
  disabled?: boolean;

  /**
   * Defines a pack to which this icon belongs. A pack can be toggled and all icons inside this pack can be enabled or disabled together.
   */
  enabledFor?: IconPack[];
}
/**
 * Type for the default icon.
 */
export type DefaultIconAssociation = {
  /**
   * Name of the icon, e.g. 'src'
   */
  name: string;

  /**
   * Define if there is a light icon available.
   */
  light?: boolean;

  /**
   * Define if there is a high contrast icon available.
   */
  highContrast?: boolean;
}

/**
 * Type for a FileIcon. In addition to the `name` property, either a `fileExtensions` or `fileNames` property is required.
 */
export type FileAssociation = BasicFileAssociation & {
  /**
   * Define the file extensions that should use this icon.
   * E.g. ['js']
   */
  fileExtensions?: string[];

  /**
   * Define if there are some static file names that should apply this icon.
   * E.g. ['sample.js']
   */
  fileNames?: string[];
}

/**
 * Represents a folder assocaition. Likewise, a folder assoc can only have a list
 * of folder names, but as well as file associations, it can have a light variant,
 * a high contrast variant, an icon pack, or should be disabled by the user
 */
export type FolderAssociation = BasicFileAssociation & {
  /**
   * Define the folder names that should apply the icon.
   * E.g. ['src', 'source']
   */
  folderNames: string[];
}

/**
 * Represents a language association. Like file associations, a language association
 * have a list of language ids, but as well as file associations,
 * it can have a light variant, a high contrast variant, an icon pack,
 * or can be disabled by the user
 */
export type LanguageAssociation = BasicFileAssociation & {
  /**
   * Icon for the language identifier
   */
  icon: DefaultIconAssociation;

  /**
   * Language ID, e.g. 'javascript'
   *
   * According to official VS Code documentation:
   * https://code.visualstudio.com/docs/languages/identifiers
   */
  ids: string[];
}

/**
 * The dictionary of file associations
 */
export type FileAssociations = {
  /**
   * Define the default icon for folders.
   */
  defaultIcon: DefaultIconAssociation;

  /**
   * Defines all folder icons.
   */
  icons: FileAssociation[];
};

/**
 * The dictionary of folder associations
 */
export type FolderAssociations = {
  /**
   * Name of the theme
   */
  name: string;

  /**
   * Define the default icon for folders in a theme.
   */
  defaultIcon: DefaultIconAssociation;

  /**
   * Icon for root folders.
   */
  rootFolder?: DefaultIconAssociation;

  /**
   * Defines folder icons for specific folder names.
   */
  icons?: FolderAssociation[];
}

/**
 * An icon association maps an icon name to a url
 */
export type IconAssociations = Record<string, string>
