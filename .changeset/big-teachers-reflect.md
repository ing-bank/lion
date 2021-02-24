---
'@lion/checkbox-group': patch
'@lion/combobox': patch
'@lion/form-core': patch
'@lion/listbox': patch
'@lion/overlays': patch
'@lion/select-rich': patch
---

Remove .prototype accessor when accessing super.constructor from a constructor. This causes maximum call stack exceeded in latest chrome.
