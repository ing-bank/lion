/**
 * The results ledger: the latest comparable result per (skill revision, model, scenario).
 *
 * Run records *accumulate* — one markdown file per invocation — so a page rendered from them would
 * repeat every scenario once per re-run. The ledger key carries no timestamp, so re-running a
 * scenario updates its row instead of adding another. That makes the generated docs page
 * idempotent: rendering it twice, or after ten runs, produces the same table.
 *
 * The skill revision is the git tree hash of the skill directory, not the commit: changes elsewhere
 * in the repo must not invalidate every result row.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { SkillTesterReport } from '../skillTester.ts';
import type { TestScenario } from '../scenarios/types.ts';

export type LedgerEntry = {
  skillRevision: string;
  model: string;
  scenario: string;
  kind: string;
  samples: number;
  mean: number;
  min: number;
  max: number;
  stdDev: number;
  behaviourPassed: number;
  behaviourTotal: number;
  attempts: number;
  redoable: number;
  tokens: number;
  ranAt: string;
};

export type Ledger = { version: 1; updatedAt: string; entries: LedgerEntry[] };

export function ledgerKey(entry: Pick<LedgerEntry, 'skillRevision' | 'model' | 'scenario'>): string {
  return [entry.skillRevision, entry.model, entry.scenario].join('|');
}

export function loadLedger(file: string): Ledger {
  const empty: Ledger = { version: 1, updatedAt: new Date().toISOString(), entries: [] };
  if (!fs.existsSync(file)) return empty;
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf-8')) as Partial<Ledger>;
    return { version: 1, updatedAt: parsed.updatedAt ?? '', entries: parsed.entries ?? [] };
  } catch {
    // A corrupt ledger must not take a sweep down; the next write repairs it.
    return empty;
  }
}

export function writeLedger(file: string, ledger: Ledger): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(ledger, null, 2)}\n`);
}

function statsOf(scores: number[]) {
  if (scores.length === 0) return { mean: 0, min: 0, max: 0, stdDev: 0 };
  const mean = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  const variance = scores.reduce((sum, value) => sum + (value - mean) ** 2, 0) / scores.length;
  return { mean, min: Math.min(...scores), max: Math.max(...scores), stdDev: Math.sqrt(variance) };
}

/** Fold one report into the ledger. Existing rows for the same key are replaced, never appended. */
export function updateLedger(
  ledger: Ledger,
  report: SkillTesterReport,
  scenarios: TestScenario[],
  skillRevision: string,
): Ledger {
  const kinds = new Map(scenarios.map(scenario => [scenario.name, scenario.kind]));
  const byKey = new Map(ledger.entries.map(entry => [ledgerKey(entry), entry]));

  for (const summary of report.perModelScenario) {
    const runs = report.runs.filter(
      run => run.model === summary.model && run.scenario === summary.scenario,
    );
    if (runs.length === 0) continue;

    const withBehaviour = runs.filter(run => run.behaviour);
    const entry: LedgerEntry = {
      skillRevision,
      model: summary.model,
      scenario: summary.scenario,
      kind: kinds.get(summary.scenario) ?? 'unknown',
      samples: runs.length,
      ...statsOf(runs.map(run => run.score.score)),
      behaviourPassed: withBehaviour.filter(run => run.behaviour?.passed).length,
      behaviourTotal: withBehaviour.length,
      attempts: runs.filter(run => run.agentRun.attempted).length,
      redoable: report.redoable.filter(
        run => run.model === summary.model && run.scenario === summary.scenario,
      ).length,
      tokens: runs.reduce((sum, run) => sum + run.agentRun.totalTokens, 0),
      ranAt: report.finishedAt,
    };
    byKey.set(ledgerKey(entry), entry);
  }

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    entries: [...byKey.values()].sort(
      (a, b) => a.scenario.localeCompare(b.scenario) || a.model.localeCompare(b.model),
    ),
  };
}
