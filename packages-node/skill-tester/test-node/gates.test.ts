import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runGates, syntaxGate } from '../src/scoring/gates.ts';
import { applyGates, scoreFile } from '../src/scoring/qualityScore.ts';
import { createProjectSandbox } from '../src/createProjectSandbox.ts';

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'skill-tester-gate-'));
}

function writeSandbox(files: Record<string, string>): string {
  const root = tempDir();
  for (const [relative, content] of Object.entries(files)) {
    const full = path.join(root, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return root;
}

const VALID = "import { LionBlob } from '@lion/ui/blob.js';\nexport class A extends B {}\n";
// An unterminated template literal. `node --check` ACCEPTS this when the sandbox has no declared
// module type; oxc rejects it, which is why the gate is built on oxc.
const UNPARSEABLE = 'export const example = () => html`<lion-button>x</lion-button>;\n';

test('the syntax gate passes a parseable sandbox', () => {
  const result = syntaxGate(writeSandbox({ 'src/example.js': VALID }));
  assert.equal(result.passed, true);
  assert.equal(result.failures.length, 0);
  assert.equal(result.checked, 1);
});

test('the syntax gate fails an unparseable sandbox and reports file:line:column', () => {
  const result = syntaxGate(writeSandbox({ 'src/example.js': UNPARSEABLE }));
  assert.equal(result.passed, false);
  assert.equal(result.failures.length, 1);
  assert.equal(result.failures[0].file, 'src/example.js');
  assert.equal(result.failures[0].line, 1);
  assert.ok(result.failures[0].column > 0);
  assert.match(result.summary, /src\/example\.js:1:\d+/);
});

test('the syntax gate ignores skill references and node_modules', () => {
  const result = syntaxGate(
    writeSandbox({
      'src/example.js': VALID,
      '.skill/lion-ui/references/button.md': '# not js',
      'node_modules/x/index.js': 'this is ((not js',
    }),
  );
  assert.equal(result.passed, true);
  assert.equal(result.checked, 1, 'only the produced source file should be inspected');
});

test('runGates returns the syntax gate', () => {
  const gates = runGates(writeSandbox({ 'src/example.js': VALID }));
  assert.deepEqual(gates.map(gate => gate.name), ['syntax']);
  assert.equal(gates[0].passed, true);
});

test('a failed gate zeroes an otherwise perfect score', () => {
  const root = writeSandbox({ 'src/example.js': UNPARSEABLE });
  const raw = applyGates(
    {
      score: 1,
      percent: 100,
      files: [scoreFile({ sandboxRoot: root, relativePath: 'src/example.js', expectedContent: UNPARSEABLE })],
      checks: [],
      gates: [],
    },
    runGates(root),
  );
  assert.equal(raw.score, 0, 'unparseable output must not keep its textual score');
  assert.equal(raw.percent, 0);
  assert.equal(raw.gates[0].passed, false);
});

test('a passing gate leaves the score untouched', () => {
  const root = writeSandbox({ 'src/example.js': VALID });
  const base = {
    score: 0.8,
    percent: 80,
    files: [],
    checks: [],
    gates: [],
  };
  const scored = applyGates(base, runGates(root));
  assert.equal(scored.score, 0.8);
  assert.equal(scored.percent, 80);
  assert.equal(scored.gates[0].passed, true);
});

test('the sandbox declares "type": "module" so ESM files are unambiguous', async () => {
  const root = await createProjectSandbox(
    { 'src/example.js': VALID },
    { outputPath: tempDir() },
  );
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
  assert.equal(pkg.type, 'module');
});

test('a scenario that provides its own package.json keeps it', async () => {
  const root = await createProjectSandbox(
    { 'src/example.js': VALID, 'package.json': '{"name":"custom","type":"commonjs"}\n' },
    { outputPath: tempDir() },
  );
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
  assert.equal(pkg.name, 'custom');
});

test('the golden-file path is formatting-insensitive but gate-sensitive', () => {
  // The two reliability defects measured on the blob example, as one assertion:
  const golden = "\n      const a = 1;\n      const b = 2;\n";
  const reindented = 'const a = 1;\nconst b = 2;\n';
  const root = writeSandbox({ 'src/a.js': reindented });
  const score = scoreFile({ sandboxRoot: root, relativePath: 'src/a.js', expectedContent: golden });
  assert.equal(score.normalizedMatch, true);
  assert.equal(score.score, 1, 'identical-after-reindent code must score a full match');

  const broken = writeSandbox({ 'src/a.js': UNPARSEABLE });
  assert.equal(runGates(broken)[0].passed, false, 'unparseable output must be gated');
});
