# Systems >> Overlays >> Rationale ||30

This page describes the goal and duties of the overlay system, mainly by identifying all different
appearances and types of overlays.

## What is an overlay?

An overlay is a visual element that is painted on top of a page, breaking out of the regular
document flow.
Overlays come in many forms (dialog, popover, dropdown, tooltip etc.)
For a more exhaustive list, see 'Types of overlays' below.
Our system tries to focus on mapping all these forms to officially supported aria widgets.
Hence, all occurrences of overlays we offer will be accessible out of the box.

## Overlay Controllers

Every overlay is created from the same base class `OverlayController`.
This leads to a predictable api for all different occurrences of an overlay.

Please see Configuration for all different options that an OverlayController offers.

- Its ‘physical position’ (where the dialog is connected to the DOM). This can either be:
  - globally: at root level of the DOM. This guarantees a total control over its painting, since
    the stacking context can be controlled from here and interfering parents (that set overflow
    values or transforms) can’t be apparent. Additionally, making a modal dialog requiring
    all surroundings to have aria-hidden="true", will be easier when the overlay is attached on
    body level.
  - locally: next to the invoking element. This gives advantages for accessibility and
    (performant) rendering of an overlay next to its invoker on scroll and window resizes
- Toggling of the ‘shown’ state of the overlay
- Positioning preferences(for instance ‘bottom-left’) and strategies (ordered fallback preferences)

## Managing overlays

An overlay manager is a global repository keeping track of all different types of overlays.
The need for a global housekeeping mainly arises when multiple overlays are opened simultaneously.
As opposed to a single overlay, the overlay manager stores knowledge about:

- whether the scroll behaviour of the body element can be manipulated
- what space is available in the window for drawing new overlays

Presentational css of the overlay is out of the scope of the manager, except for its positioning
in its context.

