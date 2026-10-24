/**
 * The first concrete component runs, hand-authored so the assertion pattern can be evaluated on a
 * couple of components before it is generalised to the rest.
 *
 * The shared shape, learned from the runs:
 *
 *   - the prompt is generic and goal-oriented: it names the file, the exported class and the goal —
 *     never an internal library concept. The class name is derived from the prompt for a new file;
 *     a repair of an existing file keeps the name that is already there.
 *   - the companion test asserts, in this order:
 *       1. the RIGHT TAG was rendered (the component choice — e.g. lion-input-iban rather than a
 *          native <input> or a plain lion-input);
 *       2. the element is an INSTANCE of the expected class (it upgraded to the real component);
 *       3. the PROPS/ATTRS the prompt explicitly demanded (a label, a prefill, section structure).
 *     It deliberately does NOT re-assert component functionality that lion's own unit tests already
 *     cover (e.g. IBAN validation) — that measures the library, not the skill.
 *   - the answer is always CONSUMPTION: compose lion's documented elements. Subclassing a lion base
 *     class is a supported path, but it is a subclasser's job (own tag names, own branding/styling)
 *     and out of scope for these tests, so a scenario does not reward it. The prompt never has to say
 *     so — steering to the documented path is exactly what the skill under test is for.
 *   - the test accepts either a shadow-root or a light-dom answer (`el.shadowRoot ?? el`), because
 *     which one is correct depends on the prompt: a component that CARRIES a form control and must be
 *     usable inside a form renders into light dom, any other component keeps its shadow root.
 */

import type { TestScenario } from './types.ts';

/**
 * A form, built from scratch, that carries an IBAN field.
 *
 * Two things are measured at once. The COMPONENT CHOICE: the prompt never says which component to
 * use, so a native `<input>` or a plain `lion-input` is a wrong answer even though it renders. And
 * the FORM CONTEXT: the deliverable is a parent of a form control, which is the one documented case
 * where light DOM is required — so this is where the skill's rule about `createRenderRoot` is put
 * under a real browser instead of being trusted.
 */
