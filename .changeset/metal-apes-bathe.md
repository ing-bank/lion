---
"@lion/combobox": patch
"@lion/listbox": patch
---

Combobox: demos, Subclasser features and fixes


### Features
- Subclassers can configure `_syncToTextboxCondition()`. By default only for `autocomplete="inline|both"`
- Subclassers can configure `_showOverlayCondition(options)`.  For instance, already show once textbox gets focus or add your own custom
- Subclassers can configure `_syncToTextboxMultiple(modelValue, oldModelValue)`.  See https://github.com/ing-bank/lion/issues/1038
- Subclassers can configure `_autoSelectCondition`, for instance to have autcomplete="list" with auto select instead of manual selection. Both are possible according to w3c specs

### Fixes
- listbox multiselect can deselect again on 'Enter' and 'Space'. Closes https://github.com/ing-bank/lion/issues/1059
- combobox multiselect display only shows last selected option in textbox (instead of all). See https://github.com/ing-bank/lion/issues/1038
- default sync to textbox behavior for `autocomplete="none|list"` is no sync with textbox

### Demos
- created a google combobox demo (with anchors as options)
  - advanced styling example
  - uses autocomplete 'list' as a fundament and enhances `_showOverlayCondition` and `_syncToTextboxCondition`
- enhanced whatsapp combobox demo
  - how to match/highlight text on multiple rows of the option (not just choiceValue)

### Potentially breaking for subclassers:
- `_computeUserIntendsAutoFill` -> `__computeUserIntendsAutoFill` (not overridable)
- `_syncCheckedWithTextboxOnInteraction ` is removed. Use `_syncToTextboxCondition` and/or `_syncToTextboxMultiple`
