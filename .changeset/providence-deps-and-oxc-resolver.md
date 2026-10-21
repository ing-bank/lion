---
'providence-analytics': minor
---

Resolve import specifiers with `oxc-resolver` instead of `@rollup/plugin-node-resolve`.

The rules are the ones the package used before - `exports` maps with the ESM conditions, `module`
preferred over `main`, `.mjs`/`.js`/`.json` extension guessing, `modulePaths` support - and a parity
test asserts both resolvers return the same path for relative, bare, subpath, exports-map,
`module`-field, extensionless and builtin specifiers. Resolution itself drops from ~1.7 ms to
~0.03 ms per call (2400 calls: 4.2 s to 0.08 s, memoization disabled), and the rollup plugin moves to
`devDependencies`, where it stays only as the resolver the mock-fs suites swap in.

Also removes unused dependencies: `@types/inquirer` (the CLI no longer uses inquirer) and
`@babel/plugin-syntax-import-assertions` (`AstService` passes the built-in parser plugin names to
`@babel/parser`), plus the duplicate `@babel/parser` / `@swc/core` declarations. The dashboard imports (`@web/dev-server`,
`lit-element`) stay dev-only: both an `optionalDependencies` edge and a `dependencies` edge were
measured and rejected (the first breaks `packages/ui`'s type gate in CI, the second adds a
194-package closure to every consumer); the constraint is now recorded in `comments.dependencies`.
