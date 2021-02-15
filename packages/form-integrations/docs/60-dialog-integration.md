[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Forms in a dialog

```js script
import { html } from '@lion/core';
import { listboxData } from '@lion/listbox/docs/listboxData.js';
import '@lion/dialog/lion-dialog.js';
import '@lion/input-datepicker';
import '@lion/select-rich/lion-select-rich.js';
import '@lion/listbox/lion-option.js';
import '@lion/radio-group/lion-radio-group.js';
import '@lion/radio-group/lion-radio.js';
import '@lion/listbox/lion-option.js';

export default {
  title: 'Forms/System/Dialog integrations',
};
```

## Select Rich

Opening a Rich Select inside a dialog

```js story
export const selectRich = () => html`
  <lion-dialog>
    <button slot="invoker">Open Dialog</button>
    <div slot="content">
      <lion-select-rich name="favoriteColor" label="Favorite color">
        <lion-option .choiceValue=${'red'}>Red</lion-option>
        <lion-option .choiceValue=${'hotpink'} checked>Hotpink</lion-option>
        <lion-option .choiceValue=${'teal'}>Teal</lion-option>
      </lion-select-rich>
      <button
        class="close-button"
        @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
      >
        ⨯
      </button>
    </div>
  </lion-dialog>
`;
```

## Input Datepicker

Opening a Input Datepicker inside a dialog

```js story
export const inputDatepicker = () => html`
  <lion-dialog>
    <button slot="invoker">Open Dialog</button>
    <div slot="content">
      <lion-input-datepicker></lion-input-datepicker>
      <button
        class="close-button"
        @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
      >
        ⨯
      </button>
    </div>
  </lion-dialog>
`;
```

## Combobox

Opening a Combobox inside a dialog

```js story
export const combobox = () => html`
  <lion-dialog>
    <button slot="invoker">Open Dialog</button>
    <div slot="content">
      <lion-combobox name="combo" label="Default">
        ${listboxData.map(
          entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `,
        )}
      </lion-combobox>
      <lion-radio-group name="dinosaurs" label="Favorite dinosaur">
        <lion-radio .choiceValue=${'allosaurus'} label="allosaurus"></lion-radio>
        <lion-radio .choiceValue=${'brontosaurus'} label="brontosaurus"></lion-radio>
        <lion-radio .choiceValue=${'diplodocus'} label="diplodocus"></lion-radio>
      </lion-radio-group>
      <button
        class="close-button"
        @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
      >
        ⨯
      </button>
    </div>
  </lion-dialog>
`;
```
