/**
 * Scenario discovery + aggregation.
 *
 * Reads the lion repository layout to build the default scenario set:
 * `packages/ui/components/*` -> one scenario per component,
 * `docs/fundamentals/systems/*` -> one scenario per system,
 * plus the hand-authored scenarios in `manual.ts`.
 */

import { createLionUiScenarios } from './lionUi.ts';
import { deriveUseCaseScenariosSync } from './useCases.ts';
import {
  discoverComponentNames,
  discoverKnownTags,
  discoverSystemNames,
  discoverTagClasses,
} from './discover.ts';
import { manualScenarios } from './manual.ts';
import { runScenarios } from './runs.ts';
import type { TestScenario } from './types.ts';

export { NON_VISUAL_COMPONENT_DIRS, SYSTEM_NAMES } from './lionUi.ts';
export {
  discoverComponentNames,
  discoverKnownTags,
  discoverSystemNames,
  discoverTagClasses,
} from './discover.ts';
export type { LionUiScenarioContext } from './lionUi.ts';
export { manualScenarios } from './manual.ts';
export { runScenarios } from './runs.ts';
export type { TestScenario, ScenarioCheck } from './types.ts';

/**
 * The whole registry: the generated per-component and per-system scenarios, one derived scenario per
 * documented use case (`useCases.ts`), then the hand-authored ones. A derived use case that clashes with a
 * hand-authored name is an error (`deriveUseCaseScenariosSync` throws), never a silent duplicate.
 */
export function loadLionUiScenarios({
  repoRoot,
  components = discoverComponentNames(repoRoot),
  systems = discoverSystemNames(repoRoot),
  includeManual = true,
  includeUseCases = true,
}: {
  repoRoot: string;
  components?: string[];
  systems?: string[];
  includeManual?: boolean;
  /** Derive one scenario per documented use case of the selected components and systems. */
  includeUseCases?: boolean;
}): TestScenario[] {
  const generated = createLionUiScenarios({
    components,
    systems,
    knownTags: discoverKnownTags(repoRoot),
    tagClasses: discoverTagClasses(repoRoot),
  });
  const handAuthored = [...manualScenarios, ...runScenarios];
  // The use cases follow the same selection as the generated set: a unit that is not selected gets none.
  const selected = new Set([...components, ...systems]);
  const useCases = includeUseCases
    ? deriveUseCaseScenariosSync({
        repoRoot,
        reserved: includeManual ? handAuthored.map(scenario => scenario.name) : [],
      })
        .derived.filter(entry => selected.has(entry.source.unit))
        .map(entry => entry.scenario)
    : [];
  return includeManual ? [...generated, ...useCases, ...handAuthored] : [...generated, ...useCases];
}
