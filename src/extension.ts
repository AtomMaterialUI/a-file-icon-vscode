import { unwatchFile, watchFile } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { registerCommands } from 'src/commands/commands';
import { EXTENSION_KEY, VERSION_KEY } from 'src/helpers/constants';
import { isCancellation } from 'src/helpers/utils';
import { findLayerThemes } from 'src/helpers/vscodeUtils';
import { initI18next } from 'src/i18n/i18next';
import { configChangeDetector } from 'src/services/ConfigChangeDetector';
import { colorThemeService, forgetInstalledColorThemes } from 'src/services/ColorThemeService';
import { configService } from 'src/services/ConfigService';
import { fontCheckService } from 'src/services/FontCheckService';
import { logger } from 'src/services/LoggingService';
import { forgetInstalledProductThemes, productIconService } from 'src/services/ProductIconService';
import { ThemeMixerPanel } from 'src/panels/ThemeMixerPanel';
import { notificationsService } from 'src/services/NotificationsService';
import { initThemeFailure, reportThemeFailure } from 'src/services/themeFailure';
import { updatesService } from 'src/services/UpdatesService';
import { extensions, workspace } from 'vscode';

import type { ConfigurationChangeEvent, ExtensionContext } from 'vscode';

/** Json files of the other icon themes being watched */
const watchedThemes = new Set<string>();

/**
 * Events often come in bursts (two settings written by the theme mixer, an extension installed with its dependencies,
 * a theme json rewritten in several steps): the theme is regenerated once after the last one.
 */
const REGENERATE_DELAY = 300;
let regenerateTimer: NodeJS.Timeout | undefined;

const scheduleRegenerate = () => {
  clearTimeout(regenerateTimer);
  regenerateTimer = setTimeout(() => {
    regenerateTimer = undefined;
    regenerateTheme();
  }, REGENERATE_DELAY);
};

const cancelRegenerate = () => {
  clearTimeout(regenerateTimer);
  regenerateTimer = undefined;
};

/** The settings the generated theme reads: this extension's, and the file associations for the mixed themes */
const affectsTheme = (event: ConfigurationChangeEvent) =>
  event.affectsConfiguration(EXTENSION_KEY) || event.affectsConfiguration('files.associations');

/**
 * Regenerate the theme files from the settings. A failure is shown to the user instead of only being logged,
 * otherwise the commands look like they do nothing (#73); a read-only install is told once (`reportThemeFailure`).
 */
const regenerateTheme = () => {
  const started = performance.now();
  try {
    configChangeDetector.listenForChanges();
  } catch (error) {
    reportThemeFailure(error);
  }
  try {
    colorThemeService.regenerate();
    productIconService.regenerate();
  } catch (error) {
    reportThemeFailure(error);
  }
  watchLayerThemes();
  // the theme mixer previews the regenerated theme
  ThemeMixerPanel.refresh();
  logger.memory('regenerated', started);
};

/**
 * The other icon themes rewrite their json when their own settings change, and a color theme file changes when its
 * extension is updated or developed: regenerate the themes then.
 * Polling the modification time works the same on every platform, unlike fs.watch.
 */
const watchLayerThemes = () => {
  const paths = new Set([...findLayerThemes(configService.getIconSettings()).map((theme) => theme.path), ...colorThemeService.watchedPaths(), ...productIconService.watchedPaths()]);

  for (const path of watchedThemes) {
    if (paths.has(path)) continue;
    unwatchFile(path, scheduleRegenerate);
    watchedThemes.delete(path);
  }
  for (const path of paths) {
    if (watchedThemes.has(path)) continue;
    watchFile(path, { interval: 5000, persistent: false }, scheduleRegenerate);
    watchedThemes.add(path);
  }
};

const logFontError = (error: unknown) => {
  if (!isCancellation(error)) logger.error(String(error));
};

const unwatchLayerThemes = () => {
  for (const path of watchedThemes) unwatchFile(path, scheduleRegenerate);
  watchedThemes.clear();
};

/**
 * When the extension gets activated
 * @param {ExtensionContext} context
 * @returns {Promise<void>}
 */
export const activate = async (context: ExtensionContext) => {
  const started = performance.now();
  try {
    // Translations
    await initI18next();
    logger.debug('Translations loaded.');

    // Init for sync
    context.globalState.setKeysForSync([VERSION_KEY]);

    // checking for updates
    logger.debug('Checking for new updates...');
    const status = await updatesService.checkUpdateStatus(context.globalState);
    initThemeFailure(context.globalState, updatesService.getPluginVersion());

    // Start notification
    notificationsService.showStartMessages(status);

    // Offer the JetBrains fonts to a user of Cool Islands, or suggest the missing ones (not awaited: it waits for the
    // user, and the message left open when the window closes is cancelled)
    fontCheckService.check(context).catch(logFontError);

    // Subscribe to the extension commands
    context.subscriptions.push(...registerCommands(context));

    // Initially trigger the config change detection, after the activation so it does not delay it
    scheduleRegenerate();

    context.subscriptions.push(
      // Observe changes in the settings the theme reads: VS Code fires this event for every setting of every extension
      workspace.onDidChangeConfiguration((event) => {
        if (affectsTheme(event)) scheduleRegenerate();
        if (event.affectsConfiguration('workbench.colorTheme')) fontCheckService.colorThemeChanged().catch(logFontError);
      }),
      // The fallback icon theme can be installed, updated or removed
      extensions.onDidChange(() => {
        forgetInstalledColorThemes();
        forgetInstalledProductThemes();
        scheduleRegenerate();
      }),
      { dispose: cancelRegenerate },
      { dispose: unwatchLayerThemes },
    );
    logger.memory('activated', started);
  }
  catch (error) {
    logger.error(String(error));
  }
};

/** This method is called when the extension is deactivated: nothing is left pending or watched */
export const deactivate = () => {
  cancelRegenerate();
  unwatchLayerThemes();
};
