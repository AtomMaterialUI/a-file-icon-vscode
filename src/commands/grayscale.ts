import i18next from 'i18next';
import { window } from 'vscode';

import { getMaterialIconsJSON, setThemeConfig } from '../helpers';

import type { QuickPickItem } from 'vscode';

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
    label: status ? '\u25FB' : '\u2714',
  };
  return window.showQuickPick([on, off], {
    ignoreFocusOut: false,
    matchOnDescription: true,
    placeHolder: i18next.t('grayscale.toggle'),
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
    default: {
      return;
    }
  }
};

/** Is grayscale icons enabled? */
export const checkGrayscaleStatus = (): boolean => {
  return getMaterialIconsJSON()?.atomConfig?.saturation === 0;
};

/** Command to toggle grayscale. */
export const toggleGrayscale = async () => {
  try {
    const status = checkGrayscaleStatus();
    const response = await showQuickPickItems(status);
    if (response) {
      handleQuickPickActions(response);
    }
  }
  catch (error) {
    console.error(error);
  }
};
