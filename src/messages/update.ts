import { window, env, Uri } from 'vscode';
import { activateIcons } from '../commands/activate';
import { getThemeConfig, isThemeNotVisible, setThemeConfig } from '../helpers';
import { translate } from './../i18n';

/** Show the update message if the icon theme has been updated. */
export const showUpdateMessage = () => {
  // if the user does not want to see the update message
  if (getThemeConfig('showUpdateMessage')?.globalValue !== true) {
    return;
  }

  window
    .showInformationMessage(
      translate('themeUpdated'),
      isThemeNotVisible() ? translate('activate') : '',
      translate('readChangelog'),
      translate('neverShowAgain')
    )
    .then(handleUpdateMessageActions);
};

/** Handle the actions of the update message. */
const handleUpdateMessageActions = (value: string | undefined) => {
  switch (value) {
    case translate('activate'):
      activateIcons();
      break;

    case translate('readChangelog'):
      env.openExternal(
        Uri.parse(
          'https://marketplace.visualstudio.com/items/atommaterial.a-file-icon-vscode/changelog'
        )
      );
      break;

    case translate('neverShowAgain'):
      disableUpdateMessage();
      break;

    default:
      break;
  }
};

/** Disable the update messages in the global settings */
const disableUpdateMessage = () => {
  setThemeConfig('showUpdateMessage', false, true);
};
