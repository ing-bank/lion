# Combobox >> Overview ||10

A combobox is a widget made up of the combination of two distinct elements:

- a single-line textbox
- an associated listbox overlay

Based on the combobox configuration and entered textbox value, options in the listbox will be
filtered, checked, focused and the textbox value may be autocompleted.
Optionally, the combobox contains a graphical button adjacent to the textbox, indicating the
availability of the pop-up.

> Fore more information, consult [Combobox wai-aria design pattern](https://www.w3.org/TR/wai-aria-practices/#combobox)

```js script
import { html } from '@mdjs/mdjs-preview';
import { listboxData } from '../listbox/src/listboxData.js';
import '@lion/components/define/lion-combobox.js';
import '@lion/components/define/lion-option.js';
import { lazyRender } from './src/lazyRender.js';
```

```js preview-story
export const main = () => html`
  <lion-combobox name="combo" label="Default">
    ${lazyRender(
      listboxData.map(
        (entry, i) =>
          html` <lion-option .checked="${i === 0}" .choiceValue="${entry}">${entry}</lion-option> `,
      ),
    )}
  </lion-combobox>
`;
```

[...show more](./examples.md)

## Features

> tbd

## Installation

```bash
npm i --save @lion/combobox
```

```js
import '@lion/components/define/lion-combobox.js';
import '@lion/components/define/lion-option.js';
```
