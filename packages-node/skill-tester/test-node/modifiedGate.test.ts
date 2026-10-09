/**
 * The no-op gate.
 *
 * Measured motivation: one sample in a 5-run sweep wrote nothing at all, and still scored 42.9%
 * because the untouched starter satisfies `exists` (the file ships in the sandbox) and every
 * `notMatches` (an empty file contains none of the forbidden things). Doing nothing must score 0.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runGates } from '../src/scoring/gates.ts';
import { applyGates, scoreScenario } from '../src/scoring/qualityScore.ts';
import { defaultRepoRoot } from '../src/behaviour/runner.ts';

const repoRoot = defaultRepoRoot();
const STARTER: Record<string, string> = { 'src/x.js': '// TODO: create X here.\n' };

function sandbox(files: Record<string, string>, name = `modified-${Date.now()}${Math.random()}`) {
  const root = path.join(repoRoot, 'packages-node/skill-tester/.tmp', name);
  fs.rmSync(root, { recursive: true, force: true });
  for (const [relative, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
    fs.writeFileSync(path.join(root, relative), content);
  }
  return root;
}

const checks = [
  { type: 'exists' as const, file: 'src/x.js' },
  { type: 'notMatches' as const, file: 'src/x.js', pattern: '<input' },
];

test('an untouched starter collects partial credit WITHOUT the gate, and zero WITH it', () => {
  const root = sandbox(STARTER);

  const raw = scoreScenario({ sandboxRoot: root, checks, declaredFiles: ['src/x.js'] });
  assert.ok(
    raw.percent > 0,
    'precondition: existence and notMatches are satisfiable by doing nothing',
  );

  const gates = runGates(root, { starter: STARTER });
  assert.equal(
    gates.find(gate => gate.name === 'modified')?.passed,
    false,
    'the modified gate must fail a no-op',
  );

  const gated = applyGates(raw, gates);
  assert.equal(gated.percent, 0, 'a no-op must score zero once gated');
});

test('a changed deliverable passes the modified gate', () => {
  const root = sandbox({ 'src/x.js': 'export class X {}\n' });
  const gates = runGates(root, { starter: STARTER });
  assert.equal(gates.find(gate => gate.name === 'modified')?.passed, true);
});

test('deleting the deliverable counts as a change (the exists check reports it)', () => {
  const root = sandbox({ 'src/other.js': '// unrelated\n' });
  const gates = runGates(root, { starter: STARTER });
  assert.equal(
    gates.find(gate => gate.name === 'modified')?.passed,
    true,
    'a deletion is a change; "exists" is what fails',
  );
});

test('no starter means no modified gate, so other callers are unaffected', () => {
  const root = sandbox(STARTER);
  const gates = runGates(root);
  assert.equal(gates.some(gate => gate.name === 'modified'), false);
});
