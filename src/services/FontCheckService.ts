import i18next from 'i18next';
import { FONT_DOWNLOADS, isFontInstalled, isJetBrainsFont, JETBRAINS_FONT_SETTINGS, missingFonts, shouldOfferFonts } from 'src/helpers/fonts';
import { isCancellation } from 'src/helpers/utils';
import { openBrowser } from 'src/helpers/vscodeUtils';
import { configService } from 'src/services/ConfigService';
import { logger } from 'src/services/LoggingService';
import { COLOR_THEMES } from 'src/themes/colorThemes';
import { ConfigurationTarget, env, window, workspace } from 'vscode';

import type { FontFamily } from 'src/helpers/fonts';
import type { ExtensionContext, MessageItem } from 'vscode';

type FontAction = MessageItem & { font?: FontFamily; neverShowAgain?: boolean };

/** The missing fonts the last notice was about: the same ones are not suggested twice */
const SHOWN_KEY = 'fontMessageShown';

/** Whether the JetBrains fonts were offered: once, whatever the answer */
const OFFERED_KEY = 'fontOfferShown';

/** `workbench.colorTheme` of the Cool Islands themes (their label: package.json gives them no id) */
const ISLANDS_THEMES: readonly string[] = COLOR_THEMES.map((theme) => theme.label);

/** A notice still open when the window closes is cancelled by VS Code: not an error */
const logError = (error: unknown) => {
  if (!isCancellation(error)) logger.error(String(error));
};

/** Whether the user set an editor font anywhere (user, workspace, folder, or for a language) */
const userSetEditorFont = (): boolean => {
  const inspected = workspace.getConfiguration('editor').inspect<string>('fontFamily');
  return [inspected?.globalValue, inspected?.workspaceValue, inspected?.workspaceFolderValue, inspected?.globalLanguageValue].some(
    (value) => value !== undefined,
  );
};

/** Whether the editor draws with the JetBrains font list: written by this extension, or copied by the user */
const usesJetBrainsFont = (): boolean => isJetBrainsFont(workspace.getConfiguration('editor').get<string>('fontFamily'));

/**
 * The JetBrains fonts are opt-in: installing the extension changes no font. They are offered once, to a user of a Cool
 * Islands color theme with no editor font of their own, and written to the user settings by the "Use the JetBrains
 * Fonts" command. When the editor uses them, JetBrains Mono (and D2Coding with a Korean interface) is suggested if it
 * is not installed, since VS Code falls back to the next font of the list.
 */
export class FontCheckService {
  private context: ExtensionContext | undefined;

  /** At startup: offer the fonts, or else suggest the missing ones */
  async check(context: ExtensionContext): Promise<void> {
    this.context = context;
    if (await this.offer()) return;
    await this.suggestMissing(false);
  }

  /** A Cool Islands color theme was just selected */
  async colorThemeChanged(): Promise<void> {
    await this.offer();
  }

  /** The "Use the JetBrains Fonts" command: write the font lists to the user settings, then suggest the missing fonts */
  async use(): Promise<void> {
    const replaced = JETBRAINS_FONT_SETTINGS.map(({ key, section, value }) => ({
      current: workspace.getConfiguration(section).inspect<string>(key)?.globalValue,
      value,
    })).filter(({ current, value }) => current !== undefined && !isJetBrainsFont(current, value));
    if (replaced.length > 0) {
      const replace: MessageItem = { title: i18next.t('fonts.replace') };
      const fonts = replaced.map(({ current }) => current).join(' / ');
      const answer = await window.showWarningMessage(i18next.t('fonts.replaceQuestion', { fonts }), { modal: true }, replace);
      if (answer !== replace) return;
    }

    for (const { key, section, value } of JETBRAINS_FONT_SETTINGS) {
      await workspace.getConfiguration(section).update(key, value, ConfigurationTarget.Global);
    }
    logger.info('JetBrains fonts written to the user settings');
    // the command is done when the settings are written: the notice waits for the user
    this.suggestMissing(true).catch(logError);
  }

  /** The "Stop Using the JetBrains Fonts" command: remove the font lists this extension wrote, not a font of the user */
  async remove(): Promise<void> {
    let removed = false;
    for (const { key, section, value } of JETBRAINS_FONT_SETTINGS) {
      const configuration = workspace.getConfiguration(section);
      if (!isJetBrainsFont(configuration.inspect<string>(key)?.globalValue, value)) continue;
      await configuration.update(key, undefined, ConfigurationTarget.Global);
      removed = true;
    }
    logger.info(removed ? 'JetBrains fonts removed from the user settings' : 'No JetBrains fonts to remove');
    window.showInformationMessage(i18next.t(removed ? 'fonts.removed' : 'fonts.notUsed')).then(undefined, logError);
  }

  /** Offer the fonts once to a user of Cool Islands: whether the offer was made */
  private async offer(): Promise<boolean> {
    const context = this.context;
    if (!context) return false;
    const offer = shouldOfferFonts({
      asked: context.globalState.get<boolean>(OFFERED_KEY) === true,
      colorTheme: workspace.getConfiguration('workbench').get<string>('colorTheme'),
      enabled: configService.showFontMessage,
      islandsThemes: ISLANDS_THEMES,
      userFont: userSetEditorFont(),
    });
    if (!offer) return false;
    await context.globalState.update(OFFERED_KEY, true);

    const use: MessageItem = { title: i18next.t('fonts.use') };
    const action = await window.showInformationMessage(i18next.t('fonts.offer'), use, { title: i18next.t('fonts.notNow') });
    if (action === use) await this.use();
    return true;
  }

  /**
   * Suggest the fonts of the JetBrains font list that are not installed: once for the same fonts at startup, every
   * time the user asks for the fonts
   */
  private async suggestMissing(asked: boolean): Promise<void> {
    if (!asked && !configService.showFontMessage) return;

    const missing = missingFonts({ installed: (family) => isFontInstalled(family), language: env.language, usesJetBrainsFont: usesJetBrainsFont() });
    if (missing.length === 0) return;
    const key = missing.join(',');
    if (!asked) {
      if (this.context?.globalState.get<string>(SHOWN_KEY) === key) return;
      await this.context?.globalState.update(SHOWN_KEY, key);
    }
    logger.debug(`Missing fonts: ${key}`);

    const actions: FontAction[] = missing.map((font) => ({ font, title: i18next.t('fonts.get', { font }) }));
    if (!asked) actions.push({ neverShowAgain: true, title: i18next.t('neverShowAgain') });
    const action = await window.showInformationMessage(i18next.t('fonts.missing', { fonts: missing.join(', ') }), ...actions);
    if (action?.font) openBrowser(FONT_DOWNLOADS[action.font]);
    if (action?.neverShowAgain) configService.showFontMessage = false;
  }
}

export const fontCheckService = new FontCheckService();
