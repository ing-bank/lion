# Overlay System

Supports different types of overlays like dialogs, toasts, tooltips, dropdown, etc.

Manages their position on the screen relative to other elements, including other overlays.

Its purpose is to make it easy to use our Overlay System declaratively. It can be easily extended where needed, to override event listeners and more.

See [lion-dialog](../dialog) and [lion-tooltip](../tooltip) for example Web Component implementations using the Overlay System.

## Features

- lion-overlay web component:

  - Show content when clicking the invoker
  - Have a `.config` object to set or update the OverlayController's configuration

- [**OverlaysManager**](./docs/OverlaysManager.md), a global repository keeping track of all different types of overlays
- [**OverlayController**](./docs/OverlayController.md), a single controller class for handling overlays
- **OverlayMixin**, a mixin that can be used to create webcomponents that use the OverlayController under the hood

## How to use

Usually you will use `lion-dialog` (or `lion-tooltip` if this makes more sense).

### Installation

```sh
npm i --save @lion/dialog
```

### Example

```js
import '@lion/dialog/lion-dialog.js';

html`
  <lion-dialog .config=${{
    placementMode: 'global',
    viewportConfig: { placement: 'bottom-right' },
  }}>
    <div slot="content">
      This is an overlay
      <button
        @click=${e => e.target.dispatchEvent(new Event('overlay-close', { bubbles: true }))}
      >x</button>
    <div>
    <button slot="invoker">
      Click me
    </button>
  </lion-dialog>
`;
```

Or by creating a controller yourself

```sh
npm i --save @lion/overlays
```

```js
import { OverlayController } from '@lion/overlays';

const ctrl = new OverlayController({
  ...withModalDialogConfig(),
  invokerNode,
  contentNode,
});
```

Or creating your own Web Component which uses the Overlay System

```js
import { LitElement } from '@lion/core';
import { OverlayMixin, withModalDialogConfig } from '@lion/overlays';

class MyOverlayComponent extends LitElement {
  _defineOverlayConfig() {
    return {
      ...withModalDialogConfig,
    };
  }

  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this.__toggle = () => {
      this.opened = !this.opened;
    };

    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.addEventListener('click', this.__toggle);
    }
  }

  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();

    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.removeEventListener('click', this.__toggle);
    }
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
    `;
  }
}
```

## Rationales

For rationales, please check the [docs](./docs) folder, where we go more in-depth. Or check out the Storybook demos which also contains more info.

### Aria roles

- No `aria-controls` as support for it is not quite there yet
- No `aria-haspopup`. People knowing the haspop up and hear about it don’t expect a dialog to open (at this moment in time) but expect a sub-menu. Until support for the dialog value has better implementation, it’s probably best to not use aria-haspopup on the element that opens the modal dialog.
