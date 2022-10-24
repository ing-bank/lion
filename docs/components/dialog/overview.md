# Dialog >> Overview ||10

A web component that wraps a modal dialog controller.
Its purpose is to make it easy to use our Overlay System declaratively.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-dialog.js';

import { demoStyle } from './src/demoStyle.js';
```

```js preview-story
export const main = () => html`
  <style>
    ${demoStyle}
  </style>
  <lion-dialog>
    <button slot="invoker">Click me to open dialog</button>
    <div slot="content" class="dialog">
      Hello! You can close this dialog here:
      <button
        class="close-button"
        @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
      >
        ⨯
      </button>
    </div>
  </lion-dialog>
`;
```

## Features

- Show content when clicking the invoker
- Respond to close event in the slot="content" element, to close the content
- Have a `.config` object to set or update the OverlayController's configuration

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionDialog } from '@lion/ui/dialog.js';
// or
import '@lion/ui/define/lion-dialog.js';
```

- Your `slot="content"` node will be moved to the global overlay container during initialization.
  After, your content node is no longer a child of `lion-dialog`.
  If you still need to access it from the `lion-dialog` you can do so by using the `._overlayContentNode` property.
- To close the overlay from within the content node, you need to dispatch a `close-overlay` event that bubbles.
  It has to be able to reach the content node.
- If you need to traverse shadow boundaries, you will have to add `composed: true` as well, although this is discouraged as a practice.

## Changing the configuration

You can use the `config` property on the dialog to change the configuration.
The documentation of the full config object can be found in the `lion/overlay` package or here in [Overlay System - Configuration](../../fundamentals/systems/overlays/configuration.md).

The `config` property uses a setter to merge the passed configuration with the current, so you only **overwrite what you pass** when updating `config`.
