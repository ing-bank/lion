---
'@lion/ui': patch
---

Preserve the superclass type when reapplying `SlotMixin` to an already slotted component.
This prevents TypeScript 4.7 from treating `slots` as a property instead of an accessor when
subclassing, for example, `SlotMixin(LionSelectRich)`. Runtime behavior is unchanged.
