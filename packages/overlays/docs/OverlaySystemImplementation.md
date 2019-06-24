# Overlay System: Implementation
This document provides an outline of all possible occurrences of overlays found in applications in
general and thus provided by Lion.
For all concepts referred to in this document, please read [Overlay System Scope](./OverlaySystemScope.md).

## Local and global overlay controllers
Currently, we have a global and a local overlay controller, as two separate entities.
Based on provided config, they handle all positioning logic, accessibility and interaction patterns.
All of their configuration options will be described below as part of the _Responsive overlay_ section.

### Connection points and placement contexts
It's currently not clear where the border between global and local overlays lie. They seem to be
separated based on their 'dom connection point' (body vs 'page cursor'(usually invoker sibling)).
However, there is no required relationship here: we can create a modal dialog from
local context('page cursor') as well.

Only, we would have a few concerns when creating global overlays from a local connection point:
- Accessibility will be harder to implement. When wai-aria 1.0 needs to be supported, all siblings
need to have aria-hidden="true" and all parents role="presentation". Not always straightforward
in shadow dom. If we only need to support wai-aria 1.1, we could use aria-modal="true" on the
element with role="dialog". (we basically need to test our supported browsers and screen readers
for compatibility with aria-modal).
- Stacking context need to be managed: the whole 'z-index chain' should win (it's a battle between
parents in the hierarchy). This would require some complex code to cover all edge cases.
- Side effects of parents adding transforms or clipping become a risk. This is hard to detect and
'counter'.

When the dom connection point is 'body', content projection will not work, but a template that
can be rendered without being dependent on its context will be required.

There usually also is a correllation with their relative positioning context: invoker/other
relative element for local(tooltip/popover/dropdown) vs. 'window/viewport level' for global
(dialog/toast/sheet).

For responsive overlays (see below for an elaborate explanation), we need to switch from global to
local. When we switch the dom connection point, (think of rotating a mobile or tablet), we
will loose the current focus, which can be an a11y concern. This can eventually be 'catched' by
syncing the activeElement (we would only loose the screenreader active element (for instance,
focused cell in table mode))

For maximum flexibility, it should be up to the developer to decide how overlays should be rendered,
per instance of an overlay.

## Responsive overlay
Based on screen size, we might want to switch the appearance of an overlay.
For instance: an application menu can be displayed as a dropdown on desktop,
but as a bottom sheet on mobile.
Similarly, a dialog can be displayed as a popover on desktop, but as a (global) dialog on mobile.

To implement such a flexible overlay, we need an 'umbrella' layer that allows for switching between
different configuration options, also between the connection point in dom (global and local).

Luckily, interfaces of Global and OverlayControllers are very similar.
Therefore we can make a wrapping ResponsiveOverlayController.

### Configuration options for local and global overlays

In total, we should end up with configuration options as depicted below, for all possible overlays.
All boolean flags default to 'false'.
Some options are mutually exclusive, in which case their dependent options and requirement will be
mentioned.
Note: a more generic and precise term for all mentionings of `invoker` below would actually be
`relative positioning element`.
```
- {Element} elementToFocusAfterHide - the element that should be called `.focus()` on after dialog closes
- {Boolean} hasBackdrop - whether it should have a backdrop (currently exclusive to globalOverlayController)
- {Boolean} isBlocking - hides other overlays when mutiple are opened (currently exclusive to globalOverlayController)
- {Boolean} preventsScroll - prevents scrolling body content when overlay opened (currently exclusive to globalOverlayController)
- {Boolean} trapsKeyboardFocus - rotates tab, implicitly set when 'isModal'
- {Boolean} hidesOnEsc - hides the overlay when pressing [esc]
- {Boolean} hidesOnOutsideClick - hides the overlay when clicking next to it, exluding invoker. (currently exclusive to localOverlayController)
- {String} cssPosition - 'absolute' or 'fixed'. TODO: choose name that cannot be mistaken for placement like cssPosition or positioningTechnique: https://github.com/ing-bank/lion/pull/61
- {TemplateResult} contentTemplate
- {TemplateResult} invokerTemplate (currently exclusive to LocalOverlayController)
- {Element} invokerNode (currently exclusive to LocalOverlayController)
- {Element} contentNode (currently exclusive to LocalOverlayController)
```

