import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ACCENT_SOLID,
  ACCENT_TEXT,
  ACCENT_TINT,
  accentColors,
  contrastRatio,
  DEFAULT_ACCENT,
  isDefaultAccent,
  normalizeAccent,
} from 'src/themes/accent';
import { mixColorTheme } from 'src/themes/colorLayers';
import { ColorThemeGenerator } from 'src/themes/ColorThemeGenerator';
import { COLOR_THEMES, THEMES_FOLDER } from 'src/themes/colorThemes';

import type { ColorThemeData, MixedKey } from 'src/themes/colorLayers';
import type { VsCodeColorTheme } from 'src/themes/convertJetbrainsTheme';

const root = join(__dirname, '..', '..');
const readBase = (file: string) => JSON.parse(readFileSync(join(root, THEMES_FOLDER, file), 'utf8')) as VsCodeColorTheme;
const bases = COLOR_THEMES.map((info) => ({ info, theme: readBase(info.base) }));

const GREEN = '#8bc34a';

const channels = (hex: string) => {
  const number = Number.parseInt(hex.slice(1, 7), 16);
  return { b: number & 255, g: (number >> 8) & 255, r: (number >> 16) & 255 };
};

/** Hue (0-360), lightness (0-1) and the opacity digits of a color */
const hsl = (hex: string) => {
  const { b, g, r } = channels(hex);
  const [red, green, blue] = [r / 255, g / 255, b / 255];
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const l = (max + min) / 2;
  const delta = max - min;
  let h = 0;
  if (delta > 0) {
    if (max === red) h = ((green - blue) / delta) % 6;
    else if (max === green) h = (blue - red) / delta + 2;
    else h = (red - green) / delta + 4;
  }
  return { alpha: hex.slice(7), h: (h * 60 + 360) % 360, l };
};

const hueDistance = (first: number, second: number) => {
  const difference = Math.abs(first - second) % 360;
  return Math.min(difference, 360 - difference);
};

