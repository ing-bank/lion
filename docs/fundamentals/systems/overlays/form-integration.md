# Systems >> Overlays >> Form Integrations ||60

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-datepicker.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-select-rich.js';
import './assets/demo-overlay-system.mjs';
import './assets/applyDemoOverlayStyles.mjs';
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
        You can close this dialog here:
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
        You can close this dialog here:
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
