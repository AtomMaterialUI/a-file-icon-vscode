import { unwatchFile, watchFile } from 'node:fs';
import { registerCommands } from 'src/commands/commands';
import { EXTENSION_KEY, VERSION_KEY } from 'src/helpers/constants';
import { findLayerThemes } from 'src/helpers/vscodeUtils';
import { initI18next } from 'src/i18n/i18next';
import { configChangeDetector } from 'src/services/ConfigChangeDetector';
import { colorThemeService } from 'src/services/ColorThemeService';
import { configService } from 'src/services/ConfigService';
import { fontCheckService } from 'src/services/FontCheckService';
import { logger } from 'src/services/LoggingService';
import { ThemeMixerPanel } from 'src/panels/ThemeMixerPanel';
import { notificationsService } from 'src/services/NotificationsService';
import { updatesService } from 'src/services/UpdatesService';
import { extensions, window, workspace } from 'vscode';

import type { ConfigurationChangeEvent, ExtensionContext } from 'vscode';

/** Json files of the other icon themes being watched */
const watchedThemes = new Set<string>();

/**
 * Events often come in bursts (two settings written by the theme mixer, an extension installed with its dependencies,
 * a theme json rewritten in several steps): the theme is regenerated once after the last one.
 */
const REGENERATE_DELAY = 300;
let regenerateTimer: NodeJS.Timeout | undefined;

const scheduleRegenerate = () => {
  clearTimeout(regenerateTimer);
  regenerateTimer = setTimeout(() => {
    regenerateTimer = undefined;
    regenerateTheme();
  }, REGENERATE_DELAY);
};

const cancelRegenerate = () => {
  clearTimeout(regenerateTimer);
  regenerateTimer = undefined;
};

/** The settings the generated theme reads: this extension's, and the file associations for the mixed themes */
const affectsTheme = (event: ConfigurationChangeEvent) =>
  event.affectsConfiguration(EXTENSION_KEY) || event.affectsConfiguration('files.associations');

/**
 * Regenerate the theme files from the settings. A failure is shown to the user instead of only being logged,
 * otherwise the commands look like they do nothing (#73).
 */
const regenerateTheme = () => {
  try {
    configChangeDetector.listenForChanges();
  } catch (error) {
    logger.error(String(error));
    window.showErrorMessage(`Cool Theme: ${error instanceof Error ? error.message : String(error)}`);
  }
  try {
    colorThemeService.regenerate();
  } catch (error) {
    logger.error(String(error));
    window.showErrorMessage(`Cool Theme: ${error instanceof Error ? error.message : String(error)}`);
  }
  watchLayerThemes();
  // the theme mixer previews the regenerated theme
  ThemeMixerPanel.refresh();
};

/**
 * The other icon themes rewrite their json when their own settings change, and a color theme file changes when its
 * extension is updated or developed: regenerate the themes then.
 * Polling the modification time works the same on every platform, unlike fs.watch.
 */
const watchLayerThemes = () => {
  const paths = new Set([...findLayerThemes(configService.getIconSettings()).map((theme) => theme.path), ...colorThemeService.watchedPaths()]);

  for (const path of watchedThemes) {
    if (paths.has(path)) continue;
    unwatchFile(path, scheduleRegenerate);
    watchedThemes.delete(path);
  }
  for (const path of paths) {
    if (watchedThemes.has(path)) continue;
    watchFile(path, { interval: 5000, persistent: false }, scheduleRegenerate);
    watchedThemes.add(path);
  }
};

const unwatchLayerThemes = () => {
  for (const path of watchedThemes) unwatchFile(path, scheduleRegenerate);
  watchedThemes.clear();
};

/**
 * When the extension gets activated
 * @param {ExtensionContext} context
 * @returns {Promise<void>}
 */
export const activate = async (context: ExtensionContext) => {
  try {
    // Translations
    await initI18next();
    logger.debug('Translations loaded.');

    // Init for sync
    context.globalState.setKeysForSync([VERSION_KEY]);

    // checking for updates
    logger.debug('Checking for new updates...');
    const status = await updatesService.checkUpdateStatus(context.globalState);

    // Start notification
    notificationsService.showStartMessages(status);

    // Suggest the fonts of the default editor font when they are missing (not awaited: it waits for the user)
    fontCheckService.check(context).catch((error: unknown) => logger.error(String(error)));

    // Subscribe to the extension commands
    context.subscriptions.push(...registerCommands(context));

    // Initially trigger the config change detection, after the activation so it does not delay it
    scheduleRegenerate();

    context.subscriptions.push(
      // Observe changes in the settings the theme reads: VS Code fires this event for every setting of every extension
      workspace.onDidChangeConfiguration((event) => {
        if (affectsTheme(event)) scheduleRegenerate();
      }),
      // The fallback icon theme can be installed, updated or removed
      extensions.onDidChange(() => scheduleRegenerate()),
      { dispose: cancelRegenerate },
      { dispose: unwatchLayerThemes },
    );
  }
  catch (error) {
    logger.error(String(error));
  }
};

/** This method is called when the extension is deactivated: nothing is left pending or watched */
export const deactivate = () => {
  cancelRegenerate();
  unwatchLayerThemes();
};
