import i18next from 'i18next';
import type { AtomConfig } from 'src/@types/config';
import { IconPack, FolderTheme } from 'src/@types/config';
import type { IconAssociations } from 'src/@types/icons';
import { EXTENSION_KEY, ICON_THEME_KEY } from 'src/helpers/constants';
import { notificationsService } from 'src/helpers/NotificationsService';
import type { WorkspaceConfiguration } from 'vscode';
import { workspace, ConfigurationTarget } from 'vscode';

export class ConfigService implements AtomConfig {
  // region ------------------------ Atom Config -----------------------
  get showReloadMessage() {
    return this.getConfigValue<boolean>('showReloadMessage') ?? true;
  }

  set showReloadMessage(v: boolean) {
    this.setConfigValue('showReloadMessage', v);
  }

  get showUpdateMessage() {
    return this.getConfigValue<boolean>('showUpdateMessage') ?? true;
  }

  set showUpdateMessage(v: boolean) {
    this.setConfigValue('showUpdateMessage', v);
  }

  get showWelcomeMessage() {
    return this.getConfigValue<boolean>('showWelcomeMessage') ?? true;
  }

  set showWelcomeMessage(v: boolean) {
    this.setConfigValue('showWelcomeMessage', v);
  }

  get opacity() {
    return this.getConfigValue<number>('opacity') ?? 1;
  }

  set opacity(v: number) {
    this.setConfigValue('opacity', v);
  }

  get saturation() {
    return this.getConfigValue<number>('saturation') ?? 1;
  }

  set saturation(v: number) {
    this.setConfigValue('saturation', v);
  }

  get activeIconPacks() {
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
    this.setConfigValue('activeIconPacks', v);
  }

  get hidesExplorerArrows() {
    return this.getConfigValue<boolean>('hidesExplorerArrows') ?? false;
  }

  set hidesExplorerArrows(v: boolean) {
    this.setConfigValue('hidesExplorerArrows', v);
  }

  get foldersAssociations() {
    return this.getConfigValue<IconAssociations>('foldersAssociations');
  }

  get languagesAssociations() {
    return this.getConfigValue<IconAssociations>('languagesAssociations');
  }

  get filesAssociations() {
    return this.getConfigValue<IconAssociations>('filesAssociations');
  }

  get folderColor() {
    return this.getConfigValue<string>('folderColor') ?? '#90a4ae';
  }

  set folderColor(v: string) {
    this.setConfigValue('folderColor', v);
  }

  get folderTheme() {
    return this.getConfigValue<FolderTheme>('folderTheme') ?? FolderTheme.Specific;
  }

  set folderTheme(v: FolderTheme) {
    this.setConfigValue('folderTheme', v);
  }

  // endregion

  // region --------------------- Icon Theme Config ----------------------
  get iconTheme() {
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
