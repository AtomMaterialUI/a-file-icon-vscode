import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, posix, win32 } from 'node:path';
import { isInsideFolder, resolveThemePath } from 'src/helpers/themePaths';
import { ThemePreview } from 'src/helpers/themePreview';
import { readProductTheme } from 'src/productIcons/ProductIconGenerator';
import { readColorTheme } from 'src/themes/readColorTheme';

import type { LanguageLookup } from 'src/helpers/themeLayers';

// docs/MAINTENANCE.md, 1. 보안, rule 2: the files of another theme are read only from the folder of its extension
describe('paths of the theme files of other extensions', () => {
  describe('resolveThemePath', () => {
    const root = '/ext/pub.theme-1.0.0';
    const themeFile = `${root}/themes/theme.json`;
    const resolve = (path: string) => resolveThemePath(root, themeFile, path, posix);

    it('resolves the paths relative to the theme file inside the extension', () => {
      assert.equal(resolve('./icons/file.svg'), `${root}/themes/icons/file.svg`);
      assert.equal(resolve('icons/file.svg'), `${root}/themes/icons/file.svg`);
      // out of the folder of the theme file, still in the extension
      assert.equal(resolve('../fonts/seti.woff'), `${root}/fonts/seti.woff`);
      assert.equal(resolve('./../icons/../icons/file.svg'), `${root}/icons/file.svg`);
      assert.equal(resolve('..file.svg'), `${root}/themes/..file.svg`, 'a name starting with two dots');
    });

    it('rejects the paths leaving the extension', () => {
      assert.equal(resolve('../../secret.svg'), undefined);
      assert.equal(resolve('../../../../home/user/.ssh/id_rsa.svg'), undefined);
      assert.equal(resolve('../../pub.theme-1.0.0-other/file.svg'), undefined, 'a folder whose name starts like the extension');
      assert.equal(resolve('/etc/secret.svg'), undefined, 'an absolute path');
      assert.equal(resolve('../..'), undefined);
      assert.equal(resolve(''), undefined);
      assert.equal(resolveThemePath('', themeFile, './icons/file.svg', posix), undefined, 'no extension folder');
    });

    it('compares Windows paths without case, in NFC, and rejects another drive', () => {
      const windowsRoot = String.raw`C:\Users\홍길동\.vscode\extensions\Pub.Theme-1.0.0`;
      const windowsFile = String.raw`${windowsRoot}\themes\theme.json`;
      const resolveWindows = (path: string) => resolveThemePath(windowsRoot, windowsFile, path, win32);

      assert.equal(resolveWindows('../icons/file.svg'), String.raw`${windowsRoot}\icons\file.svg`);
      assert.equal(resolveWindows(String.raw`..\icons\file.svg`), String.raw`${windowsRoot}\icons\file.svg`);
      assert.equal(resolveWindows(String.raw`..\..\PUB.THEME-1.0.0\icons\file.svg`), String.raw`C:\Users\홍길동\.vscode\extensions\PUB.THEME-1.0.0\icons\file.svg`);
      assert.ok(isInsideFolder(windowsRoot, String.raw`c:\users\홍길동\.VSCODE\extensions\pub.theme-1.0.0\x.svg`, win32));
      // the name of the user typed in its decomposed form (NFD)
      const decomposed = windowsRoot.replace('홍길동', '홍길동'.normalize('NFD'));
      assert.notEqual(decomposed, windowsRoot);
      assert.ok(isInsideFolder(windowsRoot, `${decomposed}\\x.svg`, win32));

      assert.equal(resolveWindows(String.raw`..\..\secret.svg`), undefined);
      assert.equal(resolveWindows(String.raw`D:\secret.svg`), undefined);
      assert.equal(resolveWindows(String.raw`\Windows\secret.svg`), undefined, 'the root of the drive');
      assert.equal(resolveWindows(String.raw`\\server\share\secret.svg`), undefined, 'a network path');
    });

    it('takes the extension folder itself as inside, and nothing with an empty folder', () => {
      assert.ok(isInsideFolder(root, root, posix));
      assert.ok(isInsideFolder(`${root}/`, `${root}/themes`, posix));
      assert.equal(isInsideFolder(root, '/ext', posix), false);
      assert.equal(isInsideFolder('', '/ext', posix), false);
    });
  });

  describe('the readers of the other themes', () => {
    const languages: LanguageLookup = { extensions: {}, fileNames: {} };
    let folder: string;
    /** the folder of the installed extension contributing the theme */
    let extension: string;
    /** a path from the `themes` folder of the extension to a file outside it */
    let escape: (file: string) => string;

    const write = (path: string, content: string) => {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    };

    beforeEach(() => {
      folder = mkdtempSync(join(tmpdir(), 'cool-theme-paths-'));
      extension = join(folder, 'extensions', 'pub.theme-1.0.0');
      escape = (file) => `../../../secret/${file}`;
      write(join(folder, 'secret', 'secret.svg'), '<svg/>');
      write(join(folder, 'secret', 'secret.woff'), 'secret font');
      write(join(folder, 'secret', 'secret.json'), JSON.stringify({ colors: { 'editor.background': '#ff0000' }, tokenColors: [{ scope: 'secret', settings: { foreground: '#ff0000' } }] }));
      write(join(folder, 'secret', 'tokens.json'), JSON.stringify({ tokenColors: [{ scope: 'secret', settings: { foreground: '#ff0000' } }] }));
    });

    afterEach(() => rmSync(folder, { force: true, recursive: true }));

    it('reads a color theme without the include and token colors files outside its extension', () => {
      write(join(extension, 'themes', 'base.json'), JSON.stringify({
        colors: { 'editor.foreground': '#eeeeee' },
        // inside the extension, out of the folder of the theme
        tokenColors: '../shared/tokens.json',
      }));
      write(join(extension, 'shared', 'tokens.json'), JSON.stringify({ tokenColors: [{ scope: 'comment', settings: { foreground: '#888888' } }] }));
      write(join(extension, 'themes', 'nested.json'), JSON.stringify({ include: './base.json', tokenColors: escape('tokens.json') }));
      write(join(extension, 'themes', 'theme.json'), JSON.stringify({
        colors: { 'editor.background': '#222222' },
        include: './nested.json',
        tokenColors: [{ scope: 'string', settings: { foreground: '#00ff00' } }],
      }));
      write(join(extension, 'themes', 'escaping.json'), JSON.stringify({ colors: { 'editor.background': '#222222' }, include: escape('secret.json'), tokenColors: escape('tokens.json') }));
      write(join(extension, 'themes', 'absolute.json'), JSON.stringify({ include: join(folder, 'secret', 'secret.json') }));

      const theme = readColorTheme({ extensionPath: extension, path: join(extension, 'themes', 'theme.json'), uiTheme: 'vs-dark' });
      assert.deepEqual(theme.colors, { 'editor.background': '#222222', 'editor.foreground': '#eeeeee' });
      assert.deepEqual(theme.tokenColors.map((rule) => rule.scope), ['comment', 'string'], 'the token colors of the nested file outside are skipped');

      const escaping = readColorTheme({ extensionPath: extension, path: join(extension, 'themes', 'escaping.json'), uiTheme: 'vs-dark' });
      assert.deepEqual(escaping.colors, { 'editor.background': '#222222' });
      assert.deepEqual(escaping.tokenColors, []);
      assert.deepEqual(readColorTheme({ extensionPath: extension, path: join(extension, 'themes', 'absolute.json') }).colors, {});
    });

    it('reads a product icon theme without the fonts outside its extension, nor their icons', () => {
      write(join(extension, 'fonts', 'inside.woff'), 'font');
      write(join(extension, 'themes', 'product.json'), JSON.stringify({
        fonts: [
          { id: 'outside', src: [{ format: 'woff', path: escape('secret.woff') }] },
          { id: 'inside', src: [{ format: 'woff', path: '../fonts/inside.woff' }] },
          { id: 'both', src: [{ format: 'woff', path: escape('secret.woff') }, { format: 'woff2', path: '../fonts/inside.woff' }] },
        ],
        iconDefinitions: {
          both: { fontCharacter: '\\e003', fontId: 'both' },
          // without a fontId: the first font, outside
          first: { fontCharacter: '\\e004' },
          inside: { fontCharacter: '\\e002', fontId: 'inside' },
          outside: { fontCharacter: '\\e001', fontId: 'outside' },
        },
      }));

      const theme = readProductTheme({ extensionPath: extension, id: 'pub-product', path: join(extension, 'themes', 'product.json') });
      assert.deepEqual(theme.fonts, [
        { id: 'inside', src: [{ format: 'woff', path: join(extension, 'fonts', 'inside.woff') }] },
        { id: 'both', src: [{ format: 'woff2', path: join(extension, 'fonts', 'inside.woff') }] },
      ]);
      assert.deepEqual(Object.keys(theme.iconDefinitions).sort(), ['both', 'inside']);
    });

    it('previews no icon nor glyph whose file is outside the extension of its theme', () => {
      write(join(extension, 'icons', 'file.svg'), '<svg/>');
      write(join(extension, 'fonts', 'inside.woff'), 'font');
      const icons = (fonts: unknown) => {
        write(join(extension, 'themes', 'icons.json'), JSON.stringify({
          file: 'file',
          fileExtensions: { abs: 'absolute', glyph: 'glyph', secret: 'secret' },
          fonts,
          iconDefinitions: {
            absolute: { iconPath: join(folder, 'secret', 'secret.svg') },
            file: { iconPath: '../icons/file.svg' },
            glyph: { fontCharacter: '\\E001' },
            secret: { iconPath: escape('secret.svg') },
          },
        }));
        return new ThemePreview({ extensionPath: extension, id: 'pub-icons', path: join(extension, 'themes', 'icons.json') }, languages);
      };

      const preview = icons([{ id: 'inside', src: [{ format: 'woff', path: '../fonts/inside.woff' }] }]);
      assert.deepEqual(preview.icon('notes.txt', false), { kind: 'image', path: join(extension, 'icons', 'file.svg') });
      assert.equal(preview.icon('passwords.secret', false), undefined);
      assert.equal(preview.icon('passwords.abs', false), undefined);
      assert.equal(preview.icon('a.glyph', false)?.kind, 'glyph');

      const outside = icons([{ id: 'outside', src: [{ format: 'woff', path: escape('secret.woff') }] }]);
      assert.equal(outside.icon('a.glyph', false), undefined);
    });
  });
});
