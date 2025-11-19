/** script code **/
import { html, css, LitElement } from '@mdjs/mdjs-preview';
import { LionField } from '@lion/ui/form-core.js';
import '@lion/ui/define/lion-field.js';
import '@lion/ui/define/lion-validation-feedback.js';

import '@lion/demo-systems/form/assets/h-output.js';

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
        transform: translateY(-50%) translateX(-50%);
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
/** stories code **/
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
      // Remember we should always return type 'string' here
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
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'createAnInteractiveElement', story: createAnInteractiveElement }, { key: 'createAField', story: createAField }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}