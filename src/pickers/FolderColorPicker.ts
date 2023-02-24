import i18next from 'i18next';
import { getFolderColors } from 'src/helpers/themes';
import { isValidHexColorCode } from 'src/helpers/utils';
import { configService } from 'src/services/ConfigService';
import { window, QuickPickItemKind } from 'vscode';

import type { QuickPickItem } from 'vscode';

class FolderColorPicker {
  async openQuickPicker() {
    const currentColor = configService.folderColor;
    const response = await this.showQuickPickItems(currentColor);

    if (response) {
      this.handleQuickPickActions(response);
    }
  }

  /**
   * Show quick pick items for folder color options
   * @private
   * @param currentColor
   */
  private async showQuickPickItems(currentColor: string) {
    const folderColors = getFolderColors();

    const options = folderColors.map((item) => {
      const isSeparator = item.kind === QuickPickItemKind.Separator;

      if (isSeparator || !item.id) {
        return {
          kind: QuickPickItemKind.Separator,
          label: '',
        };
      }

      const picked = this.isThemeColorPicked(currentColor, item.color);
      return ({
        description: item.name,
        detail: item.description,
        kind: item.kind,
        label: picked ? '$(check)' : '',
        picked,
      });
    });

    return window.showQuickPick(options, {
      ignoreFocusOut: false,
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: i18next.t('folders.color'),
    });
  }

  private async handleQuickPickActions(decision: QuickPickItem) {
    if (!decision || !decision.description) return;

    if (decision.description === i18next.t('custom')) {
      await this.handleCustom();
    }
    else {
      configService.folderColor = this.findTheme(decision);
    }
  }

  /**
   * Finds the theme color in the themes list
   * @param {QuickPickItem} decision
   * @returns {string}
   * @private
   */
  private findTheme(decision: QuickPickItem): string {
    const foundTheme = getFolderColors().find((item) => item.name === decision.description);
    return foundTheme?.color ?? '';
  }

  /**
   * Handles the custom color input
   * @returns {Promise<void>}
   * @private
   */
  private async handleCustom() {
    const color = await window.showInputBox({
      ignoreFocusOut: false,
      placeHolder: i18next.t('folders.hexCode'),
      validateInput: (value) => {
        if (!this.isValid(value)) {
          return i18next.t('folders.wrongHexCode');
        }
        return;
      },
    });

    if (color) {
      configService.folderColor = color;
    }
  }

  /**
   * Checks if the current theme color is active
   * @param {string} currentColor the current color
   * @param {ThemeColor} color the color to check
   * @returns {boolean}
   * @private
   */
  private isThemeColorPicked(currentColor: string, color?: string) {
    return color === currentColor;
  }

  private isValid(color = '') {
    return isValidHexColorCode(color);
  }
}

export const folderColorPicker = new FolderColorPicker();