import i18next from 'i18next';
import { UpdateStatus } from 'src/@types/config';
import { EXTENSION_ID } from 'src/helpers/constants';
import { openBrowser } from 'src/helpers/vscodeUtils';
import { configService } from 'src/services/ConfigService';
import { logger } from 'src/services/LoggingService';
import { window } from 'vscode';

import type { MessageItem } from 'vscode';

type NotificationAction = MessageItem & {
  id: '' | 'activate' | 'neverShowAgain' | 'readChangelog';
};

export class NotificationsService {
  get activateAction(): NotificationAction {
    return configService.isAlreadyActivated()
      ? { id: '', title: '' }
      : { id: 'activate', title: i18next.t('activate') };
  }

  /**
   * Show relevant messages at start according to the theme status
   * @param {UpdateStatus} status
   */
  showStartMessages(status: UpdateStatus) {
    logger.debug(`Showing messages for ${status}`);
    switch (status) {
      case UpdateStatus.NeverUsedBefore: {
        logger.debug(`Showing welcome message`);
        this.showWelcomeMessage();
        break;
      }
      case UpdateStatus.Updated: {
        logger.debug(`Showing update message`);
        this.showUpdateMessage();
        break;
      }
      default: {
        logger.debug('Plugin is up to date');
      }
    }
  }

  /**
   * Show a message
   * @param {string} message
   */
  public showMessage(message: string): void {
    window.showInformationMessage(message);
  }

  // region --------------- Welcome Actions ----------------
  private showWelcomeMessage(): void {
    if (!configService.showReloadMessage) return;

    window
      .showInformationMessage<NotificationAction>(i18next.t('themeInstalled'), this.activateAction, {
        id: 'neverShowAgain',
        title: i18next.t('neverShowAgain'),
      })
      .then(this.handleWelcomeMessageActions);
  }

  private handleWelcomeMessageActions(action?: NotificationAction) {
    if (!action) return;

    switch (action.id) {
      case 'activate': {
        configService.activateIcons();
        break;
      }
      case 'neverShowAgain': {
        this.disableWelcomeMessage();
        break;
      }
      default: {
        break;
      }
    }
  }

  private disableWelcomeMessage() {
    configService.showWelcomeMessage = false;
  }

  // endregion

  // region  ------------ Update Actions ---------------
  private showUpdateMessage(): void {
    if (!configService.showUpdateMessage) return;

    window
      .showInformationMessage<NotificationAction>(
        i18next.t('themeUpdated'),
        this.activateAction,
        { id: 'readChangelog', title: i18next.t('readChangelog') },
        { id: 'neverShowAgain', title: i18next.t('neverShowAgain') },
      )
      .then(this.handleUpdateMessageActions);
  }

  private handleUpdateMessageActions(action?: NotificationAction) {
    if (!action) return;

    switch (action.id) {
      case 'activate': {
        configService.activateIcons();
        break;
      }
      case 'neverShowAgain': {
        this.disableWelcomeMessage();
        break;
      }
      case 'readChangelog': {
        openBrowser(`https://marketplace.visualstudio.com/items/${EXTENSION_ID}/changelog`);
        break;
      }
      default: {
        break;
      }
    }
  }

  // endregion
}

export const notificationsService = new NotificationsService();
