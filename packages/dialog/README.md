# Dialog

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-dialog` is a component wrapping a modal dialog controller.
Its purpose is to make it easy to use our Overlay System declaratively.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/overlays-specific-wc-dialog) for a live demo and documentation

## How to use

### Installation

```sh
npm i --save @lion/dialog
```

```js
import '@lion/dialog/lion-dialog.js';
```

### Example

```html
<lion-dialog>
  <div slot="content">
    This is a dialog
    <button @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}>x</button>
  <div>
  <button slot="invoker">Click me</button>
</lion-dialog>
```
