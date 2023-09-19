---
'@lion/ui': patch
---

lion-calendar: when determining if user interacted with a day button, use event.composedPath()[0] instead of event.target to fix Firefox 111+ issue
