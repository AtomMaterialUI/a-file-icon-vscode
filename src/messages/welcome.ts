import { env, Uri, window } from 'vscode';
import { activateIcons } from '../commands/activate';
import { getThemeConfig, isThemeNotVisible, setThemeConfig } from '../helpers';
import i18next from 'i18next';

/** Show the welcome message if the icon theme has been installed the first time. */
export const showWelcomeMessage = () => {
  // if the user does not want to see the welcome message
  if (getThemeConfig('showWelcomeMessage')?.globalValue === false) {
    return;
  }

  window
    .showInformationMessage(
      i18next.t('themeInstalled'),
      isThemeNotVisible() ? i18next.t('activate') : '',
      i18next.t('neverShowAgain'),
    )
    .then(handleWelcomeMessageActions);
};

/** Handle the actions of the welcome message. */
const handleWelcomeMessageActions = (value: string | undefined) => {
  switch (value) {
    case i18next.t('activate'):
      activateIcons();
      break;

    case i18next.t('howToActivate'):
      env.openExternal(
        Uri.parse(
          'https://code.visualstudio.com/blogs/2016/09/08/icon-themes#_file-icon-themes',
        ),
      );
      break;

    case i18next.t('neverShowAgain'):
      disableWelcomeMessage();
      break;

    default:
      break;
  }
};

/** Disable the welcome messages in the global settings */
const disableWelcomeMessage = () => {
  setThemeConfig('showWelcomeMessage', false, true);
};
