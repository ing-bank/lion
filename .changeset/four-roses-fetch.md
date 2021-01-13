---
'@lion/calendar': patch
'@lion/checkbox-group': patch
'@lion/core': patch
'@lion/fieldset': patch
'@lion/form-core': patch
'@lion/input-date': patch
'@lion/input-datepicker': patch
'@lion/input-email': patch
'@lion/input-iban': patch
'@lion/listbox': patch
'@lion/localize': patch
'@lion/overlays': patch
'@lion/pagination': patch
'@lion/progress-indicator': patch
'@lion/radio-group': patch
'@lion/select-rich': patch
'@lion/switch': patch
---

Fix type issues where base constructors would not have the same return type. This allows us to remove a LOT of @ts-expect-errors/@ts-ignores across lion.
