# Tools >> Ajax >> Overview ||10

`Ajax` is a small wrapper around `fetch` which:

- Allows globally registering request and response interceptors
- Throws on 4xx and 5xx status codes
- Supports caching, so a request can be prevented from reaching to network, by returning the cached response.
- Supports JSON with `ajax.fetchJSON` by automatically serializing request body and deserializing response payload as JSON, and adding the correct Content-Type and Accept headers.
- Adds accept-language header to requests based on application language
- Adds XSRF header to request if the cookie is present

## Installation

```bash
npm i --save @lion/ajax
```

### Relation to fetch

`Ajax` delegates all requests to fetch. `ajax.fetch` and `ajax.fetchJson` have the same function signature as `window.fetch`, you can use any online resource to learn more about fetch. [MDN](http://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) is a great start.

## Ajax class options

| Property                         | Type     | Default Value                                                      | Description                                                                                                                                     |
| -------------------------------- | -------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| addAcceptLanguage                | boolean  | `true`                                                             | Whether to add the Accept-Language header from the `data-localize-lang` document property                                                       |
| addCaching                       | boolean  | `false`                                                            | Whether to add the cache interceptor and start storing responses in the cache, even if `cacheOptions.useCache` is `false`                       |
| xsrfCookieName                   | string   | `"XSRF-TOKEN"`                                                     | The name for the Cross Site Request Forgery cookie                                                                                              |
| xsrfHeaderName                   | string   | `"X-XSRF-TOKEN"`                                                   | The name for the Cross Site Request Forgery header                                                                                              |
| jsonPrefix                       | string   | `""`                                                               | The prefix to add to add to responses for the `.fetchJson` functions                                                                            |
| cacheOptions.useCache            | boolean  | `false`                                                            | Whether to use the default cache interceptors to cache requests                                                                                 |
| cacheOptions.getCacheIdentifier  | function | a function returning the string `_default`                         | A function to determine the cache that should be used for each request; used to make sure responses for one session are not used in the next    |
| cacheOptions.methods             | string[] | `["get"]`                                                          | The HTTP methods to cache reponses for. Any other method will invalidate the cache for this request, see "Invalidating cache", below            |
| cacheOptions.maxAge              | number   | `360000`                                                           | The time to keep a response in the cache before invalidating it automatically                                                                   |
| cacheOptions.invalidateUrls      | string[] | `undefined`                                                        | Urls to invalidate each time a method not in `cacheOptions.methods` is encountered, see "Invalidating cache", below                             |
| cacheOptions.invalidateUrlsRegex | regex    | `undefined`                                                        | Regular expression matching urls to invalidate each time a method not in `cacheOptions.methods` is encountered, see "Invalidating cache", below |
| cacheOptions.requestIdFunction   | function | a function returning the base url and serialized search parameters | Function to determine what defines a unique URL                                                                                                 |
| cacheOptions.contentTypes        | string[] | `undefined`                                                        | Whitelist of content types that will be stored to or retrieved from the cache                                                                   |
| cacheOptions.maxResponseSize     | number   | `undefined`                                                        | The maximum response size in bytes that will be stored to or retrieved from the cache                                                           |
| cacheOptions.maxCacheSize        | number   | `undefined`                                                        | The maxiumum total size in bytes of the cache; when the cache gets larger it is truncated                                                       |

## Usage

```js script
import { ajax, createCacheInterceptors } from '@lion/ajax';

const getCacheIdentifier = () => {
  let userId = localStorage.getItem('lion-ajax-cache-demo-user-id');
  if (!userId) {
    localStorage.setItem('lion-ajax-cache-demo-user-id', '1');
    userId = '1';
  }
  return userId;
};

const TEN_MINUTES = 1000 * 60 * 10; // in milliseconds

const cacheOptions = {
  useCache: true,
  maxAge: TEN_MINUTES,
};

const [cacheRequestInterceptor, cacheResponseInterceptor] = createCacheInterceptors(
  getCacheIdentifier,
  cacheOptions,
);

ajax.addRequestInterceptor(cacheRequestInterceptor);
ajax.addResponseInterceptor(cacheResponseInterceptor);
```

Or use a custom cache object and add the cache config to the constructor:

```js
import { Ajax } from '@lion/ajax';

const storeButDontRetrieveByDefaultConfig = {
  addCaching: true,
  cacheOptions: {
    getCacheIdentifier,
    useCache: false,
    maxAge: TEN_MINUTES,
  },
};

const customAjax = new Ajax(storeButDontRetrieveByDefaultConfig);
```

### Invalidating the cache

Invalidating the cache, or cache busting, can be done in multiple ways:

- Going past the `maxAge` of the cache object
- Changing cache identifier (e.g. user session or active profile changes)
- Doing a non GET request to the cached endpoint
  - Invalidates the cache of that endpoint
  - Invalidates the cache of all other endpoints matching `invalidatesUrls` and `invalidateUrlsRegex`

### Restricting what to cache

The library has a number of options available to restrict what should be cached. They include:

#### By content type

`cacheOptions.contentTypes`

If this option is set, it is interpreted as a whitelist for which content types to cache. The content types of a given
response is derived from its `Content-Type` header. If this option is set, responses that do not have a `Content-Type`
header are never added to or retrieved from the cache.

#### By response size

`cacheOptions.maxResponseSize`

This option sets a maximum size (in bytes) for a single response to be cached. The size of the response is determined first by looking
at the `Content-Length` header; if this header is not available, the response is inspected (through the `blob()` function)
and its size retrieved.

### Limiting the cache size

`cacheOptions.maxCacheSize`

This option sets a maximum size (in bytes) for the whole cache. The size of a response is determined first by looking
at the `Content-Length` header; if this header is not available, the response is inspected (through the `blob()` function)
and its size retrieved.

If the cache grows larger than the `maxCacheSize` option, the cache is truncated according to a First-In-First-Out
(FIFO) algorithm that simply removes the oldest entries until the cache is smaller than `options.maxCacheSize`.
