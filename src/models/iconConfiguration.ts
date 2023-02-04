import type { AtomConfig } from 'src/@types/config';

type IconDefinition = {
  iconPath: string;
};

/**
 * A model representing the icon theme configuration.
 * See https://code.visualstudio.com/api/extension-guides/file-icon-theme
 */
export class IconConfiguration {
  /**
   * Path to the fallback default file icon
   */
  file?: string;
  /**
   * Path to the fallback default folder icon
   */
  folder?: string;
  /**
   * Path to the fallback default folder icon when expanded
   */
  folderExpanded?: string;

  /**
   * Associate folder names to paths
   */
  folderNames?: Record<string, string>;
  /**
   * Associate folder names to paths when expanded
   * @type {Record<string, string>}
   */
  folderNamesExpanded?: Record<string, string>;

  /**
   * Root folder icon
   */
  rootFolder?: string;
  /**
   * Root folder icon when expanded
   */
  rootFolderExpanded?: string;

  /**
   * Associate file extensions to paths
   */
  fileExtensions?: Record<string, string>;
  /**
   * Associate file names to paths
   */
  fileNames?: Record<string, string>;

  /**
   * Associate language ids to paths
   */
  languageIds?: Record<string, string>;

  /**
   * Associate icon definitions to paths
   * @type {Record<string, IconDefinition>}
   */
  iconDefinitions?: Record<string, IconDefinition>;

  /**
   * Light variants
   * @type {IconConfiguration}
   */
  light?: IconConfiguration;
  /**
   * High contrast variants
   * @type {IconConfiguration}
   */
  highContrast?: IconConfiguration;

  /**
   * Atom file config
   */
  atomConfig?: Partial<AtomConfig>;

  constructor(options: Partial<AtomConfig> = {}) {
    this.iconDefinitions = {};

    this.folderNames = {};
    this.folderNamesExpanded = {};

    this.fileExtensions = {};
    this.fileNames = {};

    this.languageIds = {};

    this.light = {
      fileExtensions: {},
      fileNames: {},
    };

    this.highContrast = {
      fileExtensions: {},
      fileNames: {},
    };

    this.atomConfig = options;
  }
}
