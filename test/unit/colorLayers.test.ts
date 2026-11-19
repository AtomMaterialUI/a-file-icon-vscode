import { strict as assert } from 'node:assert';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { colorMixerState } from 'src/panels/colorMixerState';
import {
  kindOfUiTheme,
  mixColorTheme,
  normalizeColorByKey,
  normalizeColorLayers,
  parseColorKey,
  serializeColorLayers,
  tokenStyleFor,
  usedColorThemeIds,
} from 'src/themes/colorLayers';
import { ColorThemeGenerator } from 'src/themes/ColorThemeGenerator';
import { COLOR_THEMES, THEMES_FOLDER } from 'src/themes/colorThemes';
import { readColorTheme, stripJsonComments } from 'src/themes/readColorTheme';

import type { ColorThemeData, MixedKey, MixedTheme, NormalizedColorLayer } from 'src/themes/colorLayers';
import type { VsCodeColorTheme } from 'src/themes/convertJetbrainsTheme';

const root = join(__dirname, '..', '..');

const base: VsCodeColorTheme = {
  $schema: 'vscode://schemas/color-theme',
  colors: { 'editor.background': '#191a1c', 'sideBar.background': '#191a1c', 'terminal.ansiRed': '#f0524f' },
  name: 'Cool Islands Dark',
  semanticHighlighting: true,
  semanticTokenColors: { parameter: { foreground: '#bcbec4' } },
  tokenColors: [
    { name: 'Comment', scope: ['comment'], settings: { fontStyle: '', foreground: '#7a7e85' } },
    { name: 'Keyword', scope: ['keyword'], settings: { fontStyle: '', foreground: '#cf8e6d' } },
  ],
  type: 'dark',
};

const theme = (colors: Record<string, string>, extra: Partial<ColorThemeData> = {}): ColorThemeData => ({
  colors,
  kind: 'dark',
  semanticTokenColors: {},
  tokenColors: [],
  ...extra,
});
const layer = (name: string, ui: NormalizedColorLayer['ui'], syntax: NormalizedColorLayer['syntax'] = 'off', applyTo?: NormalizedColorLayer['applyTo']) =>
  ({ syntax, theme: name, ui, ...(applyTo ? { applyTo } : {}) }) as NormalizedColorLayer;
const byKey = (key: string, data: ColorThemeData): MixedKey => ({ data, target: parseColorKey(key)! });

const github = theme(
  { 'editor.background': '#0d1117', 'gitlens.lineHighlight': '#123456', 'terminal.ansiRed': '#ff7b72', 'terminal.ansiBlue': '#79c0ff' },
  {
    semanticHighlighting: false,
    semanticTokenColors: { function: '#d2a8ff' },
    tokenColors: [
      { name: 'Comment', scope: ['comment'], settings: { foreground: '#8b949e' } },
      { name: 'String', scope: 'string, punctuation.definition.string' as unknown as string[], settings: { foreground: '#a5d6ff' } },
      { name: 'Line comment', scope: ['comment.line'], settings: { foreground: '#6e7681' } },
    ],
  },
);
const monokai = theme({ 'editor.background': '#272822', 'sideBar.background': '#1e1f1c' }, { tokenColors: [{ name: 'Keyword', scope: ['keyword'], settings: { foreground: '#f92672' } }] });
const solarizedLight = theme({ 'editor.background': '#fdf6e3' }, { kind: 'light' });

