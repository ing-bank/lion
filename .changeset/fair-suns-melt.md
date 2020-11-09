---
'@lion/accordion': patch
'@lion/calendar': patch
'@lion/checkbox-group': patch
'@lion/collapsible': patch
'@lion/core': patch
'@lion/dialog': patch
'@lion/form': patch
'@lion/form-core': patch
'@lion/helpers': patch
'@lion/icon': patch
'@lion/input-amount': patch
'@lion/input-date': patch
'@lion/input-datepicker': patch
'@lion/input-email': patch
'@lion/input-iban': patch
'@lion/input-range': patch
'@lion/input-stepper': patch
'@lion/listbox': patch
'@lion/pagination': patch
'providence-analytics': patch
'@lion/radio-group': patch
'@lion/steps': patch
'@lion/switch': patch
'@lion/textarea': patch
---

Fix type imports to reuse lion where possible, in case Lit updates with new types that may break us.
