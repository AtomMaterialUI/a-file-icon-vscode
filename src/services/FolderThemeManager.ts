import i18next from 'i18next';
import { FolderTheme } from 'src/@types/config';
import { capitalizeFirstLetter } from 'src/helpers';
import { findEnumKey } from 'src/helpers/utils';
import { folderIcons } from 'src/icons';
import { configService } from 'src/services/ConfigService';
import { type QuickPickItem, window } from 'vscode';

export class FolderThemeManager {
  async openSelectThemePopup() {
    const currentTheme = configService.folderTheme;
    const response = await this.showQuickPickItems(currentTheme);

    if (response) {
      this.handleQuickPickActions(response);
    }
  }

  /**
   * Show quick pick items for folder themes
   * @private
   * @param currentTheme
   */
  private showQuickPickItems(currentTheme: FolderTheme) {
    const options = folderIcons.map((theme): QuickPickItem => ({
      description: capitalizeFirstLetter(theme.name),
      label: theme.name === currentTheme ? '\u2714' : '\u25FB',
      detail: this.isNoneActive(currentTheme)
        ? i18next.t('folders.disabled')
        : i18next.t('folders.theme.description', capitalizeFirstLetter(theme.name)),
    }));

    return window.showQuickPick(options, {
      placeHolder: i18next.t('folders.toggleIcons'),
      ignoreFocusOut: false,
      matchOnDescription: true,
    });
  }

  /**
   * Checks if no theme is active
   * @returns {boolean}
   * @private
   * @param folderTheme
   */
  private isNoneActive(folderTheme: FolderTheme): boolean {
    return folderTheme === FolderTheme.None;
  }

  /**
   * Handle selection
   * @private
   * @param decision
   */
  private handleQuickPickActions(decision: QuickPickItem): void {
    if (!decision || !decision.description) return;
    const enumKey = findEnumKey(FolderTheme, decision.description);

    if (enumKey) {
      configService.folderTheme = FolderTheme[enumKey];
    }
    else {
      configService.folderTheme = FolderTheme.None;
    }
  }

}

export const folderThemeManager = new FolderThemeManager();