describe('color theme layers', () => {
  it('reads the layer setting like the icon layers', () => {
    assert.deepEqual(
      normalizeColorLayers(['GitHub Dark', { syntax: 'override', theme: ' Monokai ', ui: 'nope' }, 'GitHub Dark', { applyTo: 'both', theme: 'Solarized Light' }, 3, { ui: 'fill' }]),
      [
        { syntax: 'fill', theme: 'GitHub Dark', ui: 'fill' },
        { syntax: 'override', theme: 'Monokai', ui: 'fill' },
        { applyTo: 'both', syntax: 'fill', theme: 'Solarized Light', ui: 'fill' },
      ],
    );
    assert.deepEqual(serializeColorLayers(normalizeColorLayers(['A', { syntax: 'off', theme: 'B' }])), ['A', { syntax: 'off', theme: 'B', ui: 'fill' }]);
    assert.deepEqual(usedColorThemeIds([{ syntax: 'off', theme: 'Off', ui: 'off' }, 'B'], { 'terminal.*': 'A' }), ['A', 'B']);
    assert.equal(kindOfUiTheme('vs'), 'light');
    assert.equal(kindOfUiTheme('hc-light'), 'light');
    assert.equal(kindOfUiTheme('hc-black'), 'dark');
  });

  it('reads the keys: color id globs, TextMate scopes and semantic selectors', () => {
    const color = parseColorKey('terminal.ansi*');
    assert.ok(color?.kind === 'color' && color.matches('terminal.ansiRed') && !color.matches('terminal.background'));
    assert.deepEqual(parseColorKey('scope: comment.line'), { kind: 'scope', scope: 'comment.line' });
    assert.deepEqual(parseColorKey('semantic:parameter'), { kind: 'semantic', selector: 'parameter' });
    assert.equal(parseColorKey('not a key'), undefined);
    assert.deepEqual(normalizeColorByKey({ 'bad key': 'A', 'editor.background': ' GitHub Dark ', 'scope:string': '' }).map((entry) => entry.theme), ['GitHub Dark']);
  });

  it('finds the style of a scope like a TextMate theme', () => {
    assert.equal(tokenStyleFor(github.tokenColors, 'comment.line.number-sign')?.foreground, '#6e7681');
    assert.equal(tokenStyleFor(github.tokenColors, 'comment.block')?.foreground, '#8b949e');
    assert.equal(tokenStyleFor(github.tokenColors, 'punctuation.definition.string.begin')?.foreground, '#a5d6ff');
    assert.equal(tokenStyleFor(github.tokenColors, 'keyword'), undefined);
  });

  it('fills only the workbench colors Cool Islands has none for, the first fill layer first', () => {
    const mixed = mixColorTheme(base, 'dark', [{ data: github, layer: layer('GitHub Dark', 'fill') }, { data: monokai, layer: layer('Monokai', 'fill') }], []);
    assert.equal(mixed.colors['editor.background'], '#191a1c');
    assert.equal(mixed.colors['gitlens.lineHighlight'], '#123456');
    assert.equal(mixed.colors['terminal.ansiBlue'], '#79c0ff');
    assert.deepEqual(mixed.tokenColors, base.tokenColors);
  });

  it('lets an override layer win, the first listed over the next', () => {
    const layers: MixedTheme[] = [{ data: monokai, layer: layer('Monokai', 'override') }, { data: github, layer: layer('GitHub Dark', 'override') }];
    const mixed = mixColorTheme(base, 'dark', layers, []);
    assert.equal(mixed.colors['editor.background'], '#272822');
    assert.equal(mixed.colors['sideBar.background'], '#1e1f1c');
    assert.equal(mixed.colors['terminal.ansiRed'], '#ff7b72');
  });

  it('mixes a layer only into the Cool Islands theme of its kind, unless applyTo says', () => {
    assert.equal(mixColorTheme(base, 'dark', [{ data: solarizedLight, layer: layer('Solarized Light', 'override') }], []).colors['editor.background'], '#191a1c');
    assert.equal(mixColorTheme(base, 'light', [{ data: solarizedLight, layer: layer('Solarized Light', 'override') }], []).colors['editor.background'], '#fdf6e3');
    assert.equal(mixColorTheme(base, 'dark', [{ data: solarizedLight, layer: layer('Solarized Light', 'override', 'off', 'both') }], []).colors['editor.background'], '#fdf6e3');
    assert.equal(mixColorTheme(base, 'light', [{ data: github, layer: layer('GitHub Dark', 'override', 'off', 'dark') }], []).colors['editor.background'], '#191a1c');
  });

  it('replaces the syntax with an override layer, and only adds the scopes Cool Islands has no rule for with a fill layer', () => {
    const override = mixColorTheme(base, 'dark', [{ data: github, layer: layer('GitHub Dark', 'off', 'override') }], []);
    assert.deepEqual(override.tokenColors, github.tokenColors);
    assert.deepEqual(override.semanticTokenColors, { function: '#d2a8ff' });
    assert.equal(override.semanticHighlighting, false);
    assert.equal(override.colors['editor.background'], '#191a1c');

    const fill = mixColorTheme(base, 'dark', [{ data: github, layer: layer('GitHub Dark', 'off', 'fill') }], []);
    // comment and comment.line are under the comment rule of Cool Islands: only the string rule is added, before it
    assert.deepEqual(fill.tokenColors.map((rule) => rule.name), ['String', 'Comment', 'Keyword']);
    assert.deepEqual(fill.semanticTokenColors, { function: '#d2a8ff', parameter: { foreground: '#bcbec4' } });
  });

  it('gives single keys from their theme over every layer', () => {
    const mixed = mixColorTheme(base, 'dark', [{ data: monokai, layer: layer('Monokai', 'override', 'override') }], [
      byKey('terminal.ansi*', github),
      byKey('scope:comment', github),
      byKey('semantic:function', github),
      byKey('editor.background', github),
    ]);
    assert.equal(mixed.colors['editor.background'], '#0d1117');
    assert.equal(mixed.colors['sideBar.background'], '#1e1f1c');
    assert.equal(mixed.colors['terminal.ansiRed'], '#ff7b72');
    assert.equal(tokenStyleFor(mixed.tokenColors, 'comment.line')?.foreground, '#6e7681');
    assert.equal(tokenStyleFor(mixed.tokenColors, 'comment.block')?.foreground, '#8b949e');
    assert.equal(tokenStyleFor(mixed.tokenColors, 'keyword')?.foreground, '#f92672');
    assert.equal(mixed.semanticTokenColors.function, '#d2a8ff' as never);
  });
});

