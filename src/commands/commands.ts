import { setThemeConfig } from 'src/helpers';
import { EXTENSION_KEY } from 'src/helpers/constants';
import { iconPackPicker } from 'src/pickers';
import { arrowThemePicker } from 'src/pickers/ArrowThemePicker';
import { folderColorPicker } from 'src/pickers/FolderColorPicker';
import { folderThemePicker } from 'src/pickers/FolderThemePicker';
import { opacityPicker } from 'src/pickers/OpacityPicker';
import { saturationPicker } from 'src/pickers/SaturationPicker';
import { logger, configService } from 'src/services';
import { commands } from 'vscode';

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

const restoreDefaultConfig = async () => {
  logger.info('Resetting default config');
  configService.resetConfig();

  await setThemeConfig('activeIconPacks', undefined, true);
  await setThemeConfig('folders.theme', undefined, true);
  await setThemeConfig('folders.color', undefined, true);
  await setThemeConfig('opacity', undefined, true);
  await setThemeConfig('saturation', undefined, true);
  await setThemeConfig('files.associations', undefined, true);
  await setThemeConfig('folders.associations', undefined, true);
  await setThemeConfig('languages.associations', undefined, true);
};

const extensionCommands: Record<string, () => Promise<void>> = {
  changeArrowTheme,
  changeFolderColor,
  changeFolderTheme,
  changeOpacity,
  changeSaturation,
  restoreDefaultConfig,
  toggleIconPacks,
};

/**
 * List of registered commands from package.json
 * @type {Disposable[]}
 */
export const registeredCommands = Object.keys(extensionCommands).map((commandName) => {
  const callCommand = () => extensionCommands[commandName]();
  return commands.registerCommand(
    `${EXTENSION_KEY}.${commandName}`,
    callCommand,
  );
});
