/**
 * Build the Cool Islands Icons product icon font from the New UI icons of the JetBrains IDEs (JetBrains/intellij-community,
 * Apache License 2.0), at the commit pinned in themes/jetbrains-source.json, for the ids of src/productIcons/jetbrainsMap.ts.
 *
 * A product icon is a glyph of one color, and the New UI icons are drawn with strokes and several colors: each SVG is
 * made black and white (dark colors black, white and light fills white, so they cut holes like the "!" of the error
 * icon), rendered, and traced back into filled outlines. The 16x16 design keeps its padding: every icon gets the same
 * scale, as in the IDE.
 * The outputs (productIcons/cool-islands-icons.woff and productIcons/cool-islands-product-icon-theme.json) are generated
 * and committed: do not edit them by hand.
 *
 * Usage: bun run build:product-icons
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { compareCodeUnits } from 'src/helpers/utils';
import { checkedCommit } from 'src/scripts/jetbrainsSource';
import { extensionRoot, THEMES_FOLDER } from 'src/themes/colorThemes';
import { ISLANDS_FONT_ID, ISLANDS_FONT_FILE, ISLANDS_PRODUCT_FILE } from 'src/productIcons/islandsProductTheme';
import { expuiPath, JETBRAINS_ICONS } from 'src/productIcons/jetbrainsMap';
import { webfont } from 'webfont';

import { Potrace } from './potrace';

const REPOSITORY = 'JetBrains/intellij-community';
const RESOLUTION = 800;
const START_CODEPOINT = 0xE0_00;
/** Colors lighter than this are the white parts of an icon */
const LIGHT = 0.8;

const root = extensionRoot(__dirname);
const output = join(root, 'productIcons');

const luminance = (hex: string) => {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? [...value].map((digit) => digit + digit).join('') : value.slice(0, 6);
  const [red, green, blue] = [0, 2, 4].map((index) => Number.parseInt(full.slice(index, index + 2), 16) / 255);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

/** Black for the drawn parts, white for the light ones */
const toBlackAndWhite = (value: string) => {
  if (value === 'none' || value === 'currentColor') return value;
  const hex = ({ black: '#000000', white: '#ffffff' } as Record<string, string>)[value.toLowerCase()] ?? value;
  if (!/^#[\da-f]{3,8}$/i.test(hex)) return '#000000';
  return luminance(hex) > LIGHT ? '#ffffff' : '#000000';
};

/** A New UI SVG as a glyph SVG: one filled path, in the box of the icon */
const toGlyph = async (svg: string): Promise<string> => {
  // XML comments are left in: resvg skips them, and recoloring a fill inside one changes nothing
  const blackAndWhite = svg.replaceAll(/(fill|stroke)="([^"]*)"/g, (_all, attribute: string, value: string) => `${attribute}="${toBlackAndWhite(value)}"`);
  const size = Number(/viewBox="0 0 ([\d.]+)/.exec(blackAndWhite)?.[1] ?? 16);
  const bitmap = new Resvg(blackAndWhite, { background: '#ffffff', fitTo: { mode: 'width', value: RESOLUTION } }).render().asPng();
  const traced: string = await new Potrace(bitmap, { svgSize: size / RESOLUTION }).trace();
  const path = [...traced.matchAll(/\sd="([^"]+)"/g)].map((match) => match[1]).join(' ');
  if (!path.trim()) throw new Error('nothing traced');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><path fill-rule="evenodd" d="${path}"/></svg>`;
};

const glyphName = (icon: string) => icon.replaceAll(/[^\w-]+/g, '_');

/** A PNG of every glyph with its icon name, to check the tracing (`--sheet <png>`) */
const contactSheet = (icons: string[], files: string[]): Uint8Array => {
  const columns = 10;
  const cell = 120;
  const cells = files.map((file, index) => {
    const x = (index % columns) * cell;
    const y = Math.floor(index / columns) * cell;
    const path = /\sd="([^"]+)"/.exec(readFileSync(file, 'utf8'))?.[1] ?? '';
    const label = icons[index].split('/').at(-1) ?? '';
    return `<g transform="translate(${x + 36} ${y + 12}) scale(3)"><path fill-rule="evenodd" d="${path}"/></g>`
      + `<text x="${x + cell / 2}" y="${y + 80}" font-size="11" font-family="Segoe UI, Arial" text-anchor="middle">${label}</text>`;
  });
  const height = Math.ceil(files.length / columns) * cell;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${columns * cell}" height="${height}"><rect width="100%" height="100%" fill="#fff"/>${cells.join('')}</svg>`;
  return new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng();
};

const main = async () => {
  const source = JSON.parse(readFileSync(join(root, THEMES_FOLDER, 'jetbrains-source.json'), 'utf8')) as { commit: unknown };
  const commit = checkedCommit(source.commit);
  console.log(`${REPOSITORY}@${commit}`);

  const icons = [...new Set(Object.values(JETBRAINS_ICONS))].sort(compareCodeUnits);
  const work = mkdtempSync(join(tmpdir(), 'cool-islands-icons-'));
  try {
    const files: string[] = [];
    for (const icon of icons) {
      const response = await fetch(`https://raw.githubusercontent.com/${REPOSITORY}/${commit}/${expuiPath(icon)}`);
      if (!response.ok) throw new Error(`${icon}: HTTP ${response.status}`);
      const file = join(work, `${glyphName(icon)}.svg`);
      writeFileSync(file, await toGlyph(await response.text()));
      // webfont reads the files through glob patterns, which take / even on Windows
      files.push(file.replaceAll('\\', '/'));
    }

    // formatsOptions is read by webfont but missing from its types; ts 0: no build date, the same file for the same icons
    const options = {
      files,
      fixedWidth: true,
      fontHeight: 1000,
      fontName: ISLANDS_FONT_ID,
      formats: ['woff'],
      formatsOptions: { ttf: { ts: 0 } },
      normalize: false,
      sort: true,
      startUnicode: START_CODEPOINT,
    } as Parameters<typeof webfont>[0];
    const result = await webfont(options);

    const codepoints = new Map<string, number>();
    for (const glyph of result.glyphsData ?? []) {
      const name = glyph.metadata?.name;
      const unicode = glyph.metadata?.unicode?.[0];
      if (name && unicode) codepoints.set(name, unicode.codePointAt(0)!);
    }

    const iconDefinitions = Object.fromEntries(
      Object.entries(JETBRAINS_ICONS).map(([id, icon]) => {
        const codepoint = codepoints.get(glyphName(icon));
        if (codepoint === undefined) throw new Error(`No glyph for ${icon}`);
        return [id, { fontCharacter: `\\${codepoint.toString(16)}` }];
      }),
    );

    const sheet = process.argv.indexOf('--sheet');
    if (sheet !== -1 && process.argv[sheet + 1]) writeFileSync(process.argv[sheet + 1], contactSheet(icons, files));

    mkdirSync(output, { recursive: true });
    writeFileSync(join(output, ISLANDS_FONT_FILE), result.woff as Uint8Array);
    const theme = {
      fonts: [{ id: ISLANDS_FONT_ID, src: [{ format: 'woff', path: `./${ISLANDS_FONT_FILE}` }], style: 'normal', weight: 'normal' }],
      iconDefinitions,
    };
    writeFileSync(join(output, ISLANDS_PRODUCT_FILE), `${JSON.stringify(theme, undefined, 2)}\n`);
    console.log(`${icons.length} glyphs for ${Object.keys(iconDefinitions).length} ids`);
  } finally {
    rmSync(work, { force: true, recursive: true });
  }
};

// ts-node runs the scripts as CommonJS, which has no top-level await
// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
