import type { QuickPickItem } from 'vscode';
import { window } from 'vscode';
import { getMaterialIconsJSON, setThemeConfig } from '../helpers';
import i18next from 'i18next';

/** Command to toggle the explorer arrows. */
export const toggleExplorerArrows = async () => {
  try {
    const status = checkArrowStatus();
    const response = await showQuickPickItems(status);
    return handleQuickPickActions(response);
  } catch (error) {
    console.error(error);
  }
};

/** Show QuickPick items to select preferred configuration for the explorer arrows. */
const showQuickPickItems = (status: boolean): Thenable<QuickPickItem | undefined> => {
  const on: QuickPickItem = {
    description: i18next.t('toggleSwitch.on'),
    detail: i18next.t('explorerArrows.enable'),
    label: !status ? '\u2714' : '\u25FB',
  };
  const off: QuickPickItem = {
    description: i18next.t('toggleSwitch.off'),
    detail: i18next.t('explorerArrows.disable'),
    label: status ? '\u2714' : '\u25FB',
  };
  return window.showQuickPick([on, off], {
    placeHolder: i18next.t('explorerArrows.toggle'),
    ignoreFocusOut: false,
    matchOnDescription: true,
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
    default:
      return;
  }
};

/** Check if arrows are enabled. */
export const checkArrowStatus = (): boolean => {
  return !!getMaterialIconsJSON()?.atomConfig?.hidesExplorerArrows;
};
