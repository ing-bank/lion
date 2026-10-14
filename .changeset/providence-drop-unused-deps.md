---
'providence-analytics': patch
---

Remove unused dependencies and duplicate declarations from the manifest.

- `@types/inquirer` is gone: the CLI no longer uses inquirer and no source, test or type file ever imported it.
- `@babel/plugin-syntax-import-assertions` is gone: `AstService` passes the built-in `importAssertions`/`importMeta`/`classProperties` parser plugin names to `@babel/parser` directly, so the standalone package was never imported.
- `@babel/parser` and `@swc/core` are now declared once, as `optionalDependencies`: they are lazily imported fallback parsers and their types are referenced from the emitted declarations.
