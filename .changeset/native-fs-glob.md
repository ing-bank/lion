---
'providence-analytics': minor
---

Replace the `globby` dependency with a small `fsGlob` util built on the native `fs.promises.glob`, and require Node.js >= 22.
Internal imports now use package subpath imports (`#core/*`, `#utils/*`, ...).
