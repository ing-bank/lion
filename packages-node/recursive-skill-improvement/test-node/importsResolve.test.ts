/**
 * The imports-resolve check.
 *
 * A relative import (`./x.js`, `../x.js`) is the one specifier class the entrypoint checks cannot
 * see: `@lion/ui/**` and bare packages are resolved against the real repository, but a relative
 * import must be a file this very run wrote. When it is not, the browser refuses the module and the
 * behaviour tier dies with the opaque "Could not import your test module" — no file, no specifier.
 * This check names it.
 *
 * Detection errs toward passing: the literal path and the common extensionless forms are all
 * accepted, because a wrongly-flagged correct answer is the defect class this harness removes.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateCheck } from '../src/scoring/qualityScore.ts';
import { loadLionUiScenarios } from '../src/scenarios/index.ts';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

function sandbox(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'recursive-skill-improvement-imports-'));
  for (const [relative, content] of Object.entries(files)) {
    const full = path.join(root, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return root;
}

test('fails when a relative import names a file the run never wrote', () => {
  const root = sandbox({
    'src/x.js': "import { helper } from './missing.js';\nexport const x = helper;\n",
  });
  const outcome = evaluateCheck(root, { type: 'importsResolve', file: 'src/x.js' });
  assert.equal(outcome.passed, false);
  // The failure is named: file, line and specifier.
  assert.ok(outcome.description.includes('src/x.js:1'), outcome.description);
  assert.ok(outcome.description.includes("'./missing.js'"), outcome.description);
});

test('fails when a parent-relative import points outside the run', () => {
  const root = sandbox({
    'src/nested/x.js': "import { y } from '../gone.js';\nexport const x = y;\n",
  });
  const outcome = evaluateCheck(root, { type: 'importsResolve', file: 'src/nested/x.js' });
  assert.equal(outcome.passed, false);
  assert.ok(outcome.description.includes("'../gone.js'"), outcome.description);
});

test('passes when the relative import resolves to a sibling the run wrote', () => {
  const root = sandbox({
    'src/x.js': "import { helper } from './helper.js';\nexport const x = helper;\n",
    'src/helper.js': 'export const helper = 1;\n',
  });
  assert.equal(evaluateCheck(root, { type: 'importsResolve', file: 'src/x.js' }).passed, true);
});

test('ignores @lion/ui/** and bare packages, which resolve against the real repo', () => {
  const root = sandbox({
    'src/x.js': [
      "import { html } from 'lit';",
      "import { LionButton } from '@lion/ui/button.js';",
      'export const x = [html, LionButton];',
      '',
    ].join('\n'),
  });
  const outcome = evaluateCheck(root, { type: 'importsResolve', file: 'src/x.js' });
  assert.equal(outcome.passed, true, outcome.description);
});

test('a file with no imports passes', () => {
  const root = sandbox({ 'src/x.js': 'export const x = 1;\n' });
  assert.equal(evaluateCheck(root, { type: 'importsResolve', file: 'src/x.js' }).passed, true);
});

test('every generated scenario asks for it', () => {
  const missing = loadLionUiScenarios({ repoRoot, includeManual: false }).filter(
    scenario => !(scenario.checks ?? []).some(check => check.type === 'importsResolve'),
  );
  assert.equal(missing.length, 0, `missing on: ${missing.map(s => s.name).join(', ')}`);
});
