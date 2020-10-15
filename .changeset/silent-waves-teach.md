---
'@lion/combobox': patch
'@lion/form-core': patch
'@lion/form-integrations': patch
'@lion/listbox': patch
---

Allow flexibility for extending the repropagation prevention conditions, which is needed for combobox, so that a model-value-changed event is propagated when no option matches after an input change. This allows validation to work properly e.g. for Required.
