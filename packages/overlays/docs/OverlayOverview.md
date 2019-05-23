The goal of this document is to specify the goal and duties of an overlay manager, mainly by
identifying all different appearances and types of overlays.

## What is an overlay manager?

An overlay is a visual element that is painted on top of a page, breaking out of the regular
document flow.
An overlay manager is a global repository keeping track of all different types of overlays.
The need for a global housekeeping mainly arises when multiple overlays are opened simultaneously.
As opposed to a single overlay, the overlay manager stores knowledge about:
- whether the scroll behaviour of the body element can be manipulated
- what space is available in the window for drawing new overlays

The manager is in charge of rendering an overlay to the DOM. Therefore, a developer should be able
to control:
- It’s ‘physical position’ (where the dialog is attached). This can either be:
    - globally: at root level of the DOM. This guarantees a total control over its painting, since
    the stacking context can be controlled from here and interfering parents (that set overflow
    values or transforms) can’t be apparent. Additionally, making a modal dialog requiring
    all surroundings to have aria-hidden="true", will be easier when the overlay is attached on
    body level.
    - locally: next to the invoking element. This gives advantages for accessibility and
    (performant) rendering of an overlay next to its invoker on scroll and window resizes
- Toggling of the ‘shown’ state of the overlay
- Positioning preferences(for instance ‘bottom-left’) and strategies (ordered fallback preferences)

Presentation/styling of the overlay is out of the scope of the manager, except for its positioning
in its context.

Accessibility is usually dependent on the type of overlay, its specific implementation and its
browser/screen reader support (aria 1.0 vs 1.1). We strive for an optimum here by supporting
1.0 as a bare minimum and add 1.1 enrichments on top.

