---
title: 'Use Cases'
parts:
  - Radio Group
  - Use Cases
eleventyNavigation:
  key: 'Radio Group: Use Cases'
  order: 20
  parent: Radio Group
  title: Use Cases
---

# Use Cases

```js script
import { LitElement, html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
```

## Model value

The `modelValue` of a `lion-radio-group` is string equal to the `choiceValue` of the `lion-radio` element that has been checked.

Given the dinosaur example above, say that we were to select the last option (diplodocus).

Then the `modelValue` of the `lion-radio-group` will look as follows:

```js
const groupElement = [parent].querySelector('lion-radio-group');
groupElement.modelValue;
  => "diplodocus";
```

## The `name` attribute

The `name` attribute of a `lion-radio-group` automatically gets assigned to its `lion-radio` children. You can also specify names for the `lion-radio` elements, but if this name is different from the name assigned to `lion-radio-group`, then an exception will be thrown.

Our recommendation would be to set the `name` attribute only on the `lion-radio-group` and not on the `lion-checkbox` elements.

## Pre-select

You can pre-select an option by adding the checked attribute to the selected `lion-radio`.

```js preview-story
export const preSelect = () => html`
  <lion-radio-group name="dinos_2" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue="${'allosaurus'}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${'brontosaurus'}" checked></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
  </lion-radio-group>
`;
```

## Pre-select via `lion-radio-group.modelValue`

You can pre-select an option by setting the `modelValue` of the `lion-radio-group`.

```js preview-story
export const preSelectViaModelValue = () => html`
  <lion-radio-group
    name="dinos_2"
    label="What are your favourite dinosaurs?"
    .modelValue="${'brontosaurus'}"
  >
    <lion-radio label="allosaurus" .choiceValue="${'allosaurus'}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${'brontosaurus'}"></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
  </lion-radio-group>
`;
```

## Dynamic options

When options are fetched asynchronously (e.g. from an API) and rendered dynamically, you can set `.modelValue` simultaneously with the rendered options. `lion-radio-group` waits for its child elements to register before applying the selection:

```js preview-story
export const dynamicOptions = () => {
  const tagName = 'demo-radio-group-dynamic';
  if (!customElements.get(tagName)) {
    customElements.define(
      tagName,
      class extends LitElement {
        static get properties() {
          return {
            options: { type: Array },
            selectedOption: { type: String },
          };
        }

        constructor() {
          super();
          /** @type {{ id: string; name: string }[]} */
          this.options = [];
          this.selectedOption = '';
        }

        connectedCallback() {
          super.connectedCallback();
          // Simulate async data fetch
          setTimeout(() => {
            this.options = [
              { id: 'allosaurus', name: 'Allosaurus' },
              { id: 'brontosaurus', name: 'Brontosaurus' },
              { id: 'diplodocus', name: 'Diplodocus' },
            ];
            this.selectedOption = 'brontosaurus';
          }, 300);
        }

        render() {
          return html`
            <lion-radio-group
              name="dynamic_dinos"
              label="Dynamically loaded dinosaurs"
              .modelValue="${this.selectedOption}"
              @model-value-changed="${(
                /** @type {CustomEvent & { target: { modelValue: string } }} */ e,
              ) => {
                this.selectedOption = e.target.modelValue;
              }}"
            >
              ${this.options.map(
                option => html`
                  <lion-radio label="${option.name}" .choiceValue="${option.id}"></lion-radio>
                `,
              )}
            </lion-radio-group>
            ${this.options.length === 0
              ? html`<p><em>Loading options...</em></p>`
              : html`<p>Selected dinosaur: <strong>${this.selectedOption}</strong></p>`}
          `;
        }
      },
    );
  }
  return html`<demo-radio-group-dynamic></demo-radio-group-dynamic>`;
};
```

## Disabled

You can disable a specific `lion-radio` option by adding the `disabled` attribute.

```js preview-story
export const disabledRadio = () => html`
  <lion-radio-group name="dinos_4" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue="${'allosaurus'}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${'brontosaurus'}" disabled></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
  </lion-radio-group>
`;
```

You can do the same thing for the entire group by setting the `disabled` attribute on the `lion-radio-group` element.

```js preview-story
export const disabledGroup = () => html`
  <lion-radio-group name="dinos_6" label="What are your favourite dinosaurs?" disabled>
    <lion-radio label="allosaurus" .choiceValue="${'allosaurus'}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${'brontosaurus'}"></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
  </lion-radio-group>
`;
```

## Label

You can use `slot="label"` instead of the `label` attribute for defining more complex labels, such as containing screen reader only text or an anchor.

```js preview-story
export const label = () => html`
  <lion-radio-group name="dinos_7" label="Favourite dinosaur">
    <lion-radio .choiceValue="${'allosaurus'}">
      <label slot="label"><strong>allosaurus</strong></label>
    </lion-radio>
    <lion-radio .choiceValue="${'brontosaurus'}">
      <label slot="label"><strong>brontosaurus</strong></label>
    </lion-radio>
    <lion-radio .choiceValue="${'diplodocus'}">
      <label slot="label"><strong>diplodocus</strong></label>
    </lion-radio>
  </lion-radio-group>
`;
```

## Help text

You can add help text on each checkbox with `help-text` attribute on the `<lion-radio>`.

```js preview-story
export const helpText = () => html`
  <lion-radio-group name="dinosTwo" label="Favourite dinosaur">
    <lion-radio
      label="allosaurus"
      .choiceValue="${'allosaurus'}"
      help-text="Allosaurus is a genus of carnivorous theropod dinosaur that lived 155 to 145 million years ago during the late Jurassic period"
    ></lion-radio>
    <lion-radio
      label="brontosaurus"
      .choiceValue="${'brontosaurus'}"
      help-text="Brontosaurus is a genus of gigantic quadruped sauropod dinosaurs"
    ></lion-radio>
    <lion-radio
      label="diplodocus"
      .choiceValue="${'diplodocus'}"
      help-text="Diplodocus is a genus of diplodocid sauropod dinosaurs whose fossils were first discovered in 1877 by S. W. Williston"
    ></lion-radio>
  </lion-radio-group>
`;
```

## Event

You can listen to the `model-value-changed` event whenever the value of the radio group is changed.

```js preview-story
export const event = ({ shadowRoot }) => html`
  <lion-radio-group
    name="dinosTwo"
    label="Favourite dinosaur"
    @model-value-changed=${ev =>
      (ev.target.parentElement.querySelector('#selectedDinosaur').innerText = ev.target.modelValue)}
  >
    <lion-radio label="allosaurus" .choiceValue="${'allosaurus'}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${'brontosaurus'}"></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
  </lion-radio-group>
  <br />
  <span>Selected dinosaur: <strong id="selectedDinosaur">N/A</strong></span>
`;
```
