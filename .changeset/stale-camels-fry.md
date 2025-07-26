---
'@lion/ui': minor
---

[overlays]: avoid interference of native dialog escape handler and escape handlers defined by OverlayController.
This is needed until we can configure `closedby="none"` on the native dialog for all browsers: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby.
(We release this as a minor change, as we stop propagation of HTMLDialogElement 'cancel' and 'close' events, and some consumers might (ab)use them...)
