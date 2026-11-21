/**
 * Mix other color themes into Cool Islands, the way the icon layers mix other icon themes into Cool Icons:
 *   - `colorThemeLayers`: other installed color themes, for the workbench colors (`ui`) and the syntax colors
 *     (`syntax`) separately, each `fill` (only what Islands has no color for), `override` (that theme wins) or `off`.
 *     A layer applies to the Islands theme of its own kind (a dark theme to Cool Islands Dark), unless `applyTo` says.
 *   - `colorThemeByKey`: single keys from a given theme, whatever the layers: a workbench color id or a glob of them
 *     (`terminal.*`), a TextMate scope (`scope:comment`) or a semantic token selector (`semantic:parameter`).
 *   - `accentColor`: the blue of Islands (focus, buttons, links, active tab, selection), see `accent.ts`.
 * From the strongest to the weakest: by key > accent color > override layers (the first listed wins) > Islands > fill
 * layers (the first listed wins). Pure functions: the themes are read by the caller.
 */
import { compareCodeUnits } from 'src/helpers/utils';

import { accentColors } from './accent';

import type { SemanticStyle, TokenColor, VsCodeColorTheme } from './convertJetbrainsTheme';

const MODES = new Set<unknown>(['fill', 'off', 'override']);
const KINDS = new Set<unknown>(['both', 'dark', 'light']);

const mode = (value: unknown): ColorLayerMode => (MODES.has(value) ? (value as ColorLayerMode) : 'fill');

const escapeRegExp = (text: string) => text.replaceAll(/[$()+.?[\\\]^{|}]/g, String.raw`\$&`);

/** `terminal.*` -> /^terminal\..*$/ ; `*` matches any characters, `?` one */
const globPattern = (glob: string) => new RegExp(`^${escapeRegExp(glob).replaceAll('*', '.*').replaceAll('?', '.')}$`);

/** The selectors of a token rule (`scope` is a string with commas, or a list) */
const selectorsOf = (rule: TokenColor): string[] => {
  const scope = rule.scope as unknown;
  const list = Array.isArray(scope) ? scope : (typeof scope === 'string' ? scope.split(',') : []);
  return list.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
};

/** Whether a scope (`comment.line.number-sign`) is `scope` or below it (`comment`) */
const isUnder = (scope: string, parent: string) => scope === parent || scope.startsWith(`${parent}.`);

/** The last scope of a selector: `meta.function entity.name.function` -> `entity.name.function` */
const lastScope = (selector: string) => selector.split(/\s+/).at(-1) ?? selector;

/** The rules of a theme for a scope and the scopes below it, and a rule for the scope itself */
const rulesForScope = (rules: TokenColor[], scope: string): TokenColor[] => {
  const below = rules.flatMap((rule) => {
    const selectors = selectorsOf(rule).filter((selector) => isUnder(lastScope(selector), scope));
    return selectors.length > 0 ? [{ ...rule, scope: selectors }] : [];
  });
  const own = tokenStyleFor(rules, scope);
  return own ? [{ name: `${scope} (by key)`, scope: [scope], settings: own }, ...below] : below;
};

const semanticForSelector = (colors: Record<string, SemanticStyle | string>, selector: string) =>
  Object.entries(colors).filter(([key]) => key === selector || key.startsWith(`${selector}.`) || key.startsWith(`${selector}:`));

export type ColorLayerMode = 'fill' | 'off' | 'override';
export type ThemeKind = 'dark' | 'light';

/** Another installed color theme: its id (`fill` for both), or its id with a mode for each part */
export type ColorThemeLayer =
  | string
  | { applyTo?: ThemeKind | 'both'; syntax?: ColorLayerMode; theme: string; ui?: ColorLayerMode };

export type NormalizedColorLayer = { applyTo?: ThemeKind | 'both'; syntax: ColorLayerMode; theme: string; ui: ColorLayerMode };

/** What a key of `colorThemeByKey` targets */
export type ColorKeyTarget =
  | { kind: 'color'; matches: (id: string) => boolean }
  | { kind: 'scope'; scope: string }
  | { kind: 'semantic'; selector: string };

