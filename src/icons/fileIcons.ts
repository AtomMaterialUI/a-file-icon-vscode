import {
  aFiles,
  archive,
  audio,
  bFiles,
  binaries,
  cFiles,
  config,
  custom,
  dFiles,
  eFiles,
  fFiles,
  gFiles,
  hFiles,
  iFiles,
  images,
  jFiles,
  kFiles,
  languages,
  least,
  lFiles,
  mFiles,
  nFiles,
  numbers,
  oFiles,
  pFiles,
  qFiles,
  rFiles,
  sFiles,
  tests,
  tFiles,
  uFiles,
  vFiles,
  video,
  wFiles,
  xFiles,
  yFiles,
  zFiles,
} from 'src/icons/files';

import type { FileIcons } from 'src/@types/iconTypes';

/**
 * Defines file icons
 */
export const fileIcons: FileIcons = {
  defaultIcon: { name: 'file' },
  icons: [
    // region [Custom]
    ...custom,
    // endregion [Custom]

    // region [Tests]
    ...tests,
    // endregion [Tests]

    // region [0-9]
    ...numbers,

    // endregion [0-9]

    // region [A]
    ...aFiles,

    // endregion

    // region [B]
    ...bFiles,
    // endregion

    // region [C]
    ...cFiles,
    // endregion

    // region [D]
    ...dFiles,
    // endregion

    // region [E]
    ...eFiles,
    // endregion

    // region [F]
    ...fFiles,
    // endregion

    // region [G]
    ...gFiles,
    // endregion

    // region [H]
    ...hFiles,
    // endregion

    // region [I]
    ...iFiles,

    // endregion

    // region [J]
    ...jFiles,
    // endregion

    // region [K]
    ...kFiles,
    // endregion

    // region [L]
    ...lFiles,

    // endregion

    // region [M]
    ...mFiles,

    // endregion

    // region [N]
    ...nFiles,

    // endregion [N]

    // region [O]
    ...oFiles,

    // endregion

    // region [P]
    ...pFiles,
    // endregion

    // region [Q]
    ...qFiles,
    // endregion

    // region [R]
    ...rFiles,
    // endregion

    // region [S]
    ...sFiles,

    // endregion

    // region [T]
    ...tFiles,

    // endregion

    // region [U]
    ...uFiles,

    // endregion [U]

    // region [V]
    ...vFiles,

    // endregion

    // region [W]
    ...wFiles,
    // endregion

    // region [X]
    ...xFiles,
    // endregion

    // region [Y]
    ...yFiles,

    // endregion

    // region [Z]
    ...zFiles,
    // endregion

    // region [Images]
    ...images,
    // endregion

    // region [Config]
    ...config,

    // endregion

    // region [Binaries]
    ...binaries,
    // endregion

    // region [Archive]
    ...archive,
    // endregion

    // region [Audio]
    ...audio,
    // endregion

    // region [Video]
    ...video,
    // endregion

    // region [Languages]
    ...languages,
    // endregion

    // region [Least priority]
    ...least,
    // endregion
  ],
};
