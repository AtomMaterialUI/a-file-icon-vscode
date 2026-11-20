/**
 * The Product icons tab of the theme mixer: the product icon layers and names of the settings, and a preview of common
 * icons in the result, in Cool Islands Icons alone and in each theme mixed in.
 */
import { dirname, resolve } from 'node:path';
import { decodeFontCharacter } from 'src/helpers/themePreview';
import { readProductTheme } from 'src/productIcons/ProductIconGenerator';
import { normalizeProductByName, normalizeProductLayers } from 'src/productIcons/productIconLayers';

import type { PreviewFont } from 'src/helpers/themePreview';
import type { ProductIconGenerator, ProductMix } from 'src/productIcons/ProductIconGenerator';
import type { ProductIconTheme } from 'src/productIcons/productIconLayers';
import type { InstalledProductTheme } from 'src/services/ProductIconService';

/** Icons shown in the preview: the activity bar, the trees and editors, find, problems, debugging and source control */
const PREVIEW_ICONS = [
  'files',
  'search',
  'source-control',
  'debug-alt',
  'extensions',
  'beaker',
  'account',
  'settings-gear',
  'terminal',
  'output',
  'bell',
  'chevron-right',
  'chevron-down',
  'close',
  'ellipsis',
  'split-horizontal',
  'new-file',
  'new-folder',
  'refresh',
  'collapse-all',
  'case-sensitive',
  'whole-word',
  'regex',
  'error',
  'warning',
  'info',
  'play',
  'debug-continue',
  'debug-step-over',
  'debug-step-into',
  'debug-step-out',
  'debug-restart',
  'debug-stop',
  'debug-breakpoint',
  'git-branch',
  'git-commit',
  'sync',
  'symbol-class',
  'symbol-method',
  'symbol-variable',
  'lightbulb',
];

type Column = { folder: string; id: string; label: string; theme: ProductIconTheme };
type PreviewGlyph = { character: string; font: string } | null;

/**
 * @param folder the folder the font paths of a theme are relative to
 * @param fonts the fonts of the preview, filled with the ones the glyphs use
 */
const glyphs = ({ folder, id, theme }: Column, fonts: Map<string, PreviewFont>): Record<string, PreviewGlyph> =>
  Object.fromEntries(
    PREVIEW_ICONS.map((icon) => {
      const definition = theme.iconDefinitions[icon];
      const source = definition && (theme.fonts.find((font) => font.id === definition.fontId) ?? theme.fonts[0]);
      if (!definition || !source) return [icon, null];
      const key = `p-${id}-${source.id}`.replaceAll(/[^\w-]/g, '_');
      if (!fonts.has(key)) {
        fonts.set(key, {
          key,
          sources: source.src.map((item) => ({ format: item.format, path: resolve(folder, item.path) })),
          style: source.style ?? 'normal',
          weight: source.weight ?? 'normal',
        });
      }
      return [icon, { character: decodeFontCharacter(definition.fontCharacter), font: key }];
    }),
  );

export const productMixerState = (options: {
  byName: unknown;
  distPath: string;
  generator: ProductIconGenerator;
  installed: InstalledProductTheme[];
  labels: { base: string; result: string };
  layers: unknown;
  mix: ProductMix;
}) => {
  const { installed } = options;
  const find = (id: string) => installed.find((theme) => theme.id === id);
  const layers = normalizeProductLayers(options.layers);
  const byName = normalizeProductByName(options.byName).map(({ key, theme }) => ({ key, theme }));
  const usedIds = [...new Set([...layers.map((layer) => layer.theme), ...byName.map((entry) => entry.theme)])];

  const columns: Column[] = [
    { folder: options.distPath, id: 'result', label: options.labels.result, theme: options.generator.createTheme(options.mix).theme },
    { folder: options.distPath, id: 'base', label: options.labels.base, theme: options.generator.base() },
  ];
  for (const id of usedIds) {
    const theme = find(id);
    if (!theme) continue;
    try {
      // read with absolute font paths, the ones outside its extension left out: the folder does not matter
      columns.push({ folder: dirname(theme.path), id, label: theme.label, theme: readProductTheme(theme) });
    } catch {
      // a theme that cannot be read has no column
    }
  }

  const fonts = new Map<string, PreviewFont>();
  return {
    byName,
    columns: columns.map((column) => ({ glyphs: glyphs(column, fonts), id: column.id, label: column.label })),
    fonts: [...fonts.values()],
    icons: PREVIEW_ICONS,
    layers: layers.map((layer) => ({ ...layer, installed: Boolean(find(layer.theme)), label: find(layer.theme)?.label ?? layer.theme })),
    themes: installed.map((theme) => ({ id: theme.id, label: theme.label })),
  };
};

export { PREVIEW_ICONS };
