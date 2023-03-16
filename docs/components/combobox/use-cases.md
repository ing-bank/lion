# Combobox >> Use Cases ||20

A combobox is a widget made up of the combination of two distinct elements:

- a single-line textbox
- an associated listbox overlay

Based on the combobox configuration and entered textbox value, options in the listbox will be
filtered, checked, focused and the textbox value may be autocompleted.
Optionally the combobox contains a graphical button adjacent to the textbox, indicating the
availability of the popup.

> Fore more information, consult [Combobox wai-aria design pattern](https://www.w3.org/TR/wai-aria-practices/#combobox)

```js script
import { LitElement, html, repeat } from '@mdjs/mdjs-preview';
import { listboxData, listboxComplexData } from '../listbox/src/listboxData.js';
import { LionCombobox } from '@lion/ui/combobox.js';
import { Required } from '@lion/ui/form-core.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';
import './src/demo-selection-display.js';
import { lazyRender } from './src/lazyRender.js';
import levenshtein from './src/levenshtein.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
loadDefaultFeedbackMessages();
```

## Require option match

By default `requireOptionMatch` is set to true, which means that the listbox is leading. The textbox is a helping aid to quickly select an option/options. Unmatching input values become Unparseable, with the `IsMatchingAnOption` set as a default validator.

When `requireOptionMatch` is set to false the textbox is leading, with the listbox as an aid to supply suggestions, e.g. a search input. This means that all input values are allowed.

```js preview-story
export const optionMatch = () => html`
  <lion-combobox name="search" label="Search" .requireOptionMatch=${false}>
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
wai-aria examples and the native `<datalist>`).
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
> as an example. The selection part of a multiselect combobox is not yet accessible. Please keep
> in mind that for now, as a Subclasser, you would have to take care of this part yourself.

```js preview-story
export const multipleChoice = () => html`
  <lion-combobox name="combo" label="Multiple" multiple-choice>
    <demo-selection-display
      slot="selection-display"
      style="display: contents;"
    ></demo-selection-display>
    ${lazyRender(
      listboxData.map(
        (entry, i) =>
          html` <lion-option .choiceValue="${entry}" ?checked=${i === 0}>${entry}</lion-option> `,
      ),
    )}
  </lion-combobox>
`;
```

## Validation

The combobox works with a `Required` validator to check if it is empty.

By default the a check is made which makes sure the value matches an option. This only works if `requireOptionMatch` is set to true.

```js preview-story
export const validation = () => html`
  <lion-combobox name="combo" label="Validation" .validators=${[new Required()]}>
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
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

## Server interaction

It's possible to fetch data from server side. When options are rerendered into the combobox,
the autocompletion (highlighting/selecting etc.) functionality of the combobox is triggered.

```js preview-story
const comboboxData = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
let rejectPrev;
/**
 * @param {string} val
 */
function fetchMyData(val) {
  if (rejectPrev) {
    rejectPrev();
  }
  const results = listboxData.filter(item => item.toLowerCase().includes(val.toLowerCase()));
  return new Promise((resolve, reject) => {
    rejectPrev = reject;
    setTimeout(() => {
      resolve(results);
    }, 1000);
  });
}
class DemoServerSide extends LitElement {
  static get properties() {
    return { options: { type: Array } };
  }

  constructor() {
    super();
    /** @type {string[]} */
    this.options = [];
  }

  get combobox() {
    return /** @type {LionCombobox} */ (this.shadowRoot?.querySelector('#combobox'));
  }

  /**
   * @param {InputEvent & {target: HTMLInputElement}} e
   */
  async fetchMyDataAndRender(e) {
    this.loading = true;
    this.requestUpdate();
    try {
      this.options = await fetchMyData(e.target.value);
      this.loading = false;
      this.requestUpdate();
    } catch (_) {}
  }

  render() {
    return html`
      <lion-combobox
        .showAllOnEmpty="${true}"
        id="combobox"
        @input="${this.fetchMyDataAndRender}"
        .helpText="Returned from server: [${this.options.join(', ')}]"
      >
        <label slot="label" aria-live="polite"
          >Server side completion ${this.loading
            ? html`<span style="font-style: italic;">(loading...)</span>`
            : ''}</label
        >
        ${repeat(
          this.options,
          entry => entry,
          entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `,
        )}
      </lion-combobox>
    `;
  }
}
customElements.define('demo-server-side', DemoServerSide);
export const serverSideCompletion = () => html`<demo-server-side></demo-server-side>`;
```

## Complex options

For performance reasons a complex object in the choiceValue property is unwanted. But it is possible to create more complex options.

To highlight the correct elements of the option, each element should be tagged with a `data-key` attribute. Which will be used in the `_onFilterMatch` and `_onFilterUnmatch` functions.

```js preview-story
class ComplexObjectCombobox extends LionCombobox {
  /**
   * @overridable
   * @param {LionOption & {__originalInnerHTML?:string}} option
   * @param {string} matchingString
   * @protected
   */
  _onFilterMatch(option, matchingString) {
    Array.from(option.children).forEach(child => {
      if (child.hasAttribute('data-key')) {
        this._highlightMatchedOption(child, matchingString);
      }
    });
    // Alternatively, an extension can add an animation here
    option.style.display = '';
  }

  /**
   * @overridable
   * @param {LionOption & {__originalInnerHTML?:string}} option
   * @param {string} [curValue]
   * @param {string} [prevValue]
   * @protected
   */
  _onFilterUnmatch(option, curValue, prevValue) {
    Array.from(option.children).forEach(child => {
      if (child.hasAttribute('data-key')) {
        this._unhighlightMatchedOption(child);
      }
    });
    // Alternatively, an extension can add an animation here
    option.style.display = 'none';
  }
}

customElements.define('complex-object-combobox', ComplexObjectCombobox);

const onModelValueChanged = event => {
  console.log(`event.target.modelValue: ${JSON.stringify(event.target.modelValue)}`);
};

export const complexObjectChoiceValue = () => html` <complex-object-combobox
  name="combo"
  label="Display only the label once selected"
  @model-value-changed="${onModelValueChanged}"
>
  ${lazyRender(
    listboxComplexData.map(
      entry =>
        html`
          <lion-option .choiceValue="${entry.label}">
            <div data-key>${entry.label}</div>
            <small>${entry.description}</small>
          </lion-option>
        `,
    ),
  )}
</complex-object-combobox>`;
```

## Listbox compatibility

All configurations that can be applied to `lion-listbox`, can be applied to `lion-combobox` as well.
See the [listbox documentation](../listbox/overview.md) for more information.
