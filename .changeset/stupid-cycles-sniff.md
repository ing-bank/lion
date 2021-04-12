---
'@lion/ajax': minor
'@lion/button': minor
'@lion/checkbox-group': minor
'@lion/combobox': minor
'@lion/core': minor
'@lion/form-core': minor
'@lion/form-integrations': minor
'@lion/input': minor
'@lion/input-amount': minor
'@lion/input-date': minor
'@lion/input-email': minor
'@lion/input-iban': minor
'@lion/input-stepper': minor
'@lion/listbox': minor
'@lion/localize': minor
'@lion/overlays': minor
'@lion/select-rich': minor
'@lion/switch': minor
'@lion/textarea': minor
'@lion/fieldset': minor
'@lion/form': minor
'@lion/input-datepicker': minor
'@lion/input-range': minor
'@lion/radio-group': minor
'@lion/select': minor
'@lion/tooltip': minor
---

Type fixes and enhancements:

- all protected/private entries added to form-core type definitions, and their dependents were fixed
- a lot @ts-expect-error and @ts-ignore (all `get slots()` and `get modelValue()` issues are fixed)
- categorized @ts-expect-error / @ts-ignore into:
  - [external]: when a 3rd party didn't ship types (could also be browser specs)
  - [allow-protected]: when we are allowed to know about protected methods. For instance when code
    resides in the same package
  - [allow-private]: when we need to check a private value inside a test
  - [allow]: miscellaneous allows
  - [editor]: when the editor complains, but the cli/ci doesn't
