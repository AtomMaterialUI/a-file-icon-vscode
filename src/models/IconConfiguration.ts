import type { AtomConfig } from 'src/@types/config';

/** An svg icon, or a glyph of one of the `fonts` (only the icons taken from a font icon theme like Seti) */
type IconDefinition = {
  fontCharacter?: string;
  fontColor?: string;
  fontId?: string;
  fontSize?: string;
  iconPath?: string;
};

/** A font of the glyphs taken from a font icon theme */
export type IconFont = {
  id: string;
  size?: string;
  src: Array<{ format: string; path: string }>;
  style?: string;
  weight?: string;
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
   * Associate root folder names to paths
   */
  rootFolderNames?: Record<string, string>;
  /**
   * Associate root folder names to paths when expanded
   */
  rootFolderNamesExpanded?: Record<string, string>;

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
   * Fonts of the glyphs taken from font icon themes; absent when none is used.
   * VS Code gives the size of the first one to every icon, the svg icons ignore it.
   */
  fonts?: IconFont[];

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
   * Fingerprint of the other icon themes mixed with this theme ('' = none),
   * to regenerate the theme when one of them changes
   */
  layerThemes?: string;

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
