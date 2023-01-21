import { window } from 'vscode';
import { getConfig } from '../helpers';

import { translate } from './../i18n';

/** Activate the icon theme by changing the settings for the iconTheme. */
export const activateIcons = () => {
  return setIconTheme();
};

/** Set the icon theme in the config. */
const setIconTheme = async () => {
  // global user config
  try {
    await getConfig().update('workbench.iconTheme', 'a-file-icon-vscode', true);

    // local workspace config
    if (getConfig().inspect('workbench.iconTheme')?.workspaceValue) {
      getConfig().update('workbench.iconTheme', 'a-file-icon-vscode');
    }
    window.showInformationMessage(translate('activated'));
  } catch (error) {
    console.error(error);
  }
};
