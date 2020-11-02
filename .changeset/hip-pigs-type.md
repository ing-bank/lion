---
'@lion/input-datepicker': minor
'@lion/overlays': minor
---

- ArrowMixin needs to extend styles and not overwrite them
- ArrowMixin add an `_arrowNodeTemplate` which can be used to only override the arrow content
- InputDatepicker switch between bottomsheet style (on mobile) popover (on desktop/table with screensize bigger then 600px)
