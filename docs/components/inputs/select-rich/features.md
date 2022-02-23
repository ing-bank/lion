# Inputs >> Select Rich >> Features ||20

```js script
import { LitElement, html } from '@mdjs/mdjs-preview';
import '@lion/listbox/define';
import '@lion/select-rich/define';
```

## Model value

You can set the full `modelValue` for each option, which includes the checked property for whether it is checked or not.

```html
<lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
```

## Options with HTML

The main feature of this rich select that makes it rich, is that your options can contain HTML.

```js preview-story
export const optionsWithHTML = () => html`
  <lion-select-rich label="Favorite color" name="color">
    <lion-option .modelValue=${{ value: 'red', checked: false }}>
      <p style="color: red;">I am red</p>
      <p>and multi Line</p>
    </lion-option>
    <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>
      <p style="color: hotpink;">I am hotpink</p>
      <p>and multi Line</p>
    </lion-option>
    <lion-option .modelValue=${{ value: 'teal', checked: false }}>
      <p style="color: teal;">I am teal</p>
      <p>and multi Line</p>
    </lion-option>
  </lion-select-rich>
`;
```

## Many Options with Scrolling

```js preview-story
export const manyOptionsWithScrolling = () => html`
  <style>
    #scrollSelectRich lion-options {
      max-height: 200px;
      overflow-y: auto;
      display: block;
    }
  </style>
  <lion-select-rich id="scrollSelectRich" label="Favorite color" name="color">
    <lion-option .modelValue=${{ value: 'red', checked: false }}>
      <p style="color: red;">I am red</p>
    </lion-option>
    <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>
      <p style="color: hotpink;">I am hotpink</p>
    </lion-option>
    <lion-option .modelValue=${{ value: 'teal', checked: false }}>
      <p style="color: teal;">I am teal</p>
    </lion-option>
    <lion-option .modelValue=${{ value: 'green', checked: false }}>
      <p style="color: green;">I am green</p>
    </lion-option>
    <lion-option .modelValue=${{ value: 'blue', checked: false }}>
      <p style="color: blue;">I am blue</p>
    </lion-option>
  </lion-select-rich>
`;
```

## Read only prefilled

You can set the rich select as read only.
This will block the user from opening the select.

The readonly attribute is delegated to the invoker for disabling opening the overlay, and for styling purposes.

```js preview-story
export const readOnlyPrefilled = () => html`
  <lion-select-rich label="Read-only select" readonly name="color">
    <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
    <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
    <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
  </lion-select-rich>
`;
```

## Disabled Select

You can set the `disabled` attribute to disable either specific options or the entire select.

If you disable the entire select, the disabled attribute is also delegated to the invoker, similar to readonly.

```js preview-story
export const disabledSelect = () => html`
  <lion-select-rich label="Disabled select" disabled name="color">
    <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
    <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
    <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
  </lion-select-rich>
`;
```

```js preview-story
export const disabledOption = () => html`
  <lion-select-rich label="Disabled options" name="color">
    <lion-option .choiceValue=${'red'} disabled>Red</lion-option>
    <lion-option .choiceValue=${'blue'}>Blue</lion-option>
    <lion-option .choiceValue=${'hotpink'} disabled>Hotpink</lion-option>
    <lion-option .choiceValue=${'green'}>Green</lion-option>
    <lion-option .choiceValue=${'teal'} disabled>Teal</lion-option>
  </lion-select-rich>
`;
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
    shadowRoot.getElementById('demoRenderOutput').innerHTML = JSON.stringify(
      ev.target.modelValue,
      null,
      2,
    );
  }
  return html`
    <lion-select-rich label="Credit Card" name="color" @model-value-changed=${showOutput}>
      ${objs.map(
        obj => html`
          <lion-option .modelValue=${{ value: obj, checked: false }}>${obj.label}</lion-option>
        `,
      )}
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

```js preview-story
export const interactionMode = () => html`
  <lion-select-rich label="Mac mode" name="color" interaction-mode="mac">
    <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
    <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
    <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
  </lion-select-rich>
  <lion-select-rich label="Windows/Linux mode" name="color" interaction-mode="windows/linux">
    <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
    <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
    <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
  </lion-select-rich>
`;
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
        const selectEl = shadowRoot.getElementById('checkedRichSelect');
        selectEl.checkedIndex = e.target.value;
      }}
    />
  </div>
  <button
    class="log-button"
    @click=${() => {
      const selectEl = shadowRoot.getElementById('checkedRichSelect');
      console.log(`checkedIndex: ${selectEl.checkedIndex}`);
      console.log(`checkedValue: ${selectEl.checkedValue}`);
    }}
  >
    Console log checked index and value
  </button>
  <lion-select-rich id="checkedRichSelect" name="favoriteColor" label="Favorite color">
    <lion-option .choiceValue=${'red'}>Red</lion-option>
    <lion-option .choiceValue=${'hotpink'} checked>Hotpink</lion-option>
    <lion-option .choiceValue=${'teal'}>Teal</lion-option>
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

```js preview-story
export const noDefaultSelection = () => html`
  <lion-select-rich name="favoriteColor" label="Favorite color" has-no-default-selected>
    <lion-option .choiceValue=${'red'}>Red</lion-option>
    <lion-option .choiceValue=${'hotpink'}>Hotpink</lion-option>
    <lion-option .choiceValue=${'teal'}>Teal</lion-option>
  </lion-select-rich>
`;
```

> By default, the placeholder is completely empty in the `LionSelectInvoker`,
> but subclassers can easily override this in their extension, by the overriding `_noSelectionTemplate()` method.

## Single Option

If there is a single option rendered, then `singleOption` property is set to `true` on `lion-select-rich` and invoker as well. Invoker also gets `single-option` which can be used to having desired templating and styling. As in here the arrow is not displayed for single option

```js preview-story
export const singleOption = () => html`
  <lion-select-rich label="Single Option" name="color">
    <lion-option .choiceValue=${'red'}>Red</lion-option>
  </lion-select-rich>
`;
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
      <button @click=${this.addOption}>Add an option</button>
      <button @click=${this.removeOption}>Remove last option</button>
      <lion-select-rich name="favoriteColor" label="Favorite color">
        <lion-options slot="input">
          ${this.options.map(
            option => html` <lion-option .choiceValue=${option}>${option}</lion-option> `,
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
This means it will get the selected value(s) as an input property `.selectedElement`.

You can use this `selectedElement` to then render the content to your own invoker.

```html
<lion-select-rich>
  <my-invoker-button slot="invoker"></my-invoker-button>
  ...
</lion-select-rich>
```

An example of how such a custom invoker class could look like:

```js
class MyInvokerButton extends LitElement() {
  static get properties() {
    return {
      selectedElement: {
        type: Object,
      };
    }
  }

  _contentTemplate() {
    if (this.selectedElement) {
      const labelNodes = Array.from(this.selectedElement.childNodes);
      // Nested html in the selected option
      if (labelNodes.length > 0) {
        // Cloning is important if you plan on passing nodes straight to a lit template
        return labelNodes.map(node => node.cloneNode(true));
      }
      // Or if it is just text inside the selected option, no html
      return this.selectedElement.textContent;
    }
    return ``;
  }

  render() {
    return html`
      <div>
        ${this._contentTemplate()}
      </div>
    `;
  }
}
```

> This example only works if your option elements don't have ShadowDOM boundaries themselves.
> Cloning deeply only works up until the first shadow boundary.
