# Select Rich >> Use Cases ||20

```js script
import { LitElement, html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';
```

## Model value

You can set the full `modelValue` for each option, which includes the checked property for whether it is checked or not.

```html
<lion-option .modelValue="${{ value: 'red', checked: false }}">Red</lion-option>
```

## Options with HTML

The main feature of this rich select that makes it rich, is that your options can contain HTML.

```html preview-story
<lion-select-rich label="Favorite color" name="color">
  <lion-option .choiceValue="${'red'}">
    <p style="color: red;">I am red</p>
    <p>and multi Line</p>
  </lion-option>
  <lion-option .choiceValue="${'hotpink'}" checked>
    <p style="color: hotpink;">I am hotpink</p>
    <p>and multi Line</p>
  </lion-option>
  <lion-option .choiceValue="${'teal'}">
    <p style="color: teal;">I am teal</p>
    <p>and multi Line</p>
  </lion-option>
</lion-select-rich>
```

## Many Options with Scrolling

```js preview-story
export const manyOptionsWithScrolling = () => {
  const modelValues = [
    { value: 'red', checked: false },
    { value: 'hotpink', checked: true },
    { value: 'teal', checked: false },
    { value: 'green', checked: false },
    { value: 'blue', checked: false },
  ];
  return html`
  <style>
    #scrollSelectRich lion-options {
      max-height: 200px;
      overflow-y: auto;
      display: block;
    }
  </style>
  <lion-select-rich id="scrollSelectRich" label="Favorite color" name="color">
    <lion-option .modelValue="${modelValues[0]}">
      <p style="color: red;">I am red</p>
    </lion-option>
    <lion-option .modelValue="${modelValues[1]}">
      <p style="color: hotpink;">I am hotpink</p>
    </lion-option>
    <lion-option .modelValue="${modelValues[2]}">
      <p style="color: teal;">I am teal</p>
    </lion-option>
    <lion-option .modelValue="${modelValues[3]}">
      <p style="color: green;">I am green</p>
    </lion-option>
    <lion-option .modelValue"="${modelValues[4]}"">
      <p style="color: blue;">I am blue</p>
    </lion-option>
  </lion-select-rich>
`;
};
```

## Read only prefilled

You can set the rich select as read only.
This will block the user from opening the select.

The readonly attribute is delegated to the invoker for disabling opening the overlay, and for styling purposes.

```html preview-story
<lion-select-rich label="Read-only select" readonly name="color">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${'teal'}">Teal</lion-option>
</lion-select-rich>
```

## Disabled Select

You can set the `disabled` attribute to disable either specific options or the entire select.

If you disable the entire select, the disabled attribute is also delegated to the invoker, similar to readonly.

```html preview-story
<lion-select-rich label="Disabled select" disabled name="color">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${'teal'}">Teal</lion-option>
</lion-select-rich>
```

```html preview-story
<lion-select-rich label="Disabled options" name="color">
  <lion-option .choiceValue="${'red'}" disabled>Red</lion-option>
  <lion-option .choiceValue="${'blue'}">Blue</lion-option>
  <lion-option .choiceValue="${'hotpink'}" disabled>Hotpink</lion-option>
  <lion-option .choiceValue="${'green'}">Green</lion-option>
  <lion-option .choiceValue="${'teal'}" disabled>Teal</lion-option>
</lion-select-rich>
```

## Render options

The choiceValue can also be a complex value like an Object.

It is up to you how to render this Object in the DOM.

```js preview-story
export const renderOptions = ({ shadowRoot }) => {
  const objs = [
    { type: 'mastercard', label: 'Master Card', amount: 12000, active: true },
    { type: 'visacard', label: 'Visa Card', amount: 0, active: false },
  ];
  function showOutput(ev) {
    shadowRoot.querySelector('#demoRenderOutput').innerHTML = JSON.stringify(
      ev.target.modelValue,
      null,
      2,
    );
  }
  return html`
    <lion-select-rich label="Credit Card" name="color" @model-value-changed="${showOutput}">
      ${objs.map(obj => html` <lion-option .choiceValue="${obj}">${obj.label}</lion-option> `)}
    </lion-select-rich>
    <p>Full value:</p>
    <pre id="demoRenderOutput"></pre>
  `;
};
```

## Interaction Mode

You can set the interaction mode to either `mac` or `windows/linux`.
By default, it will choose based on the user Operating System, but it can be forced.

This changes the keyboard interaction.

```html preview-story
<lion-select-rich label="Mac mode" name="color" interaction-mode="mac">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${'teal'}">Teal</lion-option>
</lion-select-rich>
<lion-select-rich label="Windows/Linux mode" name="color" interaction-mode="windows/linux">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${'teal'}">Teal</lion-option>
</lion-select-rich>
```

## Checked index & value

You can get/set the checkedIndex and checkedValue.

