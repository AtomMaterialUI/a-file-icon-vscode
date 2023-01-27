import type { QuickPickItem} from 'vscode';
import { window } from 'vscode';
import { getMaterialIconsJSON, setThemeConfig, toTitleCase } from '../helpers';
import { IconPack } from '../models/index';
import i18next from 'i18next';

/** Command to toggle the icons packs */
export const toggleIconPacks = async () => {
  try {
    const activeIconPack = getActiveIconPack();
    const response = await showQuickPickItems(activeIconPack);
    if (response) {
      handleQuickPickActions(response);
    }
  } catch (error) {
    console.error(error);
  }
};

/** Show QuickPick items to select preferred configuration for the icon packs. */
const showQuickPickItems = (activePack: string) => {
  const packs = [...getAllIconPacks().sort(), 'none'];
  const options = packs.map((pack): QuickPickItem => {
    const packLabel = toTitleCase(pack.replace('_', ' + '));
    const active = isPackActive(activePack, pack);
    const iconPacksDeactivated = pack === 'none' && activePack === '';

    return {
      description: packLabel,
      detail: i18next.t(
        `iconPacks.${pack === 'none' ? 'disabled' : 'description'}`,
        packLabel,
      ),
      label: iconPacksDeactivated ? '\u2714' : active ? '\u2714' : '\u25FB',
    };
  });

  return window.showQuickPick(options, {
    placeHolder: i18next.t('iconPacks.selectPack'),
    ignoreFocusOut: false,
    matchOnDescription: true,
    matchOnDetail: true,
  });
};

/** Handle the actions from the QuickPick. */
const handleQuickPickActions = (value: QuickPickItem) => {
  if (!value || !value.description) {
    return;
  }
  const decision = value.description.replace(' + ', '_').toLowerCase();

  setThemeConfig('activeIconPack', decision === 'none' ? '' : decision, true);
};

const getActiveIconPack = (): string => {
  return getMaterialIconsJSON()?.options?.activeIconPack ?? '';
};

/** Get all packs that can be used in this icon theme. */
export const getAllIconPacks = (): string[] => {
  return Object.values(IconPack).map((p) => p.toLowerCase());
};

const isPackActive = (activePack: string, pack: string) => {
  return activePack.toLowerCase() === pack.toLowerCase();
};
