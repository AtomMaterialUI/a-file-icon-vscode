import type { IconAssociations } from './associations';

export enum IconPack {
  Angular = 'angular',
  Angular2 = 'angular2',
  Nest = 'nest',
  Next = 'next',
  Ngrx = 'ngrx',
  Phalcon = 'phalcon',
  Rails = 'rails',
  React = 'react',
  Recoil = 'recoil',
  Redux = 'redux',
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
  filesAssociations?: IconAssociations,
  foldersAssociations?: IconAssociations,
  folderColor: string,
  folderTheme: FolderTheme,
  languagesAssociations?: IconAssociations,
  opacity: number,
  saturation: number,
  showReloadMessage: boolean,
  showUpdateMessage: boolean,
  showWelcomeMessage: boolean,
}

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
