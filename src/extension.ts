import { unwatchFile, watchFile } from 'node:fs';
import { registerCommands } from 'src/commands/commands';
import { VERSION_KEY } from 'src/helpers/constants';
import { findLayerThemes } from 'src/helpers/vscodeUtils';
import { initI18next } from 'src/i18n/i18next';
import { configChangeDetector } from 'src/services/ConfigChangeDetector';
import { configService } from 'src/services/ConfigService';
import { logger } from 'src/services/LoggingService';
import { ThemeMixerPanel } from 'src/panels/ThemeMixerPanel';
import { notificationsService } from 'src/services/NotificationsService';
import { updatesService } from 'src/services/UpdatesService';
import { extensions, window, workspace } from 'vscode';

import type { ExtensionContext } from 'vscode';

/** Json files of the other icon themes being watched */
const watchedThemes = new Set<string>();

/**
 * Regenerate the theme files from the settings. A failure is shown to the user instead of only being logged,
 * otherwise the commands look like they do nothing (#73).
 */
const regenerateTheme = () => {
  try {
    configChangeDetector.listenForChanges();
  } catch (error) {
    logger.error(String(error));
    window.showErrorMessage(`Cool Icon: ${error instanceof Error ? error.message : String(error)}`);
  }
  watchLayerThemes();
  // the theme mixer previews the regenerated theme
  ThemeMixerPanel.refresh();
};

/**
 * The other icon themes rewrite their json when their own settings change: regenerate this theme then.
 * Polling the modification time works the same on every platform, unlike fs.watch.
 */
const watchLayerThemes = () => {
  const paths = new Set(findLayerThemes(configService.getIconSettings()).map((theme) => theme.path));

  for (const path of watchedThemes) {
    if (paths.has(path)) continue;
    unwatchFile(path, regenerateTheme);
    watchedThemes.delete(path);
  }
  for (const path of paths) {
    if (watchedThemes.has(path)) continue;
    watchFile(path, { interval: 5000, persistent: false }, regenerateTheme);
    watchedThemes.add(path);
  }
};

const unwatchLayerThemes = () => {
  for (const path of watchedThemes) unwatchFile(path, regenerateTheme);
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

    // Subscribe to the extension commands
    context.subscriptions.push(...registerCommands(context));

    // Initially trigger the config change detection
    regenerateTheme();

    context.subscriptions.push(
      // Observe changes in the config
      workspace.onDidChangeConfiguration(() => regenerateTheme()),
      // The fallback icon theme can be installed, updated or removed
      extensions.onDidChange(() => regenerateTheme()),
      { dispose: unwatchLayerThemes },
    );

    // Observe if the window got focused to trigger config changes
    window.onDidChangeWindowState((state) => {
      if (state.focused) {
        // configChangeDetector.listenForChanges();
      }
    });
  }
  catch (error) {
    logger.error(String(error));
  }
};

/** This method is called when the extension is deactivated */
export const deactivate = () => {
  // do nothing
};
