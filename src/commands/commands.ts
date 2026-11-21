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
import { ISLANDS_PRODUCT_THEME_ID } from 'src/productIcons/islandsProductTheme';
import { logger, configService } from 'src/services';
import { copyDiagnostics } from 'src/services/DiagnosticsService';
import { fontCheckService } from 'src/services/FontCheckService';
import { COLOR_THEMES } from 'src/themes/colorThemes';
import { commands, ConfigurationTarget, window, workspace } from 'vscode';

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

const useJetBrainsFonts = async () => {
  logger.info('Use the JetBrains fonts');
  await fontCheckService.use();
};

const removeJetBrainsFonts = async () => {
  logger.info('Stop using the JetBrains fonts');
  await fontCheckService.remove();
};

/** The `workbench` setting and value of each theme of the kit, chosen one by one from the walkthrough */
const KIT_THEMES = new Map<unknown, [setting: string, value: string]>([
  ['dark', ['colorTheme', COLOR_THEMES[0].label]],
  ['icons', ['iconTheme', EXTENSION_KEY]],
  ['light', ['colorTheme', COLOR_THEMES[1].label]],
  ['product', ['productIconTheme', ISLANDS_PRODUCT_THEME_ID]],
]);

/** Select one theme of the kit: `command:a-file-icon-vscode.useTheme?["icons"]` in the walkthrough */
const useTheme = async (kind?: unknown) => {
  const theme = KIT_THEMES.get(kind);
  if (!theme) return;
  logger.info(`Use the theme ${theme[1]}`);
  await workspace.getConfiguration('workbench').update(theme[0], theme[1], ConfigurationTarget.Global);
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
  copyDiagnostics,
  openColorMixer,
  openThemeMixer,
  removeJetBrainsFonts,
  restoreDefaultConfig,
  toggleIconPacks,
  toggleMonochrome,
  useJetBrainsFonts,
  useTheme,
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
