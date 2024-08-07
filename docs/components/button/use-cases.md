# Button >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-button-reset.js';
import '@lion/ui/define/lion-button-submit.js';
import { LightRenderMixin } from '@lion/ui/core.js';
import { LitElement, css } from 'lit-element';
```

```js preview-story
export const handler1 = () => {
  class MyAccessibleControl extends LightRenderMixin(LitElement) {
    slots = {
      input: this.renderInput,
    };

    render() {
      return html` <div>${this.renderInput()}</div> `;
    }

    renderInput() {
      return html`<input />`;
    }
  }
  customElements.define('my-control', MyAccessibleControl);

  return html`
    <button>test</button>
    <my-control></my-control>
  `;
};
```
