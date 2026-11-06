/**
 * The unused-import check.
 *
 * It is a check, not a gate. A stray import does not stop the produced code from working, so zeroing
 * a run over one would fail a correct answer — the defect class this harness spent a session
 * removing. As one weighted check it costs a fraction of the score, which is proportionate.
 *
 * The detection errs in one direction only: a name mentioned anywhere outside the import statements
 * counts as used, including in a comment. It can therefore miss an unused import, and it must never
 * invent one.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { unusedImportNames } from '../src/scoring/gates.ts';
import { evaluateCheck } from '../src/scoring/qualityScore.ts';
import { loadLionUiScenarios } from '../src/scenarios/index.ts';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

test('names an import that is never referred to again', () => {
  const source = [
    "import { LitElement, html, css } from 'lit';",
    '',
    'export class X extends LitElement {',
    '  render() { return html`<div></div>`; }',
    '}',
    '',
  ].join('\n');
  assert.deepEqual(unusedImportNames(source), ['css']);
});

test('aliased and namespace imports that are used are not flagged', () => {
  const source = [
    "import { ScopedElementsMixin as SEM } from '@open-wc/scoped-elements/lit-element.js';",
    "import * as helpers from 'node:path';",
    '',
    'export const mix = [SEM, helpers.sep];',
    '',
  ].join('\n');
  assert.deepEqual(unusedImportNames(source), []);
});

test('a side-effect import has no binding, so there is nothing to flag', () => {
  const source = "import '@lion/ui/define/lion-button.js';\nexport const x = 1;\n";
  assert.deepEqual(unusedImportNames(source), []);
});

test('a mention in a comment counts as a use, so a correct answer cannot be failed', () => {
  const source = [
    "import { css } from 'lit';",
    '',
    '// css is imported deliberately for the styling contract below',
    'export const x = 1;',
    '',
  ].join('\n');
  assert.deepEqual(unusedImportNames(source), [], 'must not invent an unused import');
});

test('evaluated as a check: it fails with the name, and passes when everything is used', () => {
  const sandbox = fs.mkdtempSync(path.join(repoRoot, 'packages-node/skill-tester/.tmp/unused-'));
  fs.mkdirSync(path.join(sandbox, 'src'), { recursive: true });
  const target = path.join(sandbox, 'src/x.js');
  const check = { type: 'noUnusedImports' as const, file: 'src/x.js' };

  fs.writeFileSync(target, "import { css, html } from 'lit';\nexport const x = html`<p></p>`;\n");
  const failing = evaluateCheck(sandbox, check);
  assert.equal(failing.passed, false);
  assert.ok(failing.description.includes('css'), failing.description);

  fs.writeFileSync(target, "import { html } from 'lit';\nexport const x = html`<p></p>`;\n");
  assert.equal(evaluateCheck(sandbox, check).passed, true);
});

test('every generated scenario asks for it', () => {
  const missing = loadLionUiScenarios({ repoRoot }).filter(
    scenario => !(scenario.checks ?? []).some(check => check.type === 'noUnusedImports'),
  );
  assert.equal(missing.length, 0, `missing on: ${missing.map(scenario => scenario.name).join(', ')}`);
});
