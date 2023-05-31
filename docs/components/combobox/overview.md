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
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';
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

[...show more](./extensions.md)

## Features

The combobox has many configurable properties to fine-tune its behaviour:

- **Multiple choice** - Allows multiselection of options.
- **requireOptionMatch**
  - **true** (default) - The listbox is leading, the textbox is a helping aid to quickly select an option/options. Unmatching input values become Unparseable, with the `MatchesOption` set as a default validator.
  - **false** - The textbox is leading, with the listbox as an aid to supply suggestions, e.g. a search input.
- **Autocomplete** - When the autocompletion will happen: `none`, `list`, `inline` and `both`.
- **Matchmode** - Which part of the value should match: `begin` and `all`.
- **Show all on empty** - Shows the options list on empty.
- **Selection follows focus** - When false the active/focused and checked/selected values will be kept track of independently.
- **Rotate keyboard Navigation** - When false it won't rotate the navigation.

## Installation

```bash
npm i --save @lion/ui
```

```js
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';
```
