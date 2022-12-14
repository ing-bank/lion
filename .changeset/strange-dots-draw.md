---
'@lion/ui': patch
---

`accordion`: narrowed the scope of the selectors that query [slot=invoker] and [slot=content] to prevent that any nested elements with [slot=invoker] and [slot=content] are moved to slot=\_accordion as well
