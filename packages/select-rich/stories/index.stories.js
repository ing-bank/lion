import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';

import { Required } from '@lion/validate';
import '@lion/form/lion-form.js';
import '@lion/option/lion-option.js';
import '@lion/button/lion-button.js';

import '../lion-select-rich.js';
import '../lion-options.js';

const selectRichDemoStyle = css`
  .demo-area {
    margin: 50px;
  }
`;

storiesOf('Forms|Select Rich', module)
  .add(
    'Default',
    () => html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <div class="demo-area">
        <lion-select-rich label="Favorite color" name="color">
          <lion-options slot="input">
            <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
            <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
            <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
          </lion-options>
        </lion-select-rich>
      </div>
    `,
  )
  .add(
    'Options with HTML',
    () => html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <div class="demo-area">
        <lion-select-rich label="Favorite color" name="color">
          <lion-options slot="input" class="demo-listbox">
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
          </lion-options>
        </lion-select-rich>
      </div>
    `,
  )
  .add(
    'Read-only prefilled',
    () => html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <div class="demo-area">
        <lion-select-rich label="Read-only select" readonly name="color">
          <lion-options slot="input">
            <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
            <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
            <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
          </lion-options>
        </lion-select-rich>
      </div>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <div class="demo-area">
        <lion-select-rich label="Disabled select" disabled name="color">
          <lion-options slot="input">
            <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
            <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
            <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
          </lion-options>
        </lion-select-rich>

        <lion-select-rich label="Disabled options" name="color">
          <lion-options slot="input">
            <lion-option .choiceValue=${'red'} disabled>Red</lion-option>
            <lion-option .choiceValue=${'blue'}>Blue</lion-option>
            <lion-option .choiceValue=${'hotpink'} disabled>Hotpink</lion-option>
            <lion-option .choiceValue=${'green'}>Green</lion-option>
            <lion-option .choiceValue=${'teal'} disabled>Teal</lion-option>
          </lion-options>
        </lion-select-rich>
      </div>
    `,
  )
  .add(
    'Validation',
    () => html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <div class="demo-area">
        <lion-select-rich
          id="color"
          name="color"
          label="Favorite color"
          .validators="${[new Required()]}"
        >
          <lion-options slot="input" class="demo-listbox">
            <lion-option .choiceValue=${null}>select a color</lion-option>
            <lion-option .choiceValue=${'red'}>Red</lion-option>
            <lion-option .choiceValue=${'hotpink'} disabled>Hotpink</lion-option>
            <lion-option .choiceValue=${'teal'}>Teal</lion-option>
          </lion-options>
        </lion-select-rich>
      </div>
    `,
  )
  .add('Render Options', () => {
    const objs = [
      { type: 'mastercard', label: 'Master Card', amount: 12000, active: true },
      { type: 'visacard', label: 'Visa Card', amount: 0, active: false },
    ];

    function showOutput() {
      // eslint-disable-next-line no-undef
      output.innerHTML = JSON.stringify(this.checkedValue, null, 2);
    }
    return html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <div class="demo-area">
        <lion-form>
          <form>
            <lion-select-rich
              label="Credit Card"
              name="color"
              @select-model-value-changed=${showOutput}
            >
              <lion-options slot="input">
                ${objs.map(
                  obj => html`
                    <lion-option .modelValue=${{ value: obj, checked: false }}
                      >${obj.label}</lion-option
                    >
                  `,
                )}
              </lion-options>
            </lion-select-rich>
            <pre id="output"></pre>
          </form>
        </lion-form>
      </div>
    `;
  })
  .add(
    'Interaction mode',
    () => html`
      <style>
        ${selectRichDemoStyle}
      </style>
      <p>By default the select-rich uses the same interaction-mode as the operating system.</p>
      <div class="demo-area">
        <lion-select-rich label="Mac mode" name="color" interaction-mode="mac">
          <lion-options slot="input">
            <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
            <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
            <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
          </lion-options>
        </lion-select-rich>

        <lion-select-rich label="Windows/Linux mode" name="color" interaction-mode="windows/linux">
          <lion-options slot="input">
            <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
            <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
            <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
          </lion-options>
        </lion-select-rich>
      </div>
    `,
  );
