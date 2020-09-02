---
'@lion/form-core': minor
'@lion/core': minor
'@lion/fieldset': patch
'@lion/select-rich': patch
---

Form-core typings

#### Features

Provided typings for the form-core package and core package.
This also means that mixins that previously had implicit dependencies, now have explicit ones.

#### Patches

- lion-select-rich: invoker selectedElement now also clones text nodes (fix)
- fieldset: runs a FormGroup suite
