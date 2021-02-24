[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Forms in a dialog

```js script
import { html } from '@lion/core';
import '@lion/dialog/define';
import '@lion/input-datepicker/define';
import '@lion/select-rich/define';

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
