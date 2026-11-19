import { strict as assert } from 'node:assert';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ColorThemeGenerator } from 'src/themes/ColorThemeGenerator';
import { COLOR_THEMES, THEMES_FOLDER } from 'src/themes/colorThemes';
import { convertJetbrainsTheme } from 'src/themes/convertJetbrainsTheme';
import { normalizeColor, parseAdditionalAttributes, parseSchemes, resolveScheme, resolveUiTheme } from 'src/themes/jetbrainsTheme';
import { SEMANTIC_RULES, TOKEN_RULES } from 'src/themes/jetbrainsTokenMap';
import { UI_MAP } from 'src/themes/jetbrainsUiMap';

import type { VsCodeColorTheme } from 'src/themes/convertJetbrainsTheme';
import type { UiThemeJson } from 'src/themes/jetbrainsTheme';

const root = join(__dirname, '..', '..');
const COLOR = /^#[\da-f]{6}([\da-f]{2})?$/;

const uiThemes: UiThemeJson[] = [
  {
    colors: { 'blue-80': '#3871E1', 'gray-20': '#212326', primary: 'blue-80' },
    name: 'Darcula',
    ui: { '*': { background: '#3C3F41' }, Tree: { background: '#2B2B2B', selectionBackground: '#0D293E' } },
  },
  {
    colors: { 'gray-20': '#1E1F22' },
    editorScheme: 'Dark',
    name: 'Dark',
    parentTheme: 'Darcula',
    ui: { '*': { selectionBackground: 'primary' }, ToolWindow: { background: 'gray-20', borderColor: 'gray-20' } },
  },
  { dark: true, editorScheme: 'Islands Dark', name: 'Islands Dark', parentTheme: 'ExperimentalDark', ui: { '*': { background: '#191A1C' }, MainWindow: { background: '#26282C' } } },
];

const schemeXml = `<?xml version="1.0"?>
<application><component>
  <scheme name="Default" version="1">
    <colors>
      <option name="CARET_ROW_COLOR" value="ffffd7"/>
      <option name="GUTTER_BACKGROUND" value="f0f0f0"/>
    </colors>
    <attributes>
      <option name="TEXT"><value><option name="FOREGROUND" value="0"/><option name="BACKGROUND" value="ffffff"/></value></option>
      <option name="DEFAULT_KEYWORD"><value><option name="FOREGROUND" value="000080"/><option name="FONT_TYPE" value="1"/></value></option>
      <option name="DEFAULT_STATIC_FIELD"><value><option name="FOREGROUND" value="660E7A"/><option name="FONT_TYPE" value="2"/></value></option>
      <option name="DEPRECATED_ATTRIBUTES"><value><option name="EFFECT_COLOR" value="404040"/><option name="EFFECT_TYPE" value="3"/></value></option>
      <option name="DEFAULT_PREDEFINED_SYMBOL"><value><option name="FONT_TYPE" value="2"/></value></option>
    </attributes>
  </scheme>
  <scheme name="Darcula" version="1" parent_scheme="Default">
    <colors><option name="CARET_ROW_COLOR" value="323232"/></colors>
    <attributes>
      <option name="TEXT"><value><option name="FOREGROUND" value="a9b7c6"/><option name="BACKGROUND" value="2b2b2b"/></value></option>
    </attributes>
  </scheme>
</component></application>`;

const islandsXml = `<scheme name="Islands Dark" version="142" parent_scheme="Darcula">
  <colors><option name="GUTTER_BACKGROUND" value=""/></colors>
  <attributes>
    <option name="TEXT"><value><option name="FOREGROUND" value="bcbec4"/><option name="BACKGROUND" value="191A1C"/></value></option>
    <option name="DEFAULT_CONSTANT" baseAttributes="DEFAULT_STATIC_FIELD"/>
  </attributes>
</scheme>`;

const pythonDarcula = `<?xml version='1.0'?>
<list>
  <option name="PY.SELF_PARAMETER"><value><option name="FOREGROUND" value="94558D"/></value></option>
  <option baseAttributes="DEFAULT_KEYWORD" name="PY.BOLD"><value><option name="FONT_TYPE" value="1"/></value></option>
</list>`;

