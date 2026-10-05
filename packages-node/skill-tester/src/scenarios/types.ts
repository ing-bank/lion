/**
 * Scenario model for skill-tester.
 *
 * A scenario is one small, isolated task: a starting project (virtual file system), a prompt,
 * and a way to judge the result — either golden `expectedTransformedFiles` (scored by
 * exact/normalized/similarity) or objective `checks` (contains / notContains / matches / ...).
 * Keeping each scenario tiny means a failing run points at one component or system, not at a
 * whole application.
 */

import type { ProjectMock } from '../createProjectSandbox.ts';

export type ScenarioCheck = {
  type: 'exists' | 'contains' | 'notContains' | 'matches' | 'notMatches';
  /** File the check applies to, relative to the project root. */
  file: string;
  /** Needle for `contains` / `notContains`. */
  value?: string;
  /** Regular expression source for `matches` / `notMatches`. */
  pattern?: string;
  /** Flags for `matches` / `notMatches`. */
  flags?: string;
  /** Human-readable description shown in reports (auto-generated when omitted). */
  description?: string;
  /** Relative importance in the aggregate score (default 1). */
  weight?: number;
};

export type TestScenario = {
  /** Unique id, e.g. `component/button` or `repair/iban-field`. */
  name: string;
  kind: 'component' | 'system' | 'integration' | 'repair';
  description: string;
  /** The task given to the model under test. */
  prompt: string;
  /** Starting virtual file system for the sandbox. */
  files: ProjectMock;
  /** Optional golden output, scored by normalized-match / similarity. Must be derived or executed. */
  expectedTransformedFiles?: ProjectMock;
  /**
   * How the golden was verified. A golden that nobody executed is the authoritative way to make a
   * benchmark measure fiction, so the provenance is recorded with it.
   */
  goldenProvenance?: string;
  /** Objective assertions, used when a golden file would be over-specific. */
  checks?: ScenarioCheck[];
  /**
   * Behaviour axis: source of a test file that exercises the *produced* code in a real browser
   * (see `behaviour/runner.ts`). Opt-in per run; assertions should be borrowed from the repo's own
   * component tests rather than invented.
   */
  behaviour?: {
    /** Generated test file content, placed in the sandbox beside the produced code. */
    testSource: string;
    description?: string;
  };
  /** The file the task is expected to edit (informational; also the default check target). */
  targetFile: string;
};
