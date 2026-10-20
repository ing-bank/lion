import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  discoverComponentNames,
  discoverDefineEntrypoints,
  discoverKnownTags,
  discoverSystemNames,
  loadLionUiScenarios,
} from '../src/scenarios/index.ts';
import {
  createComponentScenario,
  createSystemScenario,
  entrypointFor,
  defineEntrypointFor,
} from '../src/scenarios/lionUi.ts';
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
  // The GENERATED set covers every component and system exactly once. Hand-authored scenarios may
  // add further scenarios of the same kind (the concrete runs do), so assert coverage by name
  // rather than by counting scenario kinds.
  for (const component of components) {
    assert.ok(
      names.includes(`component/${component}`),
      `missing the generated scenario for component "${component}"`,
    );
  }
  for (const system of systems) {
    assert.ok(names.includes(`system/${system}`), `missing the generated scenario for system "${system}"`);
  }

  for (const scenario of scenarios) {
    const hasChecks = (scenario.checks ?? []).length > 0;
    // The golden no longer scores, so a scenario without checks would score vacuously: require checks.
    assert.ok(hasChecks, `${scenario.name} has no checks, so it would score vacuously`);
    assert.ok(Object.keys(scenario.files).length === 1, `${scenario.name} should start from one file`);
    assert.ok(scenario.prompt.length > 0);
  }
});

test('entrypointFor maps a component folder to its @lion/ui entrypoint', () => {
  assert.equal(entrypointFor('input-amount'), '@lion/ui/input-amount.js');
  assert.equal(entrypointFor('core'), '@lion/ui/core.js');
});

test('a component scenario asserts the entrypoint convention and its tag when known', () => {
  const scenario = createComponentScenario('button', { knownTags: ['lion-button'] });
  const patterns = (scenario.checks ?? []).map(check => check.pattern ?? check.value);
  assert.ok(patterns.some(pattern => pattern && pattern.includes('@lion/ui/button')));
  assert.ok(
    scenario.checks?.some(check => check.description?.includes('<lion-button>')),
    'expected a tag check',
  );
});

test('a generated component scenario does not score a correct answer as failing', () => {
  // The generated checks must accept the canonical correct answer: a component file that composes
  // the documented element and carries its own scoped registry.
  const scenario = createComponentScenario('button', { knownTags: ['lion-button'] });
  const correct = [
    "import { LitElement, html } from 'lit';",
    "import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';",
    "import { LionButton } from '@lion/ui/button.js';",
    '',
    'export class MyElem extends ScopedElementsMixin(LitElement) {',
    "  static scopedElements = { 'lion-button': LionButton };",
    '',
    '  render() {',
    '    return html`<lion-button>Click</lion-button>`;',
    '  }',
    '}',
    '',
  ].join('\n');
  const scored = scoreExample(correct, scenario);
  assert.equal(
    scored.score,
    1,
    `checks rejected a correct answer: ${JSON.stringify(scored.checks)}`,
  );
});

/** Score a single-file answer against one scenario's checks, at the file that scenario targets. */
function scoreExample(
  content: string,
  scenario: {
    checks?: Parameters<typeof scoreScenario>[0]['checks'];
    targetFile?: string;
  },
) {
  const target = scenario.targetFile ?? 'src/example.js';
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'st-'));
  fs.mkdirSync(path.dirname(path.join(root, target)), { recursive: true });
  fs.writeFileSync(path.join(root, target), content);
  return scoreScenario({ sandboxRoot: root, checks: scenario.checks });
}

test('the define entrypoint is rejected: global registration is not the skill path', () => {
  // The skill now says never to use a @lion/ui/define entrypoint: it registers a tag globally, opting
  // out of the host's scoped registry. A viaDefine answer must therefore fail even though the define
  // entrypoint exists on disk and the import check still accepts it as an alternative.
  const defineEntrypoints = discoverDefineEntrypoints(repoRoot);
  assert.ok(defineEntrypoints.includes('button'), 'button should ship a define entrypoint');
  assert.ok(defineEntrypoints.includes('form'), 'form should ship a define entrypoint');
  assert.equal(defineEntrypointFor('button'), '@lion/ui/define/lion-button.js');

  const scenario = createComponentScenario('button', { knownTags: ['lion-button'], defineEntrypoints });
  const viaDefine = [
    "import '@lion/ui/define/lion-button.js';",
    "import { LitElement, html } from 'lit';",
    '',
    'export class MyElem extends LitElement {',
    '  render() {',
    '    return html`<lion-button>Click</lion-button>`;',
    '  }',
    '}',
    '',
  ].join('\n');
  const scored = scoreExample(viaDefine, scenario);
  assert.notEqual(scored.score, 1, `define entrypoint got full marks: ${JSON.stringify(scored.checks)}`);
  assert.ok(
    scored.checks.some(
      check => check.description.includes('global define entrypoint') && !check.passed,
    ),
    'the define ban itself must be the reason it fails',
  );
});

test('a direct @lion/<name> import is still rejected', () => {
  const scenario = createComponentScenario('button', {
    knownTags: [],
    defineEntrypoints: discoverDefineEntrypoints(repoRoot),
  });
  assert.ok(scoreExample("import { LionButton } from '@lion/button';\n", scenario).score < 1);
});

test('a system without a define entrypoint only accepts its class entrypoint', () => {
  const scenario = createSystemScenario('core', {
    defineEntrypoints: discoverDefineEntrypoints(repoRoot),
  });
  const entrypointCheck = scenario.checks?.find(check => check.type === 'matches');
  assert.ok(entrypointCheck?.pattern, 'expected an entrypoint check');
  assert.ok(
    !entrypointCheck.pattern.includes('define/'),
    `core has no define entrypoint, so the pattern must not offer one: ${entrypointCheck.pattern}`,
  );
});

test('the tag check accepts markup and createElement, but not a different element name', () => {
  // Regression: a real run rendered the element via document.createElement('lion-button').
  const scenario = createComponentScenario('button', { knownTags: ['lion-button'] });
  const classImport = "import { LionButton } from '@lion/ui/button.js';\n";

  const markup = `${classImport}export class MyElem { render() { return html\`<lion-button>Click</lion-button>\`; } }\nMyElem.scopedElements = { 'lion-button': LionButton };\n`;
  assert.equal(scoreExample(markup, scenario).score, 1);

  const created = `${classImport}export class MyElem {}\nMyElem.scopedElements = { 'lion-button': LionButton };\nconst el = document.createElement('lion-button');\n`;
  assert.equal(scoreExample(created, scenario).score, 1, 'createElement should be accepted');

  const wrongTag = `${classImport}export class MyElem {}\nMyElem.scopedElements = { 'lion-button': LionButton };\nconst el = document.createElement('lion-not-this-component');\n`;
  assert.ok(scoreExample(wrongTag, scenario).score < 1, 'a different element name must fail');
});
