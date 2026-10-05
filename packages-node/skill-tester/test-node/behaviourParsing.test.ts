/**
 * Parsing regressions for the behaviour tier.
 *
 * These pin the most dangerous defect found while building it: web-test-runner colours its output,
 * so a line-anchored parse matches nothing, no failures are attributed to any case, and the tier
 * reports a FALSE PASS for every scenario. The behaviour tier must never fail open, so this is
 * tested without a browser and without depending on the harness's formatting.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSuiteOutput, reportedFailureCount, stripAnsi } from '../src/behaviour/runner.ts';

const ESC = String.fromCharCode(27);
const PATH = 'packages-node/skill-tester/.tmp/x/behaviour.test.js';
const COLOURED_HEADER = `${ESC}[2K${ESC}[1A${ESC}[36m${PATH}:${ESC}[39m${ESC}[22m`;

test('stripAnsi removes the escape codes the harness emits', () => {
  const stripped = stripAnsi(COLOURED_HEADER);
  assert.equal(stripped, `${PATH}:`);
  assert.ok(!stripped.includes(ESC), 'no escape characters should survive');
});

test('a coloured file header still attributes its failures', () => {
  const output = [
    COLOURED_HEADER,
    '',
    ` ${ESC}[31m❌${ESC}[39m component/button > registers and renders`,
    '      AssertionError: the produced file registered the element',
    '',
  ].join('\n');

  const parsed = parseSuiteOutput(stripAnsi(output));
  const failures = parsed.get(PATH);
  assert.ok(failures, `expected an entry for the file, got keys ${JSON.stringify([...parsed.keys()])}`);
  assert.match(failures[0].test, /registers and renders/);
  assert.match(failures[0].message, /registered the element/);
});

test('without stripping, a coloured header loses its failures (the regression itself)', () => {
  const output = [
    COLOURED_HEADER,
    '',
    ' ❌ component/button > registers and renders',
    '      AssertionError: nope',
    '',
  ].join('\n');

  // This is the bug: no attribution, therefore no failures, therefore a false pass.
  assert.equal(parseSuiteOutput(output).size, 0);
});

test('reportedFailureCount reads the harness summary line', () => {
  assert.equal(reportedFailureCount('Chromium: |██| 1/1 test files | 0 passed, 1 failed'), 1);
  assert.equal(reportedFailureCount('Chromium: |██| 1/1 test files | 1 passed, 0 failed'), 0);
  assert.equal(reportedFailureCount('no summary here'), undefined);
});

test('failures from several files are attributed to the right file', () => {
  const other = 'packages-node/skill-tester/.tmp/y/behaviour.test.js';
  const output = [
    `${PATH}:`,
    '',
    ' ❌ component/button > a',
    '      first detail',
    '',
    `${other}:`,
    '',
    ' ❌ component/input > b',
    '      second detail',
    '',
  ].join('\n');

  const parsed = parseSuiteOutput(output);
  assert.equal(parsed.get(PATH)?.[0].test, 'component/button > a');
  assert.equal(parsed.get(other)?.[0].test, 'component/input > b');
});
