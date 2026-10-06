/**
 * Generates one small, isolated scenario per `@lion/ui` component and per system.
 *
 * Each scenario asks for a minimal, self-contained usage example in a single file and asserts
 * the conventions the `lion-ui` skill exists to teach:
 *
 *   - import through a real `@lion/ui` entrypoint — either the class entrypoint
 *     (`@lion/ui/<name>.js`) or the side-effect `define/*` entrypoint
 *     (`@lion/ui/define/lion-<name>.js`);
 *   - never import a component from `@lion/*` directly;
 *   - never deep-import into `@lion/ui` internals (`@lion/ui/components/**`, `@lion/ui/src/**`),
 *     which is the import rule the skill actually states. Bare `lit` is NOT a violation:
 *     `@lion/ui/core.js` exports only mixins and utilities (no `LitElement`/`html`/`css`), and the
 *     skill's own canonical example is `import { html } from 'lit';`;
 *   - use the component's real custom-element tag, in markup or via `createElement` (only
 *     asserted when the custom elements manifest confirms the tag exists).
 *
 * For components with a confirmed tag and a known class, a **behaviour** test is attached as well.
 * It is written against the *produced file* — it imports `./src/example.js` — and it renders the
 * example in the context the skill assumes: a host `LitElement` that applies `ScopedElementsMixin`
 * and registers the component in its `scopedElements`. The element therefore lives in the host's
 * scoped registry, NOT in the global one, so `customElements.get('<tag>')` is the wrong probe.
 * Asserting on the global registry was measured to reject a correct class-entrypoint answer; see
 * `references/systems/core.md` in the skill for the documented best practices.
 *
 * The accepted entrypoints and the tag/class facts are derived from the repository
 * (`packages/ui/exports/*`, `custom-elements.json`), so the checks assert what this codebase
 * actually ships rather than a hand-maintained list.
 */

import type { TestScenario, ScenarioCheck } from './types.ts';

/** Component folders under `packages/ui/components` that are not standalone visual components. */
export const NON_VISUAL_COMPONENT_DIRS = [
  'core',
  'localize',
  'overlays',
  'icon',
  'form-core',
  'form-integrations',
  'helpers',
  'validate-messages',
];

/** Systems documented under `docs/fundamentals/systems`. */
export const SYSTEM_NAMES = ['core', 'form', 'icon', 'localize', 'overlays'];

const TARGET_FILE = 'src/example.js';

/**
 * The export name the example must keep. Stated in the prompt so the generated behaviour test can
 * execute the produced code; without a known entry point a behaviour test can only re-test the
 * library, which passes no matter what the model wrote.
 */
const EXAMPLE_EXPORT = 'example';

