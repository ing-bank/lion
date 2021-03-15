---
'@lion/accordion': minor
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
---

BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/package/define-radio' for example for just lion-radio.
