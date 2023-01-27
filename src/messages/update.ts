import { window, env, Uri } from 'vscode';
import { activateIcons } from '../commands/activate';
import { getThemeConfig, isThemeNotVisible, setThemeConfig } from '../helpers';
import i18next from 'i18next';

/** Show the update message if the icon theme has been updated. */
export const showUpdateMessage = () => {
  // if the user does not want to see the update message
  if (getThemeConfig('showUpdateMessage')?.globalValue !== true) {
    return;
  }

  window
    .showInformationMessage(
      i18next.t('themeUpdated'),
      isThemeNotVisible() ? i18next.t('activate') : '',
      i18next.t('readChangelog'),
      i18next.t('neverShowAgain'),
    )
    .then(handleUpdateMessageActions);
};

/** Handle the actions of the update message. */
const handleUpdateMessageActions = (value: string | undefined) => {
  switch (value) {
    case i18next.t('activate'):
      activateIcons();
      break;

    case i18next.t('readChangelog'):
      env.openExternal(
        Uri.parse(
          'https://marketplace.visualstudio.com/items/atommaterial.a-file-icon-vscode/changelog',
        ),
      );
      break;

    case i18next.t('neverShowAgain'):
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
