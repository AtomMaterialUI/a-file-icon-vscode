import { registeredCommands } from 'src/commands/commands';
import { VERSION_KEY } from 'src/helpers/constants';
import { initI18next } from 'src/i18n/i18next';
import { configChangeDetector } from 'src/services/ConfigChangeDetector';
import { logger } from 'src/services/LoggingService';
import { notificationsService } from 'src/services/NotificationsService';
import { updatesService } from 'src/services/UpdatesService';
import { window, workspace } from 'vscode';

import type { ExtensionContext } from 'vscode';

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
    configChangeDetector.listenForChanges();

    // Observe changes in the config
    workspace.onDidChangeConfiguration(() => configChangeDetector.listenForChanges());

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
