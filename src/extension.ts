'use strict';

import type { ExtensionContext } from 'vscode';
import { window, workspace } from 'vscode';
import { registered } from './commands';
import { detectConfigChanges } from './helpers/changeDetection';
import { checkThemeStatus, versionKey } from './helpers/versioning';
import { showStartMessages } from './messages/start';
import { initTranslations } from 'src/i18n/i18next';

/**
 * This method is called when the extension is activated.
 * It initializes the core functionality of the extension.
 */
export const activate = async (context: ExtensionContext) => {
  try {
    await initTranslations();

    context.globalState.setKeysForSync([versionKey]);
    const status = await checkThemeStatus(context.globalState);
    showStartMessages(status);

    // Subscribe to the extension commands
    context.subscriptions.push(...registered);

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
