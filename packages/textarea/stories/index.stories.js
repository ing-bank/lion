import { storiesOf, html } from '@open-wc/demoing-storybook';
import { Required, MinLength, MaxLength } from '@lion/validate';
import '../lion-textarea.js';

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

storiesOf('Forms|Textarea', module)
  .add(
    'Default',
    () => html`
      <lion-textarea label="Default"></lion-textarea>
    `,
  )
  .add(
    'Prefilled',
    () => html`
      <p>Default "rows" is 2 and it will grow to a max of 6</p>
      <lion-textarea
        label="Prefilled"
        .modelValue=${['batman', 'and', 'robin'].join('\n')}
      ></lion-textarea>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-textarea label="Disabled" disabled></lion-textarea>
    `,
  )
  .add(
    'Stop Growing',
    () => html`
      <lion-textarea
        label="Stop Growing"
        max-rows="4"
        .modelValue=${['batman', 'and', 'robin'].join('\n')}
      ></lion-textarea>
    `,
  )
  .add(
    'Non Growing',
    () => html`
      <p>To have a fixed size provide rows and maxRows with the same value</p>
      <lion-textarea label="Non Growing" rows="3" max-rows="3"></lion-textarea>
    `,
  )
  .add(
    'Validators',
    () => html`
      <lion-textarea
        .validators="${[new Required(), new MinLength(10), new MaxLength(400)]}"
        label="Validation"
        .modelValue="${lorem}"
      ></lion-textarea>
    `,
  );
