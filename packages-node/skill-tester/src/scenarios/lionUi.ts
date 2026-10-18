/**
 * Generates one small, isolated scenario per `@lion/ui` component and per system.
 *
 * ## The component contract
 *
 * A component scenario asks for a **component file**: one file that exports a class, renders the
 * component's documented element in its own template, and carries its own scoped element registry.
 * This replaced an earlier contract where the file exported a render *function* and the harness
 * supplied a host element to mount it in.
 *
 * The old contract was not neutral: the assertion "the component ends up in a scoped registry" was
 * satisfied by the host the *harness* wrote, not by the produced code. A model that imported the
 * class and called it a day passed. With a component file the produced code owns its rendering, so
 * the behaviour test mounts what the model actually wrote.
 *
 * ## The convention checks
 *
 * `entrypointChecks` asserts the import rules the `lion-ui` skill exists to teach:
 *
 *   - import through a real `@lion/ui` entrypoint — either the class entrypoint
 *     (`@lion/ui/<name>.js`) or the side-effect `define/*` entrypoint
 *     (`@lion/ui/define/lion-<name>.js`);
 *   - never import a component from `@lion/*` directly;
 *   - never deep-import into `@lion/ui` internals (`@lion/ui/components/**`, `@lion/ui/src/**`),
 *     which is the import rule the skill actually states. Bare `lit` is NOT a violation:
 *     `@lion/ui/core.js` exports only mixins and utilities (no `LitElement`/`html`/`css`), and the
 *     skill's own canonical example is `import { html } from 'lit';`.
 *
 * Beyond that, a component scenario asserts the declared class is exported, that the documented tag
 * is used (markup or `createElement`), and that nothing else was written. The tag assertion is only
 * added when the custom elements manifest confirms the tag exists.
 *
 * ## Behaviour
 *
 * When the manifest confirms both a tag and its class, a behaviour test is attached. It imports the
 * *produced file*, mounts the produced class, and asserts the documented element is rendered and
 * upgraded. Two consequences, both deliberate:
 *
 *   - the mount reuses the produced file's own registration when it registers itself, and defines
 *     its own tag otherwise — registering the same constructor twice throws `NotSupportedError`,
 *     which would fail the whole module with an unhelpful message;
 *   - the harness supplies no host, so the scoped registry in play is the one the produced code
 *     created. `customElements.get('<tag>')` must therefore not be used as a probe.
 *
 * System scenarios keep the earlier render-function contract: they carry no behaviour test, so
 * nothing depended on the host.
 *
 * The accepted entrypoints and the tag/class facts are derived from the repository
 * (`packages/ui/exports/*`, `custom-elements.json`), so the checks assert what this codebase
 * actually ships rather than a hand-maintained list.
 */

import { COMPONENT_SYNONYMS } from '../../../../scripts/lib/component-synonyms.mjs';
import type { TestScenario, ScenarioCheck } from './types.ts';

/** Component folders under `packages/ui/components` that are not standalone visual components. */
export /**
 * User-facing descriptions + synonyms per component, used to build the goal of the generated
 * prompts. The prompt must describe what the user wants and let the model resolve it to the right
 * @lion/ui component - it must NOT name the component or its tag, otherwise it leaks the answer and
 * stops testing whether the skill teaches the mapping.
 */
