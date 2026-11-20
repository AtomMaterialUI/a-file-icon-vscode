import { readFileSync } from 'node:fs';
import { DEFAULT_FONT_SIZE, FONT_FORMATS, FONT_SIZE_PATTERN, LayerReader } from 'src/icons/generators/ThemeLayerGenerator';

import type { LanguageLookup, LayerTheme } from 'src/helpers/themeLayers';
import type { ThemeJson } from 'src/icons/generators/ThemeLayerGenerator';
import type { IconFont } from 'src/models/IconConfiguration';

/** A font of a theme, with the absolute paths of its files */
export type PreviewFont = {
  /** Unique among all the previewed themes */
  key: string;
  sources: Array<{ format: string; path: string }>;
  style: string;
  weight: string;
};

/** The icon a theme shows for a name: an image file, or a glyph of one of its fonts */
export type PreviewIcon =
  | { character: string; color?: string; font: PreviewFont; kind: 'glyph'; size: string }
  | { currentColor?: boolean; kind: 'image'; path: string };

/** `\E001` (a CSS escape, as icon themes write their glyphs) -> the character itself */
export const decodeFontCharacter = (value: string): string =>
  value.replaceAll(/\\([\dA-Fa-f]{1,6}) ?/g, (_, hex: string) => {
    const code = Number.parseInt(hex, 16);
    return code > 0 && code <= 0x10_FF_FF ? String.fromCodePoint(code) : '';
  });

/** A file icon theme to preview: its id, its json and the folder of the extension contributing it */
export type PreviewTheme = Pick<LayerTheme, 'extensionPath' | 'id' | 'path'>;

/**
 * The icons a file icon theme shows in the tree, for the preview of the theme mixer.
 * A theme that cannot be read shows no icon, and an icon or font outside the folder of its extension is not shown.
 */
export class ThemePreview {
  readonly id: string;
  private readonly fonts = new Map<string, PreviewFont | undefined>();
  private readonly json: ThemeJson;
  private readonly reader: LayerReader;

  constructor(theme: PreviewTheme, languages: LanguageLookup) {
    let json: ThemeJson = {};
    try {
      const parsed: unknown = JSON.parse(readFileSync(theme.path, 'utf8'));
      if (parsed && typeof parsed === 'object') json = parsed as ThemeJson;
    } catch {
      // not generated yet, or being rewritten
    }
    this.id = theme.id;
    this.json = json;
    this.reader = new LayerReader({ extensionPath: theme.extensionPath, id: theme.id, path: theme.path, stamp: '' }, json, languages);
  }

  /** The icon of a file (`name`) or of a closed folder (`name/`) */
  icon(name: string, light: boolean): PreviewIcon | undefined {
    const hit = this.reader.hitTreeItem(name);
    const definitionId = hit && this.reader.definitionOf(hit, light);
    const definition = definitionId ? this.json.iconDefinitions?.[definitionId] : undefined;
    if (!definition) return undefined;

    if (typeof definition.iconPath === 'string') {
      const path = this.reader.resolve(definition.iconPath);
      if (!path) return undefined;
      // the svg files of these themes are drawn with the color of the text (`currentColor`)
      return this.json.usesCurrentColor === true ? { currentColor: true, kind: 'image', path } : { kind: 'image', path };
    }
    if (typeof definition.fontCharacter !== 'string' || !definition.fontCharacter) return undefined;

    const fontId = typeof definition.fontId === 'string' ? definition.fontId : undefined;
    const font = this.font(fontId);
    if (!font) return undefined;

    const fonts = this.fontList();
    const source = fontId === undefined ? fonts[0] : fonts.find((item) => item?.id === fontId);
    const size = [definition.fontSize, source?.size, fonts[0]?.size].find(
      (item): item is string => typeof item === 'string' && FONT_SIZE_PATTERN.test(item),
    ) ?? DEFAULT_FONT_SIZE;
    const color = typeof definition.fontColor === 'string' && /^#[\dA-Fa-f]{3,8}$/.test(definition.fontColor) ? definition.fontColor : undefined;

    return {
      character: decodeFontCharacter(definition.fontCharacter),
      ...(color ? { color } : {}),
      font,
      kind: 'glyph',
      size,
    };
  }

  private fontList(): Array<Partial<IconFont> | undefined> {
    return Array.isArray(this.json.fonts) ? (this.json.fonts as Array<Partial<IconFont> | undefined>) : [];
  }

  /** A font of the theme (its first one without an id, as VS Code does) with its files in a known format inside its extension */
  private font(fontId: string | undefined): PreviewFont | undefined {
    const cacheKey = fontId ?? '';
    if (this.fonts.has(cacheKey)) return this.fonts.get(cacheKey);

    const fonts = this.fontList();
    const source = fontId === undefined ? fonts[0] : fonts.find((item) => item?.id === fontId);
    let font: PreviewFont | undefined;
    if (source && typeof source.id === 'string' && Array.isArray(source.src)) {
      const sources = source.src.flatMap((item) => {
        const path = typeof item?.path === 'string' ? this.reader.resolve(item.path) : undefined;
        return path && typeof item?.format === 'string' && FONT_FORMATS.has(item.format) ? [{ format: item.format, path }] : [];
      });
      if (sources.length > 0) {
        font = {
          key: `${this.id}-${source.id}`.replaceAll(/[^\w-]/g, '_'),
          sources,
          style: typeof source.style === 'string' ? source.style : 'normal',
          weight: typeof source.weight === 'string' ? source.weight : 'normal',
        };
      }
    }
    this.fonts.set(cacheKey, font);
    return font;
  }
}
