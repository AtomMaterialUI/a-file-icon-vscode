/**
 * Read the themes of the JetBrains IDEs (JetBrains/intellij-community, Apache 2.0) the way the IDE resolves them:
 *   - UI themes (`*.theme.json`): the `parentTheme` chain, the named colors of `colors`, nested `ui` keys and the
 *     `*` wildcard (`"*": { "background": … }` sets every `….background` key at its place in the theme).
 *   - Editor color schemes (`<scheme>` xml): the `parent_scheme` chain, `baseAttributes` links, and the attributes
 *     plugins add to a bundled scheme (`additionalTextAttributes`, like the Python colors of PyCharm), which the
 *     schemes based on it inherit.
 * Pure functions: the sync script downloads the files, the tests give fixtures.
 */
import { XMLParser } from 'fast-xml-parser';

type XmlOption = { baseAttributes?: string; name: string; value?: XmlValue | string };
type XmlValue = { option?: XmlOption[] };
type XmlScheme = { attributes?: { option?: XmlOption[] }; colors?: { option?: XmlOption[] }; name: string; parent_scheme?: string };
type AttributeEntry = TextAttributes | { base: string };

/** `parentTheme` gives the id of a bundled theme, which is not always its name */
const THEME_IDS: Record<string, string> = {
  ExperimentalDark: 'Dark',
  ExperimentalLight: 'Light',
  ExperimentalLightWithLightHeader: 'Light with Light Header',
};

const HEX = /^#?([\da-f]{1,8})$/i;

const FIELDS: Record<string, keyof TextAttributes> = {
  BACKGROUND: 'background',
  EFFECT_COLOR: 'effectColor',
  EFFECT_TYPE: 'effectType',
  ERROR_STRIPE_COLOR: 'errorStripe',
  FONT_TYPE: 'fontType',
  FOREGROUND: 'foreground',
};

const parser = new XMLParser({
  attributeNamePrefix: '',
  ignoreAttributes: false,
  isArray: (tagName) => tagName === 'option' || tagName === 'scheme',
  parseAttributeValue: false,
});

const flatten = (object: Record<string, unknown>, prefix: string, out: Record<string, unknown>) => {
  for (const [key, value] of Object.entries(object)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) flatten(value as Record<string, unknown>, path, out);
    else out[path] = value;
  }
};

const readAttributes = (options: XmlOption[] = []): Record<string, AttributeEntry> => {
  const attributes: Record<string, AttributeEntry> = {};
  for (const option of options) {
    const fields = typeof option.value === 'object' ? (option.value.option ?? []) : [];
    // `baseAttributes` alone inherits that key; with a value of its own (MARKDOWN_BOLD: bold, base MARKDOWN_TEXT),
    // the key draws its own value
    if (option.baseAttributes && fields.length === 0) {
      attributes[option.name] = { base: option.baseAttributes };
      continue;
    }
    const value: TextAttributes = {};
    for (const field of fields) {
      const key = FIELDS[field.name];
      const raw = typeof field.value === 'string' ? field.value : undefined;
      if (!key || raw === undefined) continue;
      if (key === 'fontType' || key === 'effectType') value[key] = Number.parseInt(raw, 10);
      else value[key] = normalizeColor(raw);
    }
    attributes[option.name] = value;
  }
  return attributes;
};

const findSchemes = (node: unknown, out: XmlScheme[] = []): XmlScheme[] => {
  if (!node || typeof node !== 'object') return out;
  for (const [key, value] of Object.entries(node)) {
    if (key === 'scheme' && Array.isArray(value)) out.push(...(value as XmlScheme[]));
    else if (typeof value === 'object') findSchemes(value, out);
  }
  return out;
};

export type UiThemeJson = {
  colors?: Record<string, string>;
  dark?: boolean;
  editorScheme?: string;
  name: string;
  parentTheme?: string;
  ui?: Record<string, unknown>;
};

export type ResolvedUiTheme = {
  chain: string[];
  dark: boolean;
  editorScheme?: string;
  /** Color of a UI key: its own value or the `*.<last segment>` wildcard, whichever the IDE applies last */
  get: (key: string) => string | undefined;
  name: string;
};

export type TextAttributes = {
  background?: string;
  effectColor?: string;
  /** 0 boxed, 1 underscored, 2 wave, 3 strikeout, 4 bold underscored, 5 bold dotted */
  effectType?: number;
  errorStripe?: string;
  /** 0 plain, 1 bold, 2 italic, 3 bold italic */
  fontType?: number;
  foreground?: string;
};

export type SchemeData = {
  attributes: Record<string, AttributeEntry>;
  colors: Record<string, string | undefined>;
  name: string;
  parent?: string;
};

export type ResolvedScheme = {
  attributes: (key: string) => TextAttributes | undefined;
  chain: string[];
  color: (key: string) => string | undefined;
};

/**
 * `#rrggbb` / `#rrggbbaa` in lower case, or undefined when the value is not a color.
 * The xml values have no `#` and drop leading zeros (`0` is black).
 */
