/**
 * Scenario discrimination — does a scenario's assertion tell a right answer from a wrong one?
 *
 * The gap this closes: the suite pinned the harness's internals thoroughly and never asked whether a
 * scenario's own assertion distinguishes anything. One did not: it demanded a `<lion-input-iban>`
 * *child* while its prompt only asked for "a field where a user can enter an IBAN account number", so
 * four working subclass answers across three models were failed, and finding that took 16 model runs
 * and four models.
 *
 * That scenario has since been reshaped into `form/iban-in-form`: the deliverable is a form, built
 * from scratch, that CARRIES a form control. Two reasons. Consumption is the path these tests measure,
 * so the prompt asks for a form that composes lion instead of inviting a subclass; and a component
 * that carries a form control is the one documented case where light DOM is required, so the skill's
 * `createRenderRoot` rule is now exercised in a real browser rather than trusted.
 *
 * These fixtures are artifacts of measured runs, plus the reshaped ideal:
 *
 *   ideal-form.js          accepted   consume lion from scratch, in the documented light-dom case
 *   subclass.js            rejected   a supported path, but a subclasser's: out of scope here
 *   native-input.js        rejected   control: right label and prefill, wrong component
 *   no-label-no-prefill.js rejected   control: right component, missing demanded props
 *
 * The two controls are the point. They parse cleanly, every import resolves, and they fail only
 * because the assertion catches what the prompt actually demanded — so a failure cannot be an import
 * error wearing a costume. The second one also closes a hole this suite had: the label and prefill
 * assertions had never been seen to fail in eight measured runs.
 *
 * Browser-gated like the other behaviour tests: it self-skips when web-test-runner is absent.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runBehaviourSuite, defaultRepoRoot } from '../src/behaviour/runner.ts';
import { ibanInFormScenario } from '../src/scenarios/runs.ts';
import type { TestScenario } from '../src/scenarios/types.ts';

const repoRoot = defaultRepoRoot();
const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
const harnessAvailable = fs.existsSync(path.join(repoRoot, 'node_modules/.bin/web-test-runner'));
const skip = harnessAvailable ? false : 'web-test-runner is not installed';

const SCENARIO: TestScenario = ibanInFormScenario;

type Expectation = {
  fixture: string;
  accepted: boolean;
  /** For a rejection: what the failure must say, so it cannot pass by failing for another reason. */
  mustMention?: RegExp;
  why: string;
};

const EXPECTATIONS: Expectation[] = [
  {
    fixture: 'form-iban/ideal-form.js',
    accepted: true,
    why: 'consuming lion from scratch, in the documented light-dom case, is the canonical answer',
  },
  {
    fixture: 'form-iban/subclass.js',
    accepted: false,
    mustMention: /form context|lion-form|right component/,
    why: 'subclassing is a subclasser\'s path and out of scope for these tests',
  },
  {
    fixture: 'form-iban/native-input.js',
    accepted: false,
    mustMention: /right component|instance of/,
    why: 'a native input is not the documented component',
  },
  {
    fixture: 'form-iban/no-label-no-prefill.js',
    accepted: false,
    mustMention: /labelled|prefilled/,
    why: 'the demanded label and prefill must actually be asserted',
  },
];

/** Stage a fixture at the file its scenario scores, inside the repo (the runner requires that). */
function stage(fixture: string): string {
  const sandboxRoot = path.join(
    repoRoot,
    'packages-node/skill-tester/.tmp/discrimination',
    fixture.replace(/[^a-z0-9.-]/gi, '_'),
  );
  fs.rmSync(sandboxRoot, { recursive: true, force: true });
  const target = path.join(sandboxRoot, SCENARIO.targetFile);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(fixturesDir, fixture), target);
  return sandboxRoot;
}

test(
  'form/iban-in-form accepts the composed form and rejects the near misses, for the right reason',
  { skip, timeout: 240_000 },
  () => {
    const testSource = SCENARIO.behaviour?.testSource;
    assert.ok(testSource, 'the scenario ships a behaviour test');

    const cases = EXPECTATIONS.map(expectation => ({
      id: expectation.fixture,
      sandboxRoot: stage(expectation.fixture),
      testSource,
    }));

    const suite = runBehaviourSuite({ cases, repoRoot });
    const problems: string[] = [];

    for (const expectation of EXPECTATIONS) {
      const result = suite.results[expectation.fixture];
      if (!result || !result.ran) {
        problems.push(`${expectation.fixture}: did not run (${result?.summary ?? 'no result'})`);
        continue;
      }
      if (expectation.accepted && !result.passed) {
        problems.push(
          `${expectation.fixture} should be accepted (${expectation.why}) but failed: ${result.summary}`,
        );
        continue;
      }
      if (!expectation.accepted && result.passed) {
        problems.push(`${expectation.fixture} should be rejected (${expectation.why}) but passed`);
        continue;
      }
      if (!expectation.accepted && expectation.mustMention) {
        const mentioned = result.failures.some(failure =>
          expectation.mustMention!.test(failure.message),
        );
        if (!mentioned) {
          problems.push(
            `${expectation.fixture} failed, but not for the stated reason (${expectation.mustMention}): ` +
              JSON.stringify(result.failures),
          );
        }
      }
    }

    assert.deepEqual(problems, [], problems.join('\n'));
  },
);