const resolved = () => {
  const ui = resolveUiTheme(uiThemes, 'Islands Dark');
  const scheme = resolveScheme([...parseSchemes(schemeXml), ...parseSchemes(islandsXml)], ui.editorScheme!, {
    Darcula: [parseAdditionalAttributes(pythonDarcula)],
  });
  return { scheme, ui };
};

describe('JetBrains themes', () => {
  it('normalizes the colors of the theme json and of the scheme xml', () => {
    assert.equal(normalizeColor('#3871E1'), '#3871e1');
    assert.equal(normalizeColor('FFFFFF26'), '#ffffff26');
    assert.equal(normalizeColor('0'), '#000000');
    assert.equal(normalizeColor('8D9'), '#0008d9');
    assert.equal(normalizeColor(''), undefined);
    assert.equal(normalizeColor('primary', true), undefined);
    assert.equal(normalizeColor('3871E1', true), undefined);
  });

  it('resolves a UI theme with its parent ids, named colors and wildcards in the order the IDE applies them', () => {
    const { ui } = resolved();
    assert.deepEqual(ui.chain, ['Darcula', 'Dark', 'Islands Dark']);
    assert.equal(ui.dark, true);
    assert.equal(ui.editorScheme, 'Islands Dark');
    // named colors: the child's value of a name wins, and names point to names
    assert.equal(ui.get('ToolWindow.borderColor'), '#1e1f22');
    assert.equal(ui.get('List.selectionBackground'), '#3871e1');
    // the wildcard of a child replaces the explicit keys of its parents
    assert.equal(ui.get('ToolWindow.background'), '#191a1c');
    assert.equal(ui.get('Tree.background'), '#191a1c');
    assert.equal(ui.get('Tree.selectionBackground'), '#3871e1');
    // an explicit key after the wildcard of the same theme wins
    assert.equal(ui.get('MainWindow.background'), '#26282c');
    assert.equal(ui.get('Unknown.foreground'), undefined);
    assert.throws(() => resolveUiTheme(uiThemes.slice(1), 'Islands Dark'), /Unknown parent theme of Dark: Darcula/);
  });

  it('resolves a color scheme with its parents, base attributes and the attributes plugins add', () => {
    const { scheme } = resolved();
    assert.deepEqual(scheme.chain, ['Islands Dark', 'Darcula', 'Default']);
    assert.deepEqual(scheme.attributes('TEXT'), { background: '#191a1c', foreground: '#bcbec4' });
    assert.deepEqual(scheme.attributes('DEFAULT_KEYWORD'), { fontType: 1, foreground: '#000080' });
    assert.deepEqual(scheme.attributes('DEFAULT_CONSTANT'), { fontType: 2, foreground: '#660e7a' });
    assert.deepEqual(scheme.attributes('PY.SELF_PARAMETER'), { foreground: '#94558d' });
    // a value of its own wins over its base attributes
    assert.deepEqual(scheme.attributes('PY.BOLD'), { fontType: 1 });
    assert.equal(scheme.color('CARET_ROW_COLOR'), '#323232');
    // an empty value unsets the color of the parent scheme
    assert.equal(scheme.color('GUTTER_BACKGROUND'), undefined);
  });

  it('converts to a VS Code theme with the first source that has a value', () => {
    const { scheme, ui } = resolved();
    const { theme, unresolved } = convertJetbrainsTheme('Test', ui, scheme, {
      semantic: { '*.deprecated': ['DEPRECATED_ATTRIBUTES'], selfParameter: ['PY.SELF_PARAMETER'], unknown: ['NOPE'] },
      tokens: [
        { from: ['DEFAULT_KEYWORD'], name: 'Keyword', scope: ['keyword'] },
        { from: ['DEFAULT_PREDEFINED_SYMBOL', 'TEXT'], name: 'Builtin', scope: ['support.function'] },
        { from: ['NOPE'], name: 'Missing', scope: ['nope'] },
      ],
      ui: {
        'editor.background': ['bg:TEXT'],
        'editorGutter.background': ['color:GUTTER_BACKGROUND', '=editor.background'],
        'sideBar.background': ['ui:Nope.background', 'ui:ToolWindow.background'],
        'widget.shadow': ['#00000040'],
        'missing.color': ['ui:Nope.color'],
      },
    });
    assert.equal(theme.type, 'dark');
    assert.deepEqual(theme.colors, {
      'editor.background': '#191a1c',
      'editorGutter.background': '#191a1c',
      'sideBar.background': '#191a1c',
      'widget.shadow': '#00000040',
    });
    assert.deepEqual(theme.tokenColors, [
      { name: 'Keyword', scope: ['keyword'], settings: { fontStyle: 'bold', foreground: '#000080' } },
      // the font style of the first key, the color of the next one that has one
      { name: 'Builtin', scope: ['support.function'], settings: { fontStyle: 'italic', foreground: '#bcbec4' } },
    ]);
    assert.deepEqual(theme.semanticTokenColors['*.deprecated'], { bold: false, italic: false, strikethrough: true, underline: false });
    assert.equal(theme.semanticTokenColors.selfParameter.foreground, '#94558d');
    assert.deepEqual(unresolved, ['missing.color', 'token: Missing', 'semantic: unknown']);
  });

  it('only uses known sources in the maps', () => {
    for (const [id, sources] of Object.entries(UI_MAP)) {
      assert.match(id, /^[a-z][\dA-Za-z]*(\.[\dA-Za-z]+)*$/, id);
      for (const source of sources) {
        const known = /^(ui|color|fg|bg|effect|stripe):\S+$/.test(source) || COLOR.test(source) || (source.startsWith('=') && source.slice(1) in UI_MAP);
        assert.ok(known, `${id}: ${source}`);
      }
    }
    for (const rule of TOKEN_RULES) assert.ok(rule.from.length > 0 && rule.scope.length > 0, rule.name);
    for (const [selector, keys] of Object.entries(SEMANTIC_RULES)) assert.ok(keys.length > 0, selector);
  });
});

