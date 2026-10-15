/**
 * The ledger's honesty rules, which have now been got wrong twice and both times silently.
 *
 * A run that never modified the deliverable is *not attempted*: it says nothing about the skill, so it
 * must not enter the score stats, and a scenario where no run attempted anything must not publish a
 * score at all (the page prints n/a). The mirror image - a no-op collecting partial credit - was the
 * earlier bug; this is the same rule from the other side.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { updateLedger, ledgerKey } from '../src/report/ledger.ts';
import type { Ledger } from '../src/report/ledger.ts';
import type { SkillTesterReport } from '../src/skillTester.ts';
import type { TestScenario } from '../src/scenarios/types.ts';

type FakeRun = {
  model: string;
  scenario: string;
  score: { score: number };
  agentRun: { attempted: boolean; totalTokens: number; promptTokens: number; completionTokens: number };
  behaviour?: { passed: boolean };
};

function reportWith(runs: FakeRun[]): SkillTesterReport {
  return {
    runs,
    redoable: [],
    finishedAt: '2026-01-01T00:00:00.000Z',
    perModelScenario: runs.map(run => ({ model: run.model, scenario: run.scenario })),
  } as unknown as SkillTesterReport;
}

const scenario = { name: 'component/demo', kind: 'component' } as TestScenario;
const emptyLedger: Ledger = { version: 1, updatedAt: '', entries: [] };

function run(attempted: boolean, score: number): FakeRun {
  return {
    model: 'test-model',
    scenario: 'component/demo',
    score: { score },
    agentRun: { attempted, totalTokens: 100, promptTokens: 90, completionTokens: 10 },
    behaviour: { passed: attempted },
  };
}

test('a no-op is excluded from the ledger score, not counted as zero', () => {
  // Measured case: component/menu, three runs, none of which wrote the file.
  const allNoOp = updateLedger(emptyLedger, reportWith([run(false, 0), run(false, 0), run(false, 0)]), [scenario], 'rev1');
  const entry = allNoOp.entries[0];
  assert.equal(entry.samples, 3, 'the real run count is kept, so the page can show 0/3');
  assert.equal(entry.attempts, 0, 'no run modified the deliverable');
  assert.equal(entry.behaviourTotal, 0, 'a run that wrote nothing is not a behaviour failure');
});

test('a mixed cell is scored over the runs that actually attempted', () => {
  // Measured case: 2 of 3 no-ops, which used to publish 28.6% instead of the comparable mean.
  const mixed = updateLedger(emptyLedger, reportWith([run(false, 0), run(false, 0), run(true, 0.857)]), [scenario], 'rev1');
  const entry = mixed.entries[0];
  assert.equal(entry.samples, 3);
  assert.equal(entry.attempts, 1);
  assert.equal(entry.mean, 0.857, 'the mean covers the attempted run only');
});

test('a fully attempted cell is unchanged', () => {
  const clean = updateLedger(emptyLedger, reportWith([run(true, 1), run(true, 1)]), [scenario], 'rev1');
  const entry = clean.entries[0];
  assert.equal(entry.samples, 2);
  assert.equal(entry.attempts, 2);
  assert.equal(entry.mean, 1);
});

test('the ledger key is revision-scoped, so a re-run replaces a row and a new skill adds one', () => {
  const first = updateLedger(emptyLedger, reportWith([run(true, 0.5)]), [scenario], 'rev1');
  const sameRevision = updateLedger(first, reportWith([run(true, 0.9)]), [scenario], 'rev1');
  assert.equal(sameRevision.entries.length, 1, 'same revision: replaced, not appended');
  assert.equal(sameRevision.entries[0].mean, 0.9);
  const newRevision = updateLedger(first, reportWith([run(true, 0.9)]), [scenario], 'rev2');
  assert.equal(newRevision.entries.length, 2, 'new revision: a row per revision, so before/after stays visible');
  // Rows sort by scenario then model, so the two revisions of the same cell stay in insertion order:
  // find the entry by revision instead of trusting a position.
  const rev2Entry = newRevision.entries.find(entry => entry.skillRevision === 'rev2');
  assert.ok(rev2Entry, 'the new revision has an entry of its own');
  assert.equal(ledgerKey(rev2Entry), 'rev2|test-model|component/demo');
});
