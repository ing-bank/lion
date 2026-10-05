import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { importPolicyGate, runGates, syntaxGate } from '../src/scoring/gates.ts';
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

const VALID = "import { LionButton } from '@lion/ui/button.js';\nexport class A extends B {}\n";
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

test('runGates returns both gates', () => {
  const gates = runGates(writeSandbox({ 'src/example.js': VALID }));
  assert.deepEqual(gates.map(gate => gate.name), ['syntax', 'import-policy']);
  assert.equal(gates[0].passed, true);
  assert.equal(gates[1].passed, true);
});

test('the import-policy gate allows bare lit, because core.js does not export it', () => {
  // Measured: `@lion/ui/core.js` exports only DisabledMixin, DisabledWithTabIndexMixin,
  // ScopedStylesController, SlotMixin, browserDetection, EventTargetShim and uuid — none of
  // `LitElement`, `html` or `css`. The skill's canonical example is `import { html } from 'lit';`
  // and a headless-Chromium run of the "corrected" core.js import fails with
  // "does not provide an export named 'LitElement'". So bare `lit` must NOT be a violation.
  for (const specifier of ['lit', 'lit-html', 'lit-element', '@lit/context']) {
    const result = importPolicyGate(
      writeSandbox({ 'src/example.js': `import { html } from '${specifier}';\n` }),
    );
    assert.equal(
      result.passed,
      true,
      `${specifier} should be allowed: ${JSON.stringify(result.failures)}`,
    );
  }
});

test('the import-policy gate rejects deep imports into @lion/ui internals', () => {
  // The skill's rules say: "Never deep-import from `@lion/ui/components/<x>/src/*`". That — not
  // bare `lit` — is the documented, enforceable import policy.
  for (const specifier of [
    '@lion/ui/components/input-iban/src/LionInputIban.js',
    '@lion/ui/src/core.js',
  ]) {
    const result = importPolicyGate(
      writeSandbox({ 'src/example.js': `import x from '${specifier}';\n` }),
    );
    assert.equal(result.passed, false, `${specifier} should be rejected`);
    assert.match(result.failures[0].message, /deep import/);
  }
});

test('the import-policy gate rejects @lion/* but accepts @lion/ui/*', () => {
  const bad = importPolicyGate(
    writeSandbox({ 'src/example.js': "import x from '@lion/button';\n" }),
  );
  assert.equal(bad.passed, false);
  assert.match(bad.failures[0].message, /@lion\/ui\/\*/);

  // Every documented valid form must pass — no false positives on the correct answer.
  const good = importPolicyGate(
    writeSandbox({
      'src/example.js': [
        "import { html } from 'lit';",
        "import { LionButton } from '@lion/ui/button.js';",
        "import '@lion/ui/define/lion-button.js';",
        "import '@lion/ui/localize.js';",
      ].join('\n'),
    }),
  );
  assert.equal(good.passed, true, JSON.stringify(good.failures));
});

test('the import-policy gate also inspects dynamic imports', () => {
  const result = importPolicyGate(
    writeSandbox({ 'src/example.js': "export const load = () => import('@lion/legacy');\n" }),
  );
  assert.equal(result.passed, false, 'dynamic imports must be covered');
  assert.match(result.failures[0].message, /@lion\/legacy/);
});

test('a failed import-policy gate zeroes the scenario too', () => {
  const root = writeSandbox({
    'src/example.js': "import x from '@lion/ui/components/core/src/x.js';\n",
  });
  const gates = runGates(root);
  assert.equal(gates.find(gate => gate.name === 'import-policy').passed, false);
  const scored = applyGates({ score: 1, percent: 100, files: [], checks: [], gates: [] }, gates);
  assert.equal(scored.score, 0);
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
  // The two reliability defects measured on the (since deleted) fictional blob example, as one:
  const golden = "\n      const a = 1;\n      const b = 2;\n";
  const reindented = 'const a = 1;\nconst b = 2;\n';
  const root = writeSandbox({ 'src/a.js': reindented });
  const score = scoreFile({ sandboxRoot: root, relativePath: 'src/a.js', expectedContent: golden });
  assert.equal(score.normalizedMatch, true);
  assert.equal(score.score, 1, 'identical-after-reindent code must score a full match');

  const broken = writeSandbox({ 'src/a.js': UNPARSEABLE });
  assert.equal(runGates(broken)[0].passed, false, 'unparseable output must be gated');
});
