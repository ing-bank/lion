---
'@lion/overlays': patch
---

Fixed preventsScroll body margin handling for nested overlays by centralizing body-size state in OverlaysManager and avoiding margin accumulation/restoration mismatches.
