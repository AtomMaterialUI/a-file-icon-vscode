import i18next from 'i18next';
import { EXTENSION_KEY } from 'src/helpers/constants';
import { isValidHexColorCode } from 'src/helpers/utils';
import { iconPackPicker } from 'src/pickers';
import { arrowThemePicker } from 'src/pickers/ArrowThemePicker';
import { folderColorPicker } from 'src/pickers/FolderColorPicker';
import { folderThemePicker } from 'src/pickers/FolderThemePicker';
import { opacityPicker } from 'src/pickers/OpacityPicker';
import { saturationPicker } from 'src/pickers/SaturationPicker';
import { ThemeMixerPanel } from 'src/panels/ThemeMixerPanel';
import { logger, configService } from 'src/services';
import { commands, window } from 'vscode';

import type { ExtensionContext } from 'vscode';

let extensionContext: ExtensionContext | undefined;

const changeFolderColor = async () => {
  logger.info('Open select folder color popup');
  await folderColorPicker.openQuickPicker();
};

const changeFolderTheme = async () => {
  logger.info('Open select folder theme popup');
  await folderThemePicker.openQuickPicker();
};

const toggleIconPacks = async () => {
  logger.info('Open toggle icon pack popup');
  await iconPackPicker.openQuickPicker();
};

const changeOpacity = async () => {
  logger.info('Open opacity selection popup');
  await opacityPicker.openQuickPicker();
};

const changeSaturation = async () => {
  logger.info('Open saturation selection popup');
  await saturationPicker.openQuickPicker();
};

const changeArrowTheme = async () => {
  logger.info('Open select arrow theme popup');
  await arrowThemePicker.openQuickPicker();
};

const toggleMonochrome = async () => {
  logger.info('Toggle monochrome icons');
  configService.monochrome = !configService.monochrome;
};

const changeMonochromeColor = async () => {
  logger.info('Open monochrome color input');
  const color = await window.showInputBox({
    placeHolder: i18next.t('folders.hexCode'),
    validateInput: (value) => (isValidHexColorCode(value) ? undefined : i18next.t('folders.wrongHexCode')),
    value: configService.monochromeColor,
  });
  if (!color) return;

  configService.monochromeColor = color;
  // picking a color means the user wants to see it
  if (!configService.monochrome) configService.monochrome = true;
};

/** The tab can be given when the command is run from code: `executeCommand('…openThemeMixer', 'product')` */
const openThemeMixer = async (tab?: unknown) => {
  logger.info('Open the theme mixer');
  const tabs = new Set<unknown>(['colors', 'icons', 'product']);
  if (extensionContext) ThemeMixerPanel.show(extensionContext, tabs.has(tab) ? (tab as 'colors' | 'icons' | 'product') : 'icons');
};

const openColorMixer = async () => {
  logger.info('Open the theme mixer on its Colors tab');
  if (extensionContext) ThemeMixerPanel.show(extensionContext, 'colors');
};

const restoreDefaultConfig = async () => {
  logger.info('Resetting default config');
  configService.resetConfig();
};

const extensionCommands: Record<string, (...parameters: unknown[]) => Promise<void>> = {
  changeArrowTheme,
  changeFolderColor,
  changeFolderTheme,
  changeMonochromeColor,
  changeOpacity,
  changeSaturation,
  openColorMixer,
  openThemeMixer,
  restoreDefaultConfig,
  toggleIconPacks,
  toggleMonochrome,
};

/**
 * Register the commands of package.json
 * @returns their disposables
 */
export const registerCommands = (context: ExtensionContext) => {
  extensionContext = context;
  return Object.keys(extensionCommands).map((commandName) => {
    const callCommand = (...parameters: unknown[]) => extensionCommands[commandName](...parameters);
    return commands.registerCommand(
      `${EXTENSION_KEY}.${commandName}`,
      callCommand,
    );
  });
};
