---
'@lion/input-stepper': patch
---

Redispatch leave events on input-stepper when leaving the increment/decrement buttons. This will consider entering and leaving the buttons as user interactions and result in the input-stepper "touched" property to be set to true, similar to when you would enter/leave the input field.
