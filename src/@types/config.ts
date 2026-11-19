import type { IconAssociations } from './associations';
import type { ColorThemeLayer } from 'src/themes/colorLayers';

export enum IconPack {
  Angular = 'angular',
  Angular2 = 'angular2',
  Css = 'css',
  Nest = 'nest',
  Next = 'next',
  Ngrx = 'ngrx',
  Phalcon = 'phalcon',
  PyCharm = 'pycharm',
  Rails = 'rails',
  React = 'react',
  Recoil = 'recoil',
  Redux = 'redux',
  Tests = 'tests',
  Volt = 'volt',
  Vue = 'vue',
  Vuex = 'vuex',
  None = 'none',
}

export enum FolderTheme {
  Classic = 'classic',
  None = 'none',
  Specific = 'specific',
}

export enum PredefinedOpacity {
  Transparent = 'transparent',
  SemiTransparent = 'semiTransparent',
  Opaque = 'opaque',
  Custom = 'custom'
}

export enum PredefinedSaturation {
  Grayscale = 'grayscale',
  Desaturated = 'desaturated',
  Vivid = 'vivid',
  Custom = 'custom'
}

export type AtomConfig = {
  activeIconPacks: IconPack[],
  arrowTheme: ArrowTheme,
  /** color id glob, `scope:<TextMate scope>` or `semantic:<selector>` -> id of the installed color theme giving it */
  colorThemeByKey?: Record<string, string>,
  /** other installed color themes mixed with Cool Islands, the first listed wins (not an icon setting) */
  colorThemeLayers: ColorThemeLayer[],
  filesAssociations?: IconAssociations,
  foldersAssociations?: IconAssociations,
  folderColor: string,
  folderTheme: FolderTheme,
  hideFileIcons: boolean,
  /** file name, `*.ext` or `folder/` -> id of the installed file icon theme giving its icon */
  iconThemeByName?: Record<string, string>,
  /** other installed file icon themes mixed with this theme, the first listed wins */
  iconThemeLayers: IconThemeLayer[],
  languagesAssociations?: IconAssociations,
  monochrome: boolean,
  monochromeColor: string,
  opacity: number,
  saturation: number,
  /** suggest installing the fonts of the default editor font when they are missing */
  showFontMessage: boolean,
  showReloadMessage: boolean,
  showUpdateMessage: boolean,
  showWelcomeMessage: boolean,
}

/**
 * How a layer theme mixes with this theme, for files or for folders:
 * - fill: only for the names no theme above gives an icon to
 * - override: its icon wins for every name it gives an icon to, and its default file or folder icon too
 * - off: nothing
 */
export type LayerMode = 'fill' | 'off' | 'override';

/** Another installed file icon theme: its id (`fill` for files and folders), or its id with a mode for each */
export type IconThemeLayer = string | { files?: LayerMode; folders?: LayerMode; theme: string };

export enum UpdateStatus {
  NeverUsedBefore,
  Updated,
  Current,
}

export enum FileMappingType {
  FileExtensions = 'fileExtensions',
  FileNames = 'fileNames',
}

export type Theme = {
  accent: string;
  attributes: string;
  background: string;
  blue: string;
  border: string;
  button: string;
  className: string;
  classes: string;
  comments: string;
  contrast: string;
  cyan: string;
  dark: boolean;
  desc: string
  disabled: string;
  error: string;
  excluded: string;
  foreground: string;
  functions: string;
  gray: string;
  green: string;
  hl: string;
  id: string;
  keywords: string;
  links: string;
  name2: string;
  name: string;
  notif: string;
  numbers: string;
  operators: string;
  orange: string;
  parameters: string;
  purple: string;
  red: string;
  scheme: string;
  second: string;
  selectBg: string;
  selectFg2: string;
  selectFg: string;
  strings: string;
  table: string;
  tags: string;
  text: string;
  tree: string;
  vars: string;
  white: string;
  yellow: string;
}

export type ThemeColor = {
  name: string,
  color: string;
}

export enum ArrowTheme {
  Material = 'material',
  Triangle = 'triangle',
  PlusMinus = 'plusMinus',
  Arrow = 'arrow',
  None = 'none',
}

/** Settings that are baked into the generated icon theme json */
export const ICON_SETTING_KEYS = [
  'activeIconPacks',
  'filesAssociations',
  'folderColor',
  'folderTheme',
  'foldersAssociations',
  'hideFileIcons',
  'iconThemeByName',
  'iconThemeLayers',
  'languagesAssociations',
  'monochrome',
  'monochromeColor',
  'opacity',
  'saturation',
] as const;

export type IconSettings = Pick<AtomConfig, (typeof ICON_SETTING_KEYS)[number]>;
