/**
 * The scenario linter, applied to every scenario.
 *
 * A prompt and its checks ship together, so they are linted together: this fails the suite when a
 * check asserts something the prompt never demanded, when the prompt demands something nothing
 * measures, when the behaviour test does not exercise the produced file, when a referenced
 * entrypoint or reference doc does not exist, when a TODO starter leaks the answer, or when the
 * scenario does not pin the model to a single deliverable file.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {
  loadLionUiScenarios,
  discoverComponentNames,
  discoverSystemNames,
} from '../src/scenarios/index.ts';
import { lintScenarios } from '../src/scenarios/lint.ts';
import { defaultRepoRoot } from '../src/behaviour/runner.ts';

const repoRoot = defaultRepoRoot();
const skillDir = path.join(repoRoot, 'packages/ui/skills/lion-ui');

test('every scenario satisfies the seven prompt assertions', () => {
  const scenarios = loadLionUiScenarios({ repoRoot });
  assert.ok(scenarios.length > 0, 'expected scenarios to lint');

  const findings = lintScenarios(scenarios, {
    components: discoverComponentNames(repoRoot),
    systems: discoverSystemNames(repoRoot),
    skillDir,
  });

  const report = findings
    .map(finding => `  ${finding.scenario} [${finding.assertion}] ${finding.message}`)
    .join('\n');
  assert.deepEqual(findings, [], `\n${findings.length} lint finding(s):\n${report}`);
});

test('the linter catches a behaviour test that does not exercise the produced file', () => {
  // Guards against the linter silently passing everything. This pins the exact defect found while
  // building the behaviour tier: a test that imports the LIBRARY instead of the produced file
  // passes for every possible answer.
  const findings = lintScenarios([
    {
      name: 'bad/tautology',
      kind: 'component',
      description: 'behaviour test never imports the produced file',
      prompt: 'Create `src/x.js` only — nothing else.',
      targetFile: 'src/x.js',
      files: { 'src/x.js': '// TODO: create it\n' },
      checks: [{ type: 'exists', file: 'src/x.js', description: '' }],
      behaviour: {
        // Imports only the library: the assertion would pass for any output.
        testSource: [
          "import { expect, fixture } from '@open-wc/testing';",
          "import { LionButton } from '@lion/ui/button.js';",
        ].join('\n'),
      },
    },
  ]);

  assert.ok(
    findings.some(finding => finding.assertion === 'L2'),
    `expected an L2 finding, got: ${JSON.stringify(findings)}`,
  );
});
