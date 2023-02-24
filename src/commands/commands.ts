import { toggleExplorerArrows } from 'src/commands/explorerArrows';
import { toggleGrayscale } from 'src/commands/grayscale';
import { restoreDefaultConfig } from 'src/commands/restoreConfig';
import { EXTENSION_KEY } from 'src/helpers/constants';
import { logger, iconPackManager } from 'src/services';
import { folderColorManager } from 'src/services/FolderColorManager';
import { folderThemeManager } from 'src/services/FolderThemeManager';
import { opacityManager } from 'src/services/OpacityManager';
import { saturationManager } from 'src/services/SaturationManager';
import { commands } from 'vscode';

/** Command to change the folder color. */
const changeFolderColor = async () => {
  logger.info('Open select folder color popup');
  await folderColorManager.openQuickPicker();
};

/** Command to change the folder theme. */
const changeFolderTheme = async () => {
  logger.info('Open select folder theme popup');
  await folderThemeManager.openQuickPicker();
};

/** Command to toggle the icons packs */
const toggleIconPacks = async () => {
  logger.info('Open toggle icon pack popup');
  await iconPackManager.openQuickPicker();
};

/** Command to set the opacity */
const changeOpacity = async () => {
  logger.info('Open opacity selection popup');
  await opacityManager.openQuickPicker();
};

/** Command to set the opacity */
const changeSaturation = async () => {
  logger.info('Open saturation selection popup');
  await saturationManager.openQuickPicker();
};

const extensionCommands: Record<string, () => Promise<void>> = {
  changeFolderColor,
  changeFolderTheme,
  changeOpacity,
  changeSaturation,
  restoreDefaultConfig,
  toggleExplorerArrows,
  toggleGrayscale,
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
