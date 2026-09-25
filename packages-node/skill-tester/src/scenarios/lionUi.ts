/**
 * Generates one small, isolated scenario per `@lion/ui` component and per system.
 *
 * Each scenario asks for a minimal, self-contained usage example in a single file and asserts
 * the conventions the `lion-ui` skill exists to teach:
 *
 *   - register/import through a real `@lion/ui` entrypoint — either the class entrypoint
 *     (`@lion/ui/<name>.js`) or the side-effect `define/*` entrypoint
 *     (`@lion/ui/define/lion-<name>.js`) the skill tells you to prefer;
 *   - never import a component from `@lion/*` directly;
 *   - never import core Lit utilities from bare `lit`;
 *   - use the component's real custom-element tag, in markup or via `createElement` (only
 *     asserted when the custom elements manifest confirms the tag exists).
 *
 * The accepted entrypoints are derived from the repository (`packages/ui/exports/*`), so the
 * checks assert what this codebase actually ships rather than a hand-maintained list. A real run
 * against a live model showed that asserting only the class entrypoint penalises a correct answer
 * that follows the skill's own "prefer the `define/*` entrypoints" guidance — hence the OR.
 *
 * These conventions are objective, so a run can be scored without hand-authoring a golden file
 * for every one of the ~40 components — and the score directly reflects whether the skill
 * carried the knowledge the model needed.
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

/** Repository facts the generated checks depend on. */
export type LionUiScenarioContext = {
  /** Custom-element tag names confirmed by `packages/ui/custom-elements.json`. */
  knownTags?: string[];
  /** Names that ship a `@lion/ui/define/lion-<name>.js` entrypoint. */
  defineEntrypoints?: string[];
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
  const classImport = `from\\s+['"]@lion/ui/${escaped}\\.js['"]`;
  const defineSupported = defineEntrypoints.includes(name);
  const defineImport = `['"]@lion/ui/define/lion-${escaped}\\.js['"]`;

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
      pattern: `from\\s+['"]@lion/${escaped}['"]`,
      description: `does not import from '@lion/${name}' directly`,
    },
    {
      type: 'notMatches',
      file: TARGET_FILE,
      pattern: `from\\s+['"]lit['"]`,
      description: 'does not import core Lit utilities from bare "lit"',
    },
  ];
}

function starterFile(description: string): string {
  return [
    `// TODO: ${description}`,
    '// Import from @lion/ui entrypoints only (never from @lion/* or bare "lit").',
    'export const example = () => {};',
    '',
  ].join('\n');
}

/**
 * @param componentName folder name under `packages/ui/components`, e.g. `button`
 * @param context repository facts (known tags, available define entrypoints)
 */
export function createComponentScenario(
  componentName: string,
  context: LionUiScenarioContext = {},
): TestScenario {
  const { knownTags = [], defineEntrypoints = [] } = context;
  const tagName = `lion-${componentName}`;
  const checks = entrypointChecks(componentName, defineEntrypoints);
  if (knownTags.includes(tagName)) {
    // Accept the tag in markup or created programmatically: both name the documented element.
    // Asserting only literal markup penalises an otherwise correct example (observed in a real run).
    const escapedTag = escapeRegExp(tagName);
    checks.push({
      type: 'matches',
      file: TARGET_FILE,
      pattern:
        `<${escapedTag}(?:[\\s>/]|$)|createElement\\(\\s*['"]${escapedTag}['"]`,
      description: `uses the <${tagName}> element (markup or createElement)`,
    });
  }

  return {
    name: `component/${componentName}`,
    kind: 'component',
    description: `Minimal usage example for the "${componentName}" component.`,
    prompt: [
      `Add a minimal, correct usage example for the "${componentName}" component to \`${TARGET_FILE}\`.`,
      'It must be a small self-contained example that imports everything it needs from the',
      'correct @lion/ui entrypoints and renders the component with its documented element name.',
      'Follow the conventions in the skill.',
    ].join(' '),
    targetFile: TARGET_FILE,
    files: { [TARGET_FILE]: starterFile(`add a usage example for the "${componentName}" component.`) },
    checks,
  };
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
      'skill: import core Lit utilities from @lion/ui entrypoints, never from @lion/* or bare "lit".',
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
 */
export function createLionUiScenarios({
  components,
  systems = SYSTEM_NAMES,
  knownTags = [],
  defineEntrypoints = [],
}: {
  components: string[];
  systems?: string[];
  knownTags?: string[];
  defineEntrypoints?: string[];
}): TestScenario[] {
  const context: LionUiScenarioContext = { knownTags, defineEntrypoints };

  const componentScenarios = components
    .filter(name => !NON_VISUAL_COMPONENT_DIRS.includes(name))
    .map(name => createComponentScenario(name, context));

  const systemScenarios = systems
    .filter(name => name !== 'index')
    .map(name => createSystemScenario(name, context));

  return [...componentScenarios, ...systemScenarios];
}
