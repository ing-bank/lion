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
 *   - the test accepts either a shadow-root or a light-dom answer (`el.shadowRoot ?? el`), because
 *     which one is correct depends on the prompt: a sub form inside a form must render into light
 *     dom, a contained form must not.
 */

import type { TestScenario } from './types.ts';

/**
 * A field where a user can enter an IBAN. The point of the scenario is the COMPONENT CHOICE: the
 * prompt never says which component to use, so a native `<input>` or a plain `lion-input` is a
 * wrong answer even though it renders.
 */
export const ibanFieldScenario: TestScenario = {
  name: 'field/iban-field',
  kind: 'component',
  description: 'Create a prefilled, labelled IBAN field, choosing the right @lion/ui component.',
  prompt: [
    'Create `src/my-iban-field.js`. Create that file only — nothing else.',
    'It must export a class named `MyIbanField`.',
    'Goal: a field where a user can enter an IBAN account number.',
    'Give it the label "Account" and prefill it with NL17INGB0002822608.',
  ].join(' '),
  targetFile: 'src/my-iban-field.js',
  files: {
    'src/my-iban-field.js': '// TODO: create `MyIbanField` here.\n',
  },
  checks: [
    { type: 'exists', file: 'src/my-iban-field.js' },
    {
      type: 'matches',
      file: 'src/my-iban-field.js',
      pattern: 'export class MyIbanField',
      description: 'exports the class `MyIbanField`',
    },
    {
      type: 'matches',
      file: 'src/my-iban-field.js',
      pattern: '@lion/ui/(define/lion-input-iban|input-iban)\\.js',
      description: 'imports the IBAN input through a documented @lion/ui entrypoint',
    },
    {
      type: 'matches',
      file: 'src/my-iban-field.js',
      pattern: '(<lion-input-iban|extends\\s+LionInputIban)',
      description: 'uses the lion IBAN input (composed or subclassed)',
    },
    {
      type: 'notMatches',
      file: 'src/my-iban-field.js',
      pattern: '<(input|select|textarea)(\\s|/|>)',
      description: 'does not fall back to a native form control',
    },
    {
      type: 'matches',
      file: 'src/my-iban-field.js',
      pattern: 'NL17INGB0002822608',
      description: 'prefills the field with the requested value',
    },
    {
      type: 'noExtraFiles',
      file: 'src/my-iban-field.js',
      description: 'creates no files other than the deliverable',
    },
  ],
  behaviour: {
    description: 'the right component is used, upgraded, and carries the requested label + prefill',
    testSource: [
      "import { expect, fixture } from '@open-wc/testing';",
      "import { LionInputIban } from '@lion/ui/input-iban.js';",
      "import { MyIbanField } from './src/my-iban-field.js';",
      '',
      '// The produced file may register the class itself under its own tag. Registering the same',
      '// constructor twice throws NotSupportedError, which would fail the whole test module with an',
      '// unhelpful message, so reuse any registration before defining a tag of our own.',
      "const own = 'test-my-iban-field';",
      "const derived = 'my-iban-field';",
      'const mount = () => {',
      "  if (customElements.get(own)) return fixture('<' + own + '></' + own + '>');",
      '  if (customElements.get(derived) === MyIbanField) {',
      "    return fixture('<' + derived + '></' + derived + '>');",
      '  }',
      '  try {',
      '    customElements.define(own, MyIbanField);',
      '  } catch (error) {',
      "    throw new Error('the produced file registered the class under an unknown tag: ' + error);",
      '  }',
      "  return fixture('<' + own + '></' + own + '>');",
      '};',
      '',
      '// The prompt asks for a field a user can type an IBAN into; it does not prescribe whether that',
      '// field is composed inside the component or is the component. Both are valid answers (measured),',
      '// so the assertion targets the outcome the prompt demands: an upgraded lion IBAN input, carried',
      '// by the element, labelled and prefilled. A native input or a plain lion-input still fails.',
      'const fieldOf = el =>',
      "  el instanceof LionInputIban ? el : (el.shadowRoot ?? el).querySelector('lion-input-iban');",
      '',
      "describe('field/iban-field', () => {",
      "  it('uses the real lion IBAN input, upgraded (composed or subclassed)', async () => {",
      '    const el = await mount();',
      '    const field = fieldOf(el);',
      "    expect(field, 'the right component was chosen').to.not.equal(null);",
      "    expect(field, 'it is the real component, upgraded').to.be.instanceOf(LionInputIban);",
      '  });',
      '',
      "  it('applies the requested label and prefill', async () => {",
      '    const el = await mount();',
      '    const field = fieldOf(el);',
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
      pattern: '<lion-accordion',
      description: 'renders <lion-accordion>',
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

export const runScenarios: TestScenario[] = [ibanFieldScenario, accordionScenario];
