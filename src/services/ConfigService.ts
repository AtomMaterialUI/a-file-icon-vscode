import i18next from 'i18next';
import { EXTENSION_KEY, ICON_THEME_KEY } from 'src/helpers/constants';
import { ICON_SETTING_KEYS } from 'src/@types/config';
import { isDeepEqual } from 'src/helpers/utils';
import { getDefaultConfig } from 'src/icons/configUtils';
import { logger } from 'src/services/LoggingService';
import { notificationsService } from 'src/services/NotificationsService';
import { ConfigurationTarget, window, workspace } from 'vscode';

import type { ProductConfiguration } from 'src/models/ProductConfiguration';
import type { WorkspaceConfiguration } from 'vscode';
import type { IconConfiguration } from 'src/models/IconConfiguration';
import type { FolderTheme, ArrowTheme, AtomConfig, IconPack, IconSettings } from 'src/@types/config';
import type { IconAssociations } from 'src/@types/associations';

/** Theme files generated before associations were stored have no value for them */
const EMPTY_DEFAULTS: Partial<IconSettings> = {
  fallbackIconTheme: '',
  filesAssociations: {},
  foldersAssociations: {},
  hideFileIcons: false,
  languagesAssociations: {},
  monochrome: false,
  monochromeColor: getDefaultConfig().monochromeColor,
};

export class ConfigService implements AtomConfig {
  // region ------------------------ Atom Config -----------------------
  get showReloadMessage(): boolean {
    return this.getConfigValue<boolean>('showReloadMessage') ?? getDefaultConfig().showReloadMessage;
  }

  set showReloadMessage(v: boolean) {
    this.setConfigValue('showReloadMessage', v, ConfigurationTarget.Global);
  }

  get showUpdateMessage(): boolean {
    return this.getConfigValue<boolean>('showUpdateMessage') ?? getDefaultConfig().showUpdateMessage;
  }

  set showUpdateMessage(v: boolean) {
    this.setConfigValue('showUpdateMessage', v, ConfigurationTarget.Global);
  }

  get showWelcomeMessage(): boolean {
    return this.getConfigValue<boolean>('showWelcomeMessage') ?? getDefaultConfig().showWelcomeMessage;
  }

  set showWelcomeMessage(v: boolean) {
    this.setConfigValue('showWelcomeMessage', v, ConfigurationTarget.Global);
  }

  get arrowTheme(): ArrowTheme {
    return this.getConfigValue<ArrowTheme>('arrowTheme') ?? getDefaultConfig().arrowTheme;
  }

  set arrowTheme(v: ArrowTheme) {
    this.setConfigValue('arrowTheme', v, ConfigurationTarget.Workspace);
  }

  get folderTheme(): FolderTheme {
    return this.getConfigValue<FolderTheme>('folderTheme') ?? getDefaultConfig().folderTheme;
  }

  set folderTheme(v: FolderTheme) {
    this.setConfigValue('folderTheme', v, ConfigurationTarget.Workspace);
  }

  get opacity(): number {
    return this.getConfigValue<number>('opacity') ?? getDefaultConfig().opacity;
  }

  set opacity(v: number) {
    this.setConfigValue('opacity', v, ConfigurationTarget.Workspace);
  }

  get saturation(): number {
    return this.getConfigValue<number>('saturation') ?? getDefaultConfig().saturation;
  }

  set saturation(v: number) {
    this.setConfigValue('saturation', v, ConfigurationTarget.Workspace);
  }

  get activeIconPacks(): IconPack[] {
    return (
      this.getConfigValue<IconPack[]>('activeIconPacks') ?? getDefaultConfig().activeIconPacks
    );
  }

  set activeIconPacks(v: IconPack[]) {
    this.setConfigValue('activeIconPacks', v, ConfigurationTarget.Workspace);
  }

  get fallbackIconTheme(): string {
    return this.getConfigValue<string>('fallbackIconTheme') ?? getDefaultConfig().fallbackIconTheme;
  }

  set fallbackIconTheme(v: string) {
    this.setConfigValue('fallbackIconTheme', v, ConfigurationTarget.Global);
  }

  get foldersAssociations(): IconAssociations | undefined {
    return this.getConfigValue<IconAssociations>('foldersAssociations');
  }

  set foldersAssociations(v) {
    this.setConfigValue('foldersAssociations', v, ConfigurationTarget.Workspace);
  }

  get languagesAssociations(): IconAssociations | undefined {
    return this.getConfigValue<IconAssociations>('languagesAssociations');
  }

