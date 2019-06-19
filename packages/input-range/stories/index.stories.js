import { html, storiesOf } from '@open-wc/demoing-storybook';

import '../lion-input-range.js';

storiesOf('Forms|Input Range', module)
  .add(
    'Default',
    () => html`
      <lion-input-range></lion-input-range>
    `,
  )
  .add(
    'Label',
    () => html`
      <lion-input-range label="Label"></lion-input-range>
    `,
  )
  .add(
    'Label using html',
    () => html`
      <lion-input-range>
        <label slot="label">Label</label>
      </lion-input-range>
    `,
  )
  .add(
    'Help text',
    () => html`
      <lion-input-range help-text="A help text can show additional hints"></lion-input-range>
    `,
  )
  .add(
    'Help text using html',
    () => html`
      <lion-input-range>
        <div slot="help-text">
          Help text using <a href="https://example.com/" target="_blank">html</a>
        </div>
      </lion-input-range>
    `,
  )
  .add(
    'Prefilled',
    () => html`
      <lion-input-range .modelValue=${75} label="Prefilled"></lion-input-range>
      <lion-input-range value="75" label="Prefilled"></lion-input-range>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-input-range disabled .modelValue=${70} label="Disabled"></lion-input-range>
    `,
  )
  .add(
    'Prefix',
    () => html`
      <lion-input-range label="Prefix">
        <div slot="prefix">[prefix]</div>
      </lion-input-range>
    `,
  )
  .add(
    'Suffix',
    () => html`
      <lion-input-range label="Suffix">
        <div slot="suffix">[suffix]</div>
      </lion-input-range>
    `,
  )
  .add(
    'Before',
    () => html`
      <lion-input-range label="Before">
        <div slot="before">[before]</div>
      </lion-input-range>
    `,
  )
  .add(
    'After',
    () => html`
      <lion-input-range label="After">
        <div slot="after">[after]</div>
      </lion-input-range>
    `,
  )
  .add(
    'Min',
    () => html`
      <lion-input-range label="Min" min="10"></lion-input-range>
      <p>Sets the minimum value of the range</p>
    `,
  )
  .add(
    'Max',
    () => html`
      <lion-input-range label="Max" max="10"></lion-input-range>
      <p>Sets the maximum value of the range</p>
    `,
  )
  .add(
    'Min and Max',
    () => html`
      <lion-input-range label="Min and Max" min="1" max="10" value="5"></lion-input-range>
      <p>Sets the maximum value of the range</p>
    `,
  )
  .add(
    'Step',
    () => html`
      <lion-input-range label="Step" step="10"></lion-input-range>
      <p>Sets the value of each step in the range</p>
    `,
  )
  .add(
    'Marks',
    () => html`
      <lion-input-range label="Marks" step="10" list="tickmarks"></lion-input-range>
      <datalist id="tickmarks">
        <option value="0" label="0%"> </option>
        <option value="10"> </option>
        <option value="20"> </option>
        <option value="30"> </option>
        <option value="40"> </option>
        <option value="50" label="50%"> </option>
        <option value="60"> </option>
        <option value="70"> </option>
        <option value="80"> </option>
        <option value="90"> </option>
        <option value="100" label="100%"> </option>
      </datalist>

      <p>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range#Adding_hash_marks_and_labels"
          >Adds hash marks and labels</a
        >.
      </p>
      <p>This is partially supported in Chrome and Safari.</p>
    `,
  )
  .add(
    'Autocomplete',
    () => html`
      <lion-input-range label="Autocomplete" autocomplete="on"></lion-input-range>
      <p>
        A string that describes what if any type of autocomplete functionality the input should
        provide. A typical implementation of autocomplete simply recalls previous values entered in
        the same input field.
      </p>
    `,
  );