For every overlay, the manager has access to the overlay element and the invoker (and possible
other elements that are needed for focus delegation as described in
https://www.w3.org/TR/wai-aria-practices/#dialog_modal (notes).

## Defining different types of overlays

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
tooltip in UI framework A, can be considered a popover in framework B. What can be called  a modal
in framework C, might actually be just a dialog. Etc etc…

**Official specifications**

In order to avoid confusion and be as specification compliant as possible, it’s always a good idea
to consult the W3C. This website shows a full list with specifications of accessible web widgets:
https://www.w3.org/TR/wai-aria-practices/.
A great overview of all widget-, structure- and role relations can be found in the ontology diagram
below:
![rdf_model](/uploads/5aa251bd4a7a1ec36241d20e0af8cbb3/rdf_model.png)
https://www.w3.org/WAI/PF/aria-1.1/rdf_model.svg

Out of all the overlay names mentioned above, we can only identify the dialog and the tooltip as
official roles.
Let’s take a closer look at their definitions...

**Dialog**

The dialog is described as follows by the W3C:
> “A dialog is a window overlaid on either the primary window or another dialog window. Windows
under a modal dialog are inert. That is, users cannot interact with content outside an active
dialog window. Inert content outside an active dialog is typically visually obscured or dimmed so
it is difficult to discern, and in some implementations, attempts to interact with the inert
content cause the dialog to close.
Like non-modal dialogs, modal dialogs contain their tab sequence. That is, Tab and Shift + Tab do
not move focus outside the dialog. However, unlike most non-modal dialogs, modal dialogs do not
provide means for moving keyboard focus outside the dialog window without closing the dialog.”

- specification: https://www.w3.org/TR/wai-aria-1.1/#dialog
- widget description: https://www.w3.org/TR/wai-aria-practices/#dialog_modal

**Tooltip**

According to W3C, a tooltip is described by the following:
> “A tooltip is a popup that displays information related to an element when the element receives
keyboard focus or the mouse hovers over it. It typically appears after a small delay and disappears
when Escape is pressed or on mouse out.
> Tooltip widgets do not receive focus. A hover that contains focusable elements can be made using
a non-modal dialog.”

- specification: https://www.w3.org/TR/wai-aria-1.1/#tooltip
- widget description: https://www.w3.org/TR/wai-aria-practices/#tooltip

What needs to be mentioned is that the W3C taskforce didn’t reach consensus yet about the above
tooltip description. A good alternative resource:
https://inclusive-components.design/tooltips-toggletips/

**Dialog vs tooltip**

Summarizing, the main differences between dialogs and tooltips are:
- Dialogs have a modal option, tooltips don’t
- Dialogs have interactive content, tooltips don’t
- Dialogs are opened via regular buttons (click/space/enter), tooltips act on focus/mouseover


**Other roles and concepts**

Other roles worth mentioning are *alertdialog* (a specific instance of the dialog for system
alerts), select (an abstract role), *combobox* and *menu*.

Also, the W3C document often refers to *popup*. This term is mentioned in the context of *combobox*,
*listbox*, *grid*, *tree*, *dialog* and *tooltip*. Therefore, one could say it could be a term

*aria-haspopup* attribute needs to be mentioned: it can have values ‘menu’, ‘listbox’, ‘grid’,
’tree’ and ‘dialog’.


## Common Overlay Components

In our component library, we want to have the following overlay ‘child’ components:
- Dialog
- Tooltip
- Popover
- Select/Combobox
- Dropdown menu
- Toast
- Sheet (bottom, top, left, right)

**Dialog**

The dialog is pretty much the dialog as described in the W3C spec, having the modal option applied
by default.
The flexibility in focus delegation (see https://www.w3.org/TR/wai-aria-practices/#dialog_modal
notes) is not implemented, however.
Addressing these:
- The first focusable element in the content: although delegate this focus management to the
implementing developer is highly preferred, since this is highly dependent on the moment the dialog
content has finished rendering. This is something the overlay manager or dialog widget should not
be aware of in order to provide.a clean and reliable component.
- The focusable element after a close: by default, this is the invoker. For different behaviour, a
reference should be supplied to a more logical element in the particular workflow.


**Tooltip**

The tooltip is always invoked on hover and has no interactive content. See
https://inclusive-components.design/tooltips-toggletips/ (the tooltip example, not the toggle tip).

**Popover**

The popover looks like a crossover between the dialog and the tooltip. Popovers are invoked on
click. For non interactive content, the https://inclusive-components.design/tooltips-toggletips/
toggletip could be applied.
Whenever there would be a close button present, the ‘non interactiveness’ wouldn’t apply.

An alternative implementation: https://whatsock.com/tsg/Coding%20Arena/Popups/Popup%20(Internal%20Content)/demo.htm
This looks more like a small dialog, except that the page flow is respected (no rotating tab)

**Dropdown**
The dropdown is not an official aria-widget and thus can’t be tied to a specific role. It exists
in a lot of UI libraries and most of them share these properties:
  - Preferred position is ‘down’
  - When no space at bottom, they show ‘up’ (in which. Case it behaves a as a dropup)
  - Unlike popovers and tooltips, it will never be positioned horizontally

Aliases are ‘popdown’, ‘pulldown’ and many others.

**Select**

Implemented as a dropdown listbox with invoker button. Depending on the content of the options,
the child list can either be of type listbox or grid.
See: https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html


**Combobox**

Implemented as a dropdown combobox with invoker input. Input is used as search filter
and can contain autocomplete or autosuggest functionality:
See: https://www.w3.org/TR/wai-aria-practices/#combobox

**(Application) menu**

Or sometimes called context-menu. Uses a dropdown to position its content.
See: https://www.w3.org/WAI/tutorials/menus/flyout/
Be aware not to use role=“menu”: https://www.w3.org/WAI/tutorials/menus/application-menus/


**Toast**

See: https://www.webcomponents.org/element/@polymer/paper-toast. Should probably be implemented as
an alertdialog


**Sheet**

See: https://www.webcomponents.org/element/Collaborne/paper-bottom-sheet. Should probably be a
global(modal) dialog
