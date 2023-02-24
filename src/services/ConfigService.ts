import i18next from 'i18next';
import { FolderTheme, IconPack, ArrowTheme } from 'src/@types/config';
import { EXTENSION_KEY, ICON_THEME_KEY } from 'src/helpers/constants';
import { getDefaultConfig } from 'src/icons/configUtils';
import { notificationsService } from 'src/services/NotificationsService';
import { ConfigurationTarget, workspace } from 'vscode';

import type { IconConfiguration } from 'src/models';
import type { WorkspaceConfiguration } from 'vscode';
import type { IconAssociations } from 'src/@types/icons';
import type { AtomConfig } from 'src/@types/config';

export class ConfigService implements AtomConfig {
  // region ------------------------ Atom Config -----------------------
  get showReloadMessage(): boolean {
    return this.getConfigValue<boolean>('showReloadMessage') ?? true;
  }

  set showReloadMessage(v: boolean) {
    this.setConfigValue('showReloadMessage', v, ConfigurationTarget.Global);
  }

  get showUpdateMessage(): boolean {
    return this.getConfigValue<boolean>('showUpdateMessage') ?? true;
  }

  set showUpdateMessage(v: boolean) {
    this.setConfigValue('showUpdateMessage', v, ConfigurationTarget.Global);
  }

  get showWelcomeMessage(): boolean {
    return this.getConfigValue<boolean>('showWelcomeMessage') ?? true;
  }

  set showWelcomeMessage(v: boolean) {
    this.setConfigValue('showWelcomeMessage', v, ConfigurationTarget.Global);
  }

  get opacity(): number {
    return this.getConfigValue<number>('opacity') ?? 1;
  }

  set opacity(v: number) {
    this.setConfigValue('opacity', v, ConfigurationTarget.Workspace);
  }

  get saturation(): number {
    return this.getConfigValue<number>('saturation') ?? 1;
  }

  set saturation(v: number) {
    this.setConfigValue('saturation', v, ConfigurationTarget.Workspace);
  }

  get activeIconPacks(): IconPack[] {
    return (
      this.getConfigValue<IconPack[]>('activeIconPacks') ?? [
        IconPack.Angular,
        IconPack.React,
        IconPack.Phalcon,
        IconPack.Rails,
        IconPack.Vue,
      ]
    );
  }

  set activeIconPacks(v: IconPack[]) {
    this.setConfigValue('activeIconPacks', v, ConfigurationTarget.Workspace);
  }

  get foldersAssociations(): IconAssociations | undefined {
    return this.getConfigValue<IconAssociations>('foldersAssociations');
  }

  get languagesAssociations(): IconAssociations | undefined {
    return this.getConfigValue<IconAssociations>('languagesAssociations');
  }

  get filesAssociations(): IconAssociations | undefined {
    return this.getConfigValue<IconAssociations>('filesAssociations');
  }

  get folderColor(): string {
    return this.getConfigValue<string>('folderColor') ?? '#90a4ae';
  }

  set folderColor(v: string) {
    this.setConfigValue('folderColor', v, ConfigurationTarget.Workspace);
  }

  get folderTheme(): FolderTheme {
    return this.getConfigValue<FolderTheme>('folderTheme') ?? FolderTheme.Specific;
  }

  set folderTheme(v: FolderTheme) {
    this.setConfigValue('folderTheme', v, ConfigurationTarget.Workspace);
  }

  get arrowTheme(): ArrowTheme {
    return this.getConfigValue<ArrowTheme>('arrowTheme') ?? ArrowTheme.Material;
  }

  set arrowTheme(v: ArrowTheme) {
    this.setConfigValue('arrowTheme', v, ConfigurationTarget.Workspace);
  }

  // endregion

  // region --------------------- Icon Theme Config ----------------------
  get iconTheme(): string {
    return this.getConfig().get<string>(ICON_THEME_KEY) ?? '';
  }

  set iconTheme(v: string) {
    this.getConfig().update(ICON_THEME_KEY, v, ConfigurationTarget.Global);

    // local workspace
    if (this.getConfig().inspect(ICON_THEME_KEY)?.workspaceValue) {
      this.getConfig().update(ICON_THEME_KEY, v, ConfigurationTarget.Workspace);
    }

    notificationsService.showMessage(i18next.t('activated'));
  }

  // endregion

  /**
   * Checks if the plugin is already activated, globally or not
   * @returns {boolean}
   * @private
   */
  public isAlreadyActivated(): boolean {
    return this.isActivated();
  }

  /**
   * Activate the plugin icons by settings the icon workbench
   */
  public activateIcons(): void {
    this.iconTheme = EXTENSION_KEY;
  }

  /**
   * Get a value from the configuration
   * @param {keyof AtomConfig} key
   * @returns {any | undefined} the value to get
   * @private
   */
  public getConfigValue<T>(key: keyof AtomConfig): T | undefined {
    return this.getPluginConfig().get<T>(key);
  }

  /**
   * Set a value from the configuration
   * @param {keyof AtomConfig} key the key to set
   * @param value the value to set
   * @param scope a scope, that can be either global, workspace or folder based
   * @private
   */
  public setConfigValue(
    key: keyof AtomConfig,
    value: unknown,
    scope: ConfigurationTarget = ConfigurationTarget.WorkspaceFolder,
  ): void {
    this.getPluginConfig().update(key, value, scope);
  }

  public getChanges(config: IconConfiguration) {
    const changes: Partial<AtomConfig> = {};

    if (this.opacity !== config.atomConfig?.opacity) {
      changes.opacity = this.opacity;
    }
    if (this.saturation !== config.atomConfig?.saturation) {
      changes.saturation = this.saturation;
    }
    if (this.folderColor !== config.atomConfig?.folderColor) {
      changes.folderColor = this.folderColor;
    }
    if (this.folderTheme !== config.atomConfig?.folderTheme) {
      changes.folderTheme = this.folderTheme;
    }
    if (this.arrowTheme !== config.atomConfig?.arrowTheme) {
      changes.arrowTheme = this.arrowTheme;
    }
    if (this.activeIconPacks !== config.atomConfig?.activeIconPacks) {
      changes.activeIconPacks = this.activeIconPacks;
    }
    // if (this.filesAssociations !== config.atomConfig?.filesAssociations) {
    //   changes.filesAssociations = this.filesAssociations;
    // }

    return changes;
  }

  public resetConfig() {
    const defaultConfig = getDefaultConfig();
    this.activeIconPacks = defaultConfig.activeIconPacks;
    this.arrowTheme = defaultConfig.arrowTheme;
    this.folderColor = defaultConfig.folderColor;
    this.folderTheme = defaultConfig.folderTheme;
    this.opacity = defaultConfig.opacity;
    this.saturation = defaultConfig.saturation;
    this.showReloadMessage = true;
    this.showUpdateMessage = true;
    this.showWelcomeMessage = true;
  }

  /**
   * Checks if the plugin is activated
   * @returns {boolean}
   * @private
   */
  private isActivated(): boolean {
    return this.iconTheme === EXTENSION_KEY;
  }

  /**
   * Return the plugin configuration
   * @returns {WorkspaceConfiguration} the configuration section
   * @private
   */
  private getPluginConfig(): WorkspaceConfiguration {
    return this.getConfig(EXTENSION_KEY);
  }

  /**
   * Return a configuration section
   * @param {string} section the configuration section
   * @returns {WorkspaceConfiguration}
   */
  private getConfig(section?: string): WorkspaceConfiguration {
    return workspace.getConfiguration(section);
  }
}

export const configService = new ConfigService();
