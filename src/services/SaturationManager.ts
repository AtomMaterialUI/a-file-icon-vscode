import i18next from 'i18next';
import { getOpacities } from 'src/helpers/opacities';
import { validateOpacityValue } from 'src/helpers/utils';
import { configService } from 'src/services/ConfigService';
import { type QuickPickItem, window } from 'vscode';

export class SaturationManager {
  async openQuickPicker() {
    const saturation = configService.saturation;
    const response = await this.showQuickPickItems(saturation);

    if (response) {
      this.handleQuickPickActions(response);
    }
  }

  /**
   * Show quick pick items for saturation options
   * @private
   * @param saturation
   */
  private showQuickPickItems(saturation: number) {
    const opacities = getOpacities();

    const options = opacities.map((item): QuickPickItem => {
      const picked = this.isOpacityPicked(saturation, item.value);
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
      await this.handleCustomOpacity();
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
  private async handleCustomOpacity() {
    const opacity = await window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: i18next.t('opacity.inputPlaceholder'),
      validateInput: (value) => {
        if (!validateOpacityValue(Number(value))) {
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
}

export const saturationManager = new SaturationManager();
