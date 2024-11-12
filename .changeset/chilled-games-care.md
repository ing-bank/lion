---
'@lion/ui': patch
---

Add unique ['_$isValidator$'] marker to identify Validator instances across different lion versions.
It's meant to be used as a replacement for an `instanceof` check.
