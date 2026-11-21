import * as assert from 'node:assert/strict';
import { compareCodeUnits, trimTrailingSlashes } from 'src/helpers/utils';
import { hashedIconName } from 'src/icons/generators/IconThemeGenerator';
import { checkedCommit, checkedDate } from 'src/scripts/jetbrainsSource';
import { parseColorKey } from 'src/themes/colorLayers';

// The rewrites of the SonarQube Cloud findings must keep the results of the code they replace
describe('rewritten helpers', () => {
  it('compareCodeUnits sorts like sort() without a compare function', () => {
    const values = ['b', 'B', 'a', '가', 'Z', 'a-b', 'a_b', '10', '9', ''];
    assert.deepEqual([...values].sort(compareCodeUnits), [...values].sort()); // NOSONAR: the reference order
  });

  it('trimTrailingSlashes drops only the slashes at the end', () => {
    for (const text of ['src/', 'src///', 'a/b/', '/', '///', '', 'src', '/src']) {
      assert.equal(trimTrailingSlashes(text), text.replace(/\/+$/, ''), text); // NOSONAR: the former code
    }
    assert.equal(trimTrailingSlashes(`${'/'.repeat(100_000)}x`), `${'/'.repeat(100_000)}x`);
  });

  it('hashedIconName gives the former replace result', () => {
    const former = (file: string, hash: string) => file.replace(/(^[^.~]+)(.*)\.svg/, `$1${hash}.svg`); // NOSONAR
    const files = ['folder.svg', 'folder-open.svg', 'a.b.svg', 'name~-123.svg', 'name~4.svg', '.svg', '~x.svg', 'readme', 'x.svg.bak', 'x.png', 'a~b.c'];
    for (const file of files) {
      assert.equal(hashedIconName(file, '~42'), former(file, '~42'), file);
      assert.equal(hashedIconName(file, ''), former(file, ''), file);
    }
  });

  it('parseColorKey reads the scope and semantic prefixes as before', () => {
    assert.deepEqual(parseColorKey(' scope:  comment.line '), { kind: 'scope', scope: 'comment.line' });
    assert.deepEqual(parseColorKey('Semantic:parameter'), { kind: 'semantic', selector: 'parameter' });
    assert.equal(parseColorKey('scope:'), undefined);
    assert.equal(parseColorKey('scope:   '), undefined);
    assert.equal(parseColorKey('editor.background')?.kind, 'color');
  });

  it('checkedCommit accepts only a full commit SHA', () => {
    const sha = '8a2ab1f1502587f60d62a868554050924dce7b6d';
    assert.equal(checkedCommit(sha), sha);
    for (const bad of [undefined, 42, '', 'master', sha.slice(1), `${sha}\n`, `${sha}/../x`, sha.toUpperCase()]) {
      assert.throws(() => checkedCommit(bad));
    }
  });

  it('checkedDate keeps only the day of an ISO 8601 commit date', () => {
    assert.equal(checkedDate('2026-11-19T04:05:06Z'), '2026-11-19');
    assert.equal(checkedDate('2026-11-19T23:30:00-02:00'), '2026-11-20');
    for (const bad of [undefined, 42, '', '2026-11-19', 'yesterday', '2026-13-45T00:00:00Z', '2026-11-19T\n']) {
      assert.throws(() => checkedDate(bad));
    }
  });
});
