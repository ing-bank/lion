---
'remark-extend': minor
---

BREAKING CHANGE: Changing approach from overwriting extending files to using an import-based approach.

Removed features:

- `::replaceFrom`
- `::replaceBetween`
- `::addMdAfter`
- `::removeFrom`
- `::removeBetween`

Added Features:

- `::import`
- `::importBlock`
- `::importBlockContent`
- `::importSmallBlock`
- `::importSmallBlockContent`

See the updated documentation for how to use this new approach.
