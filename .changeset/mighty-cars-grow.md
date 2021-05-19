---
'@lion/localize': patch
---

Fix localize race condition where data was being added while namespace loader promise was no longer in cache.
