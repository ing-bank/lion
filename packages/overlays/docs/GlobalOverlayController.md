# GlobalOverlayController

This is a base class for different global overlays (e.g. a dialog, see [Overlay System: Scope](./OverlaySystemScope.md) - the ones positioned relatively to the viewport).

You should not use this controller directly unless you want to create a unique type of global overlays which is not supported out of the box. But for implementation details check out [Overlay System: Implementation](./OverlaySystemImplementation.md).

All supported types of global overlays are described below.

## How to use

### Installation

```sh
npm i --save @lion/overlays
```

### Example

```js
import { overlays } from '@lion/overlays';

const myCtrl = overlays.add(
  new GlobalOverlayController({
    /* options */
  }),
);
```

### ModalDialogController

A specific extension of GlobalOverlayController configured to create accessible modal dialogs.

```js
import { ModalDialogController } from '@lion/overlays';
```
