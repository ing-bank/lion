# Select

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-select` component is a wrapper around the native `select`.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/forms-select) for a live demo and API documentation

## How to use

### Installation

```sh
npm i --save @lion/select
```

```js
import '@lion/select/lion-select.js';
```

### Example

```html
<lion-select name="favoriteColor" label="Favorite color">
  <select slot="input">
    <option selected hidden value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>
```
