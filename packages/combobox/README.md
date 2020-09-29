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

export default {
  title: 'Forms/Combobox',
};
```

```js preview-story
export const main = () => html`
  <lion-combobox name="combo" label="Default">
    ${listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `)}
  </lion-combobox>
`;
```

## Autocomplete

When "list", will filter listbox suggestions based on textbox value.

```js preview-story
export const autocompleteList = () => html`
  <lion-combobox name="combo" label="Autocomplete 'list'" autocomplete="list">
    ${listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `)}
  </lion-combobox>
`;
```

When "inline", will present a value completion prediction inside the text input itself.

```js preview-story
export const autocompleteInline = () => html`
  <lion-combobox name="combo" label="Autocomplete 'inline'" autocomplete="inline">
    ${listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `)}
  </lion-combobox>
`;
```

When `autocomplete="both"` is configured, it combines the filtered list from `'list'` with the text input value completion prediction from `'inline'`.
This is the default value for `autocomplete`.

```js preview-story
export const autocompleteBoth = () => html`
  <lion-combobox name="combo" label="Autocomplete 'both'" autocomplete="both">
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

## Selection follows focus

By default `selection-follows-focus` will be configured (think of the
wai-aria examples and the natve `<datalist>`).
Note that, (just like in a listbox), selection-follows-focus will never be applicable for
multiselect comboboxes.

```js preview-story
export const selectionFollowsFocus = () => html`
  <lion-combobox name="combo" label="Selection Follows focus" .selectionFollowsFocus="${false}">
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

> Please note that the lion-combobox-selection-display below is not exposed and only serves
> as an example. The selection part of a multiselect combobox is not yet accessible, please keep
> in mind that for now, as a Subclasser, you would have to take care of this part yourself.

```js preview-story
export const multipleChoice = () => html`
  <lion-combobox name="combo" label="Multiple" multiple-choice>
    <lion-combobox-selection-display slot="selection-display"></lion-combobox-selection-display>
    ${listboxData.map(
      (entry, i) =>
        html` <lion-option .choiceValue="${entry}" ?checked=${i === 0}>${entry}</lion-option> `,
    )}
  </lion-combobox>
`;
```

## Invoker button

```js preview-story
export const invokerButton = () => html`
  <lion-combobox
    .modelValue="${listboxData[1]}"
    autocomplete="none"
    name="combo"
    label="Invoker Button"
    @click="${({ currentTarget: el }) => {
      el.opened = !el.opened;
    }}"
  >
    <button slot="suffix" type="button" tabindex="-1">▼</button>
    ${listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `)}
  </lion-combobox>
`;
```

## Listbox compatibility

All configurations that can be applied to `lion-listbox`, can be applied to `lion-combobox` as well.
See the [listbox documentation](?path=/docs/forms-listbox--main) for more information.
