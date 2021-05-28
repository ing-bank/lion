---
'babel-plugin-extend-docs': minor
---

Work with package entry points (exports) and internal imports.

This simplified the internal logic a lot. For more details please see [package entry points](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#packages_exports) in the node documentation.

BREAKING CHANGES:

- we no longer support relative import paths in demos
- no need to pass on a `rootPath` or `\_\_filePath`` anymore
- option `throwOnNonExistingPathToFiles` and `throwOnNonExistingRootPath` got removed
