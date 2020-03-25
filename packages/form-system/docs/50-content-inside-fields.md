```js script
import { html } from 'lit-html';
import '@lion/input/lion-input.js';
import '@lion/button/lion-button.js';

export default {
  title: 'Forms/System/Field integrations',
};
```

# Content inside fields

Due to our custom inputs being Web Components, it is possible to put HTML content inside an input.
For example if you want to add a button as a prefix or suffix.

```js preview-story
export const ButtonsWithFields = () => html`
  <lion-input label="Prefix and suffix">
    <lion-button slot="prefix" type="button">prefix</lion-button>
    <lion-button slot="suffix" type="button">suffix</lion-button>
  </lion-input>
`;
```
