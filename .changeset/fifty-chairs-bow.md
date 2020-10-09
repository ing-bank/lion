---
'@lion/overlays': patch
---

When closing an overlays we check if the active element is/was within the overalys content. If so we blur it to make sure the focus returns to the body.
