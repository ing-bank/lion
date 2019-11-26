# Dialog

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-dialog` is a component wrapping a modal dialog controller
Its purpose is to make it easy to use our Overlay System declaratively
With regards to modal dialogs, this is one of the more commonly used examples of overlays.

## Features

- Show content when clicking the invoker
- Respond to close event in the slot="content" element, to close the content
- Have a `.config` object to set or update the OverlayController's configuration

## How to use

### Installation

```sh
npm i --save @lion/dialog
```

```js
import '@lion/dialog/lion-dialog.js';
```

### Example

```js
html`
  <lion-dialog>
    <div slot="content" class="tooltip" .config=${{
      viewportConfig: { placement: 'bottom-right' },
    }}>
      This is a dialog
      <button
        @click=${e => e.target.dispatchEvent(new Event('close', { bubbles: true }))}
      >x</button>
    <div>
    <button slot="invoker">
      Click me
    </button>
  </lion-dialog>
`;
```
