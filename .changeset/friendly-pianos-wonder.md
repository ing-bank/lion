---
'@lion/button': patch
---

Delay adding prevent event leakage handler by one frame. This is because it takes 1 frame longer for older browsers such as Firefox ESR 60, IE11 and old Edge to have the native form available as a property on the native button.
