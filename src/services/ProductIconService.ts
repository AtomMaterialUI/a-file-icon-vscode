import { existsSync } from 'node:fs';
import { join } from 'node:path';
import i18next from 'i18next';
import { EXTENSION_ID } from 'src/helpers/constants';
import { isInsideFolder } from 'src/helpers/themePaths';
import { getExtensionPath } from 'src/helpers/vscodeUtils';
import { ISLANDS_PRODUCT_THEME_ID } from 'src/productIcons/islandsProductTheme';
import { ProductIconGenerator, readProductTheme } from 'src/productIcons/ProductIconGenerator';
import { normalizeProductByName, normalizeProductLayers, usedProductThemeIds } from 'src/productIcons/productIconLayers';
import { configService } from 'src/services/ConfigService';
import { logger } from 'src/services/LoggingService';
import { offerReload } from 'src/services/reloadNotice';
import { extensions, workspace } from 'vscode';

import type { ProductMix } from 'src/productIcons/ProductIconGenerator';
import type { ReadProductTheme } from 'src/productIcons/productIconLayers';

type ContributedProductTheme = { id?: unknown; label?: unknown; path?: unknown };

/** A product icon theme of an installed extension, Cool Material Icons of this one too */
type InstalledProductTheme = { extensionPath: string; id: string; label: string; path: string };

/**
 * The product icon themes that can be mixed with Cool Islands Icons: the ones of the other installed extensions, and
 * Cool Material Icons of this extension. The id is the value of `workbench.productIconTheme`. A theme file outside the
 * folder of its extension is left out.
 */
const scanProductThemes = (): InstalledProductTheme[] => {
  const result: InstalledProductTheme[] = [];
  for (const extension of extensions.all) {
    const own = extension.id.toLowerCase() === EXTENSION_ID.toLowerCase();
    const themes: ContributedProductTheme[] = extension.packageJSON?.contributes?.productIconThemes ?? [];
    if (!Array.isArray(themes)) continue;
    for (const theme of themes) {
      if (typeof theme?.id !== 'string' || typeof theme.path !== 'string') continue;
      if ((own && theme.id === ISLANDS_PRODUCT_THEME_ID) || result.some((item) => item.id === theme.id)) continue;
      const path = join(extension.extensionPath, theme.path);
      if (!isInsideFolder(extension.extensionPath, path)) continue;
      const label = typeof theme.label === 'string' && !/^%.*%$/.test(theme.label) ? theme.label : theme.id;
      result.push({ extensionPath: extension.extensionPath, id: theme.id, label, path });
    }
  }
  return result.sort((a, b) => a.label.localeCompare(b.label));
};

/** The scan reads the manifest of every installed extension: it is kept until an extension is installed, updated or removed */
let installedProductThemes: InstalledProductTheme[] | undefined;

export const listProductThemes = (): InstalledProductTheme[] => (installedProductThemes ??= scanProductThemes());

/** An extension was installed, updated or removed: the next list reads the manifests again */
export const forgetInstalledProductThemes = () => {
  installedProductThemes = undefined;
};

/**
 * Mixes the other product icon themes of the settings into Cool Islands Icons of the installed extension, and offers to
 * reload the window when it is the selected product icon theme
 */
export class ProductIconService {
  /** The files of the product icon themes the settings mix in, to regenerate when one changes */
  watchedPaths(): string[] {
    const ids = new Set(usedProductThemeIds(configService.productIconThemeLayers, configService.productIconByName));
    if (ids.size === 0) return [];
    return listProductThemes()
      .filter((theme) => ids.has(theme.id))
      .map((theme) => theme.path);
  }

  /** The themes of the settings, read; the ones not installed or not readable are left out */
  mix(): ProductMix {
    // listed only when a theme is mixed in: most users mix none
    let installedById: Map<string, InstalledProductTheme> | undefined;
    const cache = new Map<string, ReadProductTheme | undefined>();
    const read = (id: string): ReadProductTheme | undefined => {
      if (!cache.has(id)) {
        installedById ??= new Map(listProductThemes().map((item) => [item.id, item]));
        const theme = installedById.get(id);
        let data: ReadProductTheme | undefined;
        if (theme && existsSync(theme.path)) {
          try {
            data = readProductTheme(theme);
          } catch (error) {
            logger.error(`Product icon theme ${id}: ${String(error)}`);
          }
        }
        cache.set(id, data);
      }
      return cache.get(id);
    };

    return {
      byName: normalizeProductByName(configService.productIconByName).flatMap(({ matches, theme }) => {
        const data = read(theme);
        return data ? [{ matches, theme: data }] : [];
      }),
      layers: normalizeProductLayers(configService.productIconThemeLayers)
        .filter((layer) => layer.mode !== 'off')
        .flatMap((layer) => {
          const data = read(layer.theme);
          return data ? [{ layer, theme: data }] : [];
        }),
    };
  }

  regenerate(): void {
    const extensionPath = getExtensionPath();
    if (!extensionPath) return;
    const generator = new ProductIconGenerator({ dist: join(extensionPath, 'dist'), productIcons: join(extensionPath, 'productIcons') });
    if (!generator.createJsonTheme(this.mix())) return;
    logger.info('Product icon theme written: Cool Islands Icons');

    if (workspace.getConfiguration('workbench').get<string>('productIconTheme') === ISLANDS_PRODUCT_THEME_ID) {
      offerReload(i18next.t('productIcons.reload'));
    }
  }
}

export const productIconService = new ProductIconService();

export type { InstalledProductTheme };
