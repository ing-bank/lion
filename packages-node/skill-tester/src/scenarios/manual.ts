/**
 * Hand-authored scenarios.
 *
 * These complement the generated per-component/system scenarios with tasks that exercise the
 * golden-file scoring path (exact / normalized / similarity) and slightly richer integrations.
 */

import type { TestScenario } from './types.ts';

/**
 * Harness smoke test carried over from the original proof of concept. Deliberately tiny and
 * paired with a golden file so the exact/normalized/similarity scoring path can be verified
 * without an LLM: pair it with a mock endpoint to assert the whole loop end to end.
 */
export const buttonToBlobScenario: TestScenario = {
  name: 'integration/poc-button-to-blob',
  kind: 'integration',
  description: 'Golden-file smoke test: rename a button usage to the blob component.',
  prompt: 'Convert the button component to the blob component.',
  targetFile: 'src/MyButtonApp.js',
  files: {
    'src/MyButtonApp.js': `
      import { LionButton } from '@lion/ui/button.js';
      import { LitElement, ScopedElementsMixin } from '@lion/ui/core.js';

      export class MyButtonApp extends ScopedElementsMixin(LitElement) {
        scopedElements = {
          'lion-button': LionButton,
        };

        render() {
          return html\`
            <lion-button variation="primary-medium">Click me</lion-button>
          \`;
        }

        handleClick() {
          console.log('Button clicked!');
        }
      }
      `,
  },
  expectedTransformedFiles: {
    'src/MyButtonApp.js': `
      import { LionBlob } from '@lion/ui/blob.js';
      import { LitElement, ScopedElementsMixin } from '@lion/ui/core.js';

      export class MyButtonApp extends ScopedElementsMixin(LitElement) {
        scopedElements = {
          'lion-blob': LionBlob,
        };

        render() {
          return html\`
            <lion-blob><button>Click me</button></lion-blob>
          \`;
        }

        handleClick() {
          console.log('Button clicked!');
        }
      }
      `,
  },
};

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
      "  return html`",
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
      pattern: `from\\s+['"]${'@lion/ui/form.js'}['"]`,
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

export const manualScenarios: TestScenario[] = [
  buttonToBlobScenario,
  nativeFormToLionFormScenario,
];
