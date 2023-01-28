import { iconPackManager } from 'src/helpers/IconPackManager';

/** Command to toggle the icons packs */
export const toggleIconPacks = async () => {
  await iconPackManager.toggleIconPacks();
};