/** The colors of a color theme file, with its `include` already applied */
export type ColorThemeData = {
  colors: Record<string, string>;
  kind: ThemeKind;
  semanticHighlighting?: boolean;
  semanticTokenColors: Record<string, SemanticStyle | string>;
  tokenColors: TokenColor[];
};

export type MixedTheme = { data: ColorThemeData; layer: NormalizedColorLayer };
export type MixedKey = { data: ColorThemeData; target: ColorKeyTarget };

/** `vs`, `hc-light` -> light; `vs-dark`, `hc-black` -> dark */
export const kindOfUiTheme = (uiTheme: unknown): ThemeKind => (uiTheme === 'vs' || uiTheme === 'hc-light' ? 'light' : 'dark');

export const normalizeColorLayers = (layers: unknown): NormalizedColorLayer[] => {
  if (!Array.isArray(layers)) return [];
  const seen = new Set<string>();
  const result: NormalizedColorLayer[] = [];
  for (const layer of layers as unknown[]) {
    const object = layer && typeof layer === 'object' ? (layer as Record<string, unknown>) : undefined;
    const theme = typeof layer === 'string' ? layer.trim() : (typeof object?.theme === 'string' ? object.theme.trim() : '');
    if (!theme || seen.has(theme)) continue;
    seen.add(theme);
    const applyTo = KINDS.has(object?.applyTo) ? (object?.applyTo as NormalizedColorLayer['applyTo']) : undefined;
    result.push({ ...(applyTo ? { applyTo } : {}), syntax: mode(object?.syntax), theme, ui: mode(object?.ui) });
  }
  return result;
};

/** The layers as the setting stores them: a plain id when both parts fill and the kind is automatic */
export const serializeColorLayers = (layers: NormalizedColorLayer[]): ColorThemeLayer[] =>
  layers.map((layer) => (layer.ui === 'fill' && layer.syntax === 'fill' && !layer.applyTo ? layer.theme : { ...layer }));

/** `scope:comment` -> TextMate scope, `semantic:parameter` -> semantic token selector, anything else -> color id glob */
export const parseColorKey = (key: string): ColorKeyTarget | undefined => {
  const text = key.trim();
  const prefix = /^(scope|semantic):/i.exec(text);
  if (prefix) {
    const value = text.slice(prefix[0].length).trim();
    if (!value) return undefined;
    return prefix[1].toLowerCase() === 'scope' ? { kind: 'scope', scope: value } : { kind: 'semantic', selector: value };
  }
  if (!/^[\w*?.-]+$/.test(text)) return undefined;
  const pattern = globPattern(text);
  return { kind: 'color', matches: (id) => pattern.test(id) };
};

/** The valid entries of `colorThemeByKey`, with their theme id trimmed, in their order */
export const normalizeColorByKey = (byKey: unknown): Array<{ key: string; target: ColorKeyTarget; theme: string }> => {
  if (!byKey || typeof byKey !== 'object' || Array.isArray(byKey)) return [];
  return Object.entries(byKey as Record<string, unknown>).flatMap(([key, theme]) => {
    const target = parseColorKey(key);
    const id = typeof theme === 'string' ? theme.trim() : '';
    return target && id ? [{ key: key.trim(), target, theme: id }] : [];
  });
};

/** Ids of the installed themes the settings mix in */
export const usedColorThemeIds = (layers: unknown, byKey: unknown): string[] => {
  const ids = normalizeColorLayers(layers)
    .filter((layer) => layer.ui !== 'off' || layer.syntax !== 'off')
    .map((layer) => layer.theme);
  for (const { theme } of normalizeColorByKey(byKey)) ids.push(theme);
  return [...new Set(ids)].sort(compareCodeUnits);
};

/** Whether a layer applies to the Islands theme of this kind */
export const appliesTo = (layer: NormalizedColorLayer, data: ColorThemeData, kind: ThemeKind) =>
  layer.applyTo === 'both' || layer.applyTo === kind || (!layer.applyTo && data.kind === kind);

