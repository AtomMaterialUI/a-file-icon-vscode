import {
  aFolders,
  bFolders,
  cFolders,
  dFolders,
  eFolders,
  fFolders,
  gFolders,
  hFolders,
  iFolders,
  jFolders,
  kFolders,
  lFolders,
  mFolders,
  nFolders,
  oFolders,
  pFolders,
  qFolders,
  rFolders,
  sFolders,
  tFolders,
  uFolders,
  vFolders,
  wFolders,
  xFolders,
  yFolders,
  zFolders,
} from 'src/icons/folders';

import type { FolderAssociations } from 'src/@types/associations';

/**
 * Defines folder icons
 */
export const folderIcons: FolderAssociations[] = [
  {
    defaultIcon: { name: 'folder' },
    icons: [
      // region [A]
      ...aFolders,
      // endregion

      // region [B]
      ...bFolders,
      // endregion

      // region [C]
      ...cFolders,

      // endregion

      // region [D]
      ...dFolders,
      // endregion

      // region [E]
      ...eFolders,

      // endregion

      // region [F]
      ...fFolders,

      // endregion

      // region [G]
      ...gFolders,

      // endregion

      // region [H]
      ...hFolders,

      // endregion

      // region [I]
      ...iFolders,

      // endregion

      // region [J]
      ...jFolders,
      // endregion

      // region [K]
      ...kFolders,
      // endregion

      // region [L]
      ...lFolders,

      // endregion

      // region [M]
      ...mFolders,

      // endregion

      // region [N]
      ...nFolders,
      // endregion

      // region [O]
      ...oFolders,
      // endregion

      // region [P]
      ...pFolders,
      // endregion

      // region [Q]
      ...qFolders,
      // endregion

      // region [R]
      ...rFolders,
      // endregion

      // region [S]
      ...sFolders,
      // endregion

      // region [T]
      ...tFolders,
      // endregion

      // region [U]
      ...uFolders,
      // endregion

      // region [V]
      ...vFolders,
      // endregion

      // region [W]
      ...wFolders,
      // endregion

      // region [X]
      xFolders,
      // endregion

      // region [Y]
      yFolders,
      // endregion

      // region [Z]
      zFolders,
      // endregion
    ],
    name: 'specific',
    rootFolder: { name: 'folder-root' },
  },
  {
    defaultIcon: { name: 'folder' },
    name: 'classic',
    rootFolder: { name: 'folder-root' },
  },
  { defaultIcon: { name: '' }, name: 'none' },
];
