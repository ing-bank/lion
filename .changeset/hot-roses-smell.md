---
'@lion/overlays': patch
---

Added a fix for focus not being restored to the root element when only a focusout event happens, without a subsequent focusin event. Added a fix to use getDeepActiveElement util instead of document.activeElement which fixes focus trap in elements with shadowRoots that contain focusable elements.
