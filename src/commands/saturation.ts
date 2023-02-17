import i18next from 'i18next';
import { validateSaturationValue } from 'src/helpers/utils';
import { defaultConfig } from 'src/icons/configUtils';
import { window } from 'vscode';

import { setThemeConfig, getMaterialIconsJSON } from '../helpers';

/** Show input to enter the saturation value. */
const showInput = (saturation: number) => {
  return window.showInputBox({
    ignoreFocusOut: true,
    placeHolder: i18next.t('saturation.inputPlaceholder'),
    validateInput: validateSaturationInput,
    value: saturation.toString(),
  });
};

/** Validate the saturation value which was inserted by the user. */
const validateSaturationInput = (saturationInput: string) => {
  if (!validateSaturationValue(+saturationInput)) {
    return i18next.t('saturation.wrongValue');
  }
  return;
};

const setSaturationConfig = (saturation: number) => {
  return setThemeConfig('saturation', saturation, true);
};

/** Command to toggle the folder icons. */
export const changeSaturation = async () => {
  try {
    const currentSaturationValue = getCurrentSaturationValue();
    const response = await showInput(currentSaturationValue);
    if (response) {
      await setSaturationConfig(+response);
    }
  }
  catch (error) {
    console.error(error);
  }
};

/** Get the current value of the saturation of the icons. */
export const getCurrentSaturationValue = (): number => {
  const defaultOptions = defaultConfig();
  const config = getMaterialIconsJSON();
  return config?.atomConfig?.saturation ?? defaultOptions.saturation;
};
