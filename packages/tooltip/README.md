# Tooltip

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-tooltip` is a component used for basic popups on hover.
Its purpose is to show content appearing when the user hovers over an invoker element with the cursor or with the keyboard,
or if the invoker element is focused.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/overlays-specific-wc-tooltip) for a live demo and API documentation

## How to use

### Installation

```sh
npm i --save @lion/tooltip
```

```js
import '@lion/tooltip/lion-tooltip.js';
```

### Example

```html
<lion-tooltip>
  <button slot="invoker">Hover me</button>
  <div slot="content">This is a tooltip<div>
</lion-tooltip>
```
