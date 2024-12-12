# Radio Group >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
import '@lion/ui/define/lion-radio-with-user-value.js';
import { LionRadioWithUserValue } from '@lion/ui/radio-group.js';
import { LionCollapsible } from '@lion/ui/collapsible.js';
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
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/allosaurus" target="_blank">allosaurus</a></label
      >
    </lion-radio>
    <lion-radio .choiceValue="${'brontosaurus'}">
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/brontosaurus" target="_blank">brontosaurus</a></label
      >
    </lion-radio>
    <lion-radio .choiceValue="${'diplodocus'}">
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/diplodocus" target="_blank">diplodocus</a></label
      >
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

## Option by user input

You can add an option where user can set the value.

```js preview-story
export const userValue = ({ shadowRoot }) => html`
  <lion-radio-group
    name="dinosTwo"
    label="Favourite dinosaur"
    @model-value-changed=${ev =>
      (ev.target.parentElement.querySelector('#selectedDinosaurWithUserValue').innerText =
        ev.target.modelValue)}
  >
    <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
    <lion-radio label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
    <lion-radio-with-user-value label="other:"></lion-radio-with-user-value>
  </lion-radio-group>
  <br />
  <span>Selected dinosaur: <strong id="selectedDinosaurWithUserValue">N/A</strong></span>
`;
```

The `user-input` can observe whether it is selected or not by using the `createMutationObserver` class method.

```js preview-story
export const userValueObservingOption = ({ shadowRoot }) => {
  class CollapsibleUserInput extends LionCollapsible {
    connectedCallback() {
      super.connectedCallback();
      const observer = LionRadioWithUserValue.createMutationObserver(mutation => {
        if (mutation.target.dataset.checked === 'true') {
          this.opened = true;
        } else {
          this.opened = false;
        }
      });
      observer.observe(this.shadowRoot?.host, { attributes: true });
    }
  }
  customElements.define('collapsible-user-input', CollapsibleUserInput);

  return html`
    <lion-radio-group
      name="dinosTwo"
      label="Favourite dinosaur"
      @model-value-changed=${ev =>
        (ev.target.parentElement.querySelector('#selectedDinosaurWithUserValue2').innerText =
          ev.target.modelValue)}
    >
      <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
      <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
      <lion-radio label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
      <lion-radio-with-user-value label="other">
        <collapsible-user-input slot="user-input">
          <input slot="content"></input>
        </collapsible-user-input>
      </lion-radio-with-user-value>
    </lion-radio-group>
    <br />
    <span>Selected dinosaur: <strong id="selectedDinosaurWithUserValue2">N/A</strong></span>
  `;
};
```
