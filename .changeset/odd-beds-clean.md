---
'providence-analytics': minor
---

BREAKING: Align exports fields. If you want to import from CLI instead of main entrypoint (`import { ... } from 'providence-analytics';`) using export maps, you can now do so with `import { ... } from 'providence-analytics/src/cli';` instead of `import { ... } from 'providence-analytics/src/cli/index.js';`.
