import { UpdateStatus } from 'src/@types/config';
import { EXTENSION_ID, VERSION_KEY } from 'src/helpers/constants';
import { configService } from 'src/services/ConfigService';
import { logger } from 'src/services/LoggingService';
import { extensions } from 'vscode';

import type { Memento } from 'vscode';

export class UpdatesService {
  /**
   * Checks the current version of the plugin, prompting for updates if needed
   * @param {Memento} state
   */
  async checkUpdateStatus(state: Memento) {
    try {
      const ownVersion = state.get(VERSION_KEY);
      const pluginVersion = this.getPluginVersion();
      logger.info(`Current Version: ${ownVersion}, Plugin Version: ${pluginVersion}`);

      // First installation
      if (ownVersion === undefined || typeof ownVersion !== 'string') {
        await this.updateStateVersion(state);

        return configService.isAlreadyActivated()
          ? UpdateStatus.Updated
          : UpdateStatus.NeverUsedBefore;
      }
      else if (pluginVersion && this.isGreaterVersion(pluginVersion, ownVersion)) {
        await this.updateStateVersion(state);

        return UpdateStatus.Updated;
      }
      else {
        return UpdateStatus.Current;
      }
    }
    catch (error) {
      logger.error(String(error));
      return UpdateStatus.Current;
    }
  }

  /**
   * Return the currently available version of the plugin
   * @returns {string | undefined}
   * @private
   */
  getPluginVersion(): string | undefined {
    const extension = extensions.getExtension(EXTENSION_ID);

    return extension?.packageJSON.version;
  }

  /**
   * Update the state version with the one from the marketplace
   * @param {Memento} state
   * @returns {Promise<void>}
   * @private
   */
  private async updateStateVersion(state: Memento): Promise<void> {
    const currentVersion = this.getPluginVersion();
    if (currentVersion) {
      return state.update(VERSION_KEY, currentVersion);
    }
  }

  /**
   * Compares the plugin version to the state version.
   * @param {string} pluginVersion
   * @param {string} ownVersion
   * @returns {Boolean}
   * @private
   */
  private isGreaterVersion(pluginVersion: string, ownVersion: string): boolean {
    return pluginVersion.localeCompare(
      ownVersion,
      undefined,
      { numeric: true, sensitivity: 'base' },
    ) === 1;
  }
}

export const updatesService = new UpdatesService();