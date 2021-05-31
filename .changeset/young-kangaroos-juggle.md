---
'@lion/button': minor
'@lion/form-integrations': minor
'@lion/select-rich': minor
---

- BREAKING: In `lion-button` package split of separate buttons for reset & submit:

  - LionButton (a clean fundament, **use outside forms**)
  - LionButtonReset (logic for. submit and reset events, but without implicit form submission logic: **use for reset buttons**)
  - LionButtonSubmit (full featured button: **use for submit buttons and buttons with dynamic types**)

- fixed axe criterium for LionButton (which contained a native button to support form submission)
- removed `_beforeTemplate()` & `_afterTemplate()` from LionButton
