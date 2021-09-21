---
'@lion/core': patch
---

Allow SlotMixin to work with default slots using empty string as key (''). Ensure that we do not add slot attribute to the slottable in this case.
