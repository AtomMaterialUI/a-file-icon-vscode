import i18next from 'i18next';
import { window } from 'vscode';

import { getMaterialIconsJSON, setThemeConfig } from '../helpers';

import type { QuickPickItem } from 'vscode';

/** Show QuickPick items to select preferred configuration for the explorer arrows. */
const showQuickPickItems = (status: boolean): Thenable<QuickPickItem | undefined> => {
  const on: QuickPickItem = {
    description: i18next.t('toggleSwitch.on'),
    detail: i18next.t('explorerArrows.enable'),
    label: status ? '\u25FB' : '\u2714',
  };
  const off: QuickPickItem = {
    description: i18next.t('toggleSwitch.off'),
    detail: i18next.t('explorerArrows.disable'),
    label: status ? '\u2714' : '\u25FB',
  };
  return window.showQuickPick([on, off], {
    ignoreFocusOut: false,
    matchOnDescription: true,
    placeHolder: i18next.t('explorerArrows.toggle'),
  });
};

/** Handle the actions from the QuickPick. */
const handleQuickPickActions = (value: QuickPickItem | undefined) => {
  if (!value?.description) {
    return;
  }
  switch (value.description) {
    case i18next.t('toggleSwitch.on'): {
      return setThemeConfig('hidesExplorerArrows', false, true);
    }
    case i18next.t('toggleSwitch.off'): {
      return setThemeConfig('hidesExplorerArrows', true, true);
    }
    default: {
      return;
    }
  }
};

/** Command to toggle the explorer arrows. */
export const toggleExplorerArrows = async () => {
  try {
    const status = checkArrowStatus();
    const response = await showQuickPickItems(status);
    return handleQuickPickActions(response);
  }
  catch (error) {
    console.error(error);
  }
};

/** Check if arrows are enabled. */
export const checkArrowStatus = (): boolean => {
  return !!getMaterialIconsJSON()?.atomConfig?.hidesExplorerArrows;
};
