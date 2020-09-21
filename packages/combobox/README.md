# Combobox

A combobox is a widget made up of the combination of two distinct elements:

- a single-line textbox
- an associated pop-up element for helping users set the value of the textbox

The popup may be a listbox, grid, tree, or dialog. Many implementations also include a
third optional element -- a graphical button adjacent to the textbox, indicating the
availability of the popup. Activating the button displays the popup if suggestions are available.

> From [Combobox wai-aria design pattern](https://www.w3.org/TR/wai-aria-practices/#combobox)

```js script
import { html } from 'lit-html';
import { Required } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { listboxData } from '@lion/listbox/docs/listboxData.js';
import '@lion/listbox/lion-option.js';
import './lion-combobox.js';
import './docs/lion-combobox-selection-display.js';

// import './overflow-previews.js';

// import './md-combobox/MdCombobox.js';
// import './google-combobox/GoogleCombobox.js';

// import './md-combobox/MdInput.js';

export default {
  title: 'Forms/Combobox',
};
```

```js preview-story
export const main = () => html`
  <lion-combobox name="combo" label="Default" rotate-keyboard-navigation>
    ${listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `)}
  </lion-combobox>
`;
```

## Multiple choice

Add `multiple-choice` flag to allow multiple values to be selected.
This will:

- keep the listbox overlay open on click of an option
- display a list of selected option representations next to the text box
- make the value of type `Array` instead of `String`

```js preview-story
export const multipleChoice = () => html`
  <lion-combobox name="combo" label="Multiple" multiple-choice>
    ${listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `)}
  </lion-combobox>
`;
```

## Autocomplete

When "list", will filter listbox suggestions based on textbox value.
When "both", an inline completion string will be added to the textbox as well.

```js preview-story
export const autocompleteList = () => html`
  <lion-combobox name="combo" label="Autocomplete 'list'" autocomplete="list">
    ${listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `)}
  </lion-combobox>
`;
```

When `autocomplete="none"` is configured, the suggested options in the overlay are not filtered
based on the characters typed in the textbox.

```js preview-story
export const autocompleteNone = () => html`
  <lion-combobox name="combo" label="Autocomplete 'none'" autocomplete="none">
    ${listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `)}
  </lion-combobox>
`;
```

## Match Mode

When `match-mode="begin"` is applied, the entered text in the textbox only filters
options whose values begin with the entered text. For instance, the entered text 'ch' will match
with value 'Chard', but not with 'Artichoke'.
By default `match-mode="all"` is applied. This will also match parts of a word.
So 'ch' will both match 'Chard' and 'Artichoke'.

```js preview-story
export const matchModeBegin = () => html`
  <lion-combobox name="combo" label="Match Mode 'begin'" match-mode="begin">
    ${listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `)}
  </lion-combobox>
`;
```

```js preview-story
export const selectionDisplay = () => html`
  <lion-combobox name="combo" label="Selection display" multiple-choice>
    <lion-combobox-selection-display slot="selection-display"></lion-combobox-selection-display>
    ${listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `)}
  </lion-combobox>
`;
```
