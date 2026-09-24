import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  discoverComponentNames,
  discoverKnownTags,
  discoverSystemNames,
  loadLionUiScenarios,
} from '../src/scenarios/index.ts';
import { createComponentScenario, entrypointFor } from '../src/scenarios/lionUi.ts';
import { scoreScenario } from '../src/scoring/qualityScore.ts';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

test('the repository exposes components and systems to cover', () => {
  const components = discoverComponentNames(repoRoot);
  const systems = discoverSystemNames(repoRoot);
  assert.ok(components.length >= 30, `expected >=30 components, got ${components.length}`);
  assert.ok(systems.includes('form'));
  assert.ok(systems.includes('localize'));
  // Non-visual utility folders must be filtered out of the component set.
  assert.ok(!components.includes('helpers'));
  assert.ok(!components.includes('form-core'));
});

test('the custom elements manifest is readable for tag assertions', () => {
  const tags = discoverKnownTags(repoRoot);
  assert.ok(tags.includes('lion-button'));
  assert.ok(tags.includes('lion-input-range'), 'lion-input-range should be discovered');
});

test('every component and system gets exactly one small, isolated scenario', () => {
  const scenarios = loadLionUiScenarios({ repoRoot });
  const names = scenarios.map(scenario => scenario.name);
  assert.equal(new Set(names).size, names.length, 'scenario names must be unique');

  const components = discoverComponentNames(repoRoot);
  const systems = discoverSystemNames(repoRoot);
  assert.equal(
    scenarios.filter(scenario => scenario.kind === 'component').length,
    components.length,
  );
  assert.equal(scenarios.filter(scenario => scenario.kind === 'system').length, systems.length);

  for (const scenario of scenarios) {
    const hasGolden = Object.keys(scenario.expectedTransformedFiles ?? {}).length > 0;
    const hasChecks = (scenario.checks ?? []).length > 0;
    assert.ok(hasGolden || hasChecks, `${scenario.name} has neither golden files nor checks`);
    assert.ok(Object.keys(scenario.files).length === 1, `${scenario.name} should start from one file`);
    assert.ok(scenario.prompt.length > 0);
  }
});

test('entrypointFor maps a component folder to its @lion/ui entrypoint', () => {
  assert.equal(entrypointFor('input-amount'), '@lion/ui/input-amount.js');
  assert.equal(entrypointFor('core'), '@lion/ui/core.js');
});

test('a component scenario asserts the entrypoint convention and its tag when known', () => {
  const scenario = createComponentScenario('button', ['lion-button']);
  const patterns = (scenario.checks ?? []).map(check => check.pattern ?? check.value);
  assert.ok(patterns.some(pattern => pattern && pattern.includes('@lion/ui/button')));
  assert.ok(patterns.includes('<lion-button'));
});

test('a generated component scenario does not score a correct example as failing', () => {
  // The generated checks must accept the canonical correct answer.
  const scenario = createComponentScenario('button', ['lion-button']);
  const correct = [
    "import { LionButton } from '@lion/ui/button.js';",
    "import { LitElement, html } from '@lion/ui/core.js';",
    'export const example = () => html`<lion-button>Click</lion-button>`;',
  ].join('\n');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'st-'));
  fs.mkdirSync(path.join(root, 'src'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src/example.js'), correct);
  const scored = scoreScenario({ sandboxRoot: root, checks: scenario.checks });
  assert.equal(scored.score, 1, `checks rejected a correct example: ${JSON.stringify(scored.checks)}`);
});
