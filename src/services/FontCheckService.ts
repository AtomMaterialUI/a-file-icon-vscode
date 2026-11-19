import i18next from 'i18next';
import { FONT_DOWNLOADS, isFontInstalled, missingFonts } from 'src/helpers/fonts';
import { openBrowser } from 'src/helpers/vscodeUtils';
import { configService } from 'src/services/ConfigService';
import { logger } from 'src/services/LoggingService';
import { env, window, workspace } from 'vscode';

import type { FontFamily } from 'src/helpers/fonts';
import type { ExtensionContext, MessageItem } from 'vscode';

type FontAction = MessageItem & { font?: FontFamily; neverShowAgain?: boolean };

/** The missing fonts the last notice was about: the same ones are not suggested twice */
const SHOWN_KEY = 'fontMessageShown';

/** Whether the user set an editor font anywhere (user, workspace, folder, or for a language) */
const userSetEditorFont = (): boolean => {
  const inspected = workspace.getConfiguration('editor').inspect<string>('fontFamily');
  return [inspected?.globalValue, inspected?.workspaceValue, inspected?.workspaceFolderValue, inspected?.globalLanguageValue].some(
    (value) => value !== undefined,
  );
};

/**
 * The default editor font of this extension (package.json `configurationDefaults`) starts with JetBrains Mono: suggest
 * installing it, and D2Coding with a Korean interface, when VS Code falls back to the next font of the list.
 */
export class FontCheckService {
  async check(context: ExtensionContext): Promise<void> {
    if (!configService.showFontMessage) return;

    const missing = missingFonts({ installed: (family) => isFontInstalled(family), language: env.language, userFont: userSetEditorFont() });
    const key = missing.join(',');
    if (missing.length === 0 || context.globalState.get<string>(SHOWN_KEY) === key) return;
    await context.globalState.update(SHOWN_KEY, key);
    logger.debug(`Missing fonts: ${key}`);

    const actions: FontAction[] = [
      ...missing.map((font) => ({ font, title: i18next.t('fonts.get', { font }) })),
      { neverShowAgain: true, title: i18next.t('neverShowAgain') },
    ];
    const action = await window.showInformationMessage(i18next.t('fonts.missing', { fonts: missing.join(', ') }), ...actions);
    if (action?.font) openBrowser(FONT_DOWNLOADS[action.font]);
    if (action?.neverShowAgain) configService.showFontMessage = false;
  }
}

export const fontCheckService = new FontCheckService();