export function normalizeColor(value: unknown, needsHash = false): string | undefined {
  if (typeof value !== 'string') return undefined;
  const match = HEX.exec(value.trim());
  if (!match || (needsHash && !value.trim().startsWith('#'))) return undefined;
  const hex = match[1].toLowerCase();
  if (hex.length === 8) return `#${hex}`;
  if (hex.length <= 6) return `#${hex.padStart(6, '0')}`;
  return undefined;
}

export const resolveUiTheme = (themes: UiThemeJson[], name: string): ResolvedUiTheme => {
  const byName = new Map(themes.map((theme) => [theme.name, theme]));
  const find = (id: string) => byName.get(id) ?? byName.get(THEME_IDS[id]);

  const chain: UiThemeJson[] = [];
  for (let theme = find(name); theme; theme = find(theme.parentTheme ?? '')) {
    if (chain.includes(theme)) break;
    chain.unshift(theme);
  }
  if (chain.length === 0) throw new Error(`Unknown JetBrains UI theme: ${name}`);
  const missingParent = chain[0].parentTheme;
  if (missingParent) throw new Error(`Unknown parent theme of ${chain[0].name}: ${missingParent}`);

  // Like UIThemeBean.importFromParentTheme: the keys of a theme come after the ones of its parent (a key it sets again
  // moves to the end), and the IDE applies them in that order. A wildcard sets every key with its suffix at its place,
  // so the `*` of a theme also replaces the keys its parent sets.
  const palette: Record<string, string> = {};
  const ui = new Map<string, unknown>();
  for (const theme of chain) {
    Object.assign(palette, theme.colors);
    const flat: Record<string, unknown> = {};
    flatten(theme.ui ?? {}, '', flat);
    for (const [key, value] of Object.entries(flat)) {
      ui.delete(key);
      ui.set(key, value);
    }
  }
  const order = new Map([...ui.keys()].map((key, index) => [key, index]));

  const color = (value: unknown, depth = 0): string | undefined => {
    if (typeof value !== 'string') return undefined;
    if (palette[value] !== undefined && depth < 16) return color(palette[value], depth + 1);
    return normalizeColor(value, true);
  };

  const leaf = chain.at(-1)!;
  return {
    chain: chain.map((theme) => theme.name),
    dark: Boolean(leaf.dark),
    editorScheme: [...chain].reverse().find((theme) => theme.editorScheme)?.editorScheme,
    get: (key) => {
      const wildcard = `*.${key.slice(key.lastIndexOf('.') + 1)}`;
      const own = order.get(key) ?? -1;
      const pattern = order.get(wildcard) ?? -1;
      return color(ui.get(own > pattern ? key : wildcard));
    },
    name: leaf.name,
  };
};

/** Every `<scheme>` of a file (a scheme file has one, DefaultColorSchemesManager.xml has Default and Darcula) */
export const parseSchemes = (xml: string): SchemeData[] =>
  findSchemes(parser.parse(xml)).map((scheme) => ({
    attributes: readAttributes(scheme.attributes?.option),
    colors: Object.fromEntries(
      (scheme.colors?.option ?? []).map((option) => [option.name, normalizeColor(typeof option.value === 'string' ? option.value : '')]),
    ),
    name: scheme.name,
    parent: scheme.parent_scheme,
  }));

/** The `<list>` of an `additionalTextAttributes` file */
export const parseAdditionalAttributes = (xml: string): Record<string, AttributeEntry> => {
  const root = parser.parse(xml) as { list?: { option?: XmlOption[] } };
  return readAttributes(root.list?.option);
};

/**
 * @param additional attributes added to a bundled scheme, by scheme name: they come after the scheme's own ones
 */
export const resolveScheme = (
  schemes: SchemeData[],
  name: string,
  additional: Record<string, Array<Record<string, AttributeEntry>>> = {},
): ResolvedScheme => {
  const byName = new Map(schemes.map((scheme) => [scheme.name, scheme]));
  const chain: SchemeData[] = [];
  for (let scheme = byName.get(name); scheme; scheme = byName.get(scheme.parent ?? '')) {
    if (chain.includes(scheme)) break;
    chain.push(scheme);
  }
  if (chain.length === 0) throw new Error(`Unknown JetBrains color scheme: ${name}`);
  const missingParent = chain.at(-1)!.parent;
  if (missingParent) throw new Error(`Unknown parent scheme of ${chain.at(-1)!.name}: ${missingParent}`);

  const attributes = (key: string, depth = 0): TextAttributes | undefined => {
    if (depth > 16) return undefined;
    for (const scheme of chain) {
      for (const source of [scheme.attributes, ...(additional[scheme.name] ?? [])]) {
        const entry = source[key];
        if (!entry) continue;
        return 'base' in entry ? attributes(entry.base, depth + 1) : entry;
      }
    }
    return undefined;
  };

  return {
    attributes: (key) => attributes(key),
    chain: chain.map((scheme) => scheme.name),
    color: (key) => {
      // An empty value (EDITOR_GUTTER_BACKGROUND="") unsets the color of the parent scheme
      const scheme = chain.find((candidate) => key in candidate.colors);
      return scheme?.colors[key];
    },
  };
};
