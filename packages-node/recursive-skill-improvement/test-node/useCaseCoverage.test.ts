/**
 * Ratchet on documented use-case coverage, the same idiom as `MIN_OWN_SLOTS` in `scripts/check-cem.mjs`:
 * a measured baseline, and a failure when the measure drops below it. The baseline only moves up.
 *
 * Raising coverage is the point, so when a number rises, raise its baseline in the same change. Lowering
 * one is a regression that needs a reason in the commit message, not a quiet edit here.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultRepoRoot } from '../src/behaviour/runner.ts';
import { measureUseCaseCoverage } from '../scripts/report-use-case-coverage.mjs';

/** Components with a scenario (`component/<name>` or `system/<name>`), measured 2026-11-19. */
const MIN_COMPONENTS_WITH_SCENARIO = 34;
/** Documented use-case sections reachable from a scenario, measured 2026-11-19. */
const MIN_REACHABLE_SECTIONS = 167;

const report = (await measureUseCaseCoverage(defaultRepoRoot())) as {
  totals: {
    components: number;
    sections: number;
    withScenario: number;
    withBehaviour: number;
    reachableSections: number;
  };
};

test('use-case coverage has not dropped below its baseline (ratchet)', t => {
  const { totals } = report;
  const scenarioGap = totals.components - totals.withScenario;
  const reachableGap = totals.sections - totals.reachableSections;

  t.diagnostic(
    `components with a scenario: ${totals.withScenario} of ${totals.components} ` +
      `(baseline ${MIN_COMPONENTS_WITH_SCENARIO}, gap ${scenarioGap} without a scenario)`,
  );
  t.diagnostic(
    `documented use cases reachable from a scenario: ${totals.reachableSections} of ${totals.sections} ` +
      `(baseline ${MIN_REACHABLE_SECTIONS}, gap ${reachableGap} not reachable)`,
  );
  t.diagnostic(
    `informational, no baseline yet: ${totals.withBehaviour} components with a behaviour test of ` +
      `${totals.withScenario} with a scenario`,
  );

  assert.ok(
    totals.withScenario >= MIN_COMPONENTS_WITH_SCENARIO,
    `components with a scenario dropped to ${totals.withScenario} (baseline ${MIN_COMPONENTS_WITH_SCENARIO})`,
  );
  assert.ok(
    totals.reachableSections >= MIN_REACHABLE_SECTIONS,
    `documented use cases reachable from a scenario dropped to ${totals.reachableSections} ` +
      `(baseline ${MIN_REACHABLE_SECTIONS})`,
  );
});