For every overlay, the manager has access to the overlay element and the invoker (and possible
other elements that are needed for focus delegation as described in
<https://www.w3.org/TR/wai-aria-practices/#dialog_modal> (notes).

## Types of overlays

When browsing through the average ui library, one can encounter multiple names for occurrences of
overlays. Here is a list of names encountered throughout the years:

- dialog
- modal
- popover
- popup
- popdown
- popper
- bubble
- balloon
- dropdown
- dropup
- tooltip
- layover
- overlay
- toast
- snackbar
- sheet (bottom, top, left, right)
- etc..

The problem with most of those terms is their lack of clear definition: what might be considered a
tooltip in UI framework A, can be considered a popover in framework B. What can be called a modal
in framework C, might actually be just a dialog. Etc etc…

### Official specifications

In order to avoid confusion and be as specification compliant as possible, it’s always a good idea
to consult the W3C. This website shows a full list with specifications of accessible web widgets:
<https://www.w3.org/TR/wai-aria-practices/>.
A great overview of all widget-, structure- and role relations can be found in the ontology diagram
below:

<https://www.w3.org/WAI/PF/aria-1.1/rdf_model.svg>

Out of all the overlay names mentioned above, we can only identify the dialog and the tooltip as
official roles.
Let’s take a closer look at their definitions...

### Dialog

The dialog is described as follows by the W3C:

> “A dialog is a window overlaid on either the primary window or another dialog window. Windows
> under a modal dialog are inert. That is, users cannot interact with content outside an active
> dialog window. Inert content outside an active dialog is typically visually obscured or dimmed so
> it is difficult to discern, and in some implementations, attempts to interact with the inert
> content cause the dialog to close.
> Like non-modal dialogs, modal dialogs contain their tab sequence. That is, Tab and Shift + Tab do
> not move focus outside the dialog. However, unlike most non-modal dialogs, modal dialogs do not
> provide means for moving keyboard focus outside the dialog window without closing the dialog.”

- specification: <https://www.w3.org/TR/wai-aria-1.1/#dialog>
- widget description: <https://www.w3.org/TR/wai-aria-practices/#dialog_modal>

### Tooltip

According to W3C, a tooltip is described by the following:

> “A tooltip is a popup that displays information related to an element when the element receives
> keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears
> when Escape is pressed or on mouse out.
> Tooltip widgets do not receive focus. A hover that contains focusable elements can be made using
> a non-modal dialog.”

- specification: <https://www.w3.org/TR/wai-aria-1.1/#tooltip>
- widget description: <https://www.w3.org/TR/wai-aria-practices/#tooltip>

What needs to be mentioned is that the W3C taskforce didn’t reach consensus yet about the above
tooltip description. A good alternative resource:
<https://inclusive-components.design/tooltips-toggletips/>

### Dialog vs tooltip

Summarizing, the main differences between dialogs and tooltips are:

- Dialogs have a modal option, tooltips don’t
- Dialogs have interactive content, tooltips don’t
- Dialogs are opened via regular buttons (click/space/enter), tooltips act on focus/mouseover

### Other roles and concepts

Other roles worth mentioning are _alertdialog_ (a specific instance of the dialog for system
alerts), select (an abstract role), _combobox_ and _menu_.

Also, the W3C document often refers to _popup_. This term is mentioned in the context of _combobox_,
_listbox_, _grid_, _tree_, _dialog_ and _tooltip_. It can be considered as a synonym of _overlay_.

_aria-haspopup_ attribute needs to be mentioned: it can have values ‘menu’, ‘listbox’, ‘grid’,
’tree’ and ‘dialog’.

## Common Overlay Components

In our component library, we want to have the following overlay ‘child’ components:

- Dialog
- Tooltip
- Popover
- Dropdown
- Toast
- Sheet (bottom, top, left, right)
- Select
- Combobox/autocomplete
- Application menu

### Dialog Component

The dialog is pretty much the dialog as described in the W3C spec, having the modal option applied
by default.
The flexibility in focus delegation (see <https://www.w3.org/TR/wai-aria-practices/#dialog_modal> notes) is not implemented, however.
Addressing these:

- The first focusable element in the content: although delegate this focus management to the
  implementing developer is highly preferred, since this is highly dependent on the moment the dialog
  content has finished rendering. This is something the overlay manager or dialog widget should not
  be aware of in order to provide.a clean and reliable component.
- The focusable element after a close: by default, this is the invoker. For different behaviour, a
  reference should be supplied to a more logical element in the particular workflow.

### Tooltip Component

The tooltip is always invoked on hover and has no interactive content. See
<https://inclusive-components.design/tooltips-toggletips/> (the tooltip example, not the toggle tip).

### Popover Component

The popover looks like a crossover between the dialog and the tooltip. Popovers are invoked on
click. For non interactive content, the <https://inclusive-components.design/tooltips-toggletips/> toggletip could be applied.
Whenever there would be a close button present, the ‘non interactiveness’ wouldn’t apply.

An alternative implementation: <https://whatsock.com/tsg/Coding%20Arena/Popups/Popup%20(Internal%20Content)/demo.htm>
This looks more like a small dialog, except that the page flow is respected (no rotating tab)

### Dropdown Component

The dropdown is not an official aria-widget and thus can’t be tied to a specific role. It exists
in a lot of UI libraries and most of them share these properties:

- Preferred position is ‘down’
- When no space at bottom, they show ‘up’ (in which. Case it behaves a as a dropup)
- Unlike popovers and tooltips, it will never be positioned horizontally

Aliases are ‘popdown’, ‘pulldown’ and many others.

### Select Component

Implemented as a dropdown listbox with invoker button. Depending on the content of the options,
the child list can either be of type listbox or grid.
See: <https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html>

### Combobox Component

Implemented as a dropdown combobox with invoker input. Input is used as search filter
and can contain autocomplete or autosuggest functionality:
See: <https://www.w3.org/TR/wai-aria-practices/#combobox>

### (Application) menu Component

Or sometimes called context-menu. Uses a dropdown to position its content.
See: <https://www.w3.org/WAI/tutorials/menus/flyout/>
Be aware not to use role=“menu”: <https://www.w3.org/WAI/tutorials/menus/application-menus/>

### Toast Component

See: <https://www.webcomponents.org/element/@polymer/paper-toast>. Should probably be implemented as
an alertdialog.

### Sheet Component

See: <https://material.io/design/components/sheets-bottom.html>. Should probably be a
global(modal) dialog.

## Considerations

We use the native dialog purely because it renders to the "top layer". Not because of its accessible role, which varies per component. In the future we can use the popover attribute(<https://open-ui.org/components/popover.research.explainer/>) for this (which neatly differentiates between presentation and semantics).

So in our use of the dialog we want also a dialog that only does presentation (rendering on top layer in this case), but we want to check the semantics ourselves. Hence: `role="none"`. Even though the outcome is completely accessible, AXE-core uses this rule as a kind of "precautionary measure".

After a cost/benefit analysis, we choose to be temporarily incompatible with AXE-core. Therefore, we recommend running tests with `{ ignoredRules: ['aria-allowed-role'] }`. When the popover is stable and used underwater in lion overlays, AXE can again be run without this ignoredRule.
