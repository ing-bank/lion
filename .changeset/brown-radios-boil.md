---
'@lion/ui': patch
---

OverlayController: fixed check to determine if native dialog is supported, fixed check to determine if user has moved focus while dialog is open. lion-dialog: added test to assert if element specified in dialog config key `elementToFocusAfterHide` is in viewport when dialog is closed, added test to assert that element specified in dialog config key `elementToFocusAfterHide` is not focused when the dialog is closed if the user deliberately moved focus to another element while the dialog was open
