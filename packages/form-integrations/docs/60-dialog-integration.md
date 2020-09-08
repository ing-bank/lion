[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Forms in a dialog

```js script
import { html } from 'lit-html';
import '@lion/dialog/lion-dialog.js';
import '@lion/select-rich/lion-select-rich.js';
import '@lion/listbox/lion-options.js';
import '@lion/listbox/lion-option.js';

export default {
  title: 'Forms/System/Dialog integrations',
};
```

Opening a Rich Select inside a dialog

```js story
export const main = () => html`
  <lion-dialog>
    <button slot="invoker">Open Dialog</button>
    <div slot="content">
      <lion-select-rich name="favoriteColor" label="Favorite color">
        <lion-options slot="input">
          <lion-option .choiceValue=${'red'}>Red</lion-option>
          <lion-option .choiceValue=${'hotpink'} checked>Hotpink</lion-option>
          <lion-option .choiceValue=${'teal'}>Teal</lion-option>
        </lion-options>
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
