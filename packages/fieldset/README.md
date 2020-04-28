# Fieldset

`lion-fieldset` groups multiple input fields or other fieldsets together.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/forms-fieldset-overview--page) for a live demo and documentation

## How to use

### Installation

```sh
npm i --save @lion/fieldset
```

```js
import '@lion/fieldset/lion-fieldset.js';
import '@lion/input/lion-input.js';
```

### Example

```html
<lion-fieldset name="personalia" label="personalia">
  <lion-input name="title" label="Title"></lion-input>
</lion-fieldset>
```
