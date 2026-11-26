---
'change-graph': patch
---

Read changed file names from git with `-z`, so a file with a non-ASCII letter (`café.js`) in its name is no longer reported as not in the graph and its tests are selected.
