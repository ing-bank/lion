/**
 * The behaviour tier as wired into the orchestrator.
 *
 * Runs the whole loop — scripted model -> written file -> gates -> conformance score -> behaviour
 * in a real browser — against the local mock OpenAI-compatible endpoint, so the wiring is proven
 * without network access or credentials.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runSkillTester, defaultLionUiSkillLocation } from '../src/skillTester.ts';
import { defaultRepoRoot } from '../src/behaviour/runner.ts';
import { loadLionUiScenarios } from '../src/scenarios/index.ts';
import { startMockOpenAiServer, writeFileToolCall } from './mockOpenAi.ts';
import type { SkillOrAgent } from '../src/skillTester.ts';

const repoRoot = defaultRepoRoot();
const harnessAvailable = fs.existsSync(path.join(repoRoot, 'node_modules/.bin/web-test-runner'));
const skip = harnessAvailable ? false : 'web-test-runner is not installed';

/** Where the generated run record is written so its behaviour section can be inspected. */
const REPORT_DIR = path.join(repoRoot, 'packages-node/skill-tester/.tmp/behaviour-report');

const skillOrAgent: SkillOrAgent = {
  name: 'lion-ui',
  type: 'skill',
  location: defaultLionUiSkillLocation(repoRoot),
};

/** A correct answer: imports the define entrypoint and renders the element. */
const GOOD_EXAMPLE = [
  "import { html } from 'lit';",
  "import '@lion/ui/define/lion-button.js';",
  '',
  'export const example = () => html`<lion-button>Click me</lion-button>`;',
  '',
].join('\n');

/**
 * Renders a tag the host does not register. The host supplies the scoped registry (the assumed
 * context), so a missing entrypoint no longer fails behaviour — an unregistered TAG does.
 */
const WRONG_TAG_EXAMPLE = [
  "import { html } from 'lit';",
  '',
  'export const example = () => html`<not-a-lion-button>Click me</not-a-lion-button>`;',
  '',
].join('\n');

async function runAgainst(producedFile: string) {
  fs.rmSync(REPORT_DIR, { recursive: true, force: true });
  const scenarios = loadLionUiScenarios({
    repoRoot,
    components: ['button'],
    systems: [],
    includeManual: false,
  });
  assert.equal(scenarios.length, 1, 'expected exactly the button component scenario');

  const server = await startMockOpenAiServer([
    { message: writeFileToolCall('src/example.js', producedFile) },
    { message: { role: 'assistant', content: 'done' } },
  ]);

  try {
    return await runSkillTester({
      skillOrAgent,
      scenarios,
      models: ['mock-model'],
      sampleSize: 1,
      llm: { baseUrl: server.baseUrl, apiKey: 'test-key' },
      reportDir: REPORT_DIR,
      behaviour: true,
      onProgress: () => {},
    });
  } finally {
    await server.close();
  }
}

test('behaviour is reported as its own axis, end to end', { skip, timeout: 240_000 }, async () => {
  const report = await runAgainst(GOOD_EXAMPLE);

  assert.equal(report.runs.length, 1);
  const run = report.runs[0];
  assert.equal(run.score.percent, 100, 'a correct example passes the conformance tier');
  assert.ok(run.behaviour, 'the run carries a behaviour result');
  assert.equal(run.behaviour.passed, true, run.behaviour.summary);
  assert.equal(run.behaviour.ran, true);

  assert.ok(report.behaviour, 'the report carries a behaviour aggregate');
  assert.deepEqual(
    {
      total: report.behaviour.total,
      passed: report.behaviour.passed,
      failed: report.behaviour.failed,
    },
    { total: 1, passed: 1, failed: 0 },
  );
  assert.ok(report.behaviour.durationMs > 0, 'the behaviour tier records its own duration');

  const recordName = fs.readdirSync(REPORT_DIR).find(name => name.endsWith('.md'));
  assert.ok(recordName, 'a markdown run record should have been written');
  const record = fs.readFileSync(path.join(REPORT_DIR, recordName), 'utf-8');
  assert.match(record, /## Behaviour \(real browser\)/, 'the record reports the behaviour axis');
  assert.match(record, /\*\*1\/1 passed\*\*/, 'the record states how many cases passed');
});

test('behaviour catches output that renders an unregistered element', { skip, timeout: 240_000 }, async () => {
  const report = await runAgainst(WRONG_TAG_EXAMPLE);

  const run = report.runs[0];
  assert.ok(run.behaviour, 'the run carries a behaviour result');
  assert.equal(run.behaviour.passed, false, 'behaviour must fail when the wrong tag is rendered');
  assert.ok(
    run.behaviour.failures.some(failure => /renders <lion-button>/.test(failure.message)),
    `the failure should name what is missing, got: ${JSON.stringify(run.behaviour.failures)}`,
  );
  assert.equal(report.behaviour?.failed, 1);
});
