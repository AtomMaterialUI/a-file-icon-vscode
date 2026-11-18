import { isValidHexColorCode } from 'src/helpers/utils';

type HSB = [hue: number, saturation: number, brightness: number];

/** Named colors used by the bundled icons */
const NAMED_COLORS: Record<string, string> = {
  azure: '#f0ffff',
  black: '#000000',
  red: '#ff0000',
  white: '#ffffff',
};

/** A color value of a paint attribute (`fill="#fff"`) or style property (`stop-color:#fff`) */
const PAINT_PATTERN = /((?:fill|stroke|stop-color|flood-color|lighting-color)\s*(?:=\s*["']|:\s*))(#[\dA-Fa-f]{6}|#[\dA-Fa-f]{3}|[a-z]+)\b/g;

const toRgb = (hex: string): [number, number, number] => {
  const full = hex.length === 4 ? hex.replaceAll(/[^#]/g, (c) => c + c) : hex;
  const value = Number.parseInt(full.slice(1), 16);
  return [(value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF];
};

/** Same conversion as java.awt.Color.RGBtoHSB */
const rgbToHsb = ([r, g, b]: [number, number, number]): HSB => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const brightness = max / 255;
  const saturation = max === 0 ? 0 : (max - min) / max;
  if (saturation === 0) return [0, 0, brightness];

  const rc = (max - r) / (max - min);
  const gc = (max - g) / (max - min);
  const bc = (max - b) / (max - min);
  let hue: number;
  if (r === max) hue = bc - gc;
  else if (g === max) hue = 2 + rc - bc;
  else hue = 4 + gc - rc;
  hue /= 6;
  if (hue < 0) hue += 1;
  return [hue, saturation, brightness];
};

const channel = (value: number) => Math.round(value * 255).toString(16).padStart(2, '0');

/** Same conversion as java.awt.Color.HSBtoRGB */
const hsbToHex = ([hue, saturation, brightness]: HSB): string => {
  let r = brightness;
  let g = brightness;
  let b = brightness;
  if (saturation !== 0) {
    const h = (hue - Math.floor(hue)) * 6;
    const f = h - Math.floor(h);
    const p = brightness * (1 - saturation);
    const q = brightness * (1 - saturation * f);
    const t = brightness * (1 - saturation * (1 - f));
    [r, g, b] = [
      [brightness, t, p],
      [q, brightness, p],
      [p, brightness, t],
      [p, q, brightness],
      [t, p, brightness],
      [brightness, p, q],
    ][Math.floor(h)];
  }
  return `#${channel(r)}${channel(g)}${channel(b)}`;
};

class MonochromeService {
  /**
   * Recolor every paint of the svg with the given color, like the ColorizeFilter of the JetBrains plugin:
   * the hue becomes the color's hue, saturation and brightness are the color's scaled by the original ones.
   * Icons are flat vectors, so recoloring the paint values gives the same result as filtering the pixels.
   */
  public applyMonochrome(svg: string, enabled: boolean, color: string): string {
    if (!enabled || !isValidHexColorCode(color)) return svg;

    const base = rgbToHsb(toRgb(color));
    return svg.replaceAll(PAINT_PATTERN, (match, prefix: string, value: string) => {
      const hex = value.startsWith('#') ? value : NAMED_COLORS[value.toLowerCase()];
      if (!hex) return match;

      const [, saturation, brightness] = rgbToHsb(toRgb(hex));
      return `${prefix}${hsbToHex([base[0], base[1] * saturation, base[2] * brightness])}`;
    });
  }
}

export const monochromeService = new MonochromeService();
