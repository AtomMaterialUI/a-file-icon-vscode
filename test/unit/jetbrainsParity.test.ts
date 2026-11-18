import { strict as assert } from 'node:assert';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JSON_FILE_NAME, PYTHON_FILE } from 'src/helpers/constants';
import { IconThemeGenerator } from 'src/icons/generators/IconThemeGenerator';
import {
  fileKeys,
  findAssociation,
  folderKeys,
  iconName,
  loadDefaultAssociations,
  readAssociations,
} from 'src/scripts/icons/jetbrainsMatcher';

import type { IconConfiguration } from 'src/models/IconConfiguration';

const repoRoot = join(__dirname, '..', '..');
const iconGeneratorPath = join(repoRoot, 'iconGenerator');
const iconsPath = join(iconGeneratorPath, 'assets', 'icons');

/** Packs of the JetBrains plugin that VS Code has (other packs are not ported) */
const PORTED_PACKS = new Set(['ANGULAR', 'ANGULAR2', 'NEST', 'NEXTJS', 'NGRX', 'RAILS', 'RECOIL', 'REDUX', 'TESTS']);

/**
 * The default theme must show, for every name of the JetBrains associations that VS Code can express,
 * the icon the JetBrains plugin shows in PyCharm (emulated by jetbrainsMatcher).
 */
describe('JetBrains parity', () => {
  let theme: IconConfiguration;
  let dist: string;

  /** VS Code lowercases the keys of an icon theme */
  const lowerKeys = (map?: Record<string, string>) =>
    new Map(Object.entries(map ?? {}).map(([key, value]) => [key.toLowerCase(), value]));
  /** Icon file of a definition, without the config hash nor the `_dark` variant */
  const iconOf = (definition?: string) =>
    (definition && theme.iconDefinitions?.[definition]?.iconPath.split('/').pop()?.replace(/(~[^.]*)?\.svg$/, '').replace(/_dark$/, '')) ?? undefined;

  before(() => {
    dist = mkdtempSync(join(tmpdir(), 'afi-parity-'));
    new IconThemeGenerator({}, { dist, iconGenerator: iconGeneratorPath }).createJsonTheme();
    theme = JSON.parse(readFileSync(join(dist, JSON_FILE_NAME), 'utf8'));
  });

  after(() => rmSync(dist, { force: true, recursive: true }));

  it('gives each file name and extension the icon of the JetBrains plugin, in dark and light themes', () => {
    const associations = loadDefaultAssociations(iconGeneratorPath, 'icon_associations.json');
    const dark = { fileExtensions: lowerKeys(theme.fileExtensions), fileNames: lowerKeys(theme.fileNames) };
    // a light theme uses the light section, then the base one
    const light = {
      fileExtensions: new Map([...dark.fileExtensions, ...lowerKeys(theme.light?.fileExtensions)]),
      fileNames: new Map([...dark.fileNames, ...lowerKeys(theme.light?.fileNames)]),
    };

    /** The icon definition VS Code uses for a file name: exact name, then longest extension */
    const definitionFor = (maps: typeof dark, fileName: string) => {
      if (maps.fileNames.has(fileName)) return maps.fileNames.get(fileName);
      const parts = fileName.split('.');
      for (let index = 1; index < parts.length; index++) {
        const definition = maps.fileExtensions.get(parts.slice(index).join('.'));
        if (definition) return definition;
      }
      return;
    };

    // the example names of the JetBrains associations and every name and extension of the theme:
    // an extension also applies to the dot file of that name (`.pre-commit-config.yaml`),
    // and a multi-part extension does not apply to the file of that exact name (`test.js`)
    const names = new Set([
      ...fileKeys(readAssociations(iconGeneratorPath, 'icon_associations.json')).map(({ matchedName }) => matchedName),
      ...dark.fileNames.keys(),
      ...[...dark.fileExtensions.keys()].flatMap((extension) => [`file.${extension}`, `.${extension}`, extension]),
    ]);

    const different: string[] = [];
    for (const matchedName of names) {
      if (matchedName.includes('/')) continue;
      const winner = findAssociation(associations, matchedName);
      if (!winner || (winner.iconPack && !PORTED_PACKS.has(winner.iconPack))) continue;
      // the pycharm pack shows the PyCharm Python icon instead, as PyCharm does
      if (PYTHON_FILE.test(matchedName)) continue;

      const expected = iconName(winner.icon).replace(/_dark$/, '');
      if (!existsSync(join(iconsPath, 'files', `${expected}.svg`))) continue;

      // the json writes some icon names in another case than the svg (`groovyfile` for `groovyFile.svg`)
      const darkIcon = iconOf(definitionFor(dark, matchedName));
      if (darkIcon?.toLowerCase() !== expected.toLowerCase()) different.push(`dark ${matchedName}: ${darkIcon} instead of ${expected}`);

      // the light theme must not keep the icon of another association, nor use the `_dark` variant
      const lightDefinition = definitionFor(light, matchedName);
      const lightIcon = iconOf(lightDefinition);
      if (lightIcon?.toLowerCase() !== expected.toLowerCase() || lightDefinition?.endsWith('_dark')) {
        different.push(`light ${matchedName}: ${lightDefinition} instead of ${expected}`);
      }
    }
    assert.deepEqual(different, []);
  });

  it('gives each folder name the icon of the JetBrains plugin', () => {
    const associations = loadDefaultAssociations(iconGeneratorPath, 'folder_associations.json');
    const folderNames = lowerKeys(theme.folderNames);

    const different: string[] = [];
    for (const { folderName, matchedName } of folderKeys(readAssociations(iconGeneratorPath, 'folder_associations.json'))) {
      const winner = findAssociation(associations, matchedName);
      if (!winner) continue;

      const expected = iconName(winner.icon);
      if (!existsSync(join(iconsPath, 'folders', `${expected}.svg`))) continue;

      const actual = folderNames.get(folderName)?.replace(/^folder-/, '') ?? 'folder';
      if (actual !== expected) different.push(`${folderName}: ${actual} instead of ${expected}`);
    }
    assert.deepEqual(different, []);
  });
});
