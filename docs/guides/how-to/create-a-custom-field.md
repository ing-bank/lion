# How To >> Create a custom field ||20

```js script
import { html, css, LitElement } from '@lion/core';
import { LionField } from '@lion/form-core';
import '@lion/form-core/define';
import '../../docs/systems/form/assets/h-output.js';

// A) the custom [slot=input] or 'HTMLElementWithValue'
class DummySlider extends LitElement {
  // A1) it should have a .value property of type 'string'
  static properties = { value: String, reflect: true };

  static styles = [
    css`
      :host {
        display: block;
        padding-top: 16px;
        padding-bottom: 16px;
      }

      [part='rail'] {
        position: relative;
        display: block;
        background: #eee;
        height: 8px;
        border-radius: 8px;
      }

      [part='thumb'] {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        background: black;
        color: white;
        border-radius: 50%;
        height: 24px;
        width: 24px;
        top: 50%;
        transform: translateY(-50%);
        transition: left 0.5s ease 0s;
      }
    `,
  ];

  constructor() {
    super();
    this.value = '0';
    this.addEventListener('click', ev => {
      this.value = `${Math.round(
        ((ev.clientX - this.getClientRects()[0].x) / this.offsetWidth) * 5,
      )}`;
      // A2) it should have a way to tell LionField its value changed
      this.dispatchEvent(new Event('dummy-slider-changed', { bubbles: true }));
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('tabindex', 0);
  }

  render() {
    return html` <div part="rail">
      <span part="thumb" style="left:${Number(this.value) * 20}%;">${this.value}</span>
    </div>`;
  }
}
if (!customElements.get('dummy-slider')) {
  customElements.define('dummy-slider', DummySlider);
}
```

Custom Fields can be created in just a few steps. All you need is an interaction element (like for instance a slider, a listbox or a combobox) and connect it to the [LionField](../../components/inputs/input/overview.md).

> In case you want to extend a native element, follow [Extend a native Input](./extend-a-native-input.md).

## A) an interaction element

An interaction element (.\_inputNode) provides the means for the end user to enter a certain value,
just like native elements provide in this (think of input, textarea and select).
An example of a non native element is the [slider design pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#slider) described here.

For this tutorial, we create a dummy component 'dummy-slider' that exposes its value via
property `.value` and sends an event `dummy-slider-changed` on every value change.
To make it focusable, it has a tabindex=“0” applied.

```js preview-story
export const createAnInteractiveElement = () => {
  // A) the custom [slot=input] or 'HTMLElementWithValue'
  class DummySlider extends LitElement {
    // A1) it should have a .value property of type 'string'
    static properties = { value: String };

    constructor() {
      super();
      this.value = 0;
      this.addEventListener('click', ev => {
        this.value = `${Math.round(
          ((ev.clientX - this.getClientRects()[0].x) / this.offsetWidth) * 5,
        )}`;
        // A2) it should have a way to tell LionField its value changed
        this.dispatchEvent(new Event('dummy-slider-changed', { bubbles: true }));
      });
    }

    connectedCallback() {
      super.connectedCallback();
      this.setAttribute('tabindex', 0);
    }

    render() {
      return html` <div part="rail">
        <span part="thumb" style="left:${Number(this.value) * 20}%;">${this.value}</span>
      </div>`;
    }
  }
  return html`<dummy-slider></dummy-slider>`;
};
```

## B) your LionField extension

Now we want to integrate the slider in our form framework to enrich the user interface, get
validation support and all other [benefits of LionField](../../components/inputs/input/overview.md).
We start by creating a component `<slider-field>` that extends from `LionField`.
Then we follow the steps below:

- **Add your interaction element**

  Here you return the element the user interacts with. By configuring it as a slot, it will end up in
  light DOM, ensuring the best accessibility for the end user.

- **Connect modelValue**

  The `user-input-changed` event is listened to by the FormatMixin: it should be regarded as the
  equivalent of the `input` event of the platform, but for custom built interaction elements.
  You now synchronized [modelValue](../../docs/systems/form/model-value.md), which can be regarded as
  the glue to integrate all other functionality like parsing/formatting/serializing, validating,
  tracking interaction states etc.

Implement with the following code:

```js preview-story
export const createAField = () => {
  // B) your extension with all the Field goodness...
  class SliderField extends LionField {
    // B1) Add your interaction element as ‘input slot'
    get slots() {
      return {
        ...super.slots,
        input: () => document.createElement('dummy-slider'),
      };
    }

    // B2) Connect modelValue
    constructor() {
      super();
      this.addEventListener('dummy-slider-changed', ev => {
        ev.stopPropagation();
        this.dispatchEvent(new Event('user-input-changed'));
      });
    }

    get value() {
      return this._inputNode.value;
    }

    set value(newV) {
      this._inputNode.value = newV;
    }
  }
  customElements.define('slider-field', SliderField);

  return html`<slider-field
      label="SliderField"
      help-text="Press to see how modelValue is synchronized"
    ></slider-field>
    <h-output .show="${['modelValue', 'touched', 'dirty', 'focused']}"></h-output>`;
};
```

That was all!

Now you can enhance your slider by writing custom Validators for it or by
writing a parser to get a custom modelValue type.