export const ibanInFormScenario: TestScenario = {
  name: 'form/iban-in-form',
  kind: 'component',
  description:
    'Create a form from scratch that carries a prefilled, labelled IBAN field, composed from lion.',
  prompt: [
    'Create `src/my-form.js`. Create that file only — nothing else.',
    'It must export a class named `MyForm`.',
    'Goal: a form with a field where a user can enter an IBAN account number.',
    'Give the field the label "Account" and prefill it with NL17INGB0002822608.',
  ].join(' '),
  targetFile: 'src/my-form.js',
  files: {
    'src/my-form.js': '// TODO: create `MyForm` here.\n',
  },
  checks: [
    { type: 'exists', file: 'src/my-form.js' },
    {
      type: 'matches',
      file: 'src/my-form.js',
      pattern: 'export class MyForm',
      description: 'exports the class `MyForm`',
    },
    {
      type: 'matches',
      file: 'src/my-form.js',
      pattern: '@lion/ui/input-iban\\.js',
      description: 'imports the IBAN input through its documented class entrypoint',
    },
    {
      type: 'matches',
      file: 'src/my-form.js',
      pattern: '(<lion-form|@lion/ui/form\\.js)',
      description: 'gives the field a lion form context',
    },
    {
      type: 'matches',
      file: 'src/my-form.js',
      pattern: '(<lion-input-iban|LionInputIban)',
      description: 'uses the lion IBAN input (composed; the behaviour test proves it renders)',
    },
    {
      type: 'notMatches',
      file: 'src/my-form.js',
      pattern: 'extends\\s+Lion[A-Za-z]*',
      description: 'consumes lion rather than subclassing it',
    },
    {
      type: 'notMatches',
      file: 'src/my-form.js',
      pattern: '@lion/ui/define/',
      description: 'does not use a global define entrypoint',
    },
    {
      type: 'notMatches',
      file: 'src/my-form.js',
      pattern: '<(input|select|textarea)(\\s|/|>)',
      description: 'does not fall back to a native form control',
    },
    {
      type: 'matches',
      file: 'src/my-form.js',
      pattern: 'NL17INGB0002822608',
      description: 'prefills the field with the requested value',
    },
    {
      type: 'noUnusedImports',
      file: 'src/my-form.js',
      description: 'imports nothing it does not use',
    },
    {
      type: 'noExtraFiles',
      file: 'src/my-form.js',
      description: 'creates no files other than the deliverable',
    },
  ],
  behaviour: {
    description:
      'the lion form carries an upgraded lion IBAN input with the requested label and prefill',
    testSource: [
      "import { expect, fixture } from '@open-wc/testing';",
      "import { LionForm } from '@lion/ui/form.js';",
      "import { LionInputIban } from '@lion/ui/input-iban.js';",
      "import { MyForm } from './src/my-form.js';",
      '',
      '// The produced file may register the class itself under its own tag. Registering the same',
      '// constructor twice throws NotSupportedError, which would fail the whole test module with an',
      '// unhelpful message, so reuse any registration before defining a tag of our own.',
      "const own = 'test-my-form';",
      "const derived = 'my-form';",
      'const mount = () => {',
      "  if (customElements.get(own)) return fixture('<' + own + '></' + own + '>');",
      '  if (customElements.get(derived) === MyForm) {',
      "    return fixture('<' + derived + '></' + derived + '>');",
      '  }',
      '  try {',
      '    customElements.define(own, MyForm);',
      '  } catch (error) {',
      "    throw new Error('the produced file registered the class under an unknown tag: ' + error);",
      '  }',
      "  return fixture('<' + own + '></' + own + '>');",
      '};',
      '',
      '// A component that carries a form control has to render into light DOM for the control to',
      '// register upward into the form, so the assertion reads through either root and targets the',
      '// outcome the prompt demands: the lion form, the real IBAN input inside it, labelled and',
      '// prefilled. A native input, a plain lion-input, or a subclassed field still fails.',
      'const rootOf = el => el.shadowRoot ?? el;',
      '',
      "describe('form/iban-in-form', () => {",
      "  it('renders the lion form with the real lion IBAN input inside it', async () => {",
      '    const el = await mount();',
      '    const root = rootOf(el);',
      "    const form = root.querySelector('lion-form');",
      "    expect(form, 'the form context uses lion-form').to.not.equal(null);",
      "    expect(form, 'it is the real component, upgraded').to.be.instanceOf(LionForm);",
      "    const field = root.querySelector('lion-input-iban');",
      "    expect(field, 'the right component was chosen').to.not.equal(null);",
      "    expect(field, 'it is the real component, upgraded').to.be.instanceOf(LionInputIban);",
      '  });',
      '',
      "  it('applies the requested label and prefill', async () => {",
      '    const el = await mount();',
      "    const field = rootOf(el).querySelector('lion-input-iban');",
      `    expect(field.label, 'labelled "Account"').to.equal('Account');`,
      "    expect(field.modelValue, 'prefilled').to.equal('NL17INGB0002822608');",
      '  });',
      '});',
      '',
    ].join('\n'),
  },
};

/**
 * A container: two sections of content, each behind a clickable heading. The per-component
 * assertion here is COMPOSITION — the documented invoker/content slot pairs survive — not the
 * component's internal behaviour.
 */
