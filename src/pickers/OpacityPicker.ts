import i18next from 'i18next';
import { getOpacities } from 'src/helpers/opacities';
import { configService } from 'src/services/ConfigService';
import { type QuickPickItem, window } from 'vscode';

class OpacityPicker {
  async openQuickPicker() {
    const opacity = configService.opacity;
    const response = await this.showQuickPickItems(opacity);

    if (response) {
      this.handleQuickPickActions(response);
    }
  }

  /**
   * Show quick pick items for opacity options
   * @private
   * @param opacity
   */
  private showQuickPickItems(opacity: number) {
    const opacities = getOpacities();

    const options = opacities.map((item): QuickPickItem => {
      const picked = this.isOpacityPicked(opacity, item.value);
      return ({
        description: item.title,
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
      placeHolder: i18next.t('selectOpacity'),
    });
  }

  /**
   * Handle selection
   * @private
   * @param decision
   */
  private async handleQuickPickActions(decision: QuickPickItem) {
    if (!decision || !decision.description) return;

    if (decision.description === i18next.t('custom')) {
      await this.handleCustom();
    }
    else {
      configService.opacity = this.findOpacity(decision);
    }
  }

  /**
   * Finds the opacity in the options list
   * @param {QuickPickItem} decision
   * @returns {number}
   * @private
   */
  private findOpacity(decision: QuickPickItem): number {
    const foundTheme = getOpacities().find((item) => item.title === decision.description);
    return foundTheme?.value ?? 1;
  }

  /**
   * Handles the custom opacity input
   * @returns {Promise<void>}
   * @private
   */
  private async handleCustom() {
    const opacity = await window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: i18next.t('opacity.inputPlaceholder'),
      validateInput: (value) => {
        if (!this.isValid(Number(value))) {
          return i18next.t('opacity.wrongValue');
        }
        return;
      },
    });

    if (opacity) {
      configService.opacity = Number(opacity);
    }
  }

  private isOpacityPicked(opacity: number, value: number | undefined) {
    return opacity === value;
  }

  /**
   * Validate the opacity value.
   * @param opacity Opacity value
   */
  private isValid(opacity: number | undefined) {
    return opacity !== undefined && opacity <= 1 && opacity >= 0;
  }
}

export const opacityPicker = new OpacityPicker();
