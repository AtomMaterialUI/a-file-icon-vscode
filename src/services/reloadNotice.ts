import i18next from 'i18next';
import { configService } from 'src/services/ConfigService';
import { commands, window } from 'vscode';

/** A reload notice is open: one at a time while the settings are being edited */
let asking = false;

/**
 * Offer to reload the window, which VS Code needs to read a color or product icon theme again
 * (`showReloadMessage` turns it off)
 */
export const offerReload = (message: string): void => {
  if (asking || !configService.showReloadMessage) return;
  asking = true;
  const reload = { title: i18next.t('colors.reloadWindow') };
  window.showInformationMessage(message, reload).then((action) => {
    asking = false;
    if (action === reload) commands.executeCommand('workbench.action.reloadWindow');
  });
};
