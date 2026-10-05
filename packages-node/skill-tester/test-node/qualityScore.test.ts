import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  aggregate,
  evaluateCheck,
  lineSimilarity,
  normalizeContent,
  scoreFile,
  scoreScenario,
} from '../src/scoring/qualityScore.ts';

function tempSandbox(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-tester-score-'));
  for (const [relative, content] of Object.entries(files)) {
    const full = path.join(root, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return root;
}

test('normalizeContent ignores whitespace and blank lines', () => {
  assert.equal(normalizeContent('  a  b \n\n  c '), normalizeContent('a b\nc'));
});

test('lineSimilarity is 1 for identical content and 0 for disjoint content', () => {
  assert.equal(lineSimilarity('a\nb\nc', 'a\nb\nc'), 1);
  assert.ok(lineSimilarity('a\nb\nc', 'x\ny\nz') < 0.2);
});

test('scoreFile gives full credit for an exact match', () => {
  const root = tempSandbox({ 'src/a.js': 'const a = 1;\n' });
  const score = scoreFile({
    sandboxRoot: root,
    relativePath: 'src/a.js',
    expectedContent: 'const a = 1;\n',
  });
  assert.equal(score.exists, true);
  assert.equal(score.exact, true);
  assert.equal(score.score, 1);
});

test('scoreFile treats a normalized match as a full match (formatting is not the spec)', () => {
  const root = tempSandbox({ 'src/a.js': 'const   a = 1;\n\n' });
  const score = scoreFile({
    sandboxRoot: root,
    relativePath: 'src/a.js',
    expectedContent: 'const a = 1;',
  });
  assert.equal(score.exact, false, 'not byte-identical');
  assert.equal(score.normalizedMatch, true);
  // Regression: this used to score 0.95, so identical correct code scored 100% or 95% purely on
  // indentation — noise proportional to the model's formatting style.
  assert.equal(score.score, 1);
});

test('partial credit is a gradient between a mismatch and a full match', () => {
  const near = scoreFile({
    sandboxRoot: tempSandbox({ 'src/a.js': 'const a = 1;\nconst b = 2;\n' }),
    relativePath: 'src/a.js',
    expectedContent: 'const a = 1;\nconst c = 3;\n',
  });
  const unrelated = scoreFile({
    sandboxRoot: tempSandbox({ 'src/a.js': 'x\ny\n' }),
    relativePath: 'src/a.js',
    expectedContent: 'const a = 1;\nconst c = 3;\n',
  });
  assert.ok(near.score > 0 && near.score <= 0.9, `unexpected score ${near.score}`);
  assert.ok(
    near.score > unrelated.score,
    `a one-line change (${near.score}) should score above an unrelated file (${unrelated.score})`,
  );
});

test('scoreFile scores zero for a missing file', () => {
  const root = tempSandbox({});
  const score = scoreFile({ sandboxRoot: root, relativePath: 'src/missing.js', expectedContent: 'x' });
  assert.equal(score.exists, false);
  assert.equal(score.score, 0);
});

test('evaluateCheck supports contains / notContains / matches / notMatches / exists', () => {
  const root = tempSandbox({
    'src/a.js': "import { LionButton } from '@lion/ui/button.js';\nconst x = '<lion-button>';\n",
  });
  assert.equal(evaluateCheck(root, { type: 'exists', file: 'src/a.js' }).passed, true);
  assert.equal(
    evaluateCheck(root, { type: 'contains', file: 'src/a.js', value: '@lion/ui/button.js' }).passed,
    true,
  );
  assert.equal(
    evaluateCheck(root, { type: 'notContains', file: 'src/a.js', value: "@lion/button'" }).passed,
    true,
  );
  assert.equal(
    evaluateCheck(root, { type: 'notMatches', file: 'src/a.js', pattern: "from\\s+['\"]lit['\"]" })
      .passed,
    true,
  );
  assert.equal(
    evaluateCheck(root, { type: 'matches', file: 'src/a.js', pattern: '<lion-button' }).passed,
    true,
  );
  assert.equal(
    evaluateCheck(root, { type: 'matches', file: 'src/a.js', pattern: 'nope' }).passed,
    false,
  );
});

test('scoreScenario averages file scores and checks by weight', () => {
  const root = tempSandbox({ 'src/a.js': 'const a = 1;\n' });
  const result = scoreScenario({
    sandboxRoot: root,
    expectedTransformedFiles: { 'src/a.js': 'const a = 1;\n' },
    checks: [
      { type: 'contains', file: 'src/a.js', value: 'const a', weight: 1 },
      { type: 'contains', file: 'src/a.js', value: 'missing', weight: 3 },
    ],
  });
  // 1 (file) + 1*1 (check) + 0*3 (check) => 2/5
  assert.equal(result.score, 2 / 5);
  assert.equal(result.percent, 40);
});

test('aggregate computes mean, min, max and standard deviation', () => {
  const stats = aggregate([0, 0.5, 1]);
  assert.equal(stats.count, 3);
  assert.equal(stats.mean, 0.5);
  assert.equal(stats.min, 0);
  assert.equal(stats.max, 1);
  assert.ok(Math.abs(stats.stdDev - 0.4082) < 0.001);
});
