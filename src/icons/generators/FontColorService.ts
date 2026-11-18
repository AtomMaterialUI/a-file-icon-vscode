import { monochromeService } from './MonochromeService';

import type { AtomConfig } from 'src/@types/config';

/** The colors VS Code accepts for `fontColor`: no alpha channel */
const FONT_COLOR_PATTERN = /^#(?:[\dA-Fa-f]{3}|[\dA-Fa-f]{6})$/;

const toRgb = (hex: string): [number, number, number] => {
  const full = hex.length === 4 ? hex.replaceAll(/[^#]/g, (c) => c + c) : hex;
  const value = Number.parseInt(full.slice(1), 16);
  return [(value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF];
};

const toHex = (rgb: number[]) =>
  `#${rgb.map((value) => Math.round(Math.min(255, Math.max(0, value))).toString(16).padStart(2, '0')).join('')}`;

/** The `saturate` color matrix of the svg filter of this theme (`feColorMatrix type='saturate'`) */
const saturate = (hex: string, value: number): string => {
  const [r, g, b] = toRgb(hex);
  return toHex([
    (0.213 + 0.787 * value) * r + (0.715 - 0.715 * value) * g + (0.072 - 0.072 * value) * b,
    (0.213 - 0.213 * value) * r + (0.715 + 0.285 * value) * g + (0.072 - 0.072 * value) * b,
    (0.213 - 0.213 * value) * r + (0.715 - 0.715 * value) * g + (0.072 + 0.928 * value) * b,
  ]);
};

/**
 * The color filters of this theme for the glyphs of a font icon theme (`fontColor`), like `applyFilters` for svg
 * icons: monochrome, then saturation. VS Code takes no alpha in `fontColor`, so the opacity cannot be applied.
 * @returns the filtered color, or undefined when VS Code would not accept the color
 */
export const filterFontColor = (
  color: unknown,
  config: Pick<AtomConfig, 'monochrome' | 'monochromeColor' | 'saturation'>,
): string | undefined => {
  if (typeof color !== 'string' || !FONT_COLOR_PATTERN.test(color)) return undefined;

  let result = toHex(toRgb(color));
  result = /"(#\w+)"/.exec(monochromeService.applyMonochrome(`fill="${result}"`, config.monochrome, config.monochromeColor))?.[1] ?? result;
  if (config.saturation !== undefined && config.saturation < 1) result = saturate(result, config.saturation);
  return result;
};
