---
'@lion/overlays': minor
---

BREAKING: elevation property setter on OverlayController accepts numbers only, previously this was a number as a string. This syncs it with the getter which returns a number.
