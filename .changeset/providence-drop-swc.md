---
'providence-analytics': minor
---

Drop the `@swc/core` optional dependency, and the `swc` ast type it existed for.

`@swc/core` was declared optional so `AstService` could lazily import it for `astType: 'swc'`, and its
node types were referenced from our shipped declarations. Nothing selected that path: all six analyzers
declare `static requiredAst = 'oxc'` and the base `Analyzer` defaults to `'babel'`, so no caller in the
repo - and no CLI flag - ever asked for an swc AST. The parser, its `_getSwcOffset()` span compensation
and the `'swc'` member of `AnalyzerAst` are removed with it.

Two consequences:

- The traversal (`oxc-traverse.js`, and the `SwcPath` / `SwcVisitor` / `SwcScope` / `SwcBinding` types it
  is built on) now uses our own structural `AstNode` instead of `@swc/core`'s node union. Those type
  *names* are unchanged; only the node type they are built on changed.
- `AnalyzerAst` no longer accepts `'swc'`: passing it is a type error, and `AstService.getAst` throws
  `astType "swc" not supported.`

Weight removed: 13 lock paths (11 `@swc/core-<platform>` binaries plus `@swc/core` and `@swc/types`);
a fresh `npm ci` installs 5 packages / 106 MB less (48 MB linux-x64-gnu + 59 MB linux-x64-musl, and the
musl build cannot load on a glibc host at all). On top of that an interrupted binary download had left
107 MB of extract debris (`node_modules/@swc/.core-linux-x64-*-<id>/`) in every install of this package.