describe('Cool Islands color themes', () => {
  const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
    contributes: { themes: Array<{ label: string; path: string; uiTheme: string }> };
  };

  it('contributes every theme from dist/', () => {
    assert.deepEqual(
      packageJson.contributes.themes,
      COLOR_THEMES.map((info) => ({ label: info.label, path: `./dist/${info.file}`, uiTheme: info.uiTheme })),
    );
  });

  for (const info of COLOR_THEMES) {
    it(`generates ${info.label} from the JetBrains ${info.jetbrains} theme`, () => {
      const base = JSON.parse(readFileSync(join(root, THEMES_FOLDER, info.base), 'utf8')) as VsCodeColorTheme;
      assert.equal(base.type, info.uiTheme === 'vs' ? 'light' : 'dark');
      assert.ok(Object.keys(base.colors).length > 200);
      for (const [id, value] of Object.entries(base.colors)) assert.match(value, COLOR, id);
      for (const rule of base.tokenColors) {
        if (rule.settings.foreground) assert.match(rule.settings.foreground, COLOR, rule.name);
      }
      assert.equal(base.semanticHighlighting, true);
      // the editor and the panels have the background of the JetBrains editor
      assert.equal(base.colors['editor.background'], info.uiTheme === 'vs' ? '#ffffff' : '#191a1c');
    });
  }

  it('writes the themes to dist with their names', () => {
    const dist = mkdtempSync(join(tmpdir(), 'cool-colors-'));
    try {
      new ColorThemeGenerator({ dist, themes: join(root, THEMES_FOLDER) }).createJsonThemes();
      for (const info of COLOR_THEMES) {
        const base = JSON.parse(readFileSync(join(root, THEMES_FOLDER, info.base), 'utf8')) as VsCodeColorTheme;
        const written = JSON.parse(readFileSync(join(dist, info.file), 'utf8')) as VsCodeColorTheme;
        assert.deepEqual(written, { ...base, name: info.label });
      }
    } finally {
      rmSync(dist, { force: true, recursive: true });
    }
  });
});
