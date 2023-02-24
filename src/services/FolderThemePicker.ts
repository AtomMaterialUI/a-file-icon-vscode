import i18next from 'i18next';
import { FolderTheme } from 'src/@types/config';
import { getFolderThemes } from 'src/helpers/folderThemes';
import { findEnumKey } from 'src/helpers/utils';
import { configService } from 'src/services/ConfigService';
import { type QuickPickItem, window, QuickPickItemKind } from 'vscode';

export class FolderThemePicker {
  async openQuickPicker() {
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

    const options = folderThemes.map((theme): QuickPickItem => {
      const isSeparator = theme.kind === QuickPickItemKind.Separator;

      if (isSeparator || !theme.id) {
        return {
          kind: QuickPickItemKind.Separator,
          label: '',
        };
      }

      const picked = isNoneActive ? false : this.isThemePicked(currentTheme, theme.id);
      return ({
        description: theme.title,
        detail: theme.description,
        label: picked ? '$(check)' : theme.icon ?? '',
        picked: picked,
      });
    });

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
  private isThemePicked(currentTheme: FolderTheme, id: FolderTheme) {
    return currentTheme === id;
  }
}

export const folderThemePicker = new FolderThemePicker();