/** Repository facts the generated checks depend on. */
export type LionUiScenarioContext = {
  /** Custom-element tag names confirmed by `packages/ui/custom-elements.json`. */
  knownTags?: string[];
  /** Names that ship a `@lion/ui/define/lion-<name>.js` entrypoint. */
  defineEntrypoints?: string[];
  /** Custom-element tag -> class name, from the custom elements manifest (e.g. `lion-button`). */
  tagClasses?: Record<string, string>;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** The `@lion/ui` class entrypoint, e.g. `input-amount` -> `@lion/ui/input-amount.js`. */
export function entrypointFor(name: string): string {
  return `@lion/ui/${name}.js`;
}

/** The side-effect `define` entrypoint, e.g. `button` -> `@lion/ui/define/lion-button.js`. */
export function defineEntrypointFor(name: string): string {
  return `@lion/ui/define/lion-${name}.js`;
}

/**
 * Accept both ways the skill documents: importing the class (`from '@lion/ui/x.js'`) and
 * registering the element (`import '@lion/ui/define/lion-x.js'`).
 */
function entrypointChecks(name: string, defineEntrypoints: string[] = []): ScenarioCheck[] {
  const escaped = escapeRegExp(name);
  const classImport = `from\\s+['\"]@lion/ui/${escaped}\\.js['\"]`;
  const defineSupported = defineEntrypoints.includes(name);
  const defineImport = `['\"]@lion/ui/define/lion-${escaped}\\.js['\"]`;

  return [
    { type: 'exists', file: TARGET_FILE },
    {
      type: 'matches',
      file: TARGET_FILE,
      pattern: defineSupported ? `${classImport}|${defineImport}` : classImport,
      description: defineSupported
        ? `imports '${entrypointFor(name)}' or '${defineEntrypointFor(name)}'`
        : `imports '${entrypointFor(name)}'`,
    },
    {
      type: 'notMatches',
      file: TARGET_FILE,
      pattern: `from\\s+['\"]@lion/${escaped}['\"]`,
      description: `does not import from '@lion/${name}' directly`,
    },
    {
      type: 'notMatches',
      file: TARGET_FILE,
      pattern: '@lion/ui/(components|src)/',
      description: 'does not deep-import from @lion/ui internals',
    },
  ];
}

function starterFile(description: string): string {
  return [
    `// TODO: ${description}`,
    '// Import through @lion/ui entrypoints only (never `@lion/*`, never a deep import).',
    `export const ${EXAMPLE_EXPORT} = () => {};`,
    '',
  ].join('\n');
}

/**
 * A behaviour test for a component, written against the **produced file** and rendered in the
 * context the skill assumes.
 *
 * The host applies `ScopedElementsMixin` and registers the component in `scopedElements`, exactly
 * as the skill's rule requires. Two consequences, both deliberate:
 *
 *   - the element is resolved from the host's scoped registry, so the test must NOT probe the
 *     global registry (`customElements.get` is legitimately undefined there — measured to reject a
 *     correct answer);
 *   - the host tag is unique per component, because batching runs many test files in one browser
 *     and a shared host tag would let the first component's `scopedElements` win.
 */
function componentBehaviour(
  name: string,
  tagName: string,
  className: string,
): NonNullable<TestScenario['behaviour']> {
  const hostTag = `behaviour-host-${name}`;

  return {
    description: `the produced example renders <${tagName}> inside a scoped-elements host`,
    testSource: [
      "import { expect, fixture } from '@open-wc/testing';",
      "import { LitElement } from 'lit';",
      "import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';",
      `import { ${className} } from '${entrypointFor(name)}';`,
      `import { ${EXAMPLE_EXPORT} } from './${TARGET_FILE}';`,
      '',
      '// The assumed context: the example is rendered inside a host LitElement that applies',
      '// ScopedElementsMixin and registers the components it renders. The component therefore',
      '// lives in the scoped registry of this host, NOT in the global one.',
      `class BehaviourHost extends ScopedElementsMixin(LitElement) {`,
      `  static scopedElements = { '${tagName}': ${className} };`,
      '',
      '  render() {',
      `    return ${EXAMPLE_EXPORT}();`,
      '  }',
      '}',
      '',
      `if (!customElements.get('${hostTag}')) {`,
      `  customElements.define('${hostTag}', BehaviourHost);`,
      '}',
      '',
      `describe('component/${name}', () => {`,
      `  it('renders <${tagName}> from the produced example inside a scoped host', async () => {`,
      `    expect(typeof ${EXAMPLE_EXPORT}, 'the produced file keeps the "example" export').to.equal(`,
      "      'function',",
      '    );',
      '',
      `    const host = await fixture('<${hostTag}></${hostTag}>');`,
      `    const el = host.shadowRoot.querySelector('${tagName}');`,
      `    expect(el, 'the example renders <${tagName}>').to.not.equal(null);`,
      `    expect(el, 'the scoped registry upgraded the element').to.be.instanceOf(${className});`,
      '  });',
      '});',
      '',
    ].join('\n'),
  };
}

/**
 * @param componentName folder name under `packages/ui/components`, e.g. `button`
 * @param context repository facts (known tags, available define entrypoints, tag -> class)
 */
export function createComponentScenario(
  componentName: string,
  context: LionUiScenarioContext = {},
): TestScenario {
  const { knownTags = [], defineEntrypoints = [], tagClasses = {} } = context;
  const tagName = `lion-${componentName}`;
  const checks = entrypointChecks(componentName, defineEntrypoints);
  const tagConfirmed = knownTags.includes(tagName);
  if (tagConfirmed) {
    // Accept the tag in markup or created programmatically: both name the documented element.
    // Asserting only literal markup penalises an otherwise correct example (observed in a real run).
    const escapedTag = escapeRegExp(tagName);
    checks.push({
      type: 'matches',
      file: TARGET_FILE,
      pattern:
        `<${escapedTag}(?:[\\s>/]|$)|createElement\\(\\s*['\"]${escapedTag}['\"]`,
      description: `uses the <${tagName}> element (markup or createElement)`,
    });
  }

  const scenario: TestScenario = {
    name: `component/${componentName}`,
    kind: 'component',
    description: `Minimal usage example for the "${componentName}" component.`,
    prompt: [
      `Add a minimal, correct usage example for the "${componentName}" component to \`${TARGET_FILE}\`.`,
      'It must be a small self-contained example that imports everything it needs from the',
      'correct @lion/ui entrypoints and renders the component with its documented element name.',
      `Keep the \`${EXAMPLE_EXPORT}\` export: a function that renders the example, so it can be`,
      'executed. Follow the conventions in the skill.',
    ].join(' '),
    targetFile: TARGET_FILE,
    files: { [TARGET_FILE]: starterFile(`add a usage example for the "${componentName}" component.`) },
    checks,
  };

  // The behaviour test needs the class to register in `scopedElements`.
  const className = tagClasses[tagName];
  if (tagConfirmed && className) {
    scenario.behaviour = componentBehaviour(componentName, tagName, className);
  }

  return scenario;
}

/**
 * @param systemName one of `SYSTEM_NAMES`, e.g. `form`
 * @param context repository facts (available define entrypoints)
 */
export function createSystemScenario(
  systemName: string,
  context: LionUiScenarioContext = {},
): TestScenario {
  return {
    name: `system/${systemName}`,
    kind: 'system',
    description: `Minimal example exercising the "${systemName}" system.`,
    prompt: [
      `Add a minimal example to \`${TARGET_FILE}\` that uses the "${systemName}" system of`,
      `@lion/ui (imported from '${entrypointFor(systemName)}'). Follow the conventions in the`,
      'skill: import through the documented @lion/ui entrypoints, never from @lion/* or a deep',
      'import into @lion/ui internals.',
    ].join(' '),
    targetFile: TARGET_FILE,
    files: { [TARGET_FILE]: starterFile(`add an example that uses the "${systemName}" system.`) },
    checks: entrypointChecks(systemName, context.defineEntrypoints ?? []),
  };
}

/**
 * Build the full component + system scenario set.
 * @param options.components component folder names to cover
 * @param options.systems system names to cover (defaults to `SYSTEM_NAMES`)
 * @param options.knownTags custom-element tags confirmed by the CEM (enables tag assertions)
 * @param options.defineEntrypoints names shipping a `define/lion-<name>.js` entrypoint
 * @param options.tagClasses tag -> class name from the CEM (enables behaviour tests)
 */
export function createLionUiScenarios({
  components,
  systems = SYSTEM_NAMES,
  knownTags = [],
  defineEntrypoints = [],
  tagClasses = {},
}: {
  components: string[];
  systems?: string[];
  knownTags?: string[];
  defineEntrypoints?: string[];
  tagClasses?: Record<string, string>;
}): TestScenario[] {
  const context: LionUiScenarioContext = { knownTags, defineEntrypoints, tagClasses };

  const componentScenarios = components
    .filter(name => !NON_VISUAL_COMPONENT_DIRS.includes(name))
    .map(name => createComponentScenario(name, context));

  const systemScenarios = systems
    .filter(name => name !== 'index')
    .map(name => createSystemScenario(name, context));

  return [...componentScenarios, ...systemScenarios];
}
