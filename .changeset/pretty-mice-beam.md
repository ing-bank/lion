---
'@lion/ajax': minor
---

Adds a `contentTypes` cache option to specify a whitelist of content types to be cached. The option prevents caching and cache retrieval for responses that do not have one of these values in the `Content-Type` header.
