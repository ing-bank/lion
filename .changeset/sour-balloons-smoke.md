---
'providence-analytics': minor
---

- use oxc for all analyzers (oxc is way smaller and more performant than swc, let alone babel)
- make swcTraverse compatible with oxc
- expand scope functionality of swcTraverse

BREAKING:

- make parsers peerDependencies (babel or swc should be loaded by external analyzers)
- rename `swcTraverse` to `oxcTraverse`