describe('accent color', () => {
  describe('normalizeAccent', () => {
    it('takes #rrggbb, tolerating capitals, spaces and #rgb, and drops an opacity', () => {
      assert.equal(normalizeAccent('#8BC34A'), '#8bc34a');
      assert.equal(normalizeAccent('  #8bc34a '), '#8bc34a');
      assert.equal(normalizeAccent('#abc'), '#aabbcc');
      assert.equal(normalizeAccent('#8bc34a80'), '#8bc34a');
    });

    it('gives nothing for an empty value or a value that is not a color', () => {
      for (const value of ['', '  ', 'green', '8bc34a', '#12', '#gggggg', 12, undefined, null, {}]) {
        assert.equal(normalizeAccent(value), undefined, String(value));
      }
    });

    it('knows the Islands blue', () => {
      assert.equal(isDefaultAccent(undefined), true);
      assert.equal(isDefaultAccent(DEFAULT_ACCENT), true);
      assert.equal(isDefaultAccent(GREEN), false);
    });
  });

  describe('the keys', () => {
    for (const { info, theme } of bases) {
      it(`are all in ${info.label} (a sync of the colors that renames one fails here)`, () => {
        for (const key of [...ACCENT_SOLID, ...ACCENT_TINT]) assert.ok(theme.colors[key] !== undefined, key);
      });

      it(`paint the accent blue in ${info.label}: the solid ones are the Islands blue, the tints are blue`, () => {
        for (const key of ACCENT_SOLID) assert.equal(theme.colors[key].toLowerCase(), DEFAULT_ACCENT, key);
        for (const key of ACCENT_TINT) {
          assert.ok(hueDistance(hsl(theme.colors[key]).h, hsl(DEFAULT_ACCENT).h) <= 25, `${key} ${theme.colors[key]}`);
        }
      });
    }

    it('are listed once', () => {
      const all = [...ACCENT_SOLID, ...ACCENT_TINT];
      assert.equal(new Set(all).size, all.length);
    });
  });

  describe('accentColors', () => {
    for (const { info, theme } of bases) {
      it(`changes nothing for the Islands blue in ${info.label}`, () => {
        assert.deepEqual(accentColors(theme.colors, DEFAULT_ACCENT), {});
      });

      it(`paints the solid keys with the accent in ${info.label}`, () => {
        const patch = accentColors(theme.colors, GREEN);
        for (const key of ACCENT_SOLID) assert.equal(patch[key], GREEN, key);
      });

      it(`keeps the lightness and the opacity of the tints and moves their hue in ${info.label}`, () => {
        const patch = accentColors(theme.colors, GREEN);
        const turn = hsl(GREEN).h - hsl(DEFAULT_ACCENT).h;
        for (const key of ACCENT_TINT) {
          const before = hsl(theme.colors[key]);
          const after = hsl(patch[key]);
          // the text colors are moved in lightness to stay readable, which the next test checks
          if (!(ACCENT_TEXT as readonly string[]).includes(key)) {
            assert.ok(Math.abs(after.l - before.l) < 0.02, `${key} lightness ${before.l} -> ${after.l}`);
          }
          assert.equal(after.alpha, before.alpha, key);
          // a 8-bit color rounds the hue of a pale or a dark one by a few degrees
          assert.ok(hueDistance(after.h, before.h + turn) <= 6, `${key} ${theme.colors[key]} -> ${patch[key]}`);
        }
      });

      it(`keeps the links and the matched letters as readable as the Islands blue (4.5:1 at most) in ${info.label}`, () => {
        const background = channels(theme.colors['editor.background']);
        for (const accent of ['#79cb60', '#ffeb3b', '#ff9800', '#1a237e', '#ff79c5', '#808080']) {
          const patch = accentColors(theme.colors, accent);
          for (const key of ACCENT_TEXT) {
            const wanted = Math.min(4.5, contrastRatio(channels(theme.colors[key]), background));
            const ratio = contrastRatio(channels(patch[key]), background);
            // the lightness moves away from the background, so black or white at the end always reaches it (8-bit rounding: 0.1)
            assert.ok(ratio >= wanted - 0.1, `${accent} ${key}: ${ratio.toFixed(2)} < ${wanted.toFixed(2)}`);
          }
        }
      });

      it(`leaves the blues that mean something else alone in ${info.label}`, () => {
        const patch = accentColors(theme.colors, GREEN);
        for (const key of [
          'gitDecoration.modifiedResourceForeground',
          'terminal.ansiBlue',
          'editorGutter.modifiedBackground',
          'editor.stackFrameHighlightBackground',
        ]) {
          assert.equal(patch[key], undefined, key);
        }
      });

      it(`keeps the text on the accent readable for any accent in ${info.label}`, () => {
        for (const accent of ['#000000', '#ffffff', '#ffeb3b', '#1a237e', '#8bc34a', '#ff1744', '#808080']) {
          const merged = { ...theme.colors, ...accentColors(theme.colors, accent) };
          for (const [foreground, on] of [
            ['button.foreground', 'button.background'],
            ['activityBarBadge.foreground', 'activityBarBadge.background'],
          ]) {
            const ratio = contrastRatio(channels(merged[foreground]), channels(merged[on]));
            assert.ok(ratio >= 4.5, `${accent}: ${foreground} on ${on} is ${ratio.toFixed(2)}`);
          }
        }
      });
    }

    it('leaves out a key the theme does not have', () => {
      assert.deepEqual(accentColors({ focusBorder: '#3871e1' }, GREEN), { focusBorder: GREEN });
    });

    it('keeps the opacity of a solid key', () => {
      assert.equal(accentColors({ focusBorder: '#3871e180' }, GREEN).focusBorder, `${GREEN}80`);
    });

    it('turns a gray accent into gray tints', () => {
      const [{ theme }] = bases;
      const patch = accentColors(theme.colors, '#808080');
      for (const key of ACCENT_TINT) {
        const { b, g, r } = channels(patch[key]);
        assert.ok(Math.max(r, g, b) - Math.min(r, g, b) <= 2, `${key} ${patch[key]}`);
      }
    });
  });

  describe('mixColorTheme', () => {
    const [{ theme: dark }] = bases;
    const source: ColorThemeData = {
      colors: { focusBorder: '#ff0000', 'tab.activeBorder': '#ff0000', 'terminal.ansiRed': '#aa0000' },
      kind: 'dark',
      semanticTokenColors: {},
      tokenColors: [],
    };
    const override = { data: source, layer: { applyTo: 'both' as const, syntax: 'off' as const, theme: 'red', ui: 'override' as const } };

    it('gives the theme as it is without an accent, or with the Islands blue', () => {
      assert.deepEqual(mixColorTheme(dark, 'dark', [], []), dark);
      assert.deepEqual(mixColorTheme(dark, 'dark', [], [], undefined), dark);
      assert.deepEqual(mixColorTheme(dark, 'dark', [], [], DEFAULT_ACCENT), dark);
    });

    it('puts the accent over an override layer, and a key over the accent', () => {
      const mixed = mixColorTheme(dark, 'dark', [override], [], GREEN);
      assert.equal(mixed.colors.focusBorder, GREEN);
      assert.equal(mixed.colors['terminal.ansiRed'], '#aa0000');
      assert.notEqual(mixed.colors['tab.activeBorder'], '#ff0000');

      const key: MixedKey = {
        data: { ...source, colors: { focusBorder: '#00ff00' } },
        target: { kind: 'color', matches: (id) => id === 'focusBorder' },
      };
      assert.equal(mixColorTheme(dark, 'dark', [override], [key], GREEN).colors.focusBorder, '#00ff00');
    });

    it('measures the tints from Islands, not from the color of an override layer', () => {
      const withLayer = mixColorTheme(dark, 'dark', [override], [], GREEN);
      const alone = mixColorTheme(dark, 'dark', [], [], GREEN);
      assert.equal(withLayer.colors['tab.activeBorder'], alone.colors['tab.activeBorder']);
    });

    it('does not change the syntax colors', () => {
      assert.deepEqual(mixColorTheme(dark, 'dark', [], [], GREEN).tokenColors, dark.tokenColors);
    });
  });

  describe('ColorThemeGenerator', () => {
    it('writes the accent into the generated themes, which the preview shows too', () => {
      const generator = new ColorThemeGenerator({ dist: join(root, 'dist'), themes: join(root, THEMES_FOLDER) });
      for (const info of COLOR_THEMES) {
        assert.equal(generator.createTheme(info, { accent: GREEN, byKey: [], layers: [] }).colors.focusBorder, GREEN);
        assert.equal(generator.createTheme(info).colors.focusBorder, DEFAULT_ACCENT);
      }
    });
  });
});
