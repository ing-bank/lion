# Combobox Extensions

```js script
import { html } from 'lit-html';
import './md-combobox/md-combobox.js';
import './md-combobox/md-input.js';

export default {
  title: 'Forms/Combobox/Extensions',
};
```

```js preview-story
export const MaterialDesign = () => html`
  <md-combobox name="combo" label="Default">
    <md-option .choiceValue=${'Apple'}>Apple</md-option>
    <md-option .choiceValue=${'Artichoke'}>Artichoke</md-option>
    <md-option .choiceValue=${'Asparagus'}>Asparagus</md-option>
    <md-option .choiceValue=${'Banana'}>Banana</md-option>
    <md-option .choiceValue=${'Beets'}>Beets</md-option>
  </md-combobox>
`;
```
