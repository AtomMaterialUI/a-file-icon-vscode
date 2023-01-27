import type { QuickPickItem} from 'vscode';
import { window } from 'vscode';
import { getMaterialIconsJSON, setThemeConfig } from '../helpers';
import i18next from 'i18next';

/** Command to toggle grayscale. */
export const toggleGrayscale = async () => {
  try {
    const status = checkGrayscaleStatus();
    const response = await showQuickPickItems(status);
    if (response) {
      handleQuickPickActions(response);
    }
  } catch (error) {
    console.error(error);
  }
};

/** Show QuickPick items to select preferred configuration for grayscale icons. */
const showQuickPickItems = (status: boolean) => {
  const on: QuickPickItem = {
    description: i18next.t('toggleSwitch.on'),
    detail: i18next.t('grayscale.enable'),
    label: status ? '\u2714' : '\u25FB',
  };
  const off: QuickPickItem = {
    description: i18next.t('toggleSwitch.off'),
    detail: i18next.t('grayscale.disable'),
    label: !status ? '\u2714' : '\u25FB',
  };
  return window.showQuickPick([on, off], {
    placeHolder: i18next.t('grayscale.toggle'),
    ignoreFocusOut: false,
    matchOnDescription: true,
  });
};

/** Handle the actions from the QuickPick. */
const handleQuickPickActions = (value: QuickPickItem) => {
  if (!value || !value.description) {
    return;
  }
  switch (value.description) {
    case i18next.t('toggleSwitch.on'): {
      return setThemeConfig('saturation', 0, true);
    }
    case i18next.t('toggleSwitch.off'): {
      return setThemeConfig('saturation', 1, true);
    }
    default:
      return;
  }
};

/** Is grayscale icons enabled? */
export const checkGrayscaleStatus = (): boolean => {
  return getMaterialIconsJSON()?.options?.saturation === 0;
};
