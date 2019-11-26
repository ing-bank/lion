# Overlays System

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

> Note: Migrating from the old system (`overlays.add(new SomeController({...}))`)? Please check out our [migration guidelines](./docs/migration.md)

Supports different types of overlays like dialogs, toasts, tooltips, dropdown, etc.

Manages their position on the screen relative to other elements, including other overlays.

Exports `lion-overlay`, which is a generic component wrapping OverlayController.
Its purpose is to make it easy to use our Overlay System declaratively. It can be easily extended where needed, to override event listeners and more.

## Features

- lion-overlay web component:

  - Show content when clicking the invoker
  - Respond to overlay-close event in the slot="content" element, to close the content
  - Have a `.config` object to set or update the OverlayController's configuration

- [**OverlaysManager**](./docs/OverlaysManager.md), a global repository keeping track of all different types of overlays
- [**OverlayController**](./docs/OverlayController.md), a single controller class for handling overlays
- **OverlayMixin**, a mixin that can be used to create webcomponents that use the OverlayController under the hood

## How to use

### Installation

```sh
npm i --save @lion/overlays
```

### Example

```js
import '@lion/overlays/lion-overlay.js';

html`
  <lion-overlay>
    <div slot="content" class="tooltip" .config=${{
      placementMode: global,
      viewportConfig: { placement: 'bottom-right' },
    }}>
      This is an overlay
      <button
        @click=${e => e.target.dispatchEvent(new Event('overlay-close', { bubbles: true }))}
      >x</button>
    <div>
    <button slot="invoker">
      Click me
    </button>
  </lion-overlay>
`;
```

Or by creating a controller yourself

```js
import { OverlayController } from '@lion/overlays';

const ctrl = new OverlayController({
  ...withModalDialogConfig(),
  invokerNode,
  contentNode,
});
```

## Rationales

For rationales, please check the [docs](./docs) folder, where we go more in-depth.

### Aria roles

- No `aria-controls` as support for it is not quite there yet
- No `aria-haspopup`. People knowing the haspop up and hear about it don’t expect a dialog to open (at this moment in time) but expect a sub-menu. Until support for the dialog value has better implementation, it’s probably best to not use aria-haspopup on the element that opens the modal dialog.
