/**
 * The named-`@lion/ui`-exports check.
 *
 * `import { LionMenuItem } from '@lion/ui/menu.js'` measured in a real browser run:
 *   SyntaxError: The requested module './../../../../packages/ui/exports/menu.js' does not provide
 *   an export named 'LionMenuItem'
 * The entrypoint exports `LionMenu`, `LionItem` and `LionMenuitem` (small `i`). The behaviour tier
 * reported it only as the opaque "Could not import your test module". This check names the file,
 * the line, the binding and what the entrypoint does export.
 *
 * The authority is the git-committed exports tree (`packages/ui/exports/*.js`), which is exactly
 * what the browser resolves. Scope: named imports from `@lion/ui/*` only. Detection errs toward
 * passing — an unknown entrypoint or a `export *` re-export is skipped, never flagged.
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
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-tester-named-exports-'));
  for (const [relative, content] of Object.entries(files)) {
    const full = path.join(root, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return root;
}

function check(source: string) {
  const root = sandbox({ 'src/x.js': source });
  return evaluateCheck(root, { type: 'namedExportsExist', file: 'src/x.js' }, [], { repoRoot });
}

test('the exports tree is read from git: menu ships LionMenuitem, not LionMenuItem', () => {
  const menu = fs.readFileSync(path.join(repoRoot, 'packages/ui/exports/menu.js'), 'utf-8');
  assert.ok(menu.includes('LionMenuitem'), 'menu.js exports LionMenuitem (small i)');
  assert.ok(!/\bLionMenuItem\b/.test(menu), 'menu.js never exports LionMenuItem');
});

test('fails when a named import is not exported, and names the real alternative', () => {
  const outcome = check(
    [
      "import { LionMenu } from '@lion/ui/menu.js';",
      "import { LionMenuItem } from '@lion/ui/menu.js';",
      'export const x = [LionMenu, LionMenuItem];',
      '',
    ].join('\n'),
  );
  assert.equal(outcome.passed, false, outcome.description);
  assert.ok(outcome.description.includes('src/x.js:2'), outcome.description);
  assert.ok(outcome.description.includes("'LionMenuItem'"), outcome.description);
  assert.ok(outcome.description.includes("'@lion/ui/menu.js'"), outcome.description);
  // The failure must name what the entrypoint DOES export, so the fix is obvious.
  assert.ok(outcome.description.includes('LionMenuitem'), outcome.description);
});

test('passes when every named binding is a real export', () => {
  const outcome = check(
    [
      "import { LionMenu, LionMenuitem } from '@lion/ui/menu.js';",
      'export const x = [LionMenu, LionMenuitem];',
      '',
    ].join('\n'),
  );
  assert.equal(outcome.passed, true, outcome.description);
});

test('passes for a real export in a different entrypoint', () => {
  const outcome = check(
    [
      "import { LionCheckbox } from '@lion/ui/checkbox-group.js';",
      'export const x = LionCheckbox;',
      '',
    ].join('\n'),
  );
  assert.equal(outcome.passed, true, outcome.description);
});

test('an unknown entrypoint is skipped, not flagged, rather than crashing', () => {
  const outcome = check(
    ["import { Whatever } from '@lion/ui/does-not-exist.js';", 'export const x = Whatever;', ''].join(
      '\n',
    ),
  );
  assert.equal(outcome.passed, true, outcome.description);
});

test('default and namespace imports from @lion/ui are out of scope and never flagged', () => {
  const outcome = check(
    [
      "import anything from '@lion/ui/menu.js';",
      "import * as menu from '@lion/ui/menu.js';",
      'export const x = [anything, menu];',
      '',
    ].join('\n'),
  );
  assert.equal(outcome.passed, true, outcome.description);
});

test('bare packages and relative imports are out of scope', () => {
  const outcome = check(
    [
      "import { html } from 'lit';",
      "import { helper } from './helper.js';",
      'export const x = [html, helper];',
      '',
    ].join('\n'),
  );
  assert.equal(outcome.passed, true, outcome.description);
});

test('the repository root is discovered from a sandbox inside the repo', () => {
  const root = fs.mkdtempSync(path.join(repoRoot, 'packages-node/skill-tester/.tmp/named-'));
  fs.mkdirSync(path.join(root, 'src'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'src/x.js'),
    ["import { LionMenuItem } from '@lion/ui/menu.js';", 'export const x = LionMenuItem;', ''].join(
      '\n',
    ),
  );
  // No explicit repoRoot: the check walks up to `packages/ui/exports` on its own.
  const outcome = evaluateCheck(root, { type: 'namedExportsExist', file: 'src/x.js' });
  assert.equal(outcome.passed, false, outcome.description);
});

test('every generated scenario asks for it', () => {
  const missing = loadLionUiScenarios({ repoRoot, includeManual: false }).filter(
    scenario => !(scenario.checks ?? []).some(check => check.type === 'namedExportsExist'),
  );
  assert.equal(missing.length, 0, `missing on: ${missing.map(s => s.name).join(', ')}`);
});
