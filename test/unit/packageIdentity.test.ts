import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EXTENSION_ID, EXTENSION_KEY, JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME, PACKAGE_NAME, PUBLISHER_ID } from 'src/helpers/constants';

const root = join(__dirname, '..', '..');
const read = (file: string) => readFileSync(join(root, file), 'utf8');

type Theme = { id: string; label: string; path: string };
const packageJson = JSON.parse(read('package.json')) as {
  contributes: { commands: Array<{ category?: string; command: string }>; iconThemes: Theme[]; productIconThemes: Theme[] };
  displayName: string;
  name: string;
  publisher: string;
};

const DISPLAY_NAME = 'Cool Theme';
const nlsFiles = readdirSync(root).filter((file) => /^package\.nls(\.[\w-]+)?\.json$/.test(file));
const localeFiles = readdirSync(join(root, 'src', 'i18n', 'locales')).map((file) => join('src', 'i18n', 'locales', file));

describe('package identity', () => {
  // vscode.extensions.getExtension(EXTENSION_ID) finds the extension's own folder: a wrong id breaks theme regeneration
  it('builds the extension id from the publisher and name of package.json', () => {
    assert.equal(PUBLISHER_ID, packageJson.publisher);
    assert.equal(PACKAGE_NAME, packageJson.name);
    assert.equal(EXTENSION_ID, `${packageJson.publisher}.${packageJson.name}`);
  });

  it('shows Cool Theme as the extension name, command category and settings title', () => {
    assert.equal(packageJson.displayName, DISPLAY_NAME);
    for (const command of packageJson.contributes.commands) {
      assert.equal(command.category, DISPLAY_NAME, command.command);
    }
    assert.ok(nlsFiles.length > 1);
    for (const file of nlsFiles) {
      assert.equal((JSON.parse(read(file)) as Record<string, string>)['configuration.title'], DISPLAY_NAME, file);
    }
  });

  // The ids are what users have in workbench.iconTheme / workbench.productIconTheme: renaming a label must not change them
  it('keeps the theme ids and names the themes in the pickers', () => {
    assert.deepEqual(
      packageJson.contributes.iconThemes.map(({ id, label, path }) => ({ id, label, path })),
      [{ id: EXTENSION_KEY, label: 'Cool Icons', path: `./dist/${JSON_FILE_NAME}` }],
    );
    assert.deepEqual(
      packageJson.contributes.productIconThemes.map(({ id, label, path }) => ({ id, label, path })),
      [{ id: `${EXTENSION_KEY}-product-icon-theme`, label: 'Cool Material Icons', path: `./dist/${JSON_PRODUCT_FILE_NAME}` }],
    );
  });

  it('leaves no old name in the user-facing texts', () => {
    for (const file of ['package.json', ...nlsFiles, ...localeFiles]) {
      const text = read(file);
      assert.doesNotMatch(text, /Cool Icon(?!s)/, file);
      assert.doesNotMatch(text, /Atom Material Icons/, file);
    }
  });

  // The original translations had "vuex" glued to the start of many command titles ("vuexZmień kolor folderów")
  it('has no text glued to the start of the translated titles', () => {
    for (const file of nlsFiles) {
      for (const [key, value] of Object.entries(JSON.parse(read(file)) as Record<string, string>)) {
        assert.doesNotMatch(value, /^vuex/, `${file} ${key}`);
      }
    }
  });
});
