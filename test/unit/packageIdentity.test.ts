import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EXTENSION_ID, PACKAGE_NAME, PUBLISHER_ID } from 'src/helpers/constants';

const packageJson = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8')) as {
  name: string;
  publisher: string;
};

describe('package identity', () => {
  // vscode.extensions.getExtension(EXTENSION_ID) finds the extension's own folder: a wrong id breaks theme regeneration
  it('builds the extension id from the publisher and name of package.json', () => {
    assert.equal(PUBLISHER_ID, packageJson.publisher);
    assert.equal(PACKAGE_NAME, packageJson.name);
    assert.equal(EXTENSION_ID, `${packageJson.publisher}.${packageJson.name}`);
  });
});
