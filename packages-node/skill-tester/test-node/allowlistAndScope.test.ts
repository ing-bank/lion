/**
 * The import allowlist and the extra-file check.
 *
 * Both are honest about their reach: the allowlist is built from `@lion/ui`'s own export map, and
 * because that map has a blanket `./*` key the allowlist's real teeth today are the `#` subpath ban
 * plus the existing deep-import and `@lion/*` rules. Should the map ever be narrowed, the allowlist
 * starts enforcing it with no change here.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { allowedLionUiSpecifiers, runGates } from '../src/scoring/gates.ts';
import { unexpectedFiles } from '../src/scoring/qualityScore.ts';
import { defaultRepoRoot } from '../src/behaviour/runner.ts';

const repoRoot = defaultRepoRoot();

function sandbox(files: Record<string, string>, name = `allowlist-${Date.now()}${Math.random()}`) {
  const root = path.join(repoRoot, 'packages-node/skill-tester/.tmp', name);
  fs.rmSync(root, { recursive: true, force: true });
  for (const [relative, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
    fs.writeFileSync(path.join(root, relative), content);
  }
  return root;
}

const allowed = allowedLionUiSpecifiers(repoRoot);

test('the allowlist is derived from the package export map', () => {
  assert.ok(allowed.length > 0, 'expected export-map keys');
  assert.ok(allowed.includes('@lion/ui/*'), `expected the blanket key, got ${allowed.join(', ')}`);
  assert.ok(
    allowed.some(entry => entry.startsWith('@lion/ui/') && entry.endsWith('translations/*')),
    'expected the translation subpaths to be part of the allowlist',
  );
});

test('an internal "#" subpath import is rejected', () => {
  const root = sandbox({ 'src/example.js': "import { x } from '#internal';\n" });
  const policy = runGates(root, { allowedLionUiSpecifiers: allowed }).find(g => g.name === 'import-policy');
  assert.equal(policy?.passed, false, 'a "#" specifier must be a violation');
  assert.match(policy.failures[0].message, /#/);
});

test('the allowlist raises no false positives on documented imports', () => {
  const root = sandbox({
    'src/example.js': [
      "import { html } from 'lit';",
      "import { LionInputIban } from '@lion/ui/input-iban.js';",
      "import '@lion/ui/define/lion-form.js';",
      "import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';",
    ].join('\n'),
  });
  const policy = runGates(root, { allowedLionUiSpecifiers: allowed }).find(g => g.name === 'import-policy');
  assert.equal(policy?.passed, true, JSON.stringify(policy?.failures));
});

test('a deep import stays rejected with the allowlist on', () => {
  const root = sandbox({
    'src/example.js': "import x from '@lion/ui/components/input-iban/src/LionInputIban.js';\n",
  });
  const policy = runGates(root, { allowedLionUiSpecifiers: allowed }).find(g => g.name === 'import-policy');
  assert.equal(policy?.passed, false);
});

test('unexpectedFiles finds a stray file but ignores harness support files', () => {
  const root = sandbox({
    'src/my-field.js': 'export class MyField {}\n',
    'src/helper.js': 'export const helper = 1;\n',
    'package.json': '{ "type": "module" }\n',
    '.skill/lion-ui/SKILL.md': '# lion-ui\n',
    'node_modules/thing/index.js': '// dep\n',
  });

  const unexpected = unexpectedFiles(root, ['src/my-field.js']);
  assert.deepEqual(unexpected, ['src/helper.js'], `got ${JSON.stringify(unexpected)}`);
});
