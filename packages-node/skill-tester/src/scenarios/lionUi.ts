/**
 * Generates one small, isolated scenario per `@lion/ui` component and per system.
 *
 * Each scenario asks for a minimal, self-contained usage example in a single file and asserts
 * the conventions the `lion-ui` skill exists to teach:
 *
 *   - import from the correct `@lion/ui/*` entrypoint;
 *   - never import a component from `@lion/*` directly;
 *   - never import core Lit utilities from bare `lit`;
 *   - use the component's real custom-element tag (only asserted when the custom elements
 *     manifest confirms the tag exists).
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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** The `@lion/ui` entrypoint for a component/system, e.g. `input-amount` -> `@lion/ui/input-amount.js`. */
export function entrypointFor(name: string): string {
  return `@lion/ui/${name}.js`;
}

function baseChecks(name: string): ScenarioCheck[] {
  const entrypoint = entrypointFor(name);
  return [
    { type: 'exists', file: TARGET_FILE },
    {
      type: 'matches',
      file: TARGET_FILE,
      pattern: `from\\s+['"]${escapeRegExp(entrypoint)}['"]`,
      description: `imports from '${entrypoint}'`,
    },
    {
      type: 'notMatches',
      file: TARGET_FILE,
      pattern: `from\\s+['"]@lion/${escapeRegExp(name)}['"]`,
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
 * @param knownTags custom-element tag names confirmed by `packages/ui/custom-elements.json`
 */
export function createComponentScenario(
  componentName: string,
  knownTags: string[] = [],
): TestScenario {
  const tagName = `lion-${componentName}`;
  const checks = baseChecks(componentName);
  if (knownTags.includes(tagName)) {
    checks.push({
      type: 'contains',
      file: TARGET_FILE,
      value: `<${tagName}`,
      description: `uses the <${tagName}> element`,
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
 */
export function createSystemScenario(systemName: string): TestScenario {
  const entrypoint = entrypointFor(systemName);
  return {
    name: `system/${systemName}`,
    kind: 'system',
    description: `Minimal example exercising the "${systemName}" system.`,
    prompt: [
      `Add a minimal example to \`${TARGET_FILE}\` that uses the "${systemName}" system of`,
      `@lion/ui (imported from '${entrypoint}'). Follow the conventions in the skill: import`,
      'core Lit utilities from @lion/ui entrypoints, never from @lion/* or bare "lit".',
    ].join(' '),
    targetFile: TARGET_FILE,
    files: { [TARGET_FILE]: starterFile(`add an example that uses the "${systemName}" system.`) },
    checks: baseChecks(systemName),
  };
}

/**
 * Build the full component + system scenario set.
 * @param options.components component folder names to cover
 * @param options.systems system names to cover (defaults to `SYSTEM_NAMES`)
 * @param options.knownTags custom-element tags confirmed by the CEM (enables tag assertions)
 */
export function createLionUiScenarios({
  components,
  systems = SYSTEM_NAMES,
  knownTags = [],
}: {
  components: string[];
  systems?: string[];
  knownTags?: string[];
}): TestScenario[] {
  const componentScenarios = components
    .filter(name => !NON_VISUAL_COMPONENT_DIRS.includes(name))
    .map(name => createComponentScenario(name, knownTags));

  const systemScenarios = systems
    .filter(name => name !== 'index')
    .map(name => createSystemScenario(name));

  return [...componentScenarios, ...systemScenarios];
}
