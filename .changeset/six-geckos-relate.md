---
'providence-analytics': minor
---

Many improvements:

- rewritten from babel to swc
- swc traversal tool with babel
- increased performance
- better windows compatibility

BREAKING:

- package fully written as esm
- entrypoints changed:
  - `@providence-analytics/src/cli` => `@providence-analytics/cli.js`
  - `@providence-analytics/analyzers` => `@providence-analytics/analyzers.js`
