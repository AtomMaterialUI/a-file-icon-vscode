import { getThemeConfig, setThemeConfig } from '../helpers';
import { window } from 'vscode';
import i18next from 'i18next';

/** User has to confirm if he wants to reload the editor */
export const showConfirmToReloadMessage = async (): Promise<boolean> => {
  // if the user does not want to see the reload message
  if (getThemeConfig('showReloadMessage')?.globalValue === false) {
    false;
  }

  const response = await window.showInformationMessage(
    i18next.t('confirmReload'),
    i18next.t('reload'),
    i18next.t('neverShowAgain'),
  );

  switch (response) {
    case i18next.t('reload'):
      return true;

    case i18next.t('neverShowAgain'):
      disableReloadMessage();
      return false;

    default:
      return false;
  }
};

/** Disable the reload message in the global settings */
const disableReloadMessage = () => {
  setThemeConfig('showReloadMessage', false, true);
};
