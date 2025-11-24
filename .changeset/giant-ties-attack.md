---
'@lion/ui': patch
---

feat(LionInputStepper): implement self-destructing output content for value display

1. from <div class="input-stepper__value">${this.__valueText}</div> to <output class="input-stepper__value"  for="..">${this.\_\_valueText}</output>
2. remove the \_onEnterButton() and \_onLeaveButton() logic.
