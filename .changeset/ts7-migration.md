---
'@lion/ui': minor
---

Migrate the type build to TypeScript 7.

Emitted declarations are now produced by TS 7 and no longer need the post-build correction
script, which has been removed - the script file, its npm script, the `wireit.types` chain
and the rationale docs. TS 7 emits portable specifiers itself (`lit`,
`@open-wc/scoped-elements/lit-element.js`), and type-checks this package about 6x faster
(measured cold `tsc --build --force` of singleton-manager + ui: 4.9.5 29.1s/30.2s vs
7.0.2 4.8s/4.2s; both emitting 972 declarations).

Also fixed: declarations that were invalid under TS 7 while valid under 4.9.5
(`export { undefined as X }` from post-class statics, now hoisted into the class bodies);
the un-done TS 4.9 -> 5.x migration (`super.<field>` access, mixin signatures, and
`suppressImplicitAnyIndexErrors` which TS 5.5 removed); and JSDoc/JS constructs TS 7 parses
differently (bare `?` type arguments, values used as types, `@readonly` on getters).

The published entry points are unaffected: across all 67 `dist-types/exports/` barrels the
exported names and re-export targets are identical (0 differences). 66 of them differ
textually only in the quote style of their re-export specifiers (`"..."` under 4.9.5,
`'...'` under TS 7).
