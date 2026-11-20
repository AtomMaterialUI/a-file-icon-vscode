import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { writeFileAtomic } from 'src/helpers/fsUtils';
import { resolveThemePath } from 'src/helpers/themePaths';
import { extensionRoot } from 'src/themes/colorThemes';
import { stripJsonComments } from 'src/themes/readColorTheme';

import { ISLANDS_FONT_FILE, ISLANDS_PRODUCT_DIST_FILE, ISLANDS_PRODUCT_FILE } from './islandsProductTheme';
import { mixProductTheme } from './productIconLayers';

import type { FontCopy, MixedProductLayer, MixedProductName, ProductFont, ProductIconTheme, ReadProductTheme } from './productIconLayers';

const LAYERS_FOLDER = 'layers/product';
const PRODUCT_ICONS_FOLDER = 'productIcons';

/** Copy a font when it is missing or changed (several windows regenerate the theme at the same time) */
const copyFont = (from: string, to: string) => {
  if (existsSync(to)) {
    const source = statSync(from);
    const target = statSync(to);
    if (source.size === target.size && source.mtimeMs <= target.mtimeMs) return;
  }
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
};

/** The other product icon themes mixed in (`productIconThemeLayers`, `productIconByName`), already read */
export type ProductMix = { byName: MixedProductName[]; layers: MixedProductLayer[] };

/**
 * A product icon theme file, read like VS Code reads it (comments, trailing commas): the paths of its fonts are made
 * absolute, the fonts and definitions that are not valid are left out. Font files outside the folder of the extension
 * contributing the theme are left out too (VS Code does not load them either), and so are the definitions of a font
 * left with no file: another font of the theme would show a wrong glyph.
 * @param theme its id (`workbench.productIconTheme`), its file and the folder of the extension contributing it
 */
export const readProductTheme = ({ extensionPath, id, path }: { extensionPath: string; id: string; path: string }): ReadProductTheme => {
  const json = JSON.parse(stripJsonComments(readFileSync(path, 'utf8').replace(/^﻿/, ''))) as Partial<ProductIconTheme>;
  /** the fonts whose files are all outside the extension */
  const outside = new Set<string>();
  /** the font of the definitions without `fontId`: the first one with files */
  let primary: string | undefined;
  const fonts = (Array.isArray(json.fonts) ? json.fonts : []).flatMap((font: Partial<ProductFont> | undefined) => {
    if (!font || typeof font.id !== 'string' || !Array.isArray(font.src)) return [];
    const written = font.src.filter((item) => typeof item?.path === 'string' && typeof item.format === 'string');
    const sources = written.flatMap((item) => {
      const source = resolveThemePath(extensionPath, path, item.path);
      return source ? [{ format: item.format, path: source }] : [];
    });
    if (written.length > 0) primary ??= font.id;
    if (written.length > 0 && sources.length === 0) outside.add(font.id);
    return sources.length > 0 ? [{ ...font, id: font.id, src: sources }] : [];
  });
  const definitions = json.iconDefinitions && typeof json.iconDefinitions === 'object' ? json.iconDefinitions : {};
  const iconDefinitions = Object.fromEntries(
    Object.entries(definitions).filter(
      ([, value]) =>
        value &&
        typeof value === 'object' &&
        typeof value.fontCharacter === 'string' &&
        !outside.has((typeof value.fontId === 'string' ? value.fontId : primary) ?? ''),
    ),
  );
  return { fonts, iconDefinitions, id };
};

/**
 * Write Cool Islands Icons (`contributes.productIconThemes`) to dist/: the generated New UI theme, with the other
 * product icon themes the user mixes in, and their fonts copied to dist/layers/product.
 */
export class ProductIconGenerator {
  private readonly paths: { dist: string; productIcons: string };

  constructor(paths?: Partial<{ dist: string; productIcons: string }>) {
    const root = paths?.dist && paths.productIcons ? '' : extensionRoot();
    this.paths = {
      dist: paths?.dist ?? join(root, 'dist'),
      productIcons: paths?.productIcons ?? join(root, PRODUCT_ICONS_FOLDER),
    };
  }

  /** The generated theme, with its font found from dist/ */
  base(): ProductIconTheme {
    const theme = JSON.parse(readFileSync(join(this.paths.productIcons, ISLANDS_PRODUCT_FILE), 'utf8')) as ProductIconTheme;
    return {
      ...theme,
      fonts: theme.fonts.map((font) => ({
        ...font,
        src: font.src.map((item) => ({ ...item, path: `../${PRODUCT_ICONS_FOLDER}/${ISLANDS_FONT_FILE}` })),
      })),
    };
  }

  createTheme(mix?: ProductMix): { copies: FontCopy[]; theme: ProductIconTheme } {
    return mixProductTheme(this.base(), mix?.layers ?? [], mix?.byName ?? [], LAYERS_FOLDER);
  }

  /**
   * Write the theme when its content changed, with the fonts it uses (VS Code reads a product icon theme again only on a
   * reload); the fonts of the themes no longer mixed in are removed
   * @returns whether the theme was written
   */
  createJsonTheme(mix?: ProductMix): boolean {
    const { copies, theme } = this.createTheme(mix);
    for (const copy of copies) copyFont(copy.from, join(this.paths.dist, copy.to));

    const layers = join(this.paths.dist, ...LAYERS_FOLDER.split('/'));
    const used = new Set(copies.map((copy) => copy.to.split('/')[2]));
    if (existsSync(layers)) {
      for (const folder of readdirSync(layers)) if (!used.has(folder)) rmSync(join(layers, folder), { force: true, recursive: true });
    }

    const path = join(this.paths.dist, ISLANDS_PRODUCT_DIST_FILE);
    const content = JSON.stringify(theme, undefined, 2);
    if (existsSync(path) && readFileSync(path, 'utf8') === content) return false;
    writeFileAtomic(path, content);
    return true;
  }
}
