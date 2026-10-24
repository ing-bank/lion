# Disclosure and overlays

Vocabulary for the elements that reveal and close content on the page. It follows the platform and
Open UI wording, so that a concept has exactly one name in code, in docs and in the browser.

## Language

**Disclosure**:
An element whose content is revealed on demand and closed again by user or application action.
_Avoid_: collapsible, expander, toggler

**Overlay**:
A disclosure whose content is rendered above the page instead of in the flow.
_Avoid_: popup, layer, floating element, popper

**Invoker**:
The element that asks a disclosure to show, hide or toggle.
_Avoid_: trigger, opener, target, button

**Content**:
The element that a disclosure reveals and hides.
_Avoid_: panel, body, slot content, dialog content

**Anchor**:
The element that an overlay's content is positioned against.
_Avoid_: reference element, target, aligner

**Anchor positioning**:
Positioning an overlay through CSS (`anchor-name`, `position-anchor`, `position-area`) rather than
through scripted measurements.
_Avoid_: placement mode, popper positioning, floating

**open**:
The state of a disclosure whose content is revealed. It is a state, not an action.
_Avoid_: opened, shown, visible, expanded, active

**show / hide / toggle**:
The three actions that change `open`.
_Avoid_: open(), hide(), activate, dismiss, display

**beforetoggle / toggle**:
The event that announces an impending state change (cancelable) and the one that announces a
completed state change.
_Avoid_: before-show, show, before-hide, hide, opened-changed, closed-changed

**closedby**:
Which user actions are allowed to close a disclosure.
_Avoid_: hidesOnEsc, hidesOnOutsideEsc, hideOnOutsideClick, dismissible

**modal**:
An overlay that blocks interaction with the rest of the page and keeps focus inside itself.
_Avoid_: blocking, trapsKeyboardFocus, focus trap, exclusive

**backdrop**:
The painted area between a modal overlay and the page.
_Avoid_: scrim, mask, shade, curtain

**descriptor**:
The serializable object that describes a disclosure's configuration.
_Avoid_: config object, options, settings, props

**feature**:
A capability of a disclosure that is loaded only when the descriptor asks for it.
_Avoid_: handler, plugin, mixin, extension, modifier

**legacy adapter**:
The layer that translates the pre-platform vocabulary onto this glossary for extensions that were
written before it.
_Avoid_: shim, polyfill, compat hack, wrapper
