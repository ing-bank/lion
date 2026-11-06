/**
 * The entrypoint resolution gate.
 *
 * Measured motivation: two of three runs of `component/checkbox-group` imported `LionCheckbox` from
 * `@lion/ui/checkbox.js`. No such entrypoint exists — LionCheckbox lives in `checkbox-group` — so
 * both runs failed to load in the browser. The convention tier gave them 100%, because the export
 * map carries a blanket `./*` key: an allowlist derived from it could check the shape of a specifier
 * and never whether it resolves.
 *
 * This gate closes that with the filesystem. No browser, no model run.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  resolvableLionUiSpecifiers,
  runGates,
  allowedLionUiSpecifiers,
} from '../src/scoring/gates.ts';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

function sandboxWith(source: string): string {
  const root = fs.mkdtempSync(path.join(repoRoot, 'packages-node/skill-tester/.tmp/resolve-'));
  fs.mkdirSync(path.join(root, 'src'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src/x.js'), source);
  return root;
}

function policyFor(sandboxRoot: string) {
  return runGates(sandboxRoot, {
    allowedLionUiSpecifiers: allowedLionUiSpecifiers(repoRoot),
    resolvableLionUiSpecifiers: resolvableLionUiSpecifiers(repoRoot),
  }).find(gate => gate.name === 'import-policy');
}

test('the resolvable set is read from disk: checkbox-group yes, checkbox no', () => {
  const resolvable = resolvableLionUiSpecifiers(repoRoot);
  assert.ok(resolvable.length > 10, `expected a real entrypoint set, got ${resolvable.length}`);
  assert.ok(resolvable.includes('@lion/ui/checkbox-group.js'));
  assert.ok(resolvable.includes('@lion/ui/button.js'));
  assert.ok(resolvable.includes('@lion/ui/define/lion-button.js'));
  assert.ok(
    !resolvable.includes('@lion/ui/checkbox.js'),
    'LionCheckbox lives in checkbox-group; a standalone checkbox entrypoint does not exist',
  );
});

test('an entrypoint that does not resolve fails the gate — the measured checkbox-group case', () => {
  const sandbox = sandboxWith(
    [
      "import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';",
      "import { LitElement, html } from 'lit';",
      "import { LionCheckboxGroup } from '@lion/ui/checkbox-group.js';",
      "import { LionCheckbox } from '@lion/ui/checkbox.js';",
      '',
      'export class MyCheckboxGroup extends ScopedElementsMixin(LitElement) {}',
      '',
    ].join('\n'),
  );

  const gate = policyFor(sandbox);
  assert.equal(gate?.passed, false, 'a nonexistent @lion/ui entrypoint must fail the gate');
  assert.ok(
    gate?.failures.some(failure => failure.message.includes('@lion/ui/checkbox.js')),
    `the failure must name the specifier, got: ${JSON.stringify(gate?.failures)}`,
  );
});

test('a real entrypoint passes the same gate, so the rule is not merely strict', () => {
  const sandbox = sandboxWith(
    [
      "import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';",
      "import { LitElement, html } from 'lit';",
      "import { LionCheckboxGroup, LionCheckbox } from '@lion/ui/checkbox-group.js';",
      '',
      'export class MyCheckboxGroup extends ScopedElementsMixin(LitElement) {}',
      '',
    ].join('\n'),
  );

  const gate = policyFor(sandbox);
  assert.equal(gate?.passed, true, JSON.stringify(gate?.failures));
});