const COMPONENT_PROMPTS: Record<string, { description: string; synonyms: string[] }> = {
  accordion: { description: 'a vertically stacked set of interactive headings, each revealing a section of content', synonyms: ['accordion', 'expandable headings', 'disclosure sections'] },
  button: { description: 'a clickable button', synonyms: ['button', 'action button'] },
  calendar: { description: 'a calendar widget to pick a date', synonyms: ['calendar', 'date grid'] },
  'checkbox-group': { description: 'a group of checkboxes', synonyms: ['checkbox group', 'multiple choices'] },
  collapsible: { description: 'a section that expands and collapses', synonyms: ['collapsible', 'expandable section'] },
  combobox: { description: 'a text input with a dropdown list of suggestions', synonyms: ['combobox', 'autocomplete', 'dropdown input'] },
  dialog: { description: 'a modal window on top of the page', synonyms: ['dialog', 'modal', 'popup'] },
  drawer: { description: 'a panel that slides in from the side', synonyms: ['drawer', 'side panel', 'off-canvas'] },
  fieldset: { description: 'a labelled group of related fields', synonyms: ['fieldset', 'field group'] },
  form: { description: 'a form that manages its fields', synonyms: ['form', 'form wrapper'] },
  input: { description: 'a single-line text input', synonyms: ['input', 'text field'] },
  'input-amount': { description: 'a field for entering a monetary amount', synonyms: ['amount input', 'money field'] },
  'input-amount-dropdown': { description: 'an amount field with a currency selector', synonyms: ['amount with currency', 'currency amount input'] },
  'input-date': { description: 'a date input', synonyms: ['date input', 'date field'] },
  'input-datepicker': { description: 'a date input that opens a calendar picker', synonyms: ['datepicker', 'date picker field'] },
  'input-email': { description: 'an email address input', synonyms: ['email input', 'email field'] },
  'input-file': { description: 'a file upload control', synonyms: ['file input', 'file picker', 'upload'] },
  'input-iban': { description: 'an IBAN account number input', synonyms: ['IBAN field', 'bank account number input'] },
  'input-range': { description: 'a slider to pick a value in a range', synonyms: ['range slider', 'slider'] },
  'input-stepper': { description: 'a number input with increment and decrement buttons', synonyms: ['stepper', 'number stepper'] },
  'input-tel': { description: 'a telephone number input', synonyms: ['phone input', 'tel field'] },
  'input-tel-dropdown': { description: 'a phone input with a country-code selector', synonyms: ['phone with country code', 'tel dropdown'] },
  listbox: { description: 'a list of options with a single selection', synonyms: ['listbox', 'option list'] },
  menu: { description: 'a menu of items with keyboard navigation', synonyms: ['menu', 'dropdown menu'] },
  pagination: { description: 'page navigation controls', synonyms: ['pagination', 'pager', 'page numbers'] },
  'progress-indicator': { description: 'a progress indicator', synonyms: ['progress bar', 'spinner', 'loading indicator'] },
  'radio-group': { description: 'a group of radio buttons', synonyms: ['radio group', 'single choice'] },
  select: { description: 'a dropdown select', synonyms: ['select', 'dropdown'] },
  'select-rich': { description: 'a select with fully custom options', synonyms: ['rich select', 'custom dropdown'] },
  steps: { description: 'a multi-step progress indicator', synonyms: ['steps', 'step indicator', 'wizard steps'] },
  switch: { description: 'an on/off switch', synonyms: ['switch', 'toggle'] },
  tabs: { description: 'a set of tabs with panels', synonyms: ['tabs', 'tab panel'] },
  textarea: { description: 'a multi-line text input', synonyms: ['textarea', 'multi-line input'] },
  tooltip: { description: 'a small popup with extra information', synonyms: ['tooltip', 'hint popup'] },
};

function goalPrompt(componentName: string): string {
  const entry = COMPONENT_SYNONYMS[componentName];
  if (!entry) return `Goal: a component that renders the documented lion component for ${componentName}.`;
  return `Goal: ${entry.description}.`;
}

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

/** The file system scenarios still write; their contract is unchanged. */
const SYSTEM_TARGET_FILE = 'src/example.js';

/** The produced component file: `my-accordion` -> `src/my-accordion.js`. */
export function targetFileFor(componentName: string): string {
  return `src/my-${componentName}.js`;
}

/** The class the produced file must export: `my-accordion` -> `MyAccordion`. */
export function classNameFor(componentName: string): string {
  const pascal = componentName
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `My${pascal}`;
}

