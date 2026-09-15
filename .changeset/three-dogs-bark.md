---
'@lion/ui': patch
---

[validate] guard ValidateMixin's `showsFeedbackFor` custom converters  
  
Fixes a crash (`Uncaught TypeError: can't access property "split", value is null`) in `ValidateMixin` when the reflected `shows-feedback-for` attribute is removed from the host element by external code (e.g. Storybook), instead of being set to the empty string. The `fromAttribute` custom converter now falls back to `[]`.