/**
 * The style a theme gives to a single scope, like a TextMate theme matcher for one scope: the rule whose selector ends
 * with the deepest parent of the scope wins, and the later rule for the same depth.
 */
export function tokenStyleFor(rules: TokenColor[], scope: string): TokenColor['settings'] | undefined {
  let best: { depth: number; settings: TokenColor['settings'] } | undefined;
  for (const rule of rules) {
    for (const selector of selectorsOf(rule)) {
      const last = lastScope(selector);
      if (!isUnder(scope, last)) continue;
      const depth = last.split('.').length;
      if (!best || depth >= best.depth) best = { depth, settings: rule.settings };
    }
  }
  return best?.settings;
}

/**
 * Mix the layers and the single keys into a base Islands theme of the given kind.
 * @param layers the layers in the order of the setting, with the colors of their theme (themes not installed left out)
 * @param byKey the single keys in the order of the setting, with the colors of their theme
 */
export const mixColorTheme = (
  base: VsCodeColorTheme,
  kind: ThemeKind,
  layers: MixedTheme[],
  byKey: MixedKey[],
  accent?: string,
): VsCodeColorTheme => {
  const active = layers.filter(({ data, layer }) => appliesTo(layer, data, kind));
  const part = (name: 'syntax' | 'ui', value: ColorLayerMode) => active.filter(({ layer }) => layer[name] === value).map(({ data }) => data);

  // Workbench colors: fill the ids Islands has no color for, then the override layers win, the first listed last
  const colors = { ...base.colors };
  for (const data of part('ui', 'fill')) {
    for (const [id, value] of Object.entries(data.colors)) if (!(id in colors)) colors[id] = value;
  }
  for (const data of part('ui', 'override').reverse()) Object.assign(colors, data.colors);

  // Syntax colors: an override layer replaces the syntax of Islands (the first listed comes last, so it wins);
  // a fill layer only adds the rules for the scopes the syntax has no rule for
  const overrides = part('syntax', 'override');
  let tokenColors = overrides.length > 0 ? overrides.reverse().flatMap((data) => data.tokenColors) : [...base.tokenColors];
  let semanticTokenColors: Record<string, SemanticStyle | string> =
    overrides.length > 0 ? Object.assign({}, ...overrides.map((data) => data.semanticTokenColors)) : { ...base.semanticTokenColors };
  const semanticHighlighting = overrides.length > 0 ? Boolean(overrides.at(-1)?.semanticHighlighting) : base.semanticHighlighting;

  for (const data of part('syntax', 'fill')) {
    const covered = tokenColors.flatMap((rule) => selectorsOf(rule)).map((selector) => lastScope(selector));
    const added = data.tokenColors.flatMap((rule) => {
      const selectors = selectorsOf(rule).filter((selector) => !covered.some((scope) => isUnder(lastScope(selector), scope)));
      return selectors.length > 0 ? [{ ...rule, scope: selectors }] : [];
    });
    // before the others: for the same scope depth the later rule wins
    tokenColors = [...added, ...tokenColors];
    semanticTokenColors = { ...data.semanticTokenColors, ...semanticTokenColors };
  }

  // The accent color wins over the layers: it is a choice of the user for the blue of Islands, measured from the Islands colors
  if (accent) Object.assign(colors, accentColors(base.colors, accent));

  // Single keys win over everything, a later key over an earlier one
  for (const { data, target } of byKey) {
    if (target.kind === 'color') {
      for (const [id, value] of Object.entries(data.colors)) if (target.matches(id)) colors[id] = value;
    } else if (target.kind === 'scope') {
      tokenColors = [...tokenColors, ...rulesForScope(data.tokenColors, target.scope)];
    } else {
      semanticTokenColors = { ...semanticTokenColors, ...Object.fromEntries(semanticForSelector(data.semanticTokenColors, target.selector)) };
    }
  }

  return {
    ...base,
    colors,
    semanticHighlighting,
    semanticTokenColors: semanticTokenColors as Record<string, SemanticStyle>,
    tokenColors,
  };
};