```js preview-story
export const checkedIndexAndValue = ({ shadowRoot }) => html`
  <style>
    .log-button {
      margin: 10px 0;
    }
  </style>
  <div>
    <label id="label-richSelectCheckedInput" for="richSelectCheckedInput">
      Set the checkedIndex
    </label>
    <input
      id="richSelectCheckedInput"
      aria-labelledby="label-richSelectCheckedInput"
      type="number"
      @change=${e => {
        const selectEl = shadowRoot.querySelector('#checkedRichSelect');
        selectEl.checkedIndex = Number(e.target.value);
      }}
    />
  </div>
  <button
    class="log-button"
    @click=${() => {
      const selectEl = shadowRoot.querySelector('#checkedRichSelect');
      console.log(`checkedIndex: ${selectEl.checkedIndex}`);
      console.log(`modelValue: ${selectEl.modelValue}`);
    }}
  >
    Console log checked index and value
  </button>
  <lion-select-rich id="checkedRichSelect" name="favoriteColor" label="Favorite color">
    <lion-option .choiceValue="${'red'}">Red</lion-option>
    <lion-option .choiceValue="${'hotpink'}" checked>Hotpink</lion-option>
    <lion-option .choiceValue="${'teal'}">Teal</lion-option>
  </lion-select-rich>
`;
```

## No default selection

If you want to set a placeholder option with something like 'Please select', you can of course do this, the same way you would do it in a native select.

Simply put an option with a modelValue that is `null`.

```html
<lion-option .choiceValue="${null}">select a color</lion-option>
```

However, this allows the user to explicitly select this option.

Often, you may want a placeholder that appears initially, but cannot be selected explicitly by the user.
For this you can use `has-no-default-selected` attribute.

```html preview-story
<lion-select-rich name="favoriteColor" label="Favorite color" has-no-default-selected>
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}">Hotpink</lion-option>
  <lion-option .choiceValue="${'teal'}">Teal</lion-option>
</lion-select-rich>
```

> By default, the placeholder is completely empty in the `LionSelectInvoker`,
> but subclassers can easily override this in their extension, by the overriding `_noSelectionTemplate()` method.

## Single Option

If there is a single option rendered, then `singleOption` property is set to `true` on `lion-select-rich` and invoker as well. Invoker also gets `single-option` which can be used to having desired templating and styling. As in here the arrow is not displayed for single option

```html preview-story
<lion-select-rich label="Single Option" name="color">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
</lion-select-rich>
```

When adding/removing options the `singleOption` will only be `true` when there is exactly one option.

```js preview-story
class SingleOptionRemoveAdd extends LitElement {
  static get properties() {
    return {
      options: { type: Array },
    };
  }

  constructor() {
    super();
    this.options = ['Option 1', 'Option 2'];
  }

  render() {
    return html`
      <button @click="${this.addOption}">Add an option</button>
      <button @click="${this.removeOption}">Remove last option</button>
      <lion-select-rich name="favoriteColor" label="Favorite color">
        <lion-options slot="input">
          ${this.options.map(
            option => html` <lion-option .choiceValue="${option}">${option}</lion-option> `,
          )}
        </lion-options>
      </lion-select-rich>
    `;
  }

  addOption() {
    this.options.push(`Option ${this.options.length + 1} with a long title`);
    this.options = [...this.options];
    this.requestUpdate();
  }

  removeOption() {
    if (this.options.length >= 2) {
      this.options.pop();
      this.options = [...this.options];
      this.requestUpdate();
    }
  }
}

customElements.define('single-option-remove-add', SingleOptionRemoveAdd);

export const singleOptionRemoveAdd = () => {
  return html`<single-option-remove-add></single-option-remove-add>`;
};
```

## Custom Invoker

You can provide a custom invoker using the invoker slot.
LionSelectRich will give it acces to:

- the currently selected option via `.selectedElement`
- LionSelectRich itself, via `.hostElement`

Code of an advanced custom invoker is shown below (this is the code for the
invoker used in [IntlSelectRich](./examples.md)).
The invoker is usually added in the invoker slot of the LionSelectRich subclass.
However, it would also be possible for an application developer to provide the invoker
by putting it in light dom:

```html
<lion-select-rich>
  <intl-select-invoker slot="invoker"></intl-select-invoker>
  ...
</lion-select-rich>
```

```js
import { LionSelectInvoker } from '@lion/ui/select-rich.js';

class IntlSelectInvoker extends LionSelectInvoker {
  /**
   * 1. Add your own styles
   * @configure LitElement
   * @enhance LionSelectInvoker
   */
  static styles = [
    /** <your custom styles> see IntlSelectRich listed above */
  ];

  /**
   * 2. Take back control of slots (LionSelectInvoker adds slots you most likely don't want)
   * @configure SlotMixin
   * @override LionSelectInvoker
   */
  get slots() {
    return {};
  }

  /**
   * 3. Add you custom render function
   * @override LionSelectInvoker
   */
  render() {
    const ctor = /** @type {typeof LionSelectInvoker} */ (this.constructor);
    return ctor._mainTemplate(this._templateData);
  }

  get _templateData() {
    return {
      data: { selectedElement: this.selectedElement, hostElement: this.hostElement },
    };
  }

  static _mainTemplate(templateData) {
    /** <your custom template> see IntlSelectRich listed above */
  }
}
```

> This example only works if your option elements don't have ShadowDOM boundaries themselves.
> Cloning deeply only works up until the first shadow boundary.
