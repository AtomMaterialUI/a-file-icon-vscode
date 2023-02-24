import i18next from 'i18next';
import { IconPack } from 'src/@types/config';
import { getIconPacks } from 'src/helpers/iconPacks';
import { findEnumKey } from 'src/helpers/utils';
import { configService } from 'src/services/ConfigService';
import { type QuickPickItem, QuickPickItemKind, window } from 'vscode';

class IconPackPicker {
  async openQuickPicker() {
    const activeIconPacks = configService.activeIconPacks;
    const response = await this.showQuickPickItems(activeIconPacks);

    if (response) {
      this.handleQuickPickActions(response);
    }
  }

  /**
   * Show quick pick items for icon packs
   * @param {IconPack} activeIconPacks current active pack
   * @private
   */
  private showQuickPickItems(activeIconPacks: IconPack[]) {
    const isNoneActive = this.isNoneActive(activeIconPacks);
    const iconPacks = getIconPacks();

    const options: QuickPickItem[] = iconPacks.map((pack) => {
      const isSeparator = pack.kind === QuickPickItemKind.Separator;

      if (isSeparator || !pack.id) {
        return {
          kind: QuickPickItemKind.Separator,
          label: '',
        };
      }

      return {
        description: pack.title,
        detail: i18next.t('iconPacks.description', { name: pack.title }),
        label: pack.icon ?? '',
        picked: isNoneActive ? false : this.isPackActive(activeIconPacks, pack.id),
      };
    });

    return window.showQuickPick(options, {
      canPickMany: true,
      ignoreFocusOut: false,
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: i18next.t('iconPacks.selectPack'),
    });
  }

  /**
   * Handle selection
   * @private
   * @param actions
   */
  private handleQuickPickActions(actions: QuickPickItem[]): void {
    if (!actions || actions.length === 0) return;

    const decisions = actions.map((action) => action.description?.toLowerCase() ?? '');
    configService.activeIconPacks = this.findIconPacks(decisions);
  }

  /**
   * Checks if the current pack is selected
   * @param {IconPack} activeIconPacks
   * @param {string} pack
   * @returns {boolean}
   * @private
   */
  private isPackActive(activeIconPacks: IconPack[], pack: IconPack): boolean {
    return activeIconPacks.some((activePack) => activePack.toLowerCase() === pack.toLowerCase());
  }

  /**
   * Checks if no pack is active
   * @param {IconPack} activeIconPacks
   * @returns {boolean}
   * @private
   */
  private isNoneActive(activeIconPacks: IconPack[]): boolean {
    return this.isPackActive(activeIconPacks, IconPack.None);
  }

  /**
   * Find the icon pack of the selected decision
   * @returns {IconPack}
   * @private
   * @param decisions
   */
  private findIconPacks(decisions: string[]): IconPack[] {
    return decisions.map((decision) => {
      const enumKey = findEnumKey(IconPack, decision);
      return enumKey ? IconPack[enumKey] : IconPack.None;
    });
  }
}

export const iconPackPicker = new IconPackPicker();
