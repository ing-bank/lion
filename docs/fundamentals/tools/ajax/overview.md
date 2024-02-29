# Tools >> Ajax >> Overview ||10

`Ajax` is a small wrapper around `fetch` which:

- Allows globally registering request and response interceptors
- Throws on 4xx and 5xx status codes
- Supports caching, so a request can be prevented from reaching to network, by returning the cached response.
- Supports JSON with `ajax.fetchJSON` by automatically serializing request body and deserializing response payload as JSON, and adding the correct Content-Type and Accept headers.
- Adds accept-language header to requests based on application language
- Adds XSRF header to request if the cookie is present and the request is for a mutable action (POST/PUT/PATCH/DELETE) and if the origin is the same as current origin or the request origin is in the xsrfTrustedOrigins list.

## Installation

```bash
npm i --save @lion/ajax
```

### Relation to fetch

`Ajax` delegates all requests to fetch. `ajax.fetch` and `ajax.fetchJson` have the same function signature as `window.fetch`, you can use any online resource to learn more about fetch. [MDN](http://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) is a great start.

## `ajax.fetch`

The `fetch` method of `ajax` is a very small wrapper around native `window.fetch` and returns a native [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object, the main differences with native `window.fetch` are:

- it will use any caching options that you've configured in the `Ajax` class
- it will throw on response statuses between 400 and 600 (native fetch doesn't throw)
- it will run any interceptors that you've configured
- it will add a XSRF header to the request if the XSRF cookie is present

Otherwise, you can expect the same usage as from `window.fetch`. Here are some simple examples:

```js
// A simple GET request
const response = await ajax.fetch('/api/foo');
const data = await response.json(); // or .text(), .clone(), .formData(), etc
```

```js
// A simple POST request
const response = await ajax.fetch('/api/foo', {
  method: 'POST',
  body: JSON.stringify({ foo: 'bar' }),
});
```

## `ajax.fetchJson`

The `fetchJson` method of `ajax` has some additional features, added for convenience and ease of use. For example, the `fetchJson` method:

- adds the `accept` header with a value of `application/json`
- adds the `content-type` header with a value of `application/json`, if a request body is provided
- automatically `JSON.stringifies` the request body, if one is provided
- will attempt to parse the response body as JSON if available
  - and also automatically remove a JSON prefix from the response body if one is configured

> Note that instead of returning only a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response), `fetchJson` returns an object containing the [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) and a `JSON.parse`'d `body`

```js
// A simple GET request
const { response, body } = await ajax.fetchJson('/api/foo');
// body.foo === 'bar';
```

```js
// A simple POST request
const { response, body } = await ajax.fetchJson('/api/foo', {
  method: 'POST',
  body: { foo: 'bar' },
});
```

## Interceptors

Interceptors are functions that can be used to inspect or modify the [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) or `Response` objects of a network request.

### Request interceptors

A request interceptor is a function that takes a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object, and returns a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object, or a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object, and runs _before_ the native `window.fetch` call is done, allowing you to modify or inspect a request before it's made.

If you return a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object, the response will be returned by the `fetch`
or `fetchJson` methods, instead of passing the `Request` to the native `window.fetch` function.

Returning a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request):

```js
function addAcceptLanguage(request) {
  request.headers.set('accept-language', 'EN_GB');
  return request;
}

ajax.addRequestInterceptor(addAcceptLanguage);
```

Returning a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response):

```js
function interceptFooRequest(request) {
  if (request.headers.get('foo')) {
    return Response.json({ foo: 'bar' });
  }

  return request;
}

ajax.addRequestInterceptor(interceptFooRequest);
```

Request interceptors can be async and will be awaited.

### Response interceptors

A response interceptor is a function that takes a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object, and returns a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object, and runs _after_ the native `window.fetch` call is done, allowing you to modify or inspect the response before it's returned by `fetch`/`fetchJson`.

```js
async function rewriteFoo(response) {
  const body = await response.clone().text();

  return new Response(body.replaceAll('foo', 'bar'), response);
}

ajax.addResponseInterceptor(rewriteFoo);
```

Response interceptors can be async and will be awaited.

## Ajax class options

| Property                         | Type     | Default Value                                                      | Description                                                                                                                                     |
| -------------------------------- | -------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| addAcceptLanguage                | boolean  | `true`                                                             | Whether to add the Accept-Language header from the `data-localize-lang` document property                                                       |
| addCaching                       | boolean  | `false`                                                            | Whether to add the cache interceptor and start storing responses in the cache, even if `cacheOptions.useCache` is `false`                       |
| xsrfCookieName                   | string   | `"XSRF-TOKEN"`                                                     | The name for the Cross Site Request Forgery cookie                                                                                              |
| xsrfHeaderName                   | string   | `"X-XSRF-TOKEN"`                                                   | The name for the Cross Site Request Forgery header                                                                                              |
| xsrfTrustedOrigins               | string[] | []                                                                 | List of trusted origins, the XSRF header will also be added if the origin is in this list.                                                      |
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

## Caching

```js
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
