import i18next from 'i18next';
import { configService, logger } from 'src/services';
import { folderThemeManager } from 'src/services/FolderThemeManager';
import type { QuickPickItem } from 'vscode';
import { window } from 'vscode';
import { capitalizeFirstLetter, setThemeConfig } from '../helpers';
import { folderIcons } from '../icons';

/** Command to toggle the folder icons. */
export const changeFolderTheme = async () => {
  logger.info('Open select folder theme popup');
  await folderThemeManager.openSelectThemePopup();

  try {
    const currentTheme = configService.folderTheme;
    const response = await showQuickPickItems(currentTheme);
    if (response) {
      handleQuickPickActions(response);
    }
  }
  catch (error) {
    console.error(error);
  }
};

/** Show QuickPick items to select preferred configuration for the folder icons. */
const showQuickPickItems = (activeTheme: string) => {
  const options = folderIcons.map(
    (theme): QuickPickItem => ({
      description: capitalizeFirstLetter(theme.name),
      detail:
        theme.name === 'none'
          ? i18next.t('folders.disabled')
          : i18next.t('folders.theme.description', capitalizeFirstLetter(theme.name)),
      label: theme.name === activeTheme ? '\u2714' : '\u25FB',
    }),
  );

  return window.showQuickPick(options, {
    placeHolder: i18next.t('folders.toggleIcons'),
    ignoreFocusOut: false,
    matchOnDescription: true,
  });
};

/** Handle the actions from the QuickPick. */
const handleQuickPickActions = (value: QuickPickItem) => {
  if (!value || !value.description) {
    return;
  }
  return setThemeConfig('folders.theme', value.description.toLowerCase(), true);
};



