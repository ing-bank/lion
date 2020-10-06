# Combobox

A combobox is a widget made up of the combination of two distinct elements:

- a single-line textbox
- an associated listbox overlay

Based on the combobox configuration and entered texbox value, options in the listbox will be
filtered, checked, focused and the textbox value may be autocompleted.
Optionally the combobox contains a graphical button adjacent to the textbox, indicating the
availability of the popup.

> Fore more information, consult [Combobox wai-aria design pattern](https://www.w3.org/TR/wai-aria-practices/#combobox)

```js script
import { html } from 'lit-html';
import { Required } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { listboxData } from '@lion/listbox/docs/listboxData.js';
import '@lion/listbox/lion-option.js';
import './lion-combobox.js';
import './docs/demo-selection-display.js';
import { lazyRender } from './docs/lazyRender.js';
import levenshtein from './docs/levenshtein.js';

export default {
  title: 'Forms/Combobox',
};
```

```js preview-story
export const main = () => html`
  <lion-combobox name="combo" label="Default">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
```

## Autocomplete

Below you will find an overview of all possible `autocomplete` behaviors and how they correspond
to the configurable values `none`, `list`, `inline` and `both`.

|        | list | filter | focus | check | complete |
| -----: | :--: | :----: | :---: | :---: | :------: |
|   none |  ✓   |        |       |       |          |
|   list |  ✓   |   ✓    |   ✓   |   ✓   |          |
| inline |  ✓   |        |   ✓   |   ✓   |    ✓     |
|   both |  ✓   |   ✓    |   ✓   |   ✓   |    ✓     |

- **list** shows a list on keydown character press
- **filter** filters list of potential matches according to `matchmode` or provided `matchCondition`
- **focus** automatically focuses closest match (makes it the activedescendant)
- **check** automatically checks/selects closest match when `selection-follows-focus` is enabled (this is the default configuration)
- **complete** completes the textbox value inline (the 'missing characters' will be added as selected text)

When `autocomplete="none"` is configured, the suggested options in the overlay are not filtered
based on the characters typed in the textbox.
Selection will happen manually by the user.

```js preview-story
export const autocompleteNone = () => html`
  <lion-combobox name="combo" label="Autocomplete 'none'" autocomplete="none">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
```

When `autocomplete="list"` is configured, it will filter listbox suggestions based on textbox value.

```js preview-story
export const autocompleteList = () => html`
  <lion-combobox name="combo" label="Autocomplete 'list'" autocomplete="list">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
```

When `autocomplete="inline"` is configured, it will present a value completion prediction inside the text input itself.
It does NOT filter list of potential matches.

```js preview-story
export const autocompleteInline = () => html`
  <lion-combobox name="combo" label="Autocomplete 'inline'" autocomplete="inline">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
```

When `autocomplete="both"` is configured, it combines the filtered list from `'list'` with the text input value completion prediction from `'inline'`.
This is the default value for `autocomplete`.

```js preview-story
export const autocompleteBoth = () => html`
  <lion-combobox name="combo" label="Autocomplete 'both'" autocomplete="both">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
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
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
```

```js preview-story
export const matchModeAll = () => html`
  <lion-combobox name="combo" label="Match Mode 'all'" match-mode="all">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
```

When the preconfigurable `match-mode` conditions are not sufficient,
one can define a custom matching function.
The example below matches when the Levenshtein distance is below 3 (including some other conditions).

```js preview-story
export const customMatchCondition = () => html`
  <lion-combobox
    name="combo"
    label="Custom Match Mode 'levenshtein'"
    help-text="Spelling mistakes will be forgiven. Try typing 'Aple' instead of 'Apple'"
    .matchCondition="${({ choiceValue }, textboxValue) => {
      const oVal = choiceValue.toLowerCase();
      const tVal = textboxValue.toLowerCase();
      const t = 1; // treshold
      return oVal.slice(0, t) === tVal.slice(0, t) && levenshtein(oVal, tVal) < 3;
    }}"
  >
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
```

## Options

```js preview-story
export const showAllOnEmpty = () => html`
  <lion-combobox
    name="combo"
    label="Show all on empty"
    help-text="Shows all (options) on empty (textbox has no value)"
    show-all-on-empty
  >
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
```

### Changing defaults

By default `selection-follows-focus` will be true (aligned with the
wai-aria examples and the natve `<datalist>`).
It is possible to disable this behavior, so the active/focused and checked/selected values
will be kept track of independently.

> Note that, (just like in a listbox), selection-follows-focus will never be applicable for
> multiselect comboboxes.

```js preview-story
export const noSelectionFollowsFocus = () => html`
  <lion-combobox name="combo" label="No Selection Follows focus" .selectionFollowsFocus="${false}">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
```

By default `rotate-keyboard-navigation` will be true (aligned with the
wai-aria examples and the natve `<datalist>`).
It is possible to disable this behavior, see example below

```js preview-story
export const noRotateKeyboardNavigation = () => html`
  <lion-combobox
    name="combo"
    label="No Rotate Keyboard Navigation"
    .rotateKeyboardNavigation="${false}"
  >
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
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
    <demo-selection-display slot="selection-display"></demo-selection-display>
    ${lazyRender(
      listboxData.map(
        (entry, i) =>
          html` <lion-option .choiceValue="${entry}" ?checked=${i === 0}>${entry}</lion-option> `,
      ),
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
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
```

## Listbox compatibility

All configurations that can be applied to `lion-listbox`, can be applied to `lion-combobox` as well.
See the [listbox documentation](?path=/docs/forms-listbox--main) for more information.
