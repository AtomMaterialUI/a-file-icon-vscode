import type { IconAssociations } from 'src/@types/icons';

export enum IconPack {
  Angular = 'angular',
  Nest    = 'nest',
  Ngrx    = 'ngrx',
  Phalcon = 'phalcon',
  Rails   = 'rails',
  React   = 'react',
  Recoil  = 'recoil',
  Redux   = 'redux',
  Volt    = 'volt',
  Vue     = 'vue',
  Vuex    = 'vuex',
  None    = 'none',
}

export enum FolderTheme {
  Classic  = 'classic',
  None     = 'none',
  Specific = 'specific',
}

export type AtomConfig = {
  activeIconPacks: IconPack[],
  filesAssociations?: IconAssociations,
  foldersAssociations?: IconAssociations,
  folderColor: string,
  folderTheme: FolderTheme,
  hidesExplorerArrows: boolean,
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
  FileNames      = 'fileNames',
}