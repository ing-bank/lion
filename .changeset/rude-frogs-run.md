---
'@lion/ajax': minor
---

**BREAKING** public API changes:

- `AjaxClient` is now `Ajax`
- `AjaxClientFetchError` is now `AjaxFetchError`
- `request` and `requestJson` methods of `Ajax` class are renamed as `fetch` and `fetchJson` respectively
- `getCookie` and `validateOptions` is not part of the public API any more
- Removed the `setAjax`
- `createXSRFRequestInterceptor` renamed as `createXsrfRequestInterceptor`
- Exporting `createCacheInterceptors` instead of `cacheRequestInterceptorFactory` and `cacheResponseInterceptorFactory`
