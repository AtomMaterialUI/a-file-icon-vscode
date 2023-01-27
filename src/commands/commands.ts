import { activateIcons } from 'src/commands/activate';
import { toggleIconPacks } from 'src/commands/iconPacks';
import { changeFolderTheme } from 'src/commands/folders';
import { changeFolderColor } from 'src/commands/folderColor';
import { restoreDefaultConfig } from 'src/commands/restoreConfig';
import { toggleExplorerArrows } from 'src/commands/explorerArrows';
import { changeOpacity } from 'src/commands/opacity';
import { toggleGrayscale } from 'src/commands/grayscale';
import { changeSaturation } from 'src/commands/saturation';
import { commands } from 'vscode';
import { EXTENSION_KEY } from 'src/helpers/constants';

const extensionCommands: Record<string, () => Promise<void>> = {
  activateIcons,
  toggleIconPacks,
  changeFolderTheme,
  changeFolderColor,
  restoreDefaultConfig,
  toggleExplorerArrows,
  changeOpacity,
  toggleGrayscale,
  changeSaturation,
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
