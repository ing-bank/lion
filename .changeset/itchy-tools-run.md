---
'@lion/overlays': patch
---

Fix deep contains util to properly check multiple nested shadow roots, and do not set containsTarget to false when children deepContains returns false. This would undo a found target in another child somewhere that was found in an earlier recursion.
