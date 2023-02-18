import i18next from 'i18next';
import { getFolderColors } from 'src/helpers/themes';
import { validateHEXColorCode } from 'src/helpers/utils';
import { configService } from 'src/services/ConfigService';
import { window } from 'vscode';

import type { QuickPickItem } from 'vscode';

class FolderColorManager {
  async openFolderColorPopup() {
    const currentColor = configService.folderColor;
    const response = await this.showQuickPickItems(currentColor);

    if (response) {
      this.handleQuickPickActions(response);
    }
  }

  private async showQuickPickItems(currentColor: string) {
    const folderColors = getFolderColors();

    const options = folderColors.map((item): QuickPickItem => {
      const picked = this.isThemeColorActive(currentColor, item.color);
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
      await this.handleCustomColor();
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
  private async handleCustomColor() {
    const color = await window.showInputBox({
      ignoreFocusOut: false,
      placeHolder: i18next.t('folders.hexCode'),
      validateInput: (value) => {
        if (!validateHEXColorCode(value)) {
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
  private isThemeColorActive(currentColor: string, color?: string) {
    return color === currentColor;
  }

}

export const folderColorManager = new FolderColorManager();