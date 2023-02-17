import i18next from 'i18next';
import { validateHEXColorCode } from 'src/helpers/utils';
import { defaultConfig } from 'src/icons/configUtils';
import { window } from 'vscode';

import { getMaterialIconsJSON, setThemeConfig } from '../helpers';

import type { QuickPickItem } from 'vscode';

type FolderColor = {
  label: string;
  hex: string;
};

const iconPalette: FolderColor[] = [
  { hex: '#90a4ae', label: 'Grey (Default)' },
  { hex: '#42a5f5', label: 'Blue' },
  { hex: '#7cb342', label: 'Green' },
  { hex: '#26a69a', label: 'Teal' },
  { hex: '#ef5350', label: 'Red' },
  { hex: '#ff7043', label: 'Orange' },
  { hex: '#fdd835', label: 'Yellow' },
  { hex: 'Custom HEX Code', label: 'Custom Color' },
];

/** Command to toggle the folder icons. */
export const changeFolderColor = async () => {
  try {
    const status = checkFolderColorStatus();
    const response = await showQuickPickItems(status);
    if (response) {
      handleQuickPickActions(response);
    }
  }
  catch (error) {
    console.error(error);
  }
};

/** Show QuickPick items to select preferred color for the folder icons. */
const showQuickPickItems = (currentColor: string) => {
  const options = iconPalette.map(
    (color): QuickPickItem => ({
      description: color.label,
      label: isColorActive(color, currentColor) ? '\u2714' : '\u25FB',
    }),
  );

  return window.showQuickPick(options, {
    ignoreFocusOut: false,
    matchOnDescription: true,
    placeHolder: i18next.t('folders.color'),
  });
};

/** Handle the actions from the QuickPick. */
const handleQuickPickActions = async (value: QuickPickItem) => {
  if (!value || !value.description) {
    return;
  }
  if (value.description === 'Custom Color') {
    const value = await window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: i18next.t('folders.hexCode'),
      validateInput: validateColorInput,
    });
    if (value) {
      setColorConfig(value);
    }
  }
  else {
    const hexCode = iconPalette.find((c) => c.label === value.description)?.hex;
    if (hexCode) {
      setColorConfig(hexCode);
    }
  }
};

const validateColorInput = (colorInput: string) => {
  if (!validateHEXColorCode(colorInput)) {
    return i18next.t('folders.wrongHexCode');
  }
  return;
};

/** Check status of the folder color */
export const checkFolderColorStatus = (): string => {
  const defaultOptions = defaultConfig();
  const config = getMaterialIconsJSON();
  return config?.atomConfig?.folderColor ?? defaultOptions.folderColor!;
};

const setColorConfig = (value: string) => {
  setThemeConfig('folders.color', value.toLowerCase(), true);
};

const isColorActive = (color: FolderColor, currentColor: string): boolean => {
  if (color.label === 'Custom Color') {
    return !iconPalette.some((c) => c.hex.toLowerCase() === currentColor.toLowerCase());
  }
  return color.hex.toLowerCase() === currentColor.toLowerCase();
};
