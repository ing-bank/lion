---
'@lion/ui': patch
---

fix(overlays): fix zIndex handling during initialization — \_handleZIndex now executes on 'init' phase instead of unused 'setup' phase, ensuring local overlays get proper z-index values
