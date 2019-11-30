# Overlay System

This document provides an outline of all possible occurrences of overlays found in applications in general and thus provided by Lion. For all concepts referred to in this document, please read [Overlay System Scope](./OverlaySystemScope.md), which includes more background knowledge on overlays on the web.

OverlayController is the single class we instantiate whenever creating an overlay instance.
Based on provided config, it will handle:

- DOM position (local vs global)
- positioning logic
- accessibility
- interaction patterns.

and has the following public functions:

- **show()**, to show the overlay.
- **hide()**, to hide the overlay.
- **toggle()**, to toggle between show and hide.

All overlays contain an invokerNode and a contentNode

- **contentNode**, the toggleable content of the overlay
- **invokerNode**, the element toggles the visibility of the content. For local overlays, this is the relative element the content is positioned to.

For DOM position, local refers to overlays where the content is positioned next to the invokers they are related to, DOM-wise.
Global refers to overlays where the content is positioned in a global root node at the bottom of `<body>`.

## Configuration options

In total, we should end up with configuration options as depicted below, for all possible overlays.
All boolean flags default to 'false'.

```text
- {Boolean} trapsKeyboardFocus - rotates tab.
- {Boolean} hidesOnEsc - hides the overlay when pressing [esc].
- {Boolean} hidesOnHideEventInContentNode - (defaults to true) hides if an event called "hide" is fired within the content
- {Boolean} hidesOnOutsideClick - hides if user clicks outside of the overlay
- {Element} elementToFocusAfterHide - the element that should be called `.focus()` on after dialog closes.
- {Boolean} hasBackdrop - whether it should have a backdrop. (local mode only)
- {Boolean} isBlocking - hides other overlays when multiple are opened.
- {Boolean} preventsScroll - prevents scrolling body content when overlay opened.
- {Object} viewportConfig - placementMode: local only
  - {String} placement: 'top-left' | 'top' | 'top-right' | 'right' | 'bottom-left' |'bottom' | 'bottom-right' | 'left' | 'center'
- {Object} popperConfig - placementMode: local only
  - {String} placement: 'top-left' | 'top' | 'top-right' | 'right' | 'bottom-left' |'bottom' | 'bottom-right' | 'left' | 'center'
```

> Note: popperConfig reflects [Popper.js API](https://popper.js.org/popper-documentation.html)

## Specific Controllers

You can find our existing configurations [here](../src/configurations):

- withModalDialogConfig
- withDropdownConfig
- withBottomSheetConfig

You import these using ES Modules, and then simply call them inside your OverlayController instantiation:

```js
const ctrl = new OverlayController({
  ...withModalDialogConfig(),
  invokerNode,
  contentNode,
});
```

## Responsive switching

Currently we support switching between overlay configurations. Keep in mind however that we do not yet support switching between overlay configurations while the content is shown. If you try, it will close the content if it is open, and the user will need to re-open. Will be supported in the near future.

What follows is an example implementation on an `OverlayController` instance which checks the viewport width, and then updates the configuration to a bottom sheet versus a modal dialog on `before-show`.

```js
myOverlayCtrl.addEventListener('before-show', () => {
  if (window.innerWidth >= 600) {
    ctrl.updateConfig(withModalDialogConfig());
  } else {
    ctrl.updateConfig(withBottomSheetConfig());
  }
});
```

An example implementation inside of a webcomponent that uses the `OverlayMixin`:
Overriding protected method `_defineOverlay`.

```js
_defineOverlay({ invokerNode, contentNode }) {

  // initial
  const ctrl = new OverlayController({
    ...withBottomSheetConfig(),
    hidesOnOutsideClick: true,
    invokerNode,
    contentNode,
  });

  // responsive
  ctrl.addEventListener('before-show', () => {
    if (window.innerWidth >= 600) {
      ctrl.updateConfig(withModalDialogConfig());
    } else {
      ctrl.updateConfig(withBottomSheetConfig());
    }
  });

  return ctrl;
```

We do not yet support a way to add responsive switching behavior declaratively inside your lit-templates, for our existing overlay webcomponents (e.g. `lion-dialog`). Your best bet for now would be to extend it and only override `_defineOverlay` to include a `before-show` handler as mentioned above.

## popperConfig for local overlays (placementMode: local)

> In Popper, content node is often referred to as Popper element, and invoker node is often referred to as the reference element.

Features:

- Everything Popper features!
- Currently eagerly loads popper if mode is local, in the constructor. Loading during idle time / using prefetch would be better, this is still WIP. PRs are welcome!

> Popper strictly is scoped on positioning. **It does not change the dimensions of the content node nor the invoker node**. This also means that if you use the arrow feature, you are in charge of styling it properly, use the x-placement attribute for this.

To override the default options we set for local mode, you add a `popperConfig` object to the config passed to the OverlayController.
Here's a succinct overview of some often used popper properties:

```js
const overlayCtrl = new OverlayController({
  contentNode,
  invokerNode,
  popperConfig: {
    /* Placement of content node, relative to invoker node */
    placement: 'bottom-start',
    positionFixed: true,
    modifiers: {
      /* Prevents detachment of content node from invoker node */
      keepTogether: {
        enabled: true,
      },
      /* When enabled, adds shifting/sliding behavior on secondary axis */
      preventOverflow: {
        enabled: false,
        boundariesElement: 'viewport',
        /* When enabled, this is the <boundariesElement>-margin for the secondary axis */
        padding: 32,
      },
      /* Use to adjust flipping behavior or constrain directions */
      flip: {
        boundariesElement: 'viewport',
        /* <boundariesElement>-margin for flipping on primary axis */
        padding: 16,
      },
      /* When enabled, adds an offset to either primary or secondary axis */
      offset: {
        enabled: true,
        /* margin between content node and invoker node */
        offset: `0, 16px`,
      },
    },
  },
)};
```

## Future

### Potential example implementations for overlays

- Combobox/autocomplete Component
- Application menu Component
- Popover Component
- Dropdown Component
- Toast Component

### Potential configuration additions

```text
- {Boolean} isModal - sets [aria-modal] and/or [aria-hidden="true"] on siblings
- {Boolean} isTooltip - has a totally different interaction - and accessibility pattern from all other overlays, so needed for internals.
- {Boolean} handlesUserInteraction - sets toggle on click, or hover when `isTooltip`
- {Boolean} handlesAccessibility -
  - For non `isTooltip`:
    - sets [aria-expanded="true/false"] and [aria-haspopup="true"] on invokerNode
    - sets [aria-controls] on invokerNode
    - returns focus to invokerNode on hide
    - sets focus to overlay content(?)
  - For `isTooltip`:
    - sets [role="tooltip"] and [aria-labelledby]/[aria-describedby] on the content
```

### Future for mode local (Popper)

- Coming soon: Webcomponent implementation of LocalOverlay with a default arrow, styled out of the box to at least have proper rotations and positions.
- Default overflow and/or max-width behavior when content is too wide or high for the viewport.
