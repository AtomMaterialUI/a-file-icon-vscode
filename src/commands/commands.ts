import { toggleExplorerArrows } from 'src/commands/explorerArrows';
import { changeFolderColor } from 'src/commands/folderColor';
import { changeFolderTheme } from 'src/commands/folderTheme';
import { toggleGrayscale } from 'src/commands/grayscale';
import { toggleIconPacks } from 'src/commands/iconPacks';
import { changeOpacity } from 'src/commands/opacity';
import { restoreDefaultConfig } from 'src/commands/restoreConfig';
import { changeSaturation } from 'src/commands/saturation';
import { EXTENSION_KEY } from 'src/helpers/constants';
import { commands } from 'vscode';

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