describe('reading color themes', () => {
  let folder: string;
  beforeEach(() => {
    folder = mkdtempSync(join(tmpdir(), 'cool-color-themes-'));
  });
  afterEach(() => rmSync(folder, { force: true, recursive: true }));

  it('removes comments and trailing commas, not the ones inside strings', () => {
    const text = '{ "a": "x // not a comment", /* note */ "b": "/* kept */", "c": [1, 2,], // end\n "d": "quote \\" // still a string", }';
    assert.deepEqual(JSON.parse(stripJsonComments(text)), { a: 'x // not a comment', b: '/* kept */', c: [1, 2], d: 'quote " // still a string' });
  });

  it('reads comments, trailing commas, include and token colors in another file', () => {
    writeFileSync(join(folder, 'base.json'), `{
      // the base of the theme
      "colors": { "editor.background": "#111111", "editor.foreground": "#eeeeee", },
      "tokenColors": "tokens.json",
      "semanticHighlighting": true,
    }`);
    writeFileSync(join(folder, 'tokens.json'), JSON.stringify({ tokenColors: [{ scope: 'comment', settings: { foreground: '#888888' } }] }));
    writeFileSync(join(folder, 'theme.json'), `{
      "include": "./base.json",
      "type": "light",
      "colors": { "editor.background": "#222222", "badge": 3 },
      /* a TextMate theme is not read */
      "tokenColors": [{ "scope": "string", "settings": { "foreground": "#00ff00" } }, "not a rule"],
      "semanticTokenColors": { "parameter": "#123456" }
    }`);

    const data = readColorTheme(join(folder, 'theme.json'), 'vs-dark');
    assert.equal(data.kind, 'light');
    assert.deepEqual(data.colors, { 'editor.background': '#222222', 'editor.foreground': '#eeeeee' });
    assert.deepEqual(data.tokenColors.map((rule) => rule.scope), ['comment', 'string']);
    assert.equal(data.semanticHighlighting, true);
    assert.deepEqual(data.semanticTokenColors, { parameter: '#123456' });

    writeFileSync(join(folder, 'plist.json'), '{ "tokenColors": "theme.tmTheme" }');
    assert.deepEqual(readColorTheme(join(folder, 'plist.json'), 'hc-light'), {
      colors: {},
      kind: 'light',
      semanticHighlighting: undefined,
      semanticTokenColors: {},
      tokenColors: [],
    });
  });

  it('previews the result, Cool Islands and each theme mixed in for the Colors tab', () => {
    writeFileSync(join(folder, 'monokai.json'), JSON.stringify({
      colors: { 'editor.background': '#272822', 'editor.foreground': '#f8f8f2' },
      tokenColors: [{ scope: 'storage.type', settings: { foreground: '#66d9ef', fontStyle: 'italic' } }],
    }));
    const installed = [{ extensionPath: folder, id: 'Monokai', kind: 'dark' as const, label: 'Monokai', path: join(folder, 'monokai.json'), uiTheme: 'vs-dark' }];
    const generator = new ColorThemeGenerator({ dist: folder, themes: join(root, THEMES_FOLDER) });
    const layers = [{ syntax: 'override', theme: 'Monokai', ui: 'off' }];
    const data = readColorTheme(join(folder, 'monokai.json'), 'vs-dark');

    const state = colorMixerState({
      byKey: { 'editor.background': 'Monokai', 'scope:nothing': 'Missing' },
      generator,
      installed,
      kind: 'dark',
      labels: { base: 'Cool Islands', result: 'Result' },
      layers,
      mix: { byKey: [byKey('editor.background', data)], layers: [{ data, layer: normalizeColorLayers(layers)[0] }] },
    });

    assert.equal(state.theme, 'Cool Islands Dark');
    assert.deepEqual(state.preview.map((column) => column.id), ['result', 'base', 'Monokai']);
    assert.deepEqual(state.layers, [{ installed: true, kind: 'dark', label: 'Monokai', syntax: 'override', theme: 'Monokai', ui: 'off' }]);
    const [result, islands] = state.preview;
    assert.equal(result.colors['editor.background'], '#272822');
    assert.equal(islands.colors['editor.background'], '#191a1c');
    // `def`: Monokai's syntax replaces the one of Cool Islands in the result
    assert.deepEqual(result.code[1][0], { fontStyle: 'italic', foreground: '#66d9ef', text: 'def' });
    assert.equal(islands.code[1][0].foreground, '#cf8e6d');
    assert.equal(islands.code[1].map((part) => part.text).join(''), 'def total(self, count: int):  # 합계 계산');
  });

  it('writes the mixed themes, and only the ones that changed', () => {
    const dist = mkdtempSync(join(tmpdir(), 'cool-colors-dist-'));
    try {
      const generator = new ColorThemeGenerator({ dist, themes: join(root, THEMES_FOLDER) });
      assert.deepEqual(generator.createJsonThemes(), COLOR_THEMES.map((info) => info.label));
      assert.deepEqual(generator.createJsonThemes(), []);

      const mix = { byKey: [], layers: [{ data: monokai, layer: layer('Monokai', 'override') }] };
      assert.deepEqual(generator.createJsonThemes(mix), ['Cool Islands Dark']);
      const dark = JSON.parse(readFileSync(join(dist, COLOR_THEMES[0].file), 'utf8')) as VsCodeColorTheme;
      assert.equal(dark.colors['editor.background'], '#272822');
      assert.equal(dark.name, 'Cool Islands Dark');
    } finally {
      rmSync(dist, { force: true, recursive: true });
    }
  });
});
