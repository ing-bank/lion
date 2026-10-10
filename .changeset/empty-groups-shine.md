---
'@lion/ui': patch
---

[form-core] gate FormGroup feedback visibility on interaction state

`FormGroupMixin` (lion-form, lion-fieldset, lion-checkbox-group, lion-radio-group) no longer sets `aria-invalid="true"` / `shows-feedback-for="error"` before user interaction when the group merely contains invalid children (e.g. a pristine `Required` field). The group now applies the same feedback-visibility rule as fields (`(touched && dirty) || prefilled || submitted`) via a `_showFeedbackConditionFor` override, so `aria-invalid` aligns with actually visible errors again. `hasFeedbackFor` and `validationStates` keep reflecting the group's (in)validity.
