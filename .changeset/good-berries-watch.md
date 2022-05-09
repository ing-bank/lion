---
'@lion/ajax': minor
---

Adds a `maxResponseSize` cache option to specify a max size for responses to be cached. The option prevents caching and cache retrieval for responses that are larger than the given maximum as reported in the `Content-Length` header. If this header is missing nothing happens, that is to say caching is not prevented.
