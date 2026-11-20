import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EXTENSION_ID, EXTENSION_KEY, JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME, PACKAGE_NAME, PUBLISHER_ID } from 'src/helpers/constants';

const root = join(__dirname, '..', '..');
const read = (file: string) => readFileSync(join(root, file), 'utf8');

type Theme = { id: string; label: string; path: string };
const packageJson = JSON.parse(read('package.json')) as {
  capabilities: { untrustedWorkspaces: { description?: string; restrictedConfigurations?: string[]; supported: boolean | string } };
  contributes: {
    commands: Array<{ category?: string; command: string }>;
    configuration: { properties: Record<string, unknown> };
    iconThemes: Theme[];
    productIconThemes: Theme[];
  };
  displayName: string;
  galleryBanner: { color: string; theme: string };
  icon: string;
  name: string;
  publisher: string;
  scripts: Record<string, string>;
};

const DISPLAY_NAME = 'Cool Theme Kit';
const nlsFiles = readdirSync(root).filter((file) => /^package\.nls(\.[\w-]+)?\.json$/.test(file));
const localeFiles = readdirSync(join(root, 'src', 'i18n', 'locales')).map((file) => join('src', 'i18n', 'locales', file));

describe('package identity', () => {
  // vscode.extensions.getExtension(EXTENSION_ID) finds the extension's own folder: a wrong id breaks theme regeneration
  it('builds the extension id from the publisher and name of package.json', () => {
    assert.equal(PUBLISHER_ID, packageJson.publisher);
    assert.equal(PACKAGE_NAME, packageJson.name);
    assert.equal(EXTENSION_ID, `${packageJson.publisher}.${packageJson.name}`);
  });

  it('shows Cool Theme Kit as the extension name, command category and settings title', () => {
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
      [
        { id: 'cool-islands-product-icons', label: 'Cool Islands Icons', path: './dist/cool-islands-product-icon-theme.json' },
        { id: `${EXTENSION_KEY}-product-icon-theme`, label: 'Cool Material Icons', path: `./dist/${JSON_PRODUCT_FILE_NAME}` },
      ],
    );
  });

  it('leaves no old name in the user-facing texts', () => {
    for (const file of ['package.json', ...nlsFiles, ...localeFiles]) {
      const text = read(file);
      assert.doesNotMatch(text, /Cool Icon(?!s)/, file);
      assert.doesNotMatch(text, /Atom Material Icons/, file);
      // "Cool Theme" alone is the display name of other extensions on the Marketplace, which refuses a taken name
      assert.doesNotMatch(text, /Cool Theme(?! Kit)/, file);
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

  // The associations take SVG file paths (helpers/customIcons.ts) that are copied into the theme: in Restricted Mode
  // VS Code must ignore the values of the workspace settings (docs/MAINTENANCE.md, security rule 4)
  it('ignores the icon associations of an untrusted workspace', () => {
    const { description, restrictedConfigurations, supported } = packageJson.capabilities.untrustedWorkspaces;
    assert.equal(supported, 'limited');
    const associations = ['filesAssociations', 'foldersAssociations', 'languagesAssociations'].map((key) => `${EXTENSION_KEY}.${key}`);
    assert.deepEqual(restrictedConfigurations, associations);
    for (const key of associations) assert.ok(key in packageJson.contributes.configuration.properties, key);
    assert.match(description ?? '', /^%(.+)%$/);
    const nlsKey = description!.slice(1, -1);
    assert.ok(JSON.parse(read('package.nls.json'))[nlsKey]);
    assert.ok(JSON.parse(read('package.nls.ko.json'))[nlsKey]);
  });

  // logo.png is what the Marketplace and the Extensions view show: it is rendered from logo.svg by `bun run build:logo`
  it('ships a 256 px logo rendered from logo.svg, on a Cool Islands Dark banner', () => {
    assert.equal(packageJson.icon, 'logo.png');
    const png = readFileSync(join(root, 'logo.png'));
    assert.equal(png.toString('latin1', 1, 4), 'PNG');
    // IHDR: width and height are the first two 32-bit numbers of its data
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [256, 256]);
    assert.match(packageJson.scripts['build:logo'], /buildLogo\.ts/);
    assert.deepEqual(packageJson.galleryBanner, { color: '#191a1c', theme: 'dark' });
  });
});
