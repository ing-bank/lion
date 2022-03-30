# Listbox >> Overview ||10

A widget that presents a list of options and allows a user to select one or more of them.
A listbox that allows a single option to be chosen is a `single-select listbox`; one that allows
multiple options to be selected is a `multi-select listbox`.

> From [listbox wai-aria best practices](https://www.w3.org/TR/wai-aria-practices/#Listbox)

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/listbox/define';
```

```js preview-story
export const main = () => html`
  <lion-listbox name="listbox" label="Default">
    <lion-option .choiceValue=${'Apple'}>Apple</lion-option>
    <lion-option checked .choiceValue=${'Artichoke'}>Artichoke</lion-option>
    <lion-option .choiceValue=${'Asparagus'}>Asparagus</lion-option>
    <lion-option .choiceValue=${'Banana'}>Banana</lion-option>
    <lion-option .choiceValue=${'Beets'}>Beets</lion-option>
  </lion-listbox>
`;
```

## Features

- Single & Multiple Choice
- Orientation
- Rotation when using keyboard for selection

## Installation

```bash
npm i --save @lion/listbox
```

```js
import '@lion/listbox/define';
```
