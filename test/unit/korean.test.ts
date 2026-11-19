import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseNameKey } from 'src/helpers/themeLayers';
import { normalizeName } from 'src/helpers/utils';

const root = join(__dirname, '..', '..');
const readJson = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8')) as Record<string, unknown>;
const keys = (object: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(object).flatMap(([key, value]) =>
    value && typeof value === 'object' ? keys(value as Record<string, unknown>, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
const valueAt = (object: Record<string, unknown>, path: string) =>
  path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], object) as string;
const placeholders = (text: string) => [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map((match) => match[1]).sort();

const nlsFiles = readdirSync(root).filter((file) => /^package\.nls\.[\w-]+\.json$/.test(file));
const localeFiles = readdirSync(join(root, 'src', 'i18n', 'locales')).filter((file) => file !== 'en.json');

describe('Korean', () => {
  describe('translations', () => {
    const nls = readJson('package.nls.json');
    const en = readJson('src/i18n/locales/en.json');

    it('translates every setting, command and message to Korean', () => {
      const ko = readJson('package.nls.ko.json');
      assert.deepEqual(Object.keys(nls).filter((key) => !(key in ko)), []);
      const koMessages = readJson('src/i18n/locales/ko.json');
      const koKeys = new Set(keys(koMessages));
      assert.deepEqual(keys(en).filter((key) => !koKeys.has(key)), []);
      // the same {{placeholders}} as the English text
      for (const key of keys(en)) assert.deepEqual(placeholders(valueAt(koMessages, key)), placeholders(valueAt(en, key)), key);
    });

    // The other languages fall back to English for what they do not translate, but must not keep removed keys
    it('keeps no key that the English texts do not have', () => {
      for (const file of nlsFiles) {
        assert.deepEqual(Object.keys(readJson(file)).filter((key) => !(key in nls)), [], file);
      }
      const enKeys = new Set(keys(en));
      for (const file of localeFiles) {
        assert.deepEqual(keys(readJson(join('src', 'i18n', 'locales', file))).filter((key) => !enKeys.has(key)), [], file);
      }
    });

    it('has a text for every %key% of package.json', () => {
      const used = [...readFileSync(join(root, 'package.json'), 'utf8').matchAll(/"%([\w.-]+)%"/g)].map((match) => match[1]);
      assert.ok(used.length > 20);
      assert.deepEqual(used.filter((key) => !(key in nls)), []);
    });
  });

  describe('names', () => {
    const decomposed = (text: string) => text.normalize('NFD');

    it('matches a Korean name typed in its decomposed form (NFD, as macOS file names come)', () => {
      assert.notEqual(decomposed('보고서.md'), '보고서.md');
      assert.equal(normalizeName(decomposed('보고서.MD')), '보고서.md');
      assert.deepEqual(parseNameKey(decomposed('*.한글')), { kind: 'extension', name: '한글' });
      assert.deepEqual(parseNameKey(decomposed('문서/')), { kind: 'folder', name: '문서' });
      assert.deepEqual(parseNameKey(` ${decomposed('보고서.md')} `), { kind: 'file', name: '보고서.md' });
    });
  });
});
