---
'remark-extend': minor
---

Carry along js import blocks that precede a section imported via `::importBlock`/`::importBlockContent`/`::importSmallBlock`/`::importSmallBlockContent`, and rewrite their relative local import/require specifiers so they keep resolving from the importing file's location. Bare (package) specifiers are left untouched.

A page that imports several sections of the same file now receives each `js script`/`js client` import statement once: those blocks end up in a single page module, where a second declaration of the same binding is a `SyntaxError: Identifier 'x' has already been declared`. An exact duplicate statement is dropped. Two statements that declare the same local name from different specifiers - `import { html } from '@mdjs/mdjs-preview'` and `import { html } from 'lit'` - are kept apart by renaming the declaration that yields (`html as html1`) and rewriting the occurrences of that name in its own block, so neither import is lost and no template literal, string or comment is touched. The page's own declaration keeps the plain name and an imported block yields, so code elsewhere on the page that leans on the page's own import keeps resolving. Plain `js` blocks are code samples and are left as they are.
