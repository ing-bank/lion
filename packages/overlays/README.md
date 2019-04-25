# Overlays System

[//]: # (AUTO INSERT HEADER PREPUBLISH)

Supports different types of overlays like dialogs, toasts, tooltips, dropdown, etc...
Manages their position on the screen relative to other elements, including other overlays.

## Overlays manager

This is a global singleton needed to manage positions of multiple dialogs next to each other on the entire page.
It does the job automatically, but you need to add every newly created overlay to it using the code provided below:

## How to use

### Installation
```sh
npm i --save @lion/ajax
```

### Example
```js
import { overlays } from '@lion/overlays';

const myCtrl = overlays.add(
  new OverlayTypeController({
    /* options */
  })
);
// name OverlayTypeController is for illustration purpose only
// please read below about existing classes for different types of overlays
```

## GlobalOverlayController

This is a base class for different global overlays (e.g. a dialog) - the ones positioned relatively to the viewport.
You should not use this controller directly unless you want to create a unique type of global overlays which is not supported out of the box.

All supported types of global overlays are described below.

### ModalDialogController

```js
import { ModalDialogController } from '@lion/overlays';
```

This is an extension of GlobalOverlayController configured to create accessible modal dialogs.

## LocalOverlayController

This is a base class for different local overlays (e.g. a tooltip) - the ones positioned next to invokers they are related to.
You should not use this controller directly unless you want to create a unique type of local overlays which is not supported out of the box.

All supported types of local overlays are described below.

This is currently WIP.
Stay tuned for updates on new types of overlays.
