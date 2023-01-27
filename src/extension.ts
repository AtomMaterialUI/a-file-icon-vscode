'use strict';

import type { ExtensionContext } from 'vscode';
import { window, workspace } from 'vscode';
import { registeredCommands } from 'src/commands/commands';
import { detectConfigChanges } from './helpers/changeDetection';
import { initI18next } from 'src/i18n/i18next';
import { logger } from 'src/helpers/LoggingService';
import { VERSION_KEY } from 'src/helpers/constants';
import { updatesService } from 'src/helpers/UpdatesService';
import { notificationsService } from 'src/helpers/NotificationsService';

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
    detectConfigChanges();

    // Observe changes in the config
    workspace.onDidChangeConfiguration(detectConfigChanges);

    // Observe if the window got focused to trigger config changes
    window.onDidChangeWindowState((state) => {
      if (state.focused) {
        detectConfigChanges();
      }
    });
  } catch (error) {
    console.error(error);
  }
};

/** This method is called when the extension is deactivated */
export const deactivate = () => {};
