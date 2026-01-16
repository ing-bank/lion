---
'@lion/ui': patch
---

In the \_setCheckedElements method of ChoiceGroupMixin.js, a small safeguard was added to handle cases where multipleChoice is enabled but the incoming modelValue is not an array.
