---
'@lion/ui': patch
---

fix(pagination): remove unnecessary ellipsis when count equals visiblePages + 1

Fixed issue where LionPagination component incorrectly displayed ellipsis when the total page count was exactly one more than the visible pages setting (e.g., showing [1, 2, 3, 4, 5, '...', 6] instead of [1, 2, 3, 4, 5, 6] when visiblePages=5 and count=6).
