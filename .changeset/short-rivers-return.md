---
'remark-extend': minor
---

Carry along js import blocks that precede a section imported via `::importBlock`/`::importBlockContent`/`::importSmallBlock`/`::importSmallBlockContent`, and rewrite their relative local import/require specifiers so they keep resolving from the importing file's location. Bare (package) specifiers are left untouched.

A page that imports several sections of the same file now receives each `js script`/`js client` import statement once: those blocks end up in a single page module, where a second declaration of the same binding is a `SyntaxError: Identifier 'x' has already been declared`. Plain `js` blocks are code samples and are left as they are.
