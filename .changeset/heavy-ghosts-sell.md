---
'@lion/combobox': patch
---

Combobox api, demo and ux improvements

- renamed `filterOptionCondition ` (similarity to `match-mode`, since this is basically an override)
- demos for `matchCondition`
- inline autocompletion edge cases solved (that would be inconsistent ux otherwise)
- demos took a long time render: introduced a lazyRender directive that only adds (expensive) lionOptions after first meaningful paint has happened
- made clearer from the code that selectionDisplay component is for demo purposes only at this moment
