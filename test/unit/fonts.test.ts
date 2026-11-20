import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { EDITOR_FONT_FAMILY, fontFolders, isFontInstalled, missingFonts, UI_FONT_FAMILY } from 'src/helpers/fonts';
import { isCancellation } from 'src/helpers/utils';

const root = join(__dirname, '..', '..');
const families = (list: string) => list.split(',').map((family) => family.trim().replaceAll("'", ''));

describe('JetBrains fonts', () => {
  const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
    contributes: { configurationDefaults: Record<string, string> };
  };

  it('gives the fonts as defaults only, so a font the user sets wins', () => {
    assert.deepEqual(packageJson.contributes.configurationDefaults, {
      'editor.fontFamily': EDITOR_FONT_FAMILY,
      'markdown.preview.fontFamily': UI_FONT_FAMILY,
    });
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
      assert.equal(isFontInstalled('JetBrains Mono', [folder, join(folder, 'missing')]), false);
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

  it('suggests JetBrains Mono, and D2Coding with a Korean interface, when the default font is used without them', () => {
    const none = () => false;
    assert.deepEqual(missingFonts({ installed: none, language: 'en', userFont: false }), ['JetBrains Mono']);
    assert.deepEqual(missingFonts({ installed: none, language: 'ko', userFont: false }), ['JetBrains Mono', 'D2Coding']);
    assert.deepEqual(missingFonts({ installed: (family) => family === 'JetBrains Mono', language: 'ko', userFont: false }), ['D2Coding']);
    assert.deepEqual(missingFonts({ installed: none, language: 'ko', userFont: true }), []);
  });
});
