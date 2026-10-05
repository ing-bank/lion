/**
 * Hand-authored scenarios.
 *
 * These complement the generated per-component/system scenarios with tasks that exercise the
 * golden-file and behaviour paths on concrete, bounded repairs.
 *
 * A note on goldens: a golden that nobody executed is the most reliable way to make a benchmark
 * measure fiction, so `expectedTransformedFiles` is always paired with `goldenProvenance` and
 * pinned by a test that runs it through the gates, its checks *and* the behaviour tier.
 */

import type { TestScenario } from './types.ts';

/**
 * Replace a native `<form>` (and its native submit handling) with `lion-form`, the way the
 * `lion-ui` skill's forms guidance requires.
 */
export const nativeFormToLionFormScenario: TestScenario = {
  name: 'integration/native-form-to-lion-form',
  kind: 'integration',
  description: 'Migrate a native form to lion-form with a lion-form submit handler.',
  prompt: [
    'Rewrite `src/login-form.js` so it uses `lion-form` and `@lion/ui` form controls instead of',
    'a native `<form>` and native `<input>` elements. Keep the same fields (email + password) and',
    'the same submit behaviour. Follow the conventions in the skill.',
  ].join(' '),
  targetFile: 'src/login-form.js',
  files: {
    'src/login-form.js': [
      'export function LoginForm() {',
      '  return html`',
      '    <form @submit=${onSubmit}>',
      '      <input name="email" label="Email" />',
      '      <input name="password" type="password" label="Password" />',
      '      <button type="submit">Sign in</button>',
      '    </form>',
      '  `;',
      '}',
      '',
    ].join('\n'),
  },
  checks: [
    { type: 'exists', file: 'src/login-form.js' },
    {
      type: 'matches',
      file: 'src/login-form.js',
      pattern: `from\\s+['\"]@lion/ui/form.js['\"]`,
      description: "imports LionForm from '@lion/ui/form.js'",
    },
    {
      type: 'matches',
      file: 'src/login-form.js',
      pattern: '<lion-form',
      description: 'uses the <lion-form> element',
    },
    {
      type: 'notMatches',
      file: 'src/login-form.js',
      pattern: '<form(\\s|>)',
      description: 'no longer renders a native <form>',
    },
    {
      type: 'notMatches',
      file: 'src/login-form.js',
      pattern: `<input(\\s|/|>)`,
      description: 'no longer renders native <input> elements',
    },
  ],
};

/**
 * Repair a near-miss IBAN field.
 *
 * The starting file is a plausible wrong answer rather than an empty one: it renders a native
 * `<input>` (no validation, not a lion form control) and reaches into `@lion/ui` internals with a
 * deep import — the exact thing the skill's rules forbid ("Never deep-import from
 * `@lion/ui/components/<x>/src/*`"), so the import-policy gate has real teeth here.
 *
 * The prompt is bounded: the class name, the export and the field name are invariants. The golden
 * follows the skill's canonical structure, including the native `<form>` that `lion-form` slots.
 */
export const ibanFieldScenario: TestScenario = {
  name: 'repair/iban-field',
  kind: 'repair',
  description: 'Repair an IBAN field: deep import, native input, no form registration.',
  prompt: [
    'Repair `src/iban-field.js`. It renders a native `<input>` and reaches into `@lion/ui`',
    'internals with a deep import. Make it render a `lion-input-iban` inside a `lion-form` that has',
    'a native `<form>` slotted into it, registering the field on the form under the name `account`.',
    'Keep the class name `IbanField` and its named export, and import only through the documented',
    '`@lion/ui` entrypoints.',
  ].join(' '),
  targetFile: 'src/iban-field.js',
  files: {
    'src/iban-field.js': [
      "import { LitElement, html } from 'lit';",
      "import { LionInputIban } from '@lion/ui/components/input-iban/src/LionInputIban.js';",
      '',
      'export class IbanField extends LitElement {',
      '  render() {',
      "    return html`<input name=\"account\" />`;",
      '  }',
      '}',
      '',
    ].join('\n'),
  },
  expectedTransformedFiles: {
    'src/iban-field.js': [
      "import { LitElement, html } from 'lit';",
      "import '@lion/ui/define/lion-form.js';",
      "import '@lion/ui/define/lion-input-iban.js';",
      '',
      'export class IbanField extends LitElement {',
      '  render() {',
      '    return html`',
      '      <lion-form>',
      '        <form>',
      '          <lion-input-iban name="account" label="Account"></lion-input-iban>',
      '        </form>',
      '      </lion-form>',
      '    `;',
      '  }',
      '}',
      '',
    ].join('\n'),
  },
  goldenProvenance: [
    'Authored by us and executed, not merely reviewed: the golden passes both gates, every check',
    'below, and the behaviour test file in headless Chromium.',
    '`test-node/scenarios.test.ts` ("the repair/iban-field golden passes the gates, its checks and',
    'the behaviour tier") pins this, so the golden cannot silently rot.',
  ].join(' '),
  checks: [
    { type: 'exists', file: 'src/iban-field.js' },
    {
      type: 'matches',
      file: 'src/iban-field.js',
      pattern: '@lion/ui/(define/lion-input-iban|input-iban)\\.js',
      description: 'imports the IBAN field through a documented @lion/ui entrypoint',
    },
    {
      type: 'notMatches',
      file: 'src/iban-field.js',
      pattern: '@lion/ui/components/',
      description: 'no longer deep-imports from @lion/ui internals',
    },
    {
      type: 'matches',
      file: 'src/iban-field.js',
      pattern: '<lion-form',
      description: 'renders a <lion-form>',
    },
    {
      type: 'matches',
      file: 'src/iban-field.js',
      pattern: '<lion-input-iban',
      description: 'renders a <lion-input-iban>',
    },
    {
      type: 'matches',
      file: 'src/iban-field.js',
      pattern: 'name="account"',
      description: 'keeps the field name "account"',
    },
    {
      type: 'matches',
      file: 'src/iban-field.js',
      pattern: 'export class IbanField',
      description: 'keeps the `IbanField` export',
    },
  ],
  behaviour: {
    description: 'the produced component upgrades and registers the field on a lion-form',
    testSource: [
      "import { expect } from '@open-wc/testing';",
      "import { IbanField } from './src/iban-field.js';",
      '',
      "describe('iban-field', () => {",
      "  it('upgrades and registers the field on a lion-form', async () => {",
      '    // The exported class is not self-registering, and the scenario only requires the',
      '    // `IbanField` export as an invariant, so register it before instantiating it.',
      "    if (!customElements.get('iban-field')) {",
      "      customElements.define('iban-field', IbanField);",
      '    }',
      "    const el = document.createElement('iban-field');",
      '    document.body.appendChild(el);',
      '    await el.updateComplete;',
      '',
      "    const form = el.shadowRoot.querySelector('lion-form');",
      "    expect(form, 'renders a <lion-form>').to.not.equal(null);",
      '',
      "    const field = el.shadowRoot.querySelector('lion-input-iban');",
      "    expect(field, 'renders a <lion-input-iban>').to.not.equal(null);",
      '',
      '    await form.updateComplete;',
      "    // Borrowed from the repository's own lion-form tests, which assert registration through",
      '    // `form.formElements.<name>` rather than a `.form` property on the field.',
      '    expect(',
      '      form.formElements.account,',
      `      'field is registered on the form under the name "account"',`,
      '    ).to.not.equal(undefined);',
      '  });',
      '});',
      '',
    ].join('\n'),
  },
};

export const manualScenarios: TestScenario[] = [
  nativeFormToLionFormScenario,
  ibanFieldScenario,
];
