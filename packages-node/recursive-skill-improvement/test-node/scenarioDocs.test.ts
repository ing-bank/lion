import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { defaultRepoRoot } from '../src/behaviour/runner.ts';

const repoRoot = defaultRepoRoot();

test('every scenario declares the docs it derives from', () => {
  // The coupling that makes a docs change re-run its use cases. A scenario missing here can have its docs
  // rewritten without ever being measured again, which is how a fixed cell stays red.
  const declaration = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'packages-node/recursive-skill-improvement/scenario-docs.json'), 'utf-8'),
  ).scenarios as Record<string, string[]>;
  const ledger = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'packages-node/recursive-skill-improvement/results/ledger.json'), 'utf-8'),
  ) as { entries: { scenario: string }[] };
  const scenarios = [...new Set(ledger.entries.map(entry => entry.scenario))].sort();
  const missing = scenarios.filter(scenario => !(scenario in declaration));
  assert.deepEqual(missing, [], `scenarios missing from scenario-docs.json: ${missing.join(', ')}`);
});

test('every declared doc path exists', () => {
  const declaration = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'packages-node/recursive-skill-improvement/scenario-docs.json'), 'utf-8'),
  ).scenarios as Record<string, string[]>;
  const dangling = Object.entries(declaration).flatMap(([unit, docs]) =>
    docs.filter(doc => !fs.existsSync(path.join(repoRoot, doc))).map(doc => `${unit}: ${doc}`),
  );
  assert.deepEqual(dangling, []);
});
