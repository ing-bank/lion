import { html, storiesOf } from '@open-wc/demoing-storybook';
import '../lion-input.js';

storiesOf('Forms|Input')
  .add(
    'Default',
    () => html`
      <lion-input label="First Name"></lion-input>
    `,
  )
  .add(
    'Help Text',
    () => html`
      <lion-input label="Label" help-text="A help text can show additional hints"></lion-input>
    `,
  )
  .add(
    'Help text using html',
    () => html`
      <lion-input>
        <label slot="label">Label</label>
        <div slot="help-text">
          Help text using <a href="https://example.com/" target="_blank">html</a>
        </div>
      </lion-input>
    `,
  )
  .add(
    'Prefilled',
    () => html`
      <lion-input .modelValue=${'prefilled value'} label="Prefilled"></lion-input>
    `,
  )
  .add(
    'Read Only',
    () => html`
      <lion-input readonly .modelValue=${'this is read only'} label="Read only"></lion-input>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-input disabled .modelValue=${'this is disabled'} label="Disabled"></lion-input>
    `,
  )
  .add(
    'Prefix',
    () => html`
      <lion-input label="Prefix">
        <div slot="prefix">[prefix]</div>
      </lion-input>
      <p>The prefix does not have an active use case yet.</p>
    `,
  )
  .add(
    'Suffix',
    () => html`
      <lion-input label="Suffix">
        <div slot="suffix">[suffix]</div>
      </lion-input>
      <p>
        The suffix can be used for addons to the input like a calculator, datepicker or addressbook.
        In these cases a button with an icon is used.
      </p>
    `,
  )
  .add(
    'Before',
    () => html`
      <lion-input label="Before">
        <div slot="before">[before]</div>
      </lion-input>
      <p>Before does not have an active use case yet.</p>
    `,
  )
  .add(
    'After',
    () => html`
      <lion-input label="Amount">
        <div slot="after">EUR</div>
      </lion-input>
      <lion-input label="Percentage">
        <div slot="after">%</div>
      </lion-input>
    `,
  );
