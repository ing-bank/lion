# Systems >> Overlays >> Overview ||10

Supports different types of overlays like dialogs, toasts, tooltips, dropdown, etc.

Manages their position on the screen relative to other elements, including other overlays.

Its purpose is to make it easy to use our Overlay System declaratively. It can be easily extended where needed, to override event listeners and more.

See [lion-dialog](../../../components/dialog/overview.md) and [lion-tooltip](../../../components/tooltip/overview.md) for example Web Component implementations using the Overlay System.

## Features

- local rendering (at dom location)
  - positioning with popper.js
- global rendering (at body level)
- fully accessible
- flexible to build multiple overlay components
- lion-overlay web component:
  - Show content when clicking the invoker
  - Have a `.config` object to set or update the OverlayController's configuration
- [**OverlaysManager**](./use-cases.md#overlaysmanager), a global repository keeping track of all different types of overlays
- [**OverlayController**](./use-cases.md#overlaycontroller), a single controller class for handling overlays
- [**OverlayMixin**](./use-cases.md#overlaymixin), a mixin that can be used to create webcomponents that use the OverlayController under the hood

Usually you will use `lion-dialog` (or `lion-tooltip` if this makes more sense).

## Installation

```bash
npm i --save @lion/ui
```

### Example

```js
import '@lion/ui/define/lion-dialog.js';

html`
  <lion-dialog .config=${{
    placementMode: 'global',
    viewportConfig: { placement: 'bottom-right' },
  }}>
    <div slot="content">
      This is an overlay
      <button
        @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
      >x</button>
    <div>
    <button slot="invoker">
      Click me
    </button>
  </lion-dialog>
`;
```

Or by creating a controller yourself

```js
import { OverlayController } from '@lion/ui/overlays.js';

const ctrl = new OverlayController({
  ...withModalDialogConfig(),
  invokerNode,
  contentNode,
});
```

Or creating your own Web Component which uses the Overlay System

```js
import { LitElement, html } from 'lit';
import { OverlayMixin, withModalDialogConfig } from '@lion/ui/overlays.js';

class MyOverlayComponent extends OverlayMixin(LitElement) {
  _defineOverlayConfig() {
    return {
      ...withModalDialogConfig(),
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

Please check the [system rationals](./rationale.md) folder, where we go more in-depth.

### Aria roles

- No `aria-controls` as support for it is not quite there yet
- No `aria-haspopup`. People knowing the haspopup and hear about it don’t expect a dialog to open (at this moment in time) but expect a sub-menu. Until support for the dialog value has better implementation, it’s probably best to not use aria-haspopup on the element that opens the modal dialog.
