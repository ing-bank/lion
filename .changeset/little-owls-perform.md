---
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
'@lion/steps': minor
'@lion/switch': minor
'@lion/tabs': minor
'@lion/textarea': minor
'@lion/tooltip': minor
'@lion/validate-messages': minor
'providence-analytics': patch
---

Upgrade to latest Typescript. Keep in mind, some @ts-ignores were necessary, also per TS maintainer's advice. Use skipLibCheck in your TSConfig to ignore issues coming from Lion, the types are valid. We also unfixed lion's dependencies (now using caret ^) on its own packages, because it caused a lot of problems with duplicate installations for end users as well as subclassers and its end users. Both of these changes may affect subclassers in a breaking manner, hence the minor bump.
