import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serializeLayers } from 'src/helpers/themeLayers';
import { decodeFontCharacter, ThemePreview } from 'src/helpers/themePreview';

import type { LanguageLookup } from 'src/helpers/themeLayers';

const languages: LanguageLookup = { extensions: { md: 'markdown', py: 'python' }, fileNames: { dockerfile: 'dockerfile' } };

describe('theme mixer preview', () => {
  let folder: string;

  const theme = (json: unknown) => {
    const path = join(folder, 'theme', 'icons.json');
    writeFileSync(path, JSON.stringify(json));
    return path;
  };

  beforeEach(() => {
    folder = mkdtempSync(join(tmpdir(), 'afi-preview-'));
    // the theme json lives in a sub folder: its icons are relative to it
    mkdirSync(join(folder, 'theme'));
  });

  afterEach(() => rmSync(folder, { force: true, recursive: true }));

  const svgTheme = () => ({
    file: 'file',
    fileExtensions: { 'spec.ts': 'test', ts: 'ts' },
    fileNames: { 'package.json': 'npm' },
    folder: 'folder',
    folderNames: { src: 'src' },
    iconDefinitions: {
      file: { iconPath: './icons/file.svg' },
      folder: { iconPath: './icons/folder.svg' },
      md: { iconPath: './icons/md.svg' },
      md_light: { iconPath: './icons/md_light.svg' },
      npm: { iconPath: './icons/npm.svg' },
      src: { iconPath: '../shared/src.svg' },
      test: { iconPath: './icons/test.svg' },
      ts: { iconPath: './icons/ts.svg' },
    },
    languageIds: { markdown: 'md' },
    light: { languageIds: { markdown: 'md_light' } },
  });

  it('finds the icon of a name like VS Code: name, longest extension, language, then the default', () => {
    const path = theme(svgTheme());
    const preview = new ThemePreview({ extensionPath: folder, id: 'svg', path }, languages);
    const image = (name: string, light = false) => {
      const icon = preview.icon(name, light);
      return icon?.kind === 'image' ? icon.path : icon;
    };

    assert.equal(image('Package.json'), join(folder, 'theme', 'icons', 'npm.svg'));
    assert.equal(image('button.spec.ts'), join(folder, 'theme', 'icons', 'test.svg'));
    assert.equal(image('index.ts'), join(folder, 'theme', 'icons', 'ts.svg'));
    assert.equal(image('README.md'), join(folder, 'theme', 'icons', 'md.svg'));
    assert.equal(image('README.md', true), join(folder, 'theme', 'icons', 'md_light.svg'), 'light variant');
    assert.equal(image('index.ts', true), join(folder, 'theme', 'icons', 'ts.svg'), 'no light variant: the base one');
    assert.equal(image('notes.txt'), join(folder, 'theme', 'icons', 'file.svg'));
    assert.equal(image('src/'), join(folder, 'shared', 'src.svg'));
    assert.equal(image('lib/'), join(folder, 'theme', 'icons', 'folder.svg'));
  });

  it('gives glyphs with their font, size and color, and nothing for a glyph without a usable font', () => {
    const path = theme({
      file: '_default',
      fileExtensions: { go: '_go', md: '_md', py: '_py' },
      fonts: [
        { id: 'seti', size: '125%', src: [{ format: 'woff', path: './seti.woff' }] },
        { id: 'other', src: [{ format: 'woff2', path: './other.woff2' }], weight: 'bold' },
        { id: 'broken', src: [{ format: 'bitmap', path: './broken.bmp' }] },
      ],
      iconDefinitions: {
        _default: { fontCharacter: '\\E023', fontColor: '#ffffff' },
        _go: { fontCharacter: '\\E031', fontColor: '#519aba', fontSize: '110%' },
        _md: { fontCharacter: 'M', fontId: 'other' },
        _py: { fontCharacter: '\\E037', fontId: 'broken' },
      },
    });
    const preview = new ThemePreview({ extensionPath: folder, id: 'vs-seti', path }, languages);

    assert.deepEqual(preview.icon('main.go', false), {
      character: '',
      color: '#519aba',
      font: { key: 'vs-seti-seti', sources: [{ format: 'woff', path: join(folder, 'theme', 'seti.woff') }], style: 'normal', weight: 'normal' },
      kind: 'glyph',
      size: '110%',
    });
    const markdown = preview.icon('README.md', false);
    assert.ok(markdown?.kind === 'glyph');
    assert.equal(markdown.character, 'M');
    assert.equal(markdown.font.key, 'vs-seti-other');
    assert.equal(markdown.font.weight, 'bold');
    assert.equal(markdown.size, '125%', 'a font without a size takes the size of the first font');
    assert.equal(markdown.color, undefined);
    assert.equal(preview.icon('app.py', false), undefined, 'font in an unknown format');
    assert.equal(preview.icon('notes.txt', false)?.kind, 'glyph');
  });

  it('marks the svg files of the themes drawn with the color of the text', () => {
    const path = theme({ ...svgTheme(), usesCurrentColor: true });
    assert.deepEqual(new ThemePreview({ extensionPath: folder, id: 'modern', path }, languages).icon('index.ts', false), {
      currentColor: true,
      kind: 'image',
      path: join(folder, 'theme', 'icons', 'ts.svg'),
    });
  });

  it('shows nothing for a theme that cannot be read', () => {
    const preview = new ThemePreview({ extensionPath: folder, id: 'missing', path: join(folder, 'missing.json') }, languages);
    assert.equal(preview.icon('index.ts', false), undefined);
    assert.equal(preview.icon('src/', false), undefined);
  });

  it('decodes the CSS escapes of glyphs', () => {
    assert.equal(decodeFontCharacter('\\E001'), '');
    assert.equal(decodeFontCharacter('\\f101 '), '');
    assert.equal(decodeFontCharacter('a'), 'a');
  });

  it('writes the layers like the default setting: the id alone when both modes are fill', () => {
    assert.deepEqual(
      serializeLayers([
        { files: 'fill', folders: 'fill', theme: 'material-icon-theme' },
        { files: 'override', folders: 'off', theme: 'vs-seti' },
      ]),
      ['material-icon-theme', { files: 'override', folders: 'off', theme: 'vs-seti' }],
    );
  });
});