These options are suggested to be added to the current ones:
```
- {Boolean} isModal - sets aria-modal and/or aria-hidden="true" on siblings
- {Boolean} isGlobal - determines the connection point in DOM (body vs handled by user) TODO: rename to renderToBody?
- {Boolean} isTooltip - has a totally different interaction - and accessibility pattern from all
other overlays, so needed for internals.
- {Boolean} handlesUserInteraction - sets toggle on click, or hover when `isTooltip`
- {Boolean} handlesAccessibility -
  - For non `isTooltip`:
    - sets aria-expanded="true/false" and aria-haspopup="true" on invokerNode
    - sets aria-controls on invokerNode
    - returns focus to invokerNode on hide
    - sets focus to overlay content(?)
  - For `isTooltip`:
    - sets role="tooltip" and aria-labelledby/aria-describedby on the content
- {Object} placementConfig
  - {String} placement - vertical/horizontal position to be supplied to `managePosition`. See https://github.com/ing-bank/lion/pull/61 for current api. Consists of a primary part (where the overlay is located relative from invoker) and secondary alignnment part (how the overlay 'snaps' to the perpendicular boundary of the invoker), separated via '-'.
    - primary : 'bottom' | 'top' | 'left' | 'right' | 'over' (this means the overlay will be positioned on top of the invoker. Think for instance of a select dropdown that opens a selected option on top of the invoker (default behavior of `<select>` on iOS))
    - secondary : 'start' | 'end' | 'fill' (occupies width of invoker) | 'middle' (implicit option that will be choosen by default when none of the previous are specified)
  - all other configuration as described by [Popper.js](https://popper.js.org/)
```

What we should think about more properly is a global placement option (positioned relative to window instead of invoker)
```
// TODO: namings very much under construction (we should also reconsider 'placement' names, see: https://github.com/ing-bank/lion/pull/61)
// Something like the drawing Joren made: https://github.com/ing-bank/lion/issues/36#issuecomment-491855381
- {String} viewportPlacement - consists of a vertical alignment part and an horizontal alignment part,
  separated via '-'
  - vertical align : 'center' | 'bottom' | 'top' | 'left' | 'right' | 'fullheight'
  - horizontal align: 'middle' | 'start' | 'end' | 'fullwidth'
  Examples: 'center-middle' (dialog, alertdialog), 'top-fullwidth' (top sheet)
```

## Controllers/behaviors
Controllers/behaviors provide preconfigured configuration objects for the global/local
overlay controllers.
They provide an imperative and very flexible api for creating overlays and should be used by
Subclassers, inside webcomponents.

#### Dialog
```js
{
  isGlobal: true,
  isModal: true,
  hasBackdrop: true,
  preventsScroll: true,
  trapsKeyboardFocus: true,
  hidesOnEsc: true,
  handlesUserInteraction: true,
  handlesAccessibility: true,
  viewportPlacement: 'center-middle',
}
```

#### Tooltip
```js
{
  isTooltip: true,
  handlesUserInteraction: true,
  handlesAccessibility: true,
}
```

#### Popover
```js
{
  handlesUserInteraction: true,
  handlesAccessibility: true,
}
```
#### Dropdown
It will be quite common to override placement to 'bottom-fullwidth'.
Also, it would be quite common to add a pointerNode.
```js
{
  placement: 'bottom',
  handlesUserInteraction: true,
  handlesAccessibility: true,
}
```
#### Toast
TODO:
- add an option for role="alertdialog" ?
- add an option for a 'hide timer' and belonging a11y features for this
```js
{
  ...Dialog,
  viewportPlacement: 'top-right', (?)
}
```
#### Sheet (bottom, top, left, right)
```js
{
  ...Dialog,
  viewportPlacement: '{top|bottom|left|right}-fullwidth', (?)
}
```
#### Select
No need for a config, will probably invoke ResponsiveOverlayCtrl and switches
config based on media query from Dropdown to BottomSheet/CenteredDialog

#### Combobox/autocomplete
No need for a config, will probably invoke ResponsiveOverlayCtrl and switches
config based on media query from Dropdown to BottomSheet/CenteredDialog

#### Application menu
No need for cfg, will probably invoke ResponsiveOverlayCtrl and switches
config based on media query from Dropdown to BottomSheet/CenteredDialog


## Web components
Web components provide a declaritive, developer friendly interface with a prewconfigured styling
that fits the Design System and makes it really easy for Application Developers to build
user interfaces.
Web components should use
The ground layers for the webcomponents in Lion are the following:

#### Dialog

Imperative might be better here? We can add a web component later if needed.

#### Tooltip
```html
<lion-tooltip>
  <button slot="invoker">hover/focus</button>
  <div slot="content">This will be shown</div>
</lion-tooltip>
```
#### Popover
```html
<lion-popover>
  <button slot="invoker">click/space/enter</button>
  <div slot="content">This will be shown</div>
</lion-popover>
```
#### Dropdown
Like the name suggests, the default placement will be button
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
#### Toast

Imperative might be better here?
#### Sheet (bottom, top, left, right)

Imperative might be better here?


### Web components implementing generic overlays

#### Select, Combobox/autocomplete, Application menu

Those will be separate web components with a lot of form and a11y logic that will be described
in detail in different sections.
They will imoplement the Overlay configuration as described above under 'Controllers/behaviors'.
