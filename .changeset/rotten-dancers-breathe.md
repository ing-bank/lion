---
'@lion/tabs': patch
---

The store of invoker and content slottables was not properly cleared before repopulating, on slotchange event. This would cause duplicate entries.
