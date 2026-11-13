/**
 * A retired model id is history: its cells must never be counted beside a current measurement.
 *
 * `deepseek-v4-flash` is the measured case — its rate note says deepseek retired the id and serve it at
 * the V4.1 Flash price. The flag lives on the rate (`RATES[model].retired`), the ledger stamps it on
 * both read and write so it cannot drift, and the results page excludes retired cells from the
 * "Live picture" headline while still listing them (marked †) so a past measurement is not lost.
 *
 * This is the smallest honest form the accounting allows: one flag at the source of truth, derived
 * everywhere else, instead of a hand-maintained list of 264 historical rows.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { isRetiredModel, RATES } from '../src/pricing/models.ts';
import { loadLedger, updateLedger, writeLedger } from '../src/report/ledger.ts';
import type { Ledger, LedgerEntry } from '../src/report/ledger.ts';
import { renderQualityPage } from '../src/report/docsPage.ts';
import type { SkillTesterReport } from '../src/skillTester.ts';
import type { TestScenario } from '../src/scenarios/types.ts';

function reportWith(model: string, scenario: string): SkillTesterReport {
  const run = {
    model,
    scenario,
    score: { score: 1 },
    agentRun: { attempted: true, totalTokens: 10, promptTokens: 8, completionTokens: 2 },
  };
  return {
    runs: [run],
    redoable: [],
    finishedAt: '2026-01-01T00:00:00.000Z',
    perModelScenario: [{ model, scenario }],
  } as unknown as SkillTesterReport;
}

const scenario = { name: 'component/demo', kind: 'component' } as TestScenario;
const emptyLedger: Ledger = { version: 1, updatedAt: '', entries: [] };

test('the retired flag is declared once, on the rate', () => {
  assert.equal(RATES['deepseek-v4-flash']?.retired, true);
  assert.match(RATES['deepseek-v4-flash']?.note ?? '', /retire/i);
  assert.equal(isRetiredModel('deepseek-v4-flash'), true);
  assert.equal(isRetiredModel('deepseek-v4-1-flash'), false, 'its successor is live');
  assert.equal(isRetiredModel('a-model-with-no-rate'), false, 'no rate is not retired');
});

test('the ledger stamps retired cells on write and on read, so it cannot drift', () => {
  const written = updateLedger(
    emptyLedger,
    reportWith('deepseek-v4-flash', 'component/demo'),
    [scenario],
    'rev1',
  );
  assert.equal(written.entries[0].retired, true, 'write: a retired model is stamped');
  assert.equal(
    updateLedger(emptyLedger, reportWith('deepseek-v4-1-flash', 'component/demo'), [scenario], 'rev1')
      .entries[0].retired,
    undefined,
    'a live model carries no flag (no `retired: false` noise)',
  );

  // A ledger written before the flag existed still reads as history: the model's status decides, not
  // the row. This is what makes the 264 historical rows correct without hand-editing them.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'st-retired-'));
  const file = path.join(dir, 'ledger.json');
  const legacy: Ledger = {
    version: 1,
    updatedAt: '',
    entries: [
      {
        skillRevision: 'rev-old',
        model: 'deepseek-v4-flash',
        scenario: 'component/demo',
        kind: 'component',
        samples: 3,
        mean: 1,
        min: 1,
        max: 1,
        stdDev: 0,
        behaviourPassed: 3,
        behaviourTotal: 3,
        attempts: 3,
        redoable: 0,
        tokens: 0,
        promptTokens: 0,
        completionTokens: 0,
        ranAt: '2026-01-01T00:00:00.000Z',
      },
    ],
  };
  writeLedger(file, legacy);
  assert.equal(loadLedger(file).entries[0].retired, true, 'read: a legacy row is stamped');
});

test('the results page excludes retired cells from the headline and marks them as history', () => {
  const entry = (model: string, scenarioName: string, mean: number, retired = false): LedgerEntry => ({
    skillRevision: 'rev1',
    model,
    scenario: scenarioName,
    kind: 'component',
    samples: 3,
    mean,
    min: mean,
    max: mean,
    stdDev: 0,
    behaviourPassed: 3,
    behaviourTotal: 3,
    attempts: 3,
    redoable: 0,
    tokens: 0,
    promptTokens: 0,
    completionTokens: 0,
    ...(retired ? { retired: true } : {}),
    ranAt: '2026-01-01T00:00:00.000Z',
  });
  const page = renderQualityPage({
    version: 1,
    updatedAt: '',
    entries: [
      entry('deepseek-v4-flash', 'component/at-100', 1, true),
      entry('deepseek-v4-1-flash', 'component/below', 0.8),
    ],
  });

  // Headline: only the live cell counts, so the retired 100% must not lift it to "1 at 100%".
  assert.match(page, /1 live cell\(s\)[\s\S]*?\*\*0 at 100%\*\*, 1 below 100%/);
  assert.match(page, /1 further cell\(s\) belong to a withdrawn model \(`deepseek-v4-flash`\)/);
  // The retired row is still listed, marked, so the past measurement is not lost.
  assert.ok(page.includes('| `deepseek-v4-flash` † |'), 'the retired row is marked with †');
  assert.ok(!page.includes('| `deepseek-v4-1-flash` † |'), 'a live model is not marked');
  assert.match(page, /† a withdrawn model id/);
});
