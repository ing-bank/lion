---
'@lion/ui': patch
---

[form-core] Keep registered fields in DOM order when groups are moved, fixing keyboard navigation and option positions in grouped country dropdowns.

Registration and removal remain synchronous. DOM ordering and listbox option positions are reconciled once per microtask batch, before the next browser paint.
