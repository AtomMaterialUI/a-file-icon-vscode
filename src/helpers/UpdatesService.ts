import type { Memento } from 'vscode';
import { extensions } from 'vscode';
import { EXTENSION_ID, VERSION_KEY, EXTENSION_KEY } from 'src/helpers/constants';
import { ThemeStatus } from 'src/helpers/enums';
import { logger } from './LoggingService';
import { configService } from './ConfigService';

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

        return this.isAlreadyActivated()
               ? ThemeStatus.Updated
               : ThemeStatus.NeverUsedBefore;
      } else if (pluginVersion && this.isGreaterVersion(pluginVersion, ownVersion)) {
        await this.updateStateVersion(state);

        return ThemeStatus.Updated;
      } else {
        return ThemeStatus.Current;
      }
    } catch (e) {
      logger.error(String(e));
      return ThemeStatus.Current;
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
   * Checks if the plugin is already activated, globally or not
   * @returns {boolean}
   * @private
   */
  private isAlreadyActivated(): boolean {
    return this.isActivated(true) || this.isActivated(false);
  }

  /**
   * Checks if the plugin is activated on the current workspace
   * @param {boolean} globally
   * @returns {boolean}
   * @private
   */
  private isActivated(globally = false): boolean {
    const iconTheme = configService.getConfig().inspect('workbench.iconTheme');
    if (!iconTheme) return false;

    if (globally) {
      return iconTheme.globalValue === EXTENSION_KEY;
    } else {
      return iconTheme.workspaceValue === EXTENSION_KEY;
    }
  }

  /**
   * Compares the plugin version to the state version.
   * @param {string} pluginVersion
   * @param {string} ownVersion
   * @returns {Boolean}
   * @private
   */
  private isGreaterVersion(pluginVersion: string, ownVersion: string): Boolean {
    return pluginVersion.localeCompare(
      ownVersion,
      undefined,
      { numeric: true, sensitivity: 'base' },
    ) === 1;
  }
}

export const updatesService = new UpdatesService();