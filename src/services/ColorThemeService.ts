import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import i18next from 'i18next';
import { EXTENSION_ID } from 'src/helpers/constants';
import { isInsideFolder } from 'src/helpers/themePaths';
import { getExtensionPath } from 'src/helpers/vscodeUtils';
import { configService } from 'src/services/ConfigService';
import { logger } from 'src/services/LoggingService';
import { offerReload } from 'src/services/reloadNotice';
import { normalizeAccent } from 'src/themes/accent';
import { kindOfUiTheme, normalizeColorByKey, normalizeColorLayers, usedColorThemeIds } from 'src/themes/colorLayers';
import { ColorThemeGenerator } from 'src/themes/ColorThemeGenerator';
import { THEMES_FOLDER } from 'src/themes/colorThemes';
import { readColorTheme } from 'src/themes/readColorTheme';
import { extensions, workspace } from 'vscode';

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
type InstalledColorTheme = { extensionPath: string; id: string; kind: ThemeKind; label: string; path: string; uiTheme: string };

/**
 * The color themes of the other installed extensions (VS Code's own ones too), which can be mixed with Cool Islands.
 * The id is the value of `workbench.colorTheme`: the `id` of the theme, else its label. A theme file outside the folder
 * of its extension is left out.
 */
const scanColorThemes = (): InstalledColorTheme[] => {
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
      const path = join(extension.extensionPath, theme.path);
      if (!isInsideFolder(extension.extensionPath, path)) continue;
      const uiTheme = typeof theme.uiTheme === 'string' ? theme.uiTheme : 'vs-dark';
      result.push({
        extensionPath: extension.extensionPath,
        id,
        kind: kindOfUiTheme(uiTheme),
        label: translatedLabel(extension.extensionPath, rawLabel) ?? id,
        path,
        uiTheme,
      });
    }
  }
  return result.sort((a, b) => a.label.localeCompare(b.label));
};

/** The scan reads the manifest of every installed extension: it is kept until an extension is installed, updated or removed */
let installedColorThemes: InstalledColorTheme[] | undefined;

export const listColorThemes = (): InstalledColorTheme[] => (installedColorThemes ??= scanColorThemes());

/** An extension was installed, updated or removed: the next list reads the manifests again */
export const forgetInstalledColorThemes = () => {
  installedColorThemes = undefined;
};

/**
 * Mixes the other color themes of the settings into the Cool Islands themes of the installed extension, and offers to
 * reload the window when the selected color theme changed (VS Code reads a color theme again only then).
 */
export class ColorThemeService {
  /** The files of the color themes the settings mix in, to regenerate when one changes */
  watchedPaths(): string[] {
    const ids = new Set(usedColorThemeIds(configService.colorThemeLayers, configService.colorThemeByKey));
    if (ids.size === 0) return [];
    return listColorThemes()
      .filter((theme) => ids.has(theme.id))
      .map((theme) => theme.path);
  }

  /** The themes of the settings, read; the ones not installed or not readable are left out */
  mix(): ColorMix {
    // listed only when a theme is mixed in: most users mix none
    let installedById: Map<string, InstalledColorTheme> | undefined;
    const cache = new Map<string, ColorThemeData | undefined>();
    const read = (id: string): ColorThemeData | undefined => {
      if (!cache.has(id)) {
        installedById ??= new Map(listColorThemes().map((item) => [item.id, item]));
        const theme = installedById.get(id);
        let data: ColorThemeData | undefined;
        if (theme && existsSync(theme.path)) {
          try {
            data = readColorTheme(theme);
          } catch (error) {
            logger.error(`Color theme ${id}: ${String(error)}`);
          }
        }
        cache.set(id, data);
      }
      return cache.get(id);
    };

    const accent = normalizeAccent(configService.accentColor);
    if (configService.accentColor && !accent) logger.error(`Accent color ignored, it is not a #rrggbb color: ${configService.accentColor}`);

    return {
      accent,
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
    if (selected && written.includes(selected)) offerReload(i18next.t('colors.reload', { theme: selected }));
  }
}

export const colorThemeService = new ColorThemeService();

export type { InstalledColorTheme };
