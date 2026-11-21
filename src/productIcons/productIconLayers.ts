/**
 * Mix other product icon themes into Cool Islands Icons, the way the icon layers mix other icon themes into Cool Icons:
 *   - `productIconThemeLayers`: other installed product icon themes, each `fill` (only the ids Cool Islands Icons has no
 *     icon for, which VS Code draws with its own codicons) or `override` (every id the theme has an icon for) or `off`.
 *   - `productIconByName`: icon ids or globs of them (`debug-*`) -> the theme giving their icon, whatever the layers.
 * From the strongest to the weakest: by name (a later entry wins) > override layers (the first listed wins) > Cool Islands
 * Icons > fill layers (the first listed wins). The fonts of the other themes are copied next to the generated theme.
 */
import { compareCodeUnits } from 'src/helpers/utils';

const MODES = new Set<unknown>(['fill', 'off', 'override']);

const globPattern = (glob: string) =>
  new RegExp(`^${glob.replaceAll(/[$()+.[\\\]^{|}]/g, String.raw`\$&`).replaceAll('*', '.*').replaceAll('?', '.')}$`);

/** A file name a font may take in the generated folder */
const safeName = (text: string) => text.replaceAll(/[^\w.-]+/g, '_');

export type ProductLayerMode = 'fill' | 'off' | 'override';
export type ProductIconLayer = string | { mode?: ProductLayerMode; theme: string };
export type NormalizedProductLayer = { mode: ProductLayerMode; theme: string };

export type ProductFont = { id: string; src: Array<{ format: string; path: string }>; style?: string; weight?: string };
export type ProductIconDefinition = { fontCharacter: string; fontId?: string };
export type ProductIconTheme = { fonts: ProductFont[]; iconDefinitions: Record<string, ProductIconDefinition> };

/** A product icon theme read from its file: the paths of its fonts are absolute */
export type ReadProductTheme = ProductIconTheme & { id: string };

export type MixedProductLayer = { layer: NormalizedProductLayer; theme: ReadProductTheme };
export type MixedProductName = { matches: (id: string) => boolean; theme: ReadProductTheme };

/** A font of another theme to copy next to the generated theme */
export type FontCopy = { from: string; to: string };

export const normalizeProductLayers = (layers: unknown): NormalizedProductLayer[] => {
  if (!Array.isArray(layers)) return [];
  const seen = new Set<string>();
  const result: NormalizedProductLayer[] = [];
  for (const layer of layers as unknown[]) {
    const object = layer && typeof layer === 'object' ? (layer as Record<string, unknown>) : undefined;
    const theme = typeof layer === 'string' ? layer.trim() : (typeof object?.theme === 'string' ? object.theme.trim() : '');
    if (!theme || seen.has(theme)) continue;
    seen.add(theme);
    result.push({ mode: MODES.has(object?.mode) ? (object?.mode as ProductLayerMode) : 'fill', theme });
  }
  return result;
};

/** The layers as the setting stores them: a plain id for `fill` */
export const serializeProductLayers = (layers: NormalizedProductLayer[]): ProductIconLayer[] =>
  layers.map((layer) => (layer.mode === 'fill' ? layer.theme : { ...layer }));

/** The valid entries of `productIconByName`, in their order */
export const normalizeProductByName = (byName: unknown): Array<{ key: string; matches: (id: string) => boolean; theme: string }> => {
  if (!byName || typeof byName !== 'object' || Array.isArray(byName)) return [];
  return Object.entries(byName as Record<string, unknown>).flatMap(([key, theme]) => {
    const pattern = key.trim();
    const id = typeof theme === 'string' ? theme.trim() : '';
    if (!pattern || !id || !/^[\w*?.-]+$/.test(pattern)) return [];
    const regex = globPattern(pattern);
    return [{ key: pattern, matches: (icon: string) => regex.test(icon), theme: id }];
  });
};

/** Ids of the installed product icon themes the settings mix in */
export const usedProductThemeIds = (layers: unknown, byName: unknown): string[] => {
  const ids = normalizeProductLayers(layers)
    .filter((layer) => layer.mode !== 'off')
    .map((layer) => layer.theme);
  for (const { theme } of normalizeProductByName(byName)) ids.push(theme);
  return [...new Set(ids)].sort(compareCodeUnits);
};

/**
 * @param base Cool Islands Icons as written in dist/ (its font first: the definitions without `fontId` use it)
 * @param folder the folder of the copied fonts, relative to the generated theme (`layers/product`)
 * @returns the mixed theme, and the fonts of the other themes to copy (`to` is relative to the generated theme)
 */
export const mixProductTheme = (
  base: ProductIconTheme,
  layers: MixedProductLayer[],
  byName: MixedProductName[],
  folder = 'layers/product',
): { copies: FontCopy[]; theme: ProductIconTheme } => {
  const fonts = [...base.fonts];
  const copies: FontCopy[] = [];
  const added = new Set<string>();

  // the fonts of a theme, once, with ids of their own
  const fontId = (theme: ReadProductTheme, id: string | undefined) => {
    const key = safeName(theme.id);
    const source = theme.fonts.find((font) => font.id === id) ?? theme.fonts[0];
    if (!source) return;
    const ownId = `${key}-${safeName(source.id)}`;
    if (!added.has(ownId)) {
      added.add(ownId);
      const sources = source.src.map((item) => {
        const to = `${folder}/${key}/${safeName(item.path.split(/[/\\]/).at(-1) ?? 'font')}`;
        copies.push({ from: item.path, to });
        return { format: item.format, path: `./${to}` };
      });
      fonts.push({ id: ownId, src: sources, style: source.style ?? 'normal', weight: source.weight ?? 'normal' });
    }
    return ownId;
  };
  const definition = (theme: ReadProductTheme, icon: string): ProductIconDefinition | undefined => {
    const source = theme.iconDefinitions[icon];
    if (!source || typeof source.fontCharacter !== 'string') return undefined;
    const id = fontId(theme, source.fontId);
    return id ? { fontCharacter: source.fontCharacter, fontId: id } : undefined;
  };

  const iconDefinitions = { ...base.iconDefinitions };
  const active = layers.filter(({ layer }) => layer.mode !== 'off');
  for (const { layer, theme } of active) {
    if (layer.mode !== 'fill') continue;
    for (const icon of Object.keys(theme.iconDefinitions)) {
      if (icon in iconDefinitions) continue;
      const value = definition(theme, icon);
      if (value) iconDefinitions[icon] = value;
    }
  }
  for (const { layer, theme } of [...active].reverse()) {
    if (layer.mode !== 'override') continue;
    for (const icon of Object.keys(theme.iconDefinitions)) {
      const value = definition(theme, icon);
      if (value) iconDefinitions[icon] = value;
    }
  }
  for (const { matches, theme } of byName) {
    for (const icon of Object.keys(theme.iconDefinitions)) {
      if (!matches(icon)) continue;
      const value = definition(theme, icon);
      if (value) iconDefinitions[icon] = value;
    }
  }

  return { copies, theme: { fonts, iconDefinitions } };
};
