import { unwatchFile, watchFile } from 'node:fs';
import { registeredCommands } from 'src/commands/commands';
import { VERSION_KEY } from 'src/helpers/constants';
import { findFallbackTheme } from 'src/helpers/vscodeUtils';
import { initI18next } from 'src/i18n/i18next';
import { configChangeDetector } from 'src/services/ConfigChangeDetector';
import { configService } from 'src/services/ConfigService';
import { logger } from 'src/services/LoggingService';
import { notificationsService } from 'src/services/NotificationsService';
import { updatesService } from 'src/services/UpdatesService';
import { extensions, window, workspace } from 'vscode';

import type { ExtensionContext } from 'vscode';

/** Json of the fallback icon theme being watched */
let watchedFallbackTheme: string | undefined;

/**
 * Regenerate the theme files from the settings. A failure is shown to the user instead of only being logged,
 * otherwise the commands look like they do nothing (#73).
 */
const regenerateTheme = () => {
  try {
    configChangeDetector.listenForChanges();
  } catch (error) {
    logger.error(String(error));
    window.showErrorMessage(`Atom Material Icons: ${error instanceof Error ? error.message : String(error)}`);
  }
  watchFallbackTheme();
};

/**
 * The fallback icon theme rewrites its json when its own settings change: regenerate this theme then.
 * Polling the modification time works the same on every platform, unlike fs.watch.
 */
const watchFallbackTheme = () => {
  const path = findFallbackTheme(configService.fallbackIconTheme.trim())?.path;
  if (path === watchedFallbackTheme) return;

  unwatchFallbackTheme();
  watchedFallbackTheme = path;
  if (path) watchFile(path, { interval: 5000, persistent: false }, regenerateTheme);
};

const unwatchFallbackTheme = () => {
  if (watchedFallbackTheme) unwatchFile(watchedFallbackTheme, regenerateTheme);
  watchedFallbackTheme = undefined;
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
    context.subscriptions.push(...registeredCommands);

    // Initially trigger the config change detection
    regenerateTheme();

    // Observe changes in the config
    context.subscriptions.push(workspace.onDidChangeConfiguration(() => regenerateTheme()));

    // The fallback icon theme can be installed, updated or removed
    context.subscriptions.push(extensions.onDidChange(() => regenerateTheme()), { dispose: unwatchFallbackTheme });

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
