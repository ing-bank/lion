---
'@lion/ui': patch
---

lion-calendar: when determining if user interacted with a day button we no longer examine event.target but event.composedPath()[0] since it otherwise fails in Firefox 111+
