import { strict as assert } from 'node:assert';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { productMixerState } from 'src/panels/productMixerState';
import { ISLANDS_FONT_FILE, ISLANDS_PRODUCT_DIST_FILE, ISLANDS_PRODUCT_FILE } from 'src/productIcons/islandsProductTheme';
import { JETBRAINS_ICONS } from 'src/productIcons/jetbrainsMap';
import { ProductIconGenerator, readProductTheme } from 'src/productIcons/ProductIconGenerator';
import {
  mixProductTheme,
  normalizeProductByName,
  normalizeProductLayers,
  serializeProductLayers,
  usedProductThemeIds,
} from 'src/productIcons/productIconLayers';

import type { ProductIconTheme, ReadProductTheme } from 'src/productIcons/productIconLayers';

const root = join(__dirname, '..', '..');

const base: ProductIconTheme = {
  fonts: [{ id: 'cool-islands-icons', src: [{ format: 'woff', path: '../productIcons/cool-islands-icons.woff' }] }],
  iconDefinitions: { close: { fontCharacter: '\\e001' }, files: { fontCharacter: '\\e002' } },
};
const fluent: ReadProductTheme = {
  fonts: [{ id: 'fluent', src: [{ format: 'woff2', path: '/ext/fluent/fluent.woff2' }] }],
  iconDefinitions: { 'debug-start': { fontCharacter: '\\f001' }, 'debug-stop': { fontCharacter: '\\f002' }, files: { fontCharacter: '\\f003' } },
  id: 'fluent-icons',
};
const carbon: ReadProductTheme = {
  fonts: [{ id: 'a', src: [{ format: 'woff', path: '/ext/carbon/a.woff' }] }, { id: 'b', src: [{ format: 'woff', path: '/ext/carbon/b.woff' }] }],
  iconDefinitions: { 'debug-start': { fontCharacter: '\\c001', fontId: 'b' }, files: { fontCharacter: '\\c002' } },
  id: 'carbon-product-icons',
};

