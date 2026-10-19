---
'@lion/ui': patch
---

Restore public listbox focus-node access and legacy TypeScript slot-accessor overrides.
The select-rich focus-node override is also public to match its restored public base member.
Keep custom overlay invokers clickable when no focusable light-DOM descendant exists,
and allow removing overlay content after teardown without retaining detached wrappers.
Keep declaration postprocessing in a single build-only script, excluded from the npm package.
