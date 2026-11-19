import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import i18next from 'i18next';
import { EXTENSION_ID } from 'src/helpers/constants';
import { getExtensionPath } from 'src/helpers/vscodeUtils';
import { configService } from 'src/services/ConfigService';
import { logger } from 'src/services/LoggingService';
import { kindOfUiTheme, normalizeColorByKey, normalizeColorLayers, usedColorThemeIds } from 'src/themes/colorLayers';
import { ColorThemeGenerator } from 'src/themes/ColorThemeGenerator';
import { THEMES_FOLDER } from 'src/themes/colorThemes';
import { readColorTheme } from 'src/themes/readColorTheme';
import { commands, extensions, window, workspace } from 'vscode';

import type { ColorMix } from 'src/themes/ColorThemeGenerator';
import type { ColorThemeData, ThemeKind } from 'src/themes/colorLayers';

type ContributedColorTheme = { id?: unknown; label?: unknown; path?: unknown; uiTheme?: unknown };

/** A `%key%` label of an extension, from its package.nls.json */
const translatedLabel = (extensionPath: string, label: string): string | undefined => {
  const key = /^%(.+)%$/.exec(label)?.[1];
  if (!key) return label;
  try {
    const nls = JSON.parse(readFileSync(join(extensionPath, 'package.nls.json'), 'utf8')) as Record<string, unknown>;
    const value = nls[key];
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && typeof (value as { message?: unknown }).message === 'string') {
      return (value as { message: string }).message;
    }
  } catch {
    // no translations
  }
  return undefined;
};

/** A color theme contributed by another installed extension */
export type InstalledColorTheme = { extensionPath: string; id: string; kind: ThemeKind; label: string; path: string; uiTheme: string };

/**
 * The color themes of the other installed extensions (VS Code's own ones too), which can be mixed with Cool Islands.
 * The id is the value of `workbench.colorTheme`: the `id` of the theme, else its label.
 */
export const listColorThemes = (): InstalledColorTheme[] => {
  const result: InstalledColorTheme[] = [];
  for (const extension of extensions.all) {
    if (extension.id.toLowerCase() === EXTENSION_ID.toLowerCase()) continue;
    const themes: ContributedColorTheme[] = extension.packageJSON?.contributes?.themes ?? [];
    if (!Array.isArray(themes)) continue;

    for (const theme of themes) {
      if (typeof theme?.path !== 'string') continue;
      const rawLabel = typeof theme.label === 'string' ? theme.label : '';
      const id = typeof theme.id === 'string' ? theme.id : rawLabel;
      if (!id || result.some((item) => item.id === id)) continue;
      const uiTheme = typeof theme.uiTheme === 'string' ? theme.uiTheme : 'vs-dark';
      result.push({
        extensionPath: extension.extensionPath,
        id,
        kind: kindOfUiTheme(uiTheme),
        label: translatedLabel(extension.extensionPath, rawLabel) ?? id,
        path: join(extension.extensionPath, theme.path),
        uiTheme,
      });
    }
  }
  return result.sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Mixes the other color themes of the settings into the Cool Islands themes of the installed extension, and offers to
 * reload the window when the selected color theme changed (VS Code reads a color theme again only then).
 */
export class ColorThemeService {
  /** A reload notice is open */
  private asking = false;

  /** The files of the color themes the settings mix in, to regenerate when one changes */
  watchedPaths(): string[] {
    const ids = new Set(usedColorThemeIds(configService.colorThemeLayers, configService.colorThemeByKey));
    return listColorThemes()
      .filter((theme) => ids.has(theme.id))
      .map((theme) => theme.path);
  }

  /** The themes of the settings, read; the ones not installed or not readable are left out */
  mix(): ColorMix {
    const installed = new Map(listColorThemes().map((theme) => [theme.id, theme]));
    const cache = new Map<string, ColorThemeData | undefined>();
    const read = (id: string): ColorThemeData | undefined => {
      if (!cache.has(id)) {
        const theme = installed.get(id);
        let data: ColorThemeData | undefined;
        if (theme && existsSync(theme.path)) {
          try {
            data = readColorTheme(theme.path, theme.uiTheme);
          } catch (error) {
            logger.error(`Color theme ${id}: ${String(error)}`);
          }
        }
        cache.set(id, data);
      }
      return cache.get(id);
    };

    return {
      byKey: normalizeColorByKey(configService.colorThemeByKey).flatMap(({ target, theme }) => {
        const data = read(theme);
        return data ? [{ data, target }] : [];
      }),
      layers: normalizeColorLayers(configService.colorThemeLayers)
        .filter((layer) => layer.ui !== 'off' || layer.syntax !== 'off')
        .flatMap((layer) => {
          const data = read(layer.theme);
          return data ? [{ data, layer }] : [];
        }),
    };
  }

  regenerate(): void {
    const extensionPath = getExtensionPath();
    if (!extensionPath) return;
    const generator = new ColorThemeGenerator({ dist: join(extensionPath, 'dist'), themes: join(extensionPath, THEMES_FOLDER) });
    const written = generator.createJsonThemes(this.mix());
    if (written.length === 0) return;
    logger.info(`Color themes written: ${written.join(', ')}`);

    const selected = workspace.getConfiguration('workbench').get<string>('colorTheme');
    // one notice at a time while the settings are being edited
    if (!selected || !written.includes(selected) || !configService.showReloadMessage || this.asking) return;
    this.asking = true;
    const reload = { title: i18next.t('colors.reloadWindow') };
    window.showInformationMessage(i18next.t('colors.reload', { theme: selected }), reload).then((action) => {
      this.asking = false;
      if (action === reload) commands.executeCommand('workbench.action.reloadWindow');
    });
  }
}

export const colorThemeService = new ColorThemeService();
