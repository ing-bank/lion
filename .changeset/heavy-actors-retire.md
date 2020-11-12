---
'@lion/ajax': patch
---

Added types for ajax package, although they are mostly quite butchered. This is due to the complexity of interceptor factories and bundled-es-modules/axios not exporting types, which makes it really difficult to type it properly.