  set languagesAssociations(v) {
    this.setConfigValue('languagesAssociations', v, ConfigurationTarget.Workspace);
  }

  get filesAssociations(): IconAssociations | undefined {
    return this.getConfigValue<IconAssociations>('filesAssociations');
  }

  set filesAssociations(v) {
    this.setConfigValue('filesAssociations', v, ConfigurationTarget.Workspace);
  }

  get folderColor(): string {
    return this.getConfigValue<string>('folderColor') ?? getDefaultConfig().folderColor;
  }

  set folderColor(v: string) {
    this.setConfigValue('folderColor', v, ConfigurationTarget.Workspace);
  }

  get hideFileIcons(): boolean {
    return this.getConfigValue<boolean>('hideFileIcons') ?? getDefaultConfig().hideFileIcons;
  }

  set hideFileIcons(v: boolean) {
    this.setConfigValue('hideFileIcons', v, ConfigurationTarget.Workspace);
  }

  get monochrome(): boolean {
    return this.getConfigValue<boolean>('monochrome') ?? getDefaultConfig().monochrome;
  }

  set monochrome(v: boolean) {
    this.setConfigValue('monochrome', v, ConfigurationTarget.Workspace);
  }

  get monochromeColor(): string {
    return this.getConfigValue<string>('monochromeColor') ?? getDefaultConfig().monochromeColor;
  }

  set monochromeColor(v: string) {
    this.setConfigValue('monochromeColor', v, ConfigurationTarget.Workspace);
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
    // Without an opened folder there is no workspace settings file: writing there rejects
    // and the command silently does nothing (#73). Fall back to the user settings.
    const target = scope !== ConfigurationTarget.Global && !workspace.workspaceFolders?.length
      ? ConfigurationTarget.Global
      : scope;

    this.getPluginConfig().update(key, value, target).then(undefined, (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to update ${key}: ${message}`);
      window.showErrorMessage(`Atom Material Icons: ${message}`);
    });
  }

  /**
   * Snapshot of every setting that affects the file icon theme.
   * The full snapshot (not only the changed keys) must be given to the generator,
   * otherwise unchanged settings fall back to their defaults.
   */
  public getIconSettings(): IconSettings {
    return {
      activeIconPacks: [...this.activeIconPacks],
      fallbackIconTheme: this.fallbackIconTheme.trim(),
      filesAssociations: this.filesAssociations ?? {},
      folderColor: this.folderColor,
      folderTheme: this.folderTheme,
      foldersAssociations: this.foldersAssociations ?? {},
      hideFileIcons: this.hideFileIcons,
      languagesAssociations: this.languagesAssociations ?? {},
      monochrome: this.monochrome,
      monochromeColor: this.monochromeColor,
      opacity: this.opacity,
      saturation: this.saturation,
    };
  }

  /**
   * Returns the icon settings if they differ from the ones the current theme file was generated with,
   * or undefined when the theme is up to date.
   */
  public getIconConfigChanges(config: IconConfiguration): IconSettings | undefined {
    const current = this.getIconSettings();
    const previous = config.atomConfig ?? {};

    const changed = ICON_SETTING_KEYS.some((key) => !isDeepEqual(current[key], previous[key] ?? EMPTY_DEFAULTS[key]));
    return changed ? current : undefined;
  }

  public getProductConfigChanges(config: ProductConfiguration) {
    const changes: Partial<AtomConfig> = {};

    if (this.arrowTheme !== config.atomConfig?.arrowTheme) {
      changes.arrowTheme = this.arrowTheme;
    }

    return changes;
  }

  public resetConfig() {
    const defaultConfig = getDefaultConfig();
    this.activeIconPacks = defaultConfig.activeIconPacks;
    this.arrowTheme = defaultConfig.arrowTheme;
    this.fallbackIconTheme = defaultConfig.fallbackIconTheme;
    this.folderColor = defaultConfig.folderColor;
    this.folderTheme = defaultConfig.folderTheme;
    this.hideFileIcons = defaultConfig.hideFileIcons;
    this.monochrome = defaultConfig.monochrome;
    this.monochromeColor = defaultConfig.monochromeColor;
    this.opacity = defaultConfig.opacity;
    this.saturation = defaultConfig.saturation;
    this.showReloadMessage = true;
    this.showUpdateMessage = true;
    this.showWelcomeMessage = true;

    this.filesAssociations = undefined;
    this.foldersAssociations = undefined;
    this.languagesAssociations = undefined;
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
