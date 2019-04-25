import { storiesOf, html } from '@open-wc/storybook';

import '../lion-textarea.js';

storiesOf('Forms|<lion-textarea>', module)
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
  );
