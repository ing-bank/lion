# Systems >> Overlays >> Form Integrations || 60

```js script
import { html } from '@lion/core';
import '@lion/input-datepicker/lion-input-datepicker.js';
import '@lion/listbox/lion-options.js';
import '@lion/listbox/lion-option.js';
import '@lion/select-rich/lion-select-rich.js';
import './src/demo-overlay-system.js';
import './src/applyDemoOverlayStyles.js';
```

## Select Rich

Opening a Rich Select inside a dialog.

```js preview-story
export const selectRich = () => html`
  <demo-overlay-system>
    <button slot="invoker">Open Dialog</button>
    <div slot="content" class="demo-overlay">
      <h1>Select Rick example</h1>
      <lion-select-rich name="favoriteColor" label="Favorite color">
        <lion-option .choiceValue=${'red'}>Red</lion-option>
        <lion-option .choiceValue=${'hotpink'} checked>Hotpink</lion-option>
        <lion-option .choiceValue=${'teal'}>Teal</lion-option>
      </lion-select-rich>
      <p>
        You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </p>
    </div>
  </demo-overlay-system>
`;
```

## Input Datepicker

Opening an Input Datepicker inside a dialog.

```js preview-story
export const inputDatepicker = () => html`
  <demo-overlay-system>
    <button slot="invoker">Open Dialog</button>
    <div slot="content" class="demo-overlay">
      <h1>Input Datepicker example</h1>
      <lion-input-datepicker name="date" label="Date"></lion-input-datepicker>
      <p>
        You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </p>
    </div>
  </demo-overlay-system>
`;
```
