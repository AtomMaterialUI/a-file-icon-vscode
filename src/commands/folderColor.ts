import { QuickPickItem, window } from 'vscode';
import { getMaterialIconsJSON, setThemeConfig } from '../helpers';
import { translate } from '../i18n';
import { getDefaultIconOptions, validateHEXColorCode } from '../icons';

interface FolderColor {
  label: string;
  hex: string;
}

const iconPalette: FolderColor[] = [
  { label: 'Grey (Default)', hex: '#90a4ae' },
  { label: 'Blue', hex: '#42a5f5' },
  { label: 'Green', hex: '#7cb342' },
  { label: 'Teal', hex: '#26a69a' },
  { label: 'Red', hex: '#ef5350' },
  { label: 'Orange', hex: '#ff7043' },
  { label: 'Yellow', hex: '#fdd835' },
  { label: 'Custom Color', hex: 'Custom HEX Code' },
];

/** Command to toggle the folder icons. */
export const changeFolderColor = async () => {
  try {
    const status = checkFolderColorStatus();
    const response = await showQuickPickItems(status);
    if (response) {
      handleQuickPickActions(response);
    }
  } catch (error) {
    console.error(error);
  }
};

/** Show QuickPick items to select preferred color for the folder icons. */
const showQuickPickItems = (currentColor: string) => {
  const options = iconPalette.map(
    (color): QuickPickItem => ({
      description: color.label,
      label: isColorActive(color, currentColor) ? '\u2714' : '\u25FB',
    })
  );

  return window.showQuickPick(options, {
    placeHolder: translate('folders.color'),
    ignoreFocusOut: false,
    matchOnDescription: true,
  });
};

/** Handle the actions from the QuickPick. */
const handleQuickPickActions = async (value: QuickPickItem) => {
  if (!value || !value.description) {
    return;
  }
  if (value.description === 'Custom Color') {
    const value = await window.showInputBox({
      placeHolder: translate('folders.hexCode'),
      ignoreFocusOut: true,
      validateInput: validateColorInput,
    });
    if (value) {
      setColorConfig(value);
    }
  } else {
    const hexCode = iconPalette.find((c) => c.label === value.description)?.hex;
    if (hexCode) {
      setColorConfig(hexCode);
    }
  }
};

const validateColorInput = (colorInput: string) => {
  if (!validateHEXColorCode(colorInput)) {
    return translate('folders.wrongHexCode');
  }
  return undefined;
};

/** Check status of the folder color */
export const checkFolderColorStatus = (): string => {
  const defaultOptions = getDefaultIconOptions();
  const config = getMaterialIconsJSON();
  return config?.options?.folders?.color ?? defaultOptions.folders.color!;
};

const setColorConfig = (value: string) => {
  setThemeConfig('folders.color', value.toLowerCase(), true);
};

const isColorActive = (color: FolderColor, currentColor: string): boolean => {
  if (color.label === 'Custom Color') {
    return !iconPalette.some(
      (c) => c.hex.toLowerCase() === currentColor.toLowerCase()
    );
  }
  return color.hex.toLowerCase() === currentColor.toLowerCase();
};
