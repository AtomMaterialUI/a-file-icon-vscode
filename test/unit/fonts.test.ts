import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  EDITOR_FONT_FAMILY,
  fontconfigFamilies,
  fontFolders,
  isFontInstalled,
  isJetBrainsFont,
  JETBRAINS_FONT_SETTINGS,
  missingFonts,
  shouldOfferFonts,
  UI_FONT_FAMILY,
} from 'src/helpers/fonts';
import { isCancellation } from 'src/helpers/utils';
import { COLOR_THEMES } from 'src/themes/colorThemes';

const root = join(__dirname, '..', '..');
const families = (list: string) => list.split(',').map((family) => family.trim().replaceAll("'", ''));

describe('JetBrains fonts', () => {
  const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
    contributes: { configurationDefaults?: Record<string, string> };
  };

  // a user of the file icons alone keeps the font of VS Code: the fonts are written only when the user chooses them
  it('changes no font by being installed', () => {
    const defaults = Object.keys(packageJson.contributes.configurationDefaults ?? {});
    assert.deepEqual(defaults.filter((key) => /font/i.test(key)), []);
  });

  it('writes the editor and Markdown preview font lists', () => {
    assert.deepEqual(
      JETBRAINS_FONT_SETTINGS.map(({ key, section, value }) => [`${section}.${key}`, value]),
      [
        ['editor.fontFamily', EDITOR_FONT_FAMILY],
        ['markdown.preview.fontFamily', UI_FONT_FAMILY],
      ],
    );
  });

  it('knows its font lists, also with other spaces, and not another font', () => {
    assert.equal(isJetBrainsFont(EDITOR_FONT_FAMILY), true);
    assert.equal(isJetBrainsFont(`  ${EDITOR_FONT_FAMILY.replaceAll(', ', ',\n  ')} `), true);
    assert.equal(isJetBrainsFont(UI_FONT_FAMILY, UI_FONT_FAMILY), true);
    assert.equal(isJetBrainsFont(UI_FONT_FAMILY), false);
    assert.equal(isJetBrainsFont("'Roboto Mono', 'D2Coding', monospace"), false);
    assert.equal(isJetBrainsFont(undefined), false);
  });

  it('offers the fonts once, to a user of Cool Islands with no editor font of their own', () => {
    const islandsThemes = COLOR_THEMES.map((theme) => theme.label);
    const offer = { asked: false, colorTheme: 'Cool Islands Dark', enabled: true, islandsThemes, userFont: false };
    assert.equal(shouldOfferFonts(offer), true);
    assert.equal(shouldOfferFonts({ ...offer, colorTheme: 'Cool Islands Light' }), true);
    assert.equal(shouldOfferFonts({ ...offer, colorTheme: 'Dark Modern' }), false);
    assert.equal(shouldOfferFonts({ ...offer, colorTheme: undefined }), false);
    assert.equal(shouldOfferFonts({ ...offer, asked: true }), false);
    assert.equal(shouldOfferFonts({ ...offer, userFont: true }), false);
    assert.equal(shouldOfferFonts({ ...offer, enabled: false }), false);
  });

  it('puts the JetBrains font first, then Korean fonts for Hangul, then a generic family', () => {
    const editor = families(EDITOR_FONT_FAMILY);
    assert.equal(editor[0], 'JetBrains Mono');
    assert.ok(editor.indexOf('D2Coding') < editor.indexOf('Malgun Gothic'));
    for (const korean of ['D2Coding', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans Mono CJK KR']) assert.ok(editor.includes(korean), korean);
    assert.equal(editor.at(-1), 'monospace');

    const ui = families(UI_FONT_FAMILY);
    assert.equal(ui[0], 'Inter');
    for (const korean of ['Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR']) assert.ok(ui.includes(korean), korean);
    assert.equal(ui.at(-1), 'sans-serif');
  });

  it('looks for fonts in the system and user font folders', () => {
    assert.deepEqual(fontFolders('win32', { LOCALAPPDATA: String.raw`C:\Users\me\AppData\Local`, WINDIR: String.raw`C:\Windows` }, 'C:/Users/me'), [
      join(String.raw`C:\Windows`, 'Fonts'),
      join(String.raw`C:\Users\me\AppData\Local`, 'Microsoft', 'Windows', 'Fonts'),
    ]);
    assert.deepEqual(fontFolders('darwin', {}, '/Users/me'), [join('/Users/me', 'Library', 'Fonts'), '/Library/Fonts', '/System/Library/Fonts']);
    assert.ok(fontFolders('linux', {}, '/home/me').includes('/usr/share/fonts'));
  });

  describe('installed fonts', () => {
    let folder: string;
    const font = (path: string) => {
      mkdirSync(join(folder, path, '..'), { recursive: true });
      writeFileSync(join(folder, path), '');
    };

    beforeEach(() => {
      folder = mkdtempSync(join(tmpdir(), 'cool-fonts-'));
    });
    afterEach(() => rmSync(folder, { force: true, recursive: true }));

    it('finds a font file, also in a sub folder', () => {
      font('truetype/jetbrains-mono/JetBrainsMono-Regular.ttf');
      font('D2Coding-Ver1.3.3-20180524-all.ttc');
      assert.equal(isFontInstalled('JetBrains Mono', [folder]), true);
      assert.equal(isFontInstalled('D2Coding', [folder]), true);
    });

    it('does not take another family or another file for the font', () => {
      font('JetBrainsMonoNL-Regular.ttf');
      font('JetBrainsMonoNerdFont-Regular.ttf');
      font('JetBrainsMono-Regular.txt');
      // without fontconfig: the machine running the tests may have JetBrains Mono installed (Linux CI)
      assert.equal(isFontInstalled('JetBrains Mono', [folder, join(folder, 'missing')], () => ''), false);
    });

    it('asks fontconfig for the fonts that are in none of the folders', () => {
      assert.equal(isFontInstalled('JetBrains Mono', [folder], () => 'd2coding\njetbrains mono,jetbrains mono nl\n'), true);
      assert.equal(isFontInstalled('D2Coding', [folder], () => 'jetbrains mono\n'), false);
      assert.equal(fontconfigFamilies('win32'), '');
    });
  });

  // the font message still open when the window closes is rejected by VS Code: not an error of the extension (smoke test)
  it('does not count the cancellation of the font message as an error', () => {
    const canceled = Object.assign(new Error('Canceled'), { name: 'Canceled' });
    assert.equal(isCancellation(canceled), true);
    assert.equal(isCancellation({ message: 'Canceled', name: 'Canceled' }), true);
    assert.equal(isCancellation(new Error('EISDIR')), false);
    assert.equal(isCancellation('Canceled'), false);
    assert.equal(isCancellation(undefined), false);
  });

  it('suggests JetBrains Mono, and D2Coding with a Korean interface, when the JetBrains fonts are used without them', () => {
    const none = () => false;
    assert.deepEqual(missingFonts({ installed: none, language: 'en', usesJetBrainsFont: true }), ['JetBrains Mono']);
    assert.deepEqual(missingFonts({ installed: none, language: 'ko', usesJetBrainsFont: true }), ['JetBrains Mono', 'D2Coding']);
    assert.deepEqual(missingFonts({ installed: (family) => family === 'JetBrains Mono', language: 'ko', usesJetBrainsFont: true }), ['D2Coding']);
    assert.deepEqual(missingFonts({ installed: none, language: 'ko', usesJetBrainsFont: false }), []);
  });
});
