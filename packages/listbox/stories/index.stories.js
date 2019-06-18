import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';

import '@lion/form/lion-form.js';
import '../lion-option.js';
import '../lion-listbox.js';

const selectRichDemoStyle = css`
  .demo-listbox {
    background-color: white;
  }

  .demo-option[focused] {
    background-color: lightgray;
  }
`;

storiesOf('Forms|Listbox', module)
  .add(
    'Default',
    () => html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <lion-listbox name="color">
        <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
        <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
        <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
      </lion-listbox>
    `,
  )
  .add(
    'Options with HTML',
    () => html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <lion-listbox name="color" class="demo-listbox">
        <lion-option .modelValue=${{ value: 'red', checked: false }}>
          <p style="color: red;">I am red</p>
          <p>and multi Line</p>
        </lion-option>
        <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>
          <p style="color: hotpink;">I am hotpink</p>
          <p>and multi Line</p>
        </lion-option>
        <lion-option .modelValue=${{ value: 'teal', checked: false }}>
          <p style="color: teal;">I am teal</p>
          <p>and multi Line</p>
        </lion-option>
      </lion-listbox>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <style>
        ${selectRichDemoStyle}
      </style>
      <lion-listbox name="color">
        <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
        <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
        <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
      </lion-listbox>

      <lion-listbox name="color">
        <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
        <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
        <lion-option .modelValue=${{ value: 'teal', checked: false }} disabled>Teal</lion-option>
      </lion-listbox>
    `,
  )
  .add('Validation', () => {
    const submit = () => {
      const form = document.querySelector('#form');
      if (form.errorState === false) {
        console.log(form.serializeGroup());
      }
    };
    return html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <lion-form id="form" @submit="${submit}">
        <form>
          <lion-listbox name="color" class="demo-listbox" .errorValidators="${[['required']]}">
            <lion-option value="red" class="demo-option">Red</lion-option>
            <lion-option value="hotpink" class="demo-option">Hotpink</lion-option>
            <lion-option value="teal" class="demo-option">Teal</lion-option>
          </lion-listbox>
          <lion-button type="submit">Submit</lion-button>
        </form>
      </lion-form>
    `;
  })
  .add('Render Options', () => {
    const objs = [
      { type: 'mastercard', label: 'Master Card', amount: 12000, active: true },
      { type: 'visacard', label: 'Visa Card', amount: 0, active: false },
    ];
    return html`
      <lion-listbox name="color">
        ${objs.map(
          obj => html`
            <lion-option .modelValue=${{ value: obj, checked: false }}>${obj.label}</lion-option>
          `,
        )}
      </lion-listbox>
    `;
  });
