---
'providence-analytics': minor
---

Many improvements:

- rewritten from babel to swc
- swcTraverse tool, compatible with babel traverse api
- increased performance
- better windows compatibility

BREAKING:

- package fully written as esm
- entrypoints changed:
  - `@providence-analytics/src/cli` => `@providence-analytics/cli.js`
  - `@providence-analytics/analyzers` => `@providence-analytics/analyzers.js`
