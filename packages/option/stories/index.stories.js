import { html, storiesOf } from '@open-wc/demoing-storybook';
import '../lion-option.js';

const a11yNote = html`
  <style>
    .a11y-note {
      padding: 20px;
      background-color: #eee;
    }
  </style>
  <p class="a11y-note">
    Note: This demo is not accessible, because <code>lion-option</code> just by itself is not
    accessible. This component should always be wrapped by something like a listbox,
    <code>lion-options</code> or similar.
  </p>
`;

storiesOf('Forms|Option')
  .add(
    'States',
    () => html`
      ${a11yNote}
      <lion-option>Default</lion-option><br />
      <lion-option disabled>Disabled</lion-option>
      <lion-option>
        <p style="color: darkred;">With html</p>
        <p>and multi Line</p>
      </lion-option>
    `,
  )
  .add(
    'Values',
    () => html`
      ${a11yNote}
      <lion-option .modelValue=${{ value: 10, checked: false }}>setting modelValue</lion-option>
      <lion-option .modelValue=${{ value: 10, checked: false }} active
        >setting modelValue active</lion-option
      >
      <lion-option .modelValue=${{ value: 10, checked: true }}
        >setting modelValue checked</lion-option
      >
      <lion-option .modelValue=${{ value: 10, checked: false }} disabled
        >setting modelValue disabled</lion-option
      >
      <lion-option .choiceValue=${10}>setting choiceValue</lion-option>
      <lion-option .choiceValue=${10} active>setting choiceValue active</lion-option>
      <lion-option .choiceValue=${10} checked>setting choiceValue checked</lion-option>
      <lion-option .choiceValue=${10} disabled>setting choiceValue disabled</lion-option>
    `,
  );
