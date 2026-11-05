---
'@lion/ui': patch
---

[button] a keyboard click needs its keydown on the button too. A keyup on its own, for example after a closing dialog moves the focus back to its lion-button invoker, no longer clicks it (#2555).
