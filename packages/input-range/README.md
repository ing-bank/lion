# Input range

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-input-range` component is based on the native range input.
Its purpose is to provide a way for users to select one value from a range of values.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/forms-input-range) for a live demo and API documentation

## How to use

### Installation

```sh
npm i --save @lion/input-range
```

```js
import '@lion/input-range/lion-input-range.js';
```

### Example

```html
<lion-input-range min="200" max="500" .modelValue="${300}" label="Input range"></lion-input-range>
```
