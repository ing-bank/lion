/**
 * Golden-file integrity.
 *
 * A golden that nobody executed is the most reliable way to make a benchmark measure fiction, so
 * goldens are not trusted on review: each one is written into a sandbox and run through the gates,
 * its checks and the behaviour tier.
 *
 * The behaviour tier additionally gets a *negative control* on the same scenario — code that
 * satisfies the import gate and the checks but still renders the wrong thing must fail — so a
 * green behaviour result is known to discriminate rather than to always pass.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { manualScenarios } from '../src/scenarios/manual.ts';
import { runGates } from '../src/scoring/gates.ts';
import { scoreScenario } from '../src/scoring/qualityScore.ts';
import { runBehaviour, defaultRepoRoot } from '../src/behaviour/runner.ts';

const repoRoot = defaultRepoRoot();
const harnessAvailable = fs.existsSync(path.join(repoRoot, 'node_modules/.bin/web-test-runner'));
const skip = harnessAvailable ? false : 'web-test-runner is not installed';

/** A sandbox inside the repo — required, because `@lion/ui` is a workspace symlink. */
function sandbox(name: string, files: Record<string, string>): string {
  const root = path.join(repoRoot, 'packages-node/skill-tester/.tmp/golden', name);
  fs.rmSync(root, { recursive: true, force: true });
  for (const [relative, content] of Object.entries(files)) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return root;
}

test('a golden declares how it was verified', () => {
  for (const scenario of manualScenarios) {
    if (!scenario.expectedTransformedFiles) continue;
    assert.ok(
      scenario.goldenProvenance && scenario.goldenProvenance.length > 0,
      `${scenario.name} ships a golden without goldenProvenance`,
    );
  }
});

test('every scenario ships its target file', () => {
  for (const scenario of manualScenarios) {
    assert.ok(
      Object.keys(scenario.files).includes(scenario.targetFile),
      `${scenario.name}: ${scenario.targetFile} is not among the starting files`,
    );
    assert.ok(scenario.prompt.trim().length > 0, `${scenario.name} has an empty prompt`);
  }
});

const iban = manualScenarios.find(scenario => scenario.name === 'repair/iban-field');
assert.ok(iban, 'the repair/iban-field scenario is expected to exist');

test('the repair/iban-field golden passes the gates, its checks and the behaviour tier', { skip }, () => {
  const root = sandbox('iban', iban.expectedTransformedFiles);

  const gates = runGates(root);
  assert.ok(
    gates.every(gate => gate.passed),
    `gates must pass the golden: ${JSON.stringify(gates.map(g => [g.name, g.passed, g.failures]))}`,
  );

  const score = scoreScenario({
    sandboxRoot: root,
    expectedTransformedFiles: iban.expectedTransformedFiles,
    checks: iban.checks,
  });
  assert.equal(score.percent, 100, `golden must be a perfect score: ${JSON.stringify(score.checks)}`);

  const behaviour = runBehaviour({
    sandboxRoot: root,
    testSource: iban.behaviour.testSource,
    repoRoot,
  });
  assert.equal(behaviour.passed, true, `${behaviour.summary}\n${behaviour.output}`);
});

test(
  'the behaviour tier fails code that satisfies the gate and the checks but renders the wrong thing',
  { skip },
  () => {
    // Negative control: imports are all legitimate (so the gate passes) and the markup mentions
    // lion-form/lion-input-iban in a comment — the checks are substring assertions and can be
    // satisfied — but the component still renders a native input, so behaviour must fail.
    const root = sandbox('iban-negative', {
      'src/iban-field.js': [
        "import { LitElement, html } from 'lit';",
        "import '@lion/ui/define/lion-form.js';",
        "import '@lion/ui/define/lion-input-iban.js';",
        '',
        '// renders a <lion-form> with a <lion-input-iban name="account"> in the real answer',
        'export class IbanField extends LitElement {',
        '  render() {',
        "    return html`<input name=\"account\" />`;",
        '  }',
        '}',
        '',
      ].join('\n'),
    });

    const gates = runGates(root);
    assert.ok(gates.every(gate => gate.passed), 'the negative control must pass the gates');

    const behaviour = runBehaviour({
      sandboxRoot: root,
      testSource: iban.behaviour.testSource,
      repoRoot,
    });
    assert.equal(
      behaviour.passed,
      false,
      'behaviour must discriminate: a native input is not a lion-input-iban on a lion-form',
    );
    assert.ok(behaviour.failures.length > 0, behaviour.output);
  },
);
