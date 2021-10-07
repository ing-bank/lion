---
'@lion/accordion': patch
'@lion/core': patch
'@lion/form-core': patch
'@lion/tabs': patch
---

Fix type error, EventHandlerNonNull got removed it seems. (event: Event) => unknown; instead is fine.
