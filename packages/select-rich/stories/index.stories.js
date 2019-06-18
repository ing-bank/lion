import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';

import '@lion/form/lion-form.js';
import '@lion/listbox/lion-option.js';
import '@lion/listbox/listbox.js';

import '../lion-select-rich.js';

const selectRichDemoStyle = css`
  .demo-listbox {
    background-color: white;
  }

  .demo-option[focused] {
    background-color: lightgray;
  }
`;

storiesOf('Forms|Select Rich', module)
  .add(
    'Default',
    () => html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <lion-select-rich label="Favorite color" name="color">
        <lion-listbox slot="input">
          <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
          <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
          <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
        </lion-listbox>
      </lion-select-rich>
    `,
  )
  .add(
    'Options with HTML',
    () => html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <lion-select-rich label="Favorite color" name="color">
        <lion-listbox slot="input" class="demo-listbox">
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
      </lion-select-rich>
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
      <lion-select-rich label="Disabled select" disabled name="color">
        <lion-listbox slot="input">
          <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
          <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
          <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
        </lion-listbox>
      </lion-select-rich>

      <lion-select-rich label="Disabled options" name="color">
        <lion-listbox slot="input">
          <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
          <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
          <lion-option .modelValue=${{ value: 'teal', checked: false }} disabled>Teal</lion-option>
        </lion-listbox>
      </lion-select-rich>
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
          <lion-select-rich
            id="color"
            name="color"
            label="Favorite color"
            .errorValidators="${[['required']]}"
          >
            <lion-listbox slot="input" class="demo-listbox">
              <lion-option value="red" class="demo-option">Red</lion-option>
              <lion-option value="hotpink" class="demo-option">Hotpink</lion-option>
              <lion-option value="teal" class="demo-option">Teal</lion-option>
            </lion-listbox>
          </lion-select-rich>
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
      <lion-form>
        <form>
          <lion-select-rich label="Favorite color" name="color">
            <lion-listbox slot="input">
              ${objs.map(
                obj => html`
                  <lion-option .modelValue=${{ value: obj, checked: false }}
                    >${obj.label}</lion-option
                  >
                `,
              )}
            </lion-listbox>
          </lion-select-rich>
        </form>
      </lion-form>
    `;
  });
