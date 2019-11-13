# Creating a custom field

Custom fields can be created in just a few steps. All you need is an interaction element
(like for instance a slider, a listbox or a combobox) and connect it to the [Field](../README.md)
functionality.

## Prerequisite: an interaction element

An interaction element provides the means for the end user to enter a certain value, just like
native elements provide in this (think of `<input>`, `<textarea>` and `<select>`).
An example of a non native element is the
[slider design pattern](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/#slider)
described here.

For this tutorial, we assume we have a component `<my-slider>` that exposes its value via property
`mySliderValue` and sends an event `my-slider-changed` on every value change. To make it focusable,
it has a tabindex=“0” applied.

## Connecting the interaction element to the field

Now we want to integrate the slider in our form framework to enrich the user interface, get
validation support and get all the other [benefits of LionField](../README.md).
We start of by creating a component `<lion-slider>` that extends from `LionField`.
Then we follow the steps below:

- ### 1. Add your interaction element as ‘input slot'

  Here you return the element the user interacts with. By configuring it as a slot, it will end up
  in light DOM, ensuring the best accessibility for the end user.

- ### 2. Proxy event `my-slider-changed` to `user-input-changed` event

  The `user-input-changed` event is listened to by the FormatMixin: it should be regarded as the
  equivalent of the `input` event of the platform, but for custom built interaction elements.

- ### 3. Proxy property `<my-slider>.mySliderValue` to `<lion-slider>.value`

  Every time the `user-input-changed` fires, the value of `<my-slider>` is synchronized with the
  [`modelValue`](./modelValue.md) of `<my-slider>`. Now the cycle is complete: the modelValue connects
  your interaction element to all logic inside the LionField.

Steps as described can be implemented with the following javascript:

```js
import { LionField } from '@lion/field';
import './my-slider.js';

export class LionSlider extends LionField {
  // 1. Add your interaction element as ‘input slot'
  get slots() {
    return {
      ...super.slots,
      input: () => document.createElement(‘my-slider’),
    };
  }

  // 2. Proxy event `my-slider-changed` to `user-input-changed` event
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('my-slider-changed',  this._proxyChangeEvent);
  }

  _proxyChangeEvent() {
    this._inputNode.dispatchEvent(
      new CustomEvent('user-input-changed', { bubbles: true, composed: true }),
    );
  }

  // 3. Proxy property `<my-slider>.mySliderValue` to `<lion-slider>.value`
  get value() {
    return this.querySelector('[slot=input]').mySliderValue;
  }

  set value(newV) {
    this.querySelector('[slot=input]').mySliderValue = newV;
  }
}
```

That was all. Now you can enhance your slider by writing custom validators for it
or by writing a parser to get a custom modelValue type.
