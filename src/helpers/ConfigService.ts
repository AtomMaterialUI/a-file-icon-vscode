import { workspace } from 'vscode';

export class ConfigService {
  /**
   * Return current workspaces configuration
   * @param {string} section
   * @returns {WorkspaceConfiguration}
   */
  getConfig(section?: string) {
    return workspace.getConfiguration(section);
  }
}

export const configService = new ConfigService();