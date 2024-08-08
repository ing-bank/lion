# Button >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import './MyAccessibleControl.mjs';
import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-button-reset.js';
import '@lion/ui/define/lion-button-submit.js';
```

```js preview-story
export const handler1 = () => {
  return html`
    <button>test</button>
    <my-control></my-control>
  `;
};
```
