# Orbit Combobox

Based on [Orbit Design System](https://orbit.kiwi/)

```js script
import { html } from 'lit-html';
import { listboxData } from '@lion/listbox/docs/listboxData.js';
import '@lion/listbox/lion-option.js';
import '@lion/combobox/lion-combobox.js';
import { LionCombobox } from '@lion/combobox/src/LionCombobox.js';
import { lazyRender } from '@lion/combobox/docs/lazyRender.js';
import { orbitComboboxStyles } from './styles/orbit-combobox.css.js';

class OtherCombobox extends LionCombobox {}
customElements.define('other-combobox', OtherCombobox);

export default {
  title: 'Theming/Combobox',
};
```

```js preview-story
export const orbitDesignSystem = () => html`
  <div class="orbit">
    <style>
      ${orbitComboboxStyles}
    </style>
    <lion-combobox
      label="Orbit look and feel"
      name="combo"
      .modelValue="${listboxData[1]}"
      @click="${({ currentTarget: el }) => {
        el.opened = !el.opened;
      }}"
    >
      <svg slot="prefix" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <path
          d="M9.815 3.19a6.625 6.625 0 015.624 10.128l4.927 4.933a1.5 1.5 0 11-2.123 2.12l-4.926-4.931A6.625 6.625 0 119.815 3.19zm0 2.25a4.375 4.375 0 100 8.75 4.375 4.375 0 000-8.75z"
        ></path>
      </svg>
      <lion-button slot="suffix" class="link">
        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
          <path
            d="M7.912 8.747a.904.904 0 00-1.274-.065.898.898 0 00-.066 1.27l4.796 5.303a.904.904 0 001.342-.003l4.72-5.255a.898.898 0 00-.07-1.271.904.904 0 00-1.274.07l-3.754 4.18a.4.4 0 01-.595 0L7.912 8.747z"
          ></path>
        </svg>
      </lion-button>
      ${lazyRender(
        listboxData.map(
          entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `,
        ),
      )}
    </lion-combobox>
  </div>
`;
```

```js preview-story
export const otherCombobox = () => html`
  <div class="orbit">
    <style>
      ${orbitComboboxStyles}
    </style>
    <other-combobox
      label="Orbit look and feel"
      name="combo"
      .modelValue="${listboxData[1]}"
      @click="${({ currentTarget: el }) => {
        el.opened = !el.opened;
      }}"
    >
      <svg slot="prefix" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <path
          d="M9.815 3.19a6.625 6.625 0 015.624 10.128l4.927 4.933a1.5 1.5 0 11-2.123 2.12l-4.926-4.931A6.625 6.625 0 119.815 3.19zm0 2.25a4.375 4.375 0 100 8.75 4.375 4.375 0 000-8.75z"
        ></path>
      </svg>
      <lion-button slot="suffix" class="link">
        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
          <path
            d="M7.912 8.747a.904.904 0 00-1.274-.065.898.898 0 00-.066 1.27l4.796 5.303a.904.904 0 001.342-.003l4.72-5.255a.898.898 0 00-.07-1.271.904.904 0 00-1.274.07l-3.754 4.18a.4.4 0 01-.595 0L7.912 8.747z"
          ></path>
        </svg>
      </lion-button>
      ${lazyRender(
        listboxData.map(
          entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `,
        ),
      )}
    </other-combobox>
  </div>
`;
```
