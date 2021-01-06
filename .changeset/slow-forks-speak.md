---
'@lion/form-core': minor
'@lion/listbox': minor
---

Added `isTriggeredByUser` meta data in `model-value-changed` event

Sometimes it can be helpful to detect whether a value change was caused by a user or via a programmatical change.
This feature acts as a normalization layer: since we use `model-value-changed` as a single source of truth event for all FormControls, there should be no use cases for (inconsistently implemented (cross browser)) events like `input`/`change`/`user-input-changed` etc.
