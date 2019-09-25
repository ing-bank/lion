# LocalOverlayController

This is a base class for different local overlays (e.g. a [tooltip](../../tooltip/), see [Overlay System: Scope](./OverlaySystemScope.md) - the ones positioned next to invokers they are related to).

For more information strictly about the positioning of the content element to the reference element (invoker), please refer to the [positioning documentation](./LocalOverlayPositioning.md).

You should not use this controller directly unless you want to create a unique type of local overlays which is not supported out of the box. But for implementation details check out [Overlay System: Implementation](./OverlaySystemImplementation.md).

All supported types of local overlays are described below.

## How to use

### Installation

```sh
npm i --save @lion/overlays
```

### Example

```js
import { overlays } from '@lion/overlays';

const myCtrl = overlays.add(
  new LocalOverlayController({
    /* options */
  }),
);
```

This is currently WIP.
Stay tuned for updates on new types of overlays.
