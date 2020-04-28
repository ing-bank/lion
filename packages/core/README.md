# Core

`lion-input-amount` component is based on the generic text input field. Its purpose is to provide a way for users to fill in an amount.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/core) for a live demo and API documentation

## How to use

### Installation

```sh
npm i --save @lion/core
```

```js
import { dedupeMixin, LitElement } from '@lion/core';
```

### Example

```js
const BaseMixin = dedupeMixin((superClass) => {
  return class extends superClass { ... };
});
```