export const accordionScenario: TestScenario = {
  name: 'component/accordion-run',
  kind: 'component',
  description: 'Create an accordion with two sections, using the documented slot structure.',
  prompt: [
    'Create `src/my-accordion.js`. Create that file only — nothing else.',
    'It must export a class named `MyAccordion`.',
    'Goal: a user can reveal two sections of content, each behind its own clickable heading.',
  ].join(' '),
  targetFile: 'src/my-accordion.js',
  files: {
    'src/my-accordion.js': '// TODO: create `MyAccordion` here.\n',
  },
  checks: [
    { type: 'exists', file: 'src/my-accordion.js' },
    {
      type: 'matches',
      file: 'src/my-accordion.js',
      pattern: 'export class MyAccordion',
      description: 'exports the class `MyAccordion`',
    },
    {
      type: 'matches',
      file: 'src/my-accordion.js',
      pattern: '@lion/ui/(define/lion-accordion|accordion)\\.js',
      description: 'imports the accordion through a documented @lion/ui entrypoint',
    },
    {
      type: 'matches',
      file: 'src/my-accordion.js',
      pattern: '(<lion-accordion|LionAccordion)',
      description: 'uses the lion accordion (composed; the behaviour test proves it renders)',
    },
    {
      type: 'matches',
      file: 'src/my-accordion.js',
      pattern: 'slot="invoker"',
      description: 'provides the documented invoker slots',
    },
    {
      type: 'matches',
      file: 'src/my-accordion.js',
      pattern: 'slot="content"',
      description: 'provides the documented content slots',
    },
    {
      type: 'notMatches',
      file: 'src/my-accordion.js',
      pattern: '@lion/ui/(components|src)/',
      description: 'does not deep-import from @lion/ui internals',
    },
    {
      type: 'noUnusedImports',
      file: 'src/my-accordion.js',
      description: 'imports nothing it does not use',
    },
    {
      type: 'noExtraFiles',
      file: 'src/my-accordion.js',
      description: 'creates no files other than the deliverable',
    },
  ],
  behaviour: {
    description: 'the accordion is used, upgraded, and provides two invoker/content sections',
    testSource: [
      "import { expect, fixture } from '@open-wc/testing';",
      "import { LionAccordion } from '@lion/ui/accordion.js';",
      "import { MyAccordion } from './src/my-accordion.js';",
      '',
      '// The produced file may register the class itself under its own tag. Registering the same',
      '// constructor twice throws NotSupportedError, which would fail the whole test module with an',
      '// unhelpful message, so reuse any registration before defining a tag of our own.',
      "const own = 'test-my-accordion';",
      "const derived = 'my-accordion';",
      'const mount = () => {',
      "  if (customElements.get(own)) return fixture('<' + own + '></' + own + '>');",
      '  if (customElements.get(derived) === MyAccordion) {',
      "    return fixture('<' + derived + '></' + derived + '>');",
      '  }',
      '  try {',
      '    customElements.define(own, MyAccordion);',
      '  } catch (error) {',
      "    throw new Error('the produced file registered the class under an unknown tag: ' + error);",
      '  }',
      "  return fixture('<' + own + '></' + own + '>');",
      '};',
      '',
      "describe('component/accordion-run', () => {",
      "  it('renders <lion-accordion>, upgraded', async () => {",
      '    const el = await mount();',
      '    const root = el.shadowRoot ?? el;',
      "    const accordion = root.querySelector('lion-accordion');",
      "    expect(accordion, 'the right component was chosen').to.not.equal(null);",
      "    expect(accordion, 'it is the real component, upgraded').to.be.instanceOf(LionAccordion);",
      '  });',
      '',
      "  it('provides two wired invoker/content sections', async () => {",
      '    const el = await mount();',
      '    const root = el.shadowRoot ?? el;',
      '    // Measured: lion-accordion REWRITES the user markup on upgrade. The authored',
      '    // slot="invoker" / slot="content" become slot="_accordion" plus class="invoker" /',
      '    // class="content", and the invoker button receives its aria wiring.',
      `    expect(root.querySelectorAll('lion-accordion .invoker').length, 'two invokers').to.equal(2);`,
      `    expect(root.querySelectorAll('lion-accordion .content').length, 'two sections').to.equal(2);`,
      `    const button = root.querySelector('lion-accordion .invoker button');`,
      `    expect(`,
      `      button && button.getAttribute('aria-expanded'),`,
      `      'the invoker is wired to its section',`,
      `    ).to.not.equal(null);`,
      '  });',
      '});',
      '',
    ].join('\n'),
  },
};

export const runScenarios: TestScenario[] = [ibanInFormScenario, accordionScenario];