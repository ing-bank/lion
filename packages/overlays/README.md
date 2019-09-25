# Overlays System

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

Supports different types of overlays like dialogs, toasts, tooltips, dropdown, etc...
Manages their position on the screen relative to other elements, including other overlays.

## Features

- [**Overlays Manager**](./docs/OverlaysManager.md), a global repository keeping track of all different types of overlays.
- [**Overlays System: Scope**](./docs/OverlaySystemScope.md), outline of all possible occurrences of overlays. Divided into two main types:
  - [**Global Overlay Controller**](./docs/GlobalOverlayController.md), controller for overlays relative to the viewport.
  - [**Local Overlay Controller**](./docs/LocalOverlayController.md), controller for overlays positioned next to invokers they are related to.

## How to use

### Installation

```sh
npm i --save @lion/overlays
```

### Example

```js
import { overlays } from '@lion/overlays';

const myCtrl = overlays.add(
  new OverlayTypeController({
    /* options */
  }),
);
// name OverlayTypeController is for illustration purpose only
// please read below about existing classes for different types of overlays
```
