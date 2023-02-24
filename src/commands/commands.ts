import { toggleExplorerArrows } from 'src/commands/explorerArrows';
import { restoreDefaultConfig } from 'src/commands/restoreConfig';
import { EXTENSION_KEY } from 'src/helpers/constants';
import { iconPackPicker } from 'src/pickers';
import { folderColorPicker } from 'src/pickers/FolderColorPicker';
import { folderThemePicker } from 'src/pickers/FolderThemePicker';
import { opacityPicker } from 'src/pickers/OpacityPicker';
import { saturationPicker } from 'src/pickers/SaturationPicker';
import { logger } from 'src/services';
import { commands } from 'vscode';

/** Command to change the folder color. */
const changeFolderColor = async () => {
  logger.info('Open select folder color popup');
  await folderColorPicker.openQuickPicker();
};

/** Command to change the folder theme. */
const changeFolderTheme = async () => {
  logger.info('Open select folder theme popup');
  await folderThemePicker.openQuickPicker();
};

/** Command to toggle the icons packs */
const toggleIconPacks = async () => {
  logger.info('Open toggle icon pack popup');
  await iconPackPicker.openQuickPicker();
};

/** Command to set the opacity */
const changeOpacity = async () => {
  logger.info('Open opacity selection popup');
  await opacityPicker.openQuickPicker();
};

/** Command to set the opacity */
const changeSaturation = async () => {
  logger.info('Open saturation selection popup');
  await saturationPicker.openQuickPicker();
};

const extensionCommands: Record<string, () => Promise<void>> = {
  changeFolderColor,
  changeFolderTheme,
  changeOpacity,
  changeSaturation,
  restoreDefaultConfig,
  toggleExplorerArrows,
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
