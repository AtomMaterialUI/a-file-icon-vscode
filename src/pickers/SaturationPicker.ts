import i18next from 'i18next';
import { getSaturations } from 'src/helpers/saturations';
import { configService } from 'src/services/ConfigService';
import { type QuickPickItem, window } from 'vscode';

class SaturationPicker {
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
    const saturations = getSaturations();

    const options = saturations.map((item): QuickPickItem => {
      const picked = this.isSaturationPicked(saturation, item.value);
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
      placeHolder: i18next.t('selectSaturation'),
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
      configService.saturation = this.findSaturation(decision);
    }
  }

  /**
   * Finds the opacity in the options list
   * @param {QuickPickItem} decision
   * @returns {number}
   * @private
   */
  private findSaturation(decision: QuickPickItem): number {
    const foundTheme = getSaturations().find((item) => item.title === decision.description);
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
      placeHolder: i18next.t('saturation.inputPlaceholder'),
      validateInput: (value) => {
        if (!this.isValid(Number(value))) {
          return i18next.t('saturation.wrongValue');
        }
        return;
      },
    });

    if (opacity) {
      configService.saturation = Number(opacity);
    }
  }

  private isSaturationPicked(opacity: number, value: number | undefined) {
    return opacity === value;
  }

  /**
   * Validate the saturation value.
   * @param saturation Saturation value
   */
  private isValid(saturation: number | undefined) {
    return saturation !== undefined && saturation <= 1 && saturation >= 0;
  }
}

export const saturationPicker = new SaturationPicker();
