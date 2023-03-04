import i18next from 'i18next';
import { ArrowTheme } from 'src/@types/config';
import { getArrowThemes } from 'src/helpers/arrowThemes';
import { findEnumKey } from 'src/helpers/utils';
import { configService } from 'src/services/ConfigService';
import { type QuickPickItem, window, QuickPickItemKind } from 'vscode';

type ArrowThemeQuickPickItem = QuickPickItem & { id?: ArrowTheme };

export class ArrowThemePicker {
  async openQuickPicker() {
    const currentTheme = configService.arrowTheme;
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
  private showQuickPickItems(currentTheme: ArrowTheme) {
    const isNoneActive = this.isNoneActive(currentTheme);
    const arrowThemes = getArrowThemes();

    const options = arrowThemes.map((theme): ArrowThemeQuickPickItem => {
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
        id: theme.id,
        label: picked ? '$(check)' : theme.icon ?? '',
        picked: picked,
      });
    });

    return window.showQuickPick(options, {
      ignoreFocusOut: false,
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: i18next.t('arrowThemes.pickTheme'),
    });
  }

  /**
   * Checks if no theme is active
   * @returns {boolean}
   * @private
   * @param arrowTheme
   */
  private isNoneActive(arrowTheme: ArrowTheme): boolean {
    return arrowTheme === ArrowTheme.None;
  }

  /**
   * Handle selection
   * @private
   * @param decision
   */
  private handleQuickPickActions(decision: ArrowThemeQuickPickItem): void {
    if (!decision || !decision.id) return;
    const enumKey = findEnumKey(ArrowTheme, decision.id);

    configService.arrowTheme = enumKey ? ArrowTheme[enumKey] : ArrowTheme.None;
  }

  /**
   * Checks if a theme is active
   * @param {FolderTheme} currentTheme
   * @param {FolderTheme} id
   * @returns {boolean}
   * @private
   */
  private isThemePicked(currentTheme: ArrowTheme, id: ArrowTheme) {
    return currentTheme === id;
  }
}

export const arrowThemePicker = new ArrowThemePicker();