describe('product icon layers', () => {
  it('reads the settings', () => {
    assert.deepEqual(normalizeProductLayers(['fluent-icons', { mode: 'override', theme: ' carbon ' }, 'fluent-icons', { mode: 'nope', theme: 'x' }, 4]), [
      { mode: 'fill', theme: 'fluent-icons' },
      { mode: 'override', theme: 'carbon' },
      { mode: 'fill', theme: 'x' },
    ]);
    assert.deepEqual(serializeProductLayers(normalizeProductLayers(['a', { mode: 'off', theme: 'b' }])), ['a', { mode: 'off', theme: 'b' }]);
    const byName = normalizeProductByName({ 'bad key!': 'a', 'debug-*': ' fluent-icons ', files: '' });
    assert.deepEqual(byName.map(({ key, theme }) => ({ key, theme })), [{ key: 'debug-*', theme: 'fluent-icons' }]);
    assert.ok(byName[0].matches('debug-stop') && !byName[0].matches('files'));
    assert.deepEqual(usedProductThemeIds([{ mode: 'off', theme: 'off' }, 'b'], { 'debug-*': 'a' }), ['a', 'b']);
  });

  it('fills the icons Cool Islands Icons has none for, with the fonts of the theme copied', () => {
    const { copies, theme } = mixProductTheme(base, [{ layer: { mode: 'fill', theme: 'fluent-icons' }, theme: fluent }], []);
    assert.deepEqual(theme.iconDefinitions.files, base.iconDefinitions.files);
    assert.deepEqual(theme.iconDefinitions['debug-stop'], { fontCharacter: '\\f002', fontId: 'fluent-icons-fluent' });
    // the font of Cool Islands Icons stays first: the definitions without a fontId use it
    assert.deepEqual(theme.fonts.map((font) => font.id), ['cool-islands-icons', 'fluent-icons-fluent']);
    assert.deepEqual(theme.fonts[1].src, [{ format: 'woff2', path: './layers/product/fluent-icons/fluent.woff2' }]);
    assert.deepEqual(copies, [{ from: '/ext/fluent/fluent.woff2', to: 'layers/product/fluent-icons/fluent.woff2' }]);
  });

  it('lets override layers win, the first listed over the next, and names over every layer', () => {
    const layers = [
      { layer: { mode: 'override' as const, theme: 'carbon-product-icons' }, theme: carbon },
      { layer: { mode: 'override' as const, theme: 'fluent-icons' }, theme: fluent },
    ];
    const { theme } = mixProductTheme(base, layers, []);
    assert.deepEqual(theme.iconDefinitions.files, { fontCharacter: '\\c002', fontId: 'carbon-product-icons-a' });
    assert.deepEqual(theme.iconDefinitions['debug-start'], { fontCharacter: '\\c001', fontId: 'carbon-product-icons-b' });
    assert.deepEqual(theme.iconDefinitions['debug-stop'], { fontCharacter: '\\f002', fontId: 'fluent-icons-fluent' });
    assert.deepEqual(theme.iconDefinitions.close, base.iconDefinitions.close);

    const named = mixProductTheme(base, layers, [{ matches: (id) => id.startsWith('debug-'), theme: fluent }]).theme;
    assert.deepEqual(named.iconDefinitions['debug-start'], { fontCharacter: '\\f001', fontId: 'fluent-icons-fluent' });
    assert.deepEqual(named.iconDefinitions.files, { fontCharacter: '\\c002', fontId: 'carbon-product-icons-a' });
  });

  describe('files', () => {
    let folder: string;
    beforeEach(() => {
      folder = mkdtempSync(join(tmpdir(), 'cool-product-'));
    });
    afterEach(() => rmSync(folder, { force: true, recursive: true }));

    it('reads a product icon theme with comments, its font paths made absolute', () => {
      mkdirSync(join(folder, 'theme', 'fonts'), { recursive: true });
      writeFileSync(join(folder, 'theme', 'theme.json'), `{
        // fonts next to the theme
        "fonts": [{ "id": "f", "src": [{ "path": "./fonts/f.woff", "format": "woff" }] }, { "id": 3 }],
        "iconDefinitions": { "close": { "fontCharacter": "\\\\e001" }, "bad": {}, },
      }`);
      const theme = readProductTheme('my-theme', join(folder, 'theme', 'theme.json'));
      assert.equal(theme.id, 'my-theme');
      assert.deepEqual(theme.fonts, [{ id: 'f', src: [{ format: 'woff', path: join(folder, 'theme', 'fonts', 'f.woff') }] }]);
      assert.deepEqual(Object.keys(theme.iconDefinitions), ['close']);
    });

    it('writes Cool Islands Icons to dist with the mixed fonts, and only when it changed', () => {
      const dist = join(folder, 'dist');
      mkdirSync(join(folder, 'other'));
      writeFileSync(join(folder, 'other', 'other.woff'), 'font');
      const other: ReadProductTheme = { fonts: [{ id: 'o', src: [{ format: 'woff', path: join(folder, 'other', 'other.woff') }] }], iconDefinitions: { 'not-in-islands': { fontCharacter: '\\a' } }, id: 'other' };
      const generator = new ProductIconGenerator({ dist, productIcons: join(root, 'productIcons') });

      assert.equal(generator.createJsonTheme(), true);
      assert.equal(generator.createJsonTheme(), false);
      const plain = JSON.parse(readFileSync(join(dist, ISLANDS_PRODUCT_DIST_FILE), 'utf8')) as ProductIconTheme;
      assert.deepEqual(plain.fonts[0].src, [{ format: 'woff', path: `../productIcons/${ISLANDS_FONT_FILE}` }]);

      assert.equal(generator.createJsonTheme({ byName: [], layers: [{ layer: { mode: 'fill', theme: 'other' }, theme: other }] }), true);
      assert.ok(existsSync(join(dist, 'layers', 'product', 'other', 'other.woff')));
      const mixed = JSON.parse(readFileSync(join(dist, ISLANDS_PRODUCT_DIST_FILE), 'utf8')) as ProductIconTheme;
      assert.deepEqual(mixed.iconDefinitions['not-in-islands'], { fontCharacter: '\\a', fontId: 'other-o' });

      // a theme no longer mixed in leaves no font behind
      assert.equal(generator.createJsonTheme(), true);
      assert.equal(existsSync(join(dist, 'layers', 'product', 'other')), false);
    });

    it('previews the result, Cool Islands Icons and each mixed theme for the Product icons tab', () => {
      writeFileSync(join(folder, 'other.json'), JSON.stringify({ fonts: [{ id: 'o', src: [{ format: 'woff', path: './o.woff' }] }], iconDefinitions: { files: { fontCharacter: '\\41' } } }));
      const installed = [{ extensionPath: folder, id: 'other', label: 'Other Icons', path: join(folder, 'other.json') }];
      const other = readProductTheme('other', join(folder, 'other.json'));
      const state = productMixerState({
        byName: { files: 'other' },
        distPath: join(folder, 'dist'),
        generator: new ProductIconGenerator({ dist: join(folder, 'dist'), productIcons: join(root, 'productIcons') }),
        installed,
        labels: { base: 'Cool Islands Icons', result: 'Result' },
        layers: [],
        mix: { byName: [{ matches: (id) => id === 'files', theme: other }], layers: [] },
      });
      assert.deepEqual(state.columns.map((column) => column.id), ['result', 'base', 'other']);
      const [result, islands, otherColumn] = state.columns;
      assert.deepEqual(result.glyphs.files, { character: 'A', font: 'p-result-other-o' });
      assert.equal(otherColumn.glyphs.files?.character, 'A');
      assert.ok(islands.glyphs.files && islands.glyphs.files.font === 'p-base-cool-islands-icons');
      // ids Cool Islands Icons does not map keep the VS Code icon
      assert.equal(islands.glyphs.account !== undefined, true);
      const font = state.fonts.find((item) => item.key === 'p-result-other-o');
      assert.deepEqual(font?.sources, [{ format: 'woff', path: join(folder, 'dist', 'layers', 'product', 'other', 'o.woff') }]);
    });
  });
});

describe('Cool Islands Icons', () => {
  const theme = JSON.parse(readFileSync(join(root, 'productIcons', ISLANDS_PRODUCT_FILE), 'utf8')) as ProductIconTheme;

  it('has a glyph of the New UI font for every id of the map', () => {
    assert.ok(existsSync(join(root, 'productIcons', ISLANDS_FONT_FILE)));
    assert.deepEqual(theme.fonts.map((font) => font.src), [[{ format: 'woff', path: `./${ISLANDS_FONT_FILE}` }]]);
    assert.deepEqual(Object.keys(theme.iconDefinitions).sort(), Object.keys(JETBRAINS_ICONS).sort());
    // the ids of one New UI icon share its glyph, and different icons have different glyphs
    const byIcon = new Map<string, string>();
    for (const [id, icon] of Object.entries(JETBRAINS_ICONS)) {
      const character = theme.iconDefinitions[id].fontCharacter;
      assert.match(character, /^\\[\da-f]{4}$/, id);
      if (byIcon.has(icon)) assert.equal(character, byIcon.get(icon), id);
      byIcon.set(icon, character);
    }
    assert.equal(new Set(byIcon.values()).size, byIcon.size);
  });
});
