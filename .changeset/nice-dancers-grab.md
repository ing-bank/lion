---
'@lion/ui': minor
---

[overlays] update trapskeyboardfocus feature to use native dialog

[trapskeyboardfocus](https://lion.js.org/fundamentals/systems/overlays/configuration/#trapskeyboardfocus) feature is updated to use native Dialog for trapping focus. It bring some breaking changes:

- Endpoints removed: `containFocus`, `rotateFocus` from `@lion/ui/overlays.js`
- Undocumented protected configuration property for Overlays `_noDialogEl` is removed. It allowed to use `div` element instead of `dialog` for rendering dialogs
- `OverlayController#enableTrapsKeyboardFocus`, `OverlayController#disableTrapsKeyboardFocus` have been removed
- `OverlaysManager#disableTrapsKeyboardFocusForAll`, `OverlaysManager#informTrapsKeyboardFocusGotEnabled`, `OverlaysManager#informTrapsKeyboardFocusGotDisabled` have been removed

The change in the behaviour from UX point of view:
The main difference is that the navite modal dialog does not trap the focus inside the dialog entirely. It allows to switch from the dialog to the browser's panels. It's done by design to improve a11y expirience and let users switch browser's tab as example if they want so.
