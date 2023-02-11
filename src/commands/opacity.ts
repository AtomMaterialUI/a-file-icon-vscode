import i18next from 'i18next';
import { validateOpacityValue } from 'src/helpers/utils';
import { defaultConfig } from 'src/icons/configUtils';
import { window } from 'vscode';
import { getMaterialIconsJSON, setThemeConfig } from '../helpers';

/** Command to toggle the folder icons. */
export const changeOpacity = async () => {
  try {
    const currentOpacityValue = getCurrentOpacityValue();
    const response = await showInput(currentOpacityValue);
    if (response) {
      await setOpacityConfig(+response);
    }
  }
  catch (error) {
    console.error(error);
  }
};

/** Show input to enter the opacity value. */
const showInput = (opacity: number) => {
  return window.showInputBox({
                               placeHolder: i18next.t('opacity.inputPlaceholder'),
                               ignoreFocusOut: true,
                               value: opacity.toString(),
                               validateInput: validateOpacityInput,
                             });
};

/** Validate the opacity value which was inserted by the user. */
const validateOpacityInput = (opacityInput: string) => {
  if (!validateOpacityValue(+opacityInput)) {
    return i18next.t('opacity.wrongValue');
  }
  return undefined;
};

/** Get the current value of the opacity of the icons. */
export const getCurrentOpacityValue = (): number => {
  const defaultOptions = defaultConfig();
  const config = getMaterialIconsJSON();
  return config?.atomConfig?.opacity ?? defaultOptions.opacity;
};

const setOpacityConfig = (opacity: number) => {
  return setThemeConfig('opacity', opacity, true);
};
