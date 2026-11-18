---
'remark-extend': minor
---

Carry along js import blocks that precede a section imported via `::importBlock`/`::importBlockContent`/`::importSmallBlock`/`::importSmallBlockContent`, and rewrite their relative local import/require specifiers so they keep resolving from the importing file's location. Bare (package) specifiers are left untouched.
