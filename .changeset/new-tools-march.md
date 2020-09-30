---
'@lion/combobox': minor
'@lion/core': minor
'@lion/overlays': minor
'@lion/form-core': patch
'@lion/form-integrations': patch
'@lion/listbox': patch
'@lion/select-rich': patch
---

Combobox package

## Features

- combobox: new combobox package
- core: expanded browsers detection utils
- core: closest() polyfill for IE
- overlays: allow OverlayMixin to specify reference node (when invokerNode should not be positioned against)
- form-core: add `_onLabelClick` to FormControlMixin. Subclassers should override this

## Patches

- form-core: make ChoiceGroupMixin a suite
- listbox: move generic tests from combobox to listbox
- select-rich: enhance tests
