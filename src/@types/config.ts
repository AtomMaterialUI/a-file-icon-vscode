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
}

export enum FolderTheme {
  Classic  = 'classic',
  None     = 'none',
  Specific = 'specific',
}

export type AtomConfig = {
  activeIconPath: IconPack,
  files: {
    associations: {}
  },
  folders: {
    associations: {},
    color: string,
    theme: FolderTheme
  },
  hidesExplorerArrows: boolean,
  languages: {
    associations: {}
  },
  opacity: number,
  saturation: number,
  showReloadMessage: boolean,
  showUpdateMessage: boolean,
  showWelcomeMessage: boolean,
}