---
'@lion/ui': patch
---

Fix generic validation mixin composition through SlotMixin while preserving deduped
subclass accessors, constructor arguments and static members. Allow LionOption
subclasses to return nested Lit style arrays without changing runtime behavior.
