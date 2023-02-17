import i18next from 'i18next';
import { FolderTheme } from 'src/@types/config';
import { getFolderThemes } from 'src/helpers/folderThemes';
import { findEnumKey } from 'src/helpers/utils';
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
    const isNoneActive = this.isNoneActive(currentTheme);
    const folderThemes = getFolderThemes();

    const options = Object.values(folderThemes).map((theme): QuickPickItem => ({
      description: theme.name,
      detail: theme.description,
      label: theme.icon ?? '',
      picked: isNoneActive ? false : this.isThemeActive(currentTheme, theme.id),
    }));

    return window.showQuickPick(options, {
      ignoreFocusOut: false,
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: i18next.t('folders.toggleIcons'),
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
    const enumKey = findEnumKey(FolderTheme, decision.description.toLowerCase());

    configService.folderTheme = enumKey ? FolderTheme[enumKey] : FolderTheme.None;
  }

  /**
   * Checks if a theme is active
   * @param {FolderTheme} currentTheme
   * @param {FolderTheme} id
   * @returns {boolean}
   * @private
   */
  private isThemeActive(currentTheme: FolderTheme, id: FolderTheme) {
    return currentTheme === id;
  }
}

export const folderThemeManager = new FolderThemeManager();
