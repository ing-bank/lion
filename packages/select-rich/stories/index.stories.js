import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';

import '../../button/lion-button.js';
import '../../form/lion-form.js';
import '../../listbox/lion-listbox.js';
import '../../listbox/lion-option.js';
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
        <lion-listbox slot="input" class="demo-listbox">
          <lion-option value="red" class="demo-option">Red</lion-option>
          <lion-option value="hotpink" class="demo-option">Hotpink</lion-option>
          <lion-option value="teal" class="demo-option">Teal</lion-option>
        </lion-listbox>
      </lion-select-rich>
    `,
  )
  .add(
    'Complex options',
    () => html`
      <style>
        ${selectRichDemoStyle} .demo-option__title {
          font-size: 24px;
          font-weight: bold;
        }

        .demo-option__sub {
          font-size: 16px;
          color: grey;
        }
      </style>
      <lion-select-rich label="Favorite color" name="color">
        <lion-listbox slot="input" class="demo-listbox">
          <lion-option value="nr1" class="demo-option">
            <div class="demo-option__title">Title 1</div>
            <div class="demo-option__sub">Sub text 1</div>
          </lion-option>
          <lion-option value="nr2" class="demo-option">
            <div class="demo-option__title">Title 2</div>
            <div class="demo-option__sub">Sub text 2</div>
          </lion-option>
          <lion-option value="nr3" class="demo-option">
            <div class="demo-option__title">Title 3</div>
            <div class="demo-option__sub">Sub text 3</div>
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
      <lion-select-rich label="Disabled select" disabled name="color1">
        <lion-listbox slot="input" class="demo-listbox">
          <lion-option value="red" class="demo-option">Red</lion-option>
          <lion-option value="hotpink" class="demo-option">Hotpink</lion-option>
          <lion-option value="teal" class="demo-option">Teal</lion-option>
        </lion-listbox>
      </lion-select-rich>

      <lion-select-rich label="Disabled option" name="color2">
        <lion-listbox slot="input" class="demo-listbox">
          <lion-option value="red" class="demo-option">Red</lion-option>
          <lion-option value="hotpink" class="demo-option">Hotpink</lion-option>
          <lion-option value="teal" class="demo-option" disabled>Teal</lion-option>
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
  });