/** The tag the produced file registers itself under, if it registers one at all. */
export function ownTagFor(componentName: string): string {
  return `my-${componentName}`;
}

/** The tag the behaviour test defines when the produced file does not register itself. */
export function testTagFor(componentName: string): string {
  return `test-my-${componentName}`;
}

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
 * The import-policy checks, which every scenario shares. The caller adds `exists` and
 * `noExtraFiles` around them, plus whatever else its own contract demands.
 *
 * Accept both ways the skill documents: importing the class (`from '@lion/ui/x.js'`) and
 * registering the element (`import '@lion/ui/define/lion-x.js'`).
 */
function entrypointChecks(
  file: string,
  name: string,
  defineEntrypoints: string[] = [],
): ScenarioCheck[] {
  const escaped = escapeRegExp(name);
  const classImport = `from\\s+['"]@lion/ui/${escaped}\\.js['"]`;
  const defineSupported = defineEntrypoints.includes(name);
  const defineImport = `['"]@lion/ui/define/lion-${escaped}\\.js['"]`;

  return [
    {
      type: 'matches',
      file,
      pattern: defineSupported ? `${classImport}|${defineImport}` : classImport,
      description: defineSupported
        ? `imports '${entrypointFor(name)}' or '${defineEntrypointFor(name)}'`
        : `imports '${entrypointFor(name)}'`,
    },
    {
      type: 'notMatches',
      file,
      pattern: `from\\s+['"]@lion/${escaped}['"]`,
      description: `does not import from '@lion/${name}' directly`,
    },
    {
      type: 'notMatches',
      file,
      pattern: '@lion/ui/(components|src)/',
      description: 'does not deep-import from @lion/ui internals',
    },
  ];
}

function declarationChecks(file: string): ScenarioCheck[] {
  return [
    { type: 'exists', file },
    {
      type: 'noExtraFiles',
      file,
      description: 'creates no files other than the deliverable',
    },
  ];
}

function starterFile(description: string): string {
  // Deliberately EMPTY apart from the TODO: a stub that imports something, or states a convention,
  // pre-answers the checks that assert that convention and makes them self-fulfilling. The
  // scenario linter (L6) enforces this.
  return [`// TODO: ${description}`, ''].join('\n');
}

/**
 * A behaviour test for a component, written against the **produced file**.
 *
 * It mounts the produced class directly. When the produced file registers that class itself, its
 * tag is reused; otherwise the test defines one of its own. No host is supplied, so the scoped
 * registry in play belongs to the produced code.
 */
