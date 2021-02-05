---
'babel-plugin-extend-docs': minor
'providence-analytics': minor
'remark-extend': minor
'@lion/accordion': minor
'@lion/ajax': minor
'@lion/button': minor
'@lion/calendar': minor
'@lion/checkbox-group': minor
'@lion/collapsible': minor
'@lion/combobox': minor
'@lion/core': minor
'@lion/dialog': minor
'@lion/fieldset': minor
'@lion/form': minor
'@lion/form-core': minor
'@lion/form-integrations': minor
'@lion/helpers': minor
'@lion/icon': minor
'@lion/input': minor
'@lion/input-amount': minor
'@lion/input-date': minor
'@lion/input-datepicker': minor
'@lion/input-email': minor
'@lion/input-iban': minor
'@lion/input-range': minor
'@lion/input-stepper': minor
'@lion/listbox': minor
'@lion/localize': minor
'@lion/overlays': minor
'@lion/pagination': minor
'@lion/progress-indicator': minor
'@lion/radio-group': minor
'@lion/select': minor
'@lion/select-rich': minor
'singleton-manager': minor
'@lion/steps': minor
'@lion/switch': minor
'@lion/tabs': minor
'@lion/textarea': minor
'@lion/tooltip': minor
'@lion/validate-messages': minor
---

Add exports field in package.json

Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.
