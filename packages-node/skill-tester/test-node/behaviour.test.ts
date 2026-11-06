import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultRepoRoot, runBehaviour } from '../src/behaviour/runner.ts';

const repoRoot = defaultRepoRoot();
const harnessAvailable = fs.existsSync(path.join(repoRoot, 'node_modules/.bin/web-test-runner'));
const skip = harnessAvailable ? false : 'web-test-runner is not installed';

/** A sandbox inside the repo — required, because @lion/ui is a workspace symlink. */
function repoSandbox(): string {
  const dir = path.join(repoRoot, 'packages-node/skill-tester/.tmp/behaviour', `t${Date.now()}${Math.random().toString(36).slice(2, 6)}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

test('the behaviour runner refuses a sandbox outside the repo', () => {
  const result = runBehaviour({
    sandboxRoot: path.join(path.sep, 'tmp', 'not-in-repo'),
    testSource: '',
    repoRoot,
  });
  assert.equal(result.ran, false);
  assert.match(result.summary, /must live inside the repository/);
});

test('the behaviour runner reports a missing harness instead of crashing', () => {
  const result = runBehaviour({
    sandboxRoot: repoSandbox(),
    testSource: '',
    repoRoot: path.join(repoRoot, 'packages-node/skill-tester'),
  });
  assert.equal(result.ran, false);
  assert.match(result.summary, /harness is unavailable/);
});

test(
  'a passing assertion runs in a real browser',
  { skip },
  () => {
    const result = runBehaviour({
      sandboxRoot: repoSandbox(),
      repoRoot,
      testSource: `import { expect } from '@open-wc/testing';
describe('generated', () => {
  it('passes', () => { expect(1).to.equal(1); });
});
`,
    });
    assert.equal(result.ran, true, result.summary);
    assert.equal(result.passed, true, `${result.summary}\n${result.output}`);
    assert.deepEqual(result.failures, []);
    assert.ok(result.durationMs > 0);
  },
);

test(
  'a failing assertion is reported with its test name and message',
  { skip },
  () => {
    const result = runBehaviour({
      sandboxRoot: repoSandbox(),
      repoRoot,
      testSource: `import { expect } from '@open-wc/testing';
describe('generated', () => {
  it('fails on purpose', () => { expect(1).to.equal(2); });
});
`,
    });
    assert.equal(result.ran, true, result.summary);
    assert.equal(result.passed, false);
    assert.ok(result.failures.length > 0, result.output);
    assert.match(result.failures[0].test, /fails on purpose/);
  },
);

test(
  'produced code that does not parse cannot pass the behaviour tier',
  { skip },
  () => {
    const sandbox = repoSandbox();
    // An unparseable produced module: the behaviour tier is its own correctness floor.
    fs.writeFileSync(
      path.join(sandbox, 'broken-module.js'),
      "export const x = () => html`<lion-button>oops;\n",
    );
    const result = runBehaviour({
      sandboxRoot: sandbox,
      repoRoot,
      testSource: `import { expect } from '@open-wc/testing';
import './broken-module.js';
describe('generated', () => {
  it('never runs', () => { expect(1).to.equal(1); });
});
`,
    });
    assert.equal(result.passed, false);
    assert.equal(result.ran, true, result.summary);
  },
);