function componentBehaviour(
  componentName: string,
  tagName: string,
  className: string,
): NonNullable<TestScenario['behaviour']> {
  const targetFile = targetFileFor(componentName);
  const producedClass = classNameFor(componentName);
  const ownTag = ownTagFor(componentName);
  const testTag = testTagFor(componentName);

  return {
    description: `the produced component renders <${tagName}>`,
    testSource: [
      "import { expect, fixture } from '@open-wc/testing';",
      `import { ${className} } from '${entrypointFor(componentName)}';`,
      `import { ${producedClass} } from './${targetFile}';`,
      '',
      '// The produced file may register the class itself under its own tag. Registering the same',
      '// constructor twice throws NotSupportedError, which would fail the whole test module with an',
      '// unhelpful message, so reuse any registration before defining a tag of our own.',
      `const own = '${testTag}';`,
      `const derived = '${ownTag}';`,
      'const mount = () => {',
      "  if (customElements.get(own)) return fixture('<' + own + '></' + own + '>');",
      `  if (customElements.get(derived) === ${producedClass}) {`,
      "    return fixture('<' + derived + '></' + derived + '>');",
      '  }',
      '  try {',
      `    customElements.define(own, ${producedClass});`,
      '  } catch (error) {',
      "    throw new Error('the produced file registered the class under an unknown tag: ' + error);",
      '  }',
      "  return fixture('<' + own + '></' + own + '>');",
      '};',
      '',
      `describe('component/${componentName}', () => {`,
      `  it('renders <${tagName}> from the produced component', async () => {`,
      '    const el = await mount();',
      '    const root = el.shadowRoot ?? el;',
      `    const rendered = root.querySelector('${tagName}');`,
      `    expect(rendered, 'the component renders <${tagName}>').to.not.equal(null);`,
      `    expect(rendered, 'the scoped registry upgraded it').to.be.instanceOf(${className});`,
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
  const targetFile = targetFileFor(componentName);
  const producedClass = classNameFor(componentName);
  const [exists, noExtraFiles] = declarationChecks(targetFile);

  const checks: ScenarioCheck[] = [
    exists,
    {
      type: 'matches',
      file: targetFile,
      pattern: `export class ${producedClass}`,
      description: `exports the class \`${producedClass}\``,
    },
    ...entrypointChecks(targetFile, componentName, defineEntrypoints),
  ];

  const tagConfirmed = knownTags.includes(tagName);
  if (tagConfirmed) {
    // Accept the tag in markup or created programmatically: both name the documented element.
    // Asserting only literal markup penalises an otherwise correct example (observed in a real run).
    const escapedTag = escapeRegExp(tagName);
    checks.push({
      type: 'matches',
      file: targetFile,
      pattern: `<${escapedTag}(?:[\\s>/]|$)|createElement\\(\\s*['"]${escapedTag}['"]`,
      description: `uses the <${tagName}> element (markup or createElement)`,
    });
  }

  checks.push({
    type: 'noUnusedImports',
    file: targetFile,
    description: 'imports nothing it does not use',
  });
  // Consumption is measured, not prompted: the slimmer prompt no longer says how to consume, so the
  // harness must still pin it. A subclass is a supported path but out of scope here, and a global
  // define entrypoint opts out of the host's scoped registry.
  checks.push({
    type: 'notMatches',
    file: targetFile,
    pattern: '@lion/ui/define/',
    description: 'does not use a global define entrypoint',
  });
  checks.push({
    type: 'notMatches',
    file: targetFile,
    pattern: 'extends\\s+Lion[A-Za-z]*',
    description: 'consumes lion rather than subclassing it',
  });
  checks.push(noExtraFiles);

  const scenario: TestScenario = {
    name: `component/${componentName}`,
    kind: 'component',
    description: `Minimal component file for the "${componentName}" component.`,
    prompt: [
      `Create \`${targetFile}\`. Create that file only — nothing else.`,
      `It must export a class named \`${producedClass}\`.`,
      goalPrompt(componentName),
    ].join(' '),
    targetFile,
    files: {
      [targetFile]: starterFile(`create the "${componentName}" component in this file.`),
    },
    checks,
  };

  // The behaviour test needs the class the produced file composes, to check it was upgraded.
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
  const [exists, noExtraFiles] = declarationChecks(SYSTEM_TARGET_FILE);

  return {
    name: `system/${systemName}`,
    kind: 'system',
    description: `Minimal example exercising the "${systemName}" system.`,
    prompt: [
      `Add a minimal example to \`${SYSTEM_TARGET_FILE}\` that uses the "${systemName}" system of @lion/ui.`,
      'Create that file only — nothing else.',
    ].join(' '),
    targetFile: SYSTEM_TARGET_FILE,
    files: {
      [SYSTEM_TARGET_FILE]: starterFile(`add an example that uses the "${systemName}" system.`),
    },
    checks: [
      exists,
      ...entrypointChecks(SYSTEM_TARGET_FILE, systemName, context.defineEntrypoints ?? []),
      {
        type: 'noUnusedImports',
        file: SYSTEM_TARGET_FILE,
        description: 'imports nothing it does not use',
      },
      {
        type: 'notMatches',
        file: SYSTEM_TARGET_FILE,
        pattern: '@lion/ui/define/',
        description: 'does not use a global define entrypoint',
      },
      noExtraFiles,
    ],
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
