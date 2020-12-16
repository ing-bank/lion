---
'@lion/ajax': minor
---

BREAKING CHANGE: We no longer use axios! Our ajax package is now a thin wrapper around Fetch. The API has changed completely. You will need a fetch polyfill for IE11.
