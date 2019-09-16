# Overlay System: Implementation

This document provides an outline of all possible occurrences of overlays found in applications in general and thus provided by Lion. For all concepts referred to in this document, please read [Overlay System Scope](./OverlaySystemScope.md).

## Base controller

The BaseController handles the basics of all controllers, and has the following public functions:

- **show()**, to show the overlay.
- **hide()**, to hide the overlay.
- **toggle()**, to toggle between show and hide.

All overlays exists of an invoker and a content

- **invoker**, the element that can trigger showing (and hiding) the overlay.
  - invokerNode
- **content**, the toggleable overlays content
  - contentTemplate, in most cases the content will be placed inside a template as one of the controller configuration options.
  - contentNode, a node can also be used as the content for local overlays (see next section), such as is done in the [popup](../../popup/).

## Local and global overlay controllers

Currently, we have a global and a local overlay controller, as two separate entities.
Based on provided config, they handle all positioning logic, accessibility and interaction patterns.

- [GlobalOverlayController](./GlobalOverlayController.md), the ones positioned relatively to the viewport.
- [LocalOverlayController](./LocalOverlayController.md), the ones positioned next to invokers they are related to.

All of their configuration options will be described below as part of the _Configuration options_ section.

### DynamicOverlayController

Based on screen size, we might want to switch the appearance of an overlay.
For instance: an application menu can be displayed as a dropdown on desktop,
but as a bottom sheet on mobile.

Similarly, a dialog can be displayed as a popover on desktop, but as a (global) dialog on mobile.

The DynamicOverlayController is a flexible overlay that can switch between different controllers, also between the connection point in dom (global and local). The switch is only done when the overlay is closed, so the focus isn't lost while switching from one overlay to another.

### Configuration options

In total, we should end up with configuration options as depicted below, for all possible overlays.
All boolean flags default to 'false'.
Some options are mutually exclusive, in which case their dependent options and requirement will be mentioned.

> Note: a more generic and precise term for all mentionings of `invoker` below would actually be `relative positioning element`.

#### Shared configuration options

```text
- {Boolean} trapsKeyboardFocus - rotates tab, implicitly set when 'isModal'.
- {Boolean} hidesOnEsc - hides the overlay when pressing [esc].
```

#### Global specific configuration options

```text
- {Element} elementToFocusAfterHide - the element that should be called `.focus()` on after dialog closes.
- {Boolean} hasBackdrop - whether it should have a backdrop.
- {Boolean} isBlocking - hides other overlays when multiple are opened.
- {Boolean} preventsScroll - prevents scrolling body content when overlay opened.
- {Object} viewportConfig
  - {String} placement: 'top-left' | 'top' | 'top-right' | 'right' | 'bottom-left' |'bottom' |'bottom-right' |'left' | 'center'
```

#### Local specific configuration options

```text
- {Boolean} hidesOnOutsideClick - hides the overlay when clicking next to it, excluding invoker.
- {String} cssPosition - 'absolute' or 'fixed'. TODO: choose name that cannot be mistaken for placement like cssPosition or positioningTechnique: <https://github.com/ing-bank/lion/pull/61>.
- For positioning checkout [localOverlayPositioning](./localOverlayPositioning.md).
```

#### Suggested additions

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

## Specific Controllers

Controllers/behaviors provide preconfigured configuration objects for the global/local
overlay controllers.

They provide an imperative and very flexible api for creating overlays and should be used by
Subclassers, inside webcomponents.

### Dialog Controller

```js
{
  isModal: true,
  hasBackdrop: true,
  preventsScroll: true,
  trapsKeyboardFocus: true,
  hidesOnEsc: true,
  handlesUserInteraction: true,
  handlesAccessibility: true,
  viewportConfig: {
    placement: 'center',
  },
}
```

### Tooltip Controller

```js
{
  isTooltip: true,
  handlesUserInteraction: true,
  handlesAccessibility: true,
}
```

### Popover Controller

```js
{
  handlesUserInteraction: true,
  handlesAccessibility: true,
}
```

### Dropdown Controller

It will be quite common to override placement to 'bottom-fullwidth'.
Also, it would be quite common to add a pointerNode.

```js
{
  placement: 'bottom',
  handlesUserInteraction: true,
  handlesAccessibility: true,
}
```

### Toast Controller

TODO:

- add an option for role="alertdialog" ?
- add an option for a 'hide timer' and belonging a11y features for this

```js
{
  viewportconfig: {
    placement: 'top-right',
},
```

### Bottomsheet Controller

```js
{
  viewportConfig: {
    placement: 'bottom',
  },
}
```

### Select Controller

No need for a config, will probably invoke ResponsiveOverlayCtrl and switches
config based on media query from Dropdown to BottomSheet/CenteredDialog

### Combobox/autocomplete Controller

No need for a config, will probably invoke ResponsiveOverlayCtrl and switches
config based on media query from Dropdown to BottomSheet/CenteredDialog

### Application menu Controller

No need for cfg, will probably invoke ResponsiveOverlayCtrl and switches
config based on media query from Dropdown to BottomSheet/CenteredDialog

## Web components

Web components provide a declarative, developer friendly interface with a preconfigured styling that fits the Design System and makes it really easy for Application Developers to build user interfaces.

Web components should use the ground layers for the webcomponents in Lion are the following:

### Dialog Component

Imperative might be better here? We can add a web component later if needed.

### Tooltip Component

```html
<lion-tooltip>
  <button slot="invoker">hover/focus</button>
  <div slot="content">This will be shown</div>
</lion-tooltip>
```

### Popover Component

```html
<lion-popover>
  <button slot="invoker">click/space/enter</button>
  <div slot="content">This will be shown</div>
</lion-popover>
```

### Dropdown Component

Like the name suggests, the default placement will be bottom

```html
<lion-dropdown>
  <button slot="invoker">click/space/enter</button>
  <ul slot="content">
    <li>This</li>
    <li>will be</li>
    <li>shown</li>
  </ul>
</lion-dropdown>
```

### Toast Component

Imperative might be better here?

### Sheet Component (bottom, top, left, right)

Imperative might be better here?

## Web components implementing generic overlays

### Select, Combobox/autocomplete, Application menu

Those will be separate web components with a lot of form and a11y logic that will be described in detail in different sections.

They will implement the Overlay configuration as described above under 'Controllers/behaviors'.
