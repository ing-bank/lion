[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Ajax

`ajax` is a small wrapper around `fetch` which:

- Allows globally registering request and response interceptors
- Throws on 4xx and 5xx status codes
- Prevents network request if a request interceptor returns a response
- Supports a JSON request which automatically encodes/decodes body request and response payload as JSON
- Adds accept-language header to requests based on application language
- Adds XSRF header to request if the cookie is present

## How to use

### Installation

```sh
npm i --save @lion/ajax
```

### Relation to fetch

`ajax` delegates all requests to fetch. `ajax.request` and `ajax.requestJson` have the same function signature as `window.fetch`, you can use any online resource to learn more about fetch. [MDN](http://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) is a great start.

### Example requests

#### GET request

```js
import { ajax } from '@lion/ajax';

const response = await ajax.request('/api/users');
const users = await response.json();
```

#### POST request

```js
import { ajax } from '@lion/ajax';

const response = await ajax.request('/api/users', {
  method: 'POST',
  body: JSON.stringify({ username: 'steve' }),
});
const newUser = await response.json();
```

### JSON requests

We usually deal with JSON requests and responses. With `requestJson` you don't need to specifically stringify the request body or parse the response body:

#### GET JSON request

```js
import { ajax } from '@lion/ajax';

const { response, body } = await ajax.requestJson('/api/users');
```

#### POST JSON request

```js
import { ajax } from '@lion/ajax';

const { response, body } = await ajax.requestJson('/api/users', {
  method: 'POST',
  body: { username: 'steve' },
});
```

### Error handling

Different from fetch, `ajax` throws when the server returns a 4xx or 5xx, returning the request and response:

```js
import { ajax } from '@lion/ajax';

try {
  const users = await ajax.requestJson('/api/users');
} catch (error) {
  if (error.response) {
    if (error.response.status === 400) {
      // handle a specific status code, for example 400 bad request
    } else {
      console.error(error);
    }
  } else {
    // an error happened before receiving a response, ex. an incorrect request or network error
    console.error(error);
  }
}
```

## Ajax Cache

A caching library that uses `lion-web/ajax` and adds cache interceptors to provide caching for use in
frontend `services`.

> Technical documentation and decisions can be found in
> [./docs/technical-docs.md](./docs/technical-docs.md)

### Getting started

Consume the global `ajax` instance and add the interceptors to it, using a cache configuration
which is applied on application level. If a developer wants to add specifics to cache behavior
they have to provide a cache config per action (`get`, `post`, etc.) via `cacheOptions` field of local ajax config,
see examples below.

> **Note**: make sure to add the **interceptors** only **once**. This is usually
> done on app-level

```js
import {
  ajax,
  cacheRequestInterceptorFactory,
  cacheResponseInterceptorFactory,
} from '@lion-web/ajax.js';

const globalCacheOptions = {
  useCache: true,
  timeToLive: 1000 * 60 * 5, // 5 minutes
};
// Cache is removed each time an identifier changes,
// for instance when a current user is logged out
const getCacheIdentifier = () => getActiveProfile().profileId;

ajax.addRequestInterceptor(cacheRequestInterceptorFactory(getCacheIdentifier, globalCacheOptions));
ajax.addResponseInterceptor(
  cacheResponseInterceptorFactory(getCacheIdentifier, globalCacheOptions),
);

const { response, body } = await ajax.requestJson('/my-url');
```

### Ajax cache example

```js
import {
  ajax,
  cacheRequestInterceptorFactory,
  cacheResponseInterceptorFactory,
} from '@lion-web/ajax';

const getCacheIdentifier = () => getActiveProfile().profileId;

const globalCacheOptions = {
  useCache: false,
  timeToLive: 50, // default: one hour (the cache instance will be replaced in 1 hour, regardless of this setting)
  methods: ['get'], // default: ['get'] NOTE for now only 'get' is supported
  // requestIdentificationFn: (requestConfig) => { }, // see docs below for more info
  // invalidateUrls: [], see docs below for more info
  // invalidateUrlsRegex: RegExp, // see docs below for more info
};

// pass a function to the interceptorFactory that retrieves a cache identifier
// ajax.interceptors.request.use(cacheRequestInterceptorFactory(getCacheIdentifier, cacheOptions));
// ajax.interceptors.response.use(
//   cacheResponseInterceptorFactory(getCacheIdentifier, cacheOptions),
// );

class TodoService {
  constructor() {
    this.localAjaxConfig = {
      cacheOptions: {
        invalidateUrls: ['/api/todosbykeyword'], // default: []
      },
    };
  }

  /**
   * Returns all todos from cache if not older than 5 minutes
   */
  getTodos() {
    return ajax.requestJson(`/api/todos`, this.localAjaxConfig);
  }

  /**
   *
   */
  getTodosByKeyword(keyword) {
    return ajax.requestJson(`/api/todosbykeyword/${keyword}`, this.localAjaxConfig);
  }

  /**
   * Creates new todo and invalidates cache.
   * `getTodos` will NOT take the response from cache
   */
  saveTodo(todo) {
    return ajax.requestJson(`/api/todos`, { method: 'POST', body: todo, ...this.localAjaxConfig });
  }
}
```

If a value returned by `cacheIdentifier` changes the cache is reset. We avoid situation of accessing old cache and proactively clean it, for instance when a user session is ended.

### Ajax cache Options

```js
const cacheOptions = {
  // `useCache`: determines wether or not to use the cache
  // can be boolean
  // default: false
  useCache: true,

  // `timeToLive`: is the time the cache should be kept in ms
  // default: 0
  // Note: regardless of this setting, the cache instance holding all the caches
  //       will be invalidated after one hour
  timeToLive: 1000 * 60 * 5,

  // `methods`: an array of methods on which this configuration is applied
  // Note: when `useCache` is `false` this will not be used
  // NOTE: ONLY GET IS SUPPORTED
  // default: ['get']
  methods: ['get'],

  // `invalidateUrls`: an array of strings that for each string that partially
  // occurs as key in the cache, will be removed
  // default: []
  // Note: can be invalidated only by non-get request to the same url
  invalidateUrls: ['/api/todosbykeyword'],

  // `invalidateUrlsRegex`: a RegExp object to match and delete
  // each matched key in the cache
  // Note: can be invalidated only by non-get request to the same url
  invalidateUrlsRegex: /posts/

  // `requestIdentificationFn`: a function to provide a string that should be
  // taken as a key in the cache.
  // This can be used to cache post-requests.
  // default: (requestConfig, searchParamsSerializer) => url + params
  requestIdentificationFn: (request, serializer) => {
    return `${request.url}?${serializer(request.params)}`;
  },
};
```

## Considerations

## Fetch Polyfill

For IE11 you will need a polyfill for fetch. You should add this on your top level layer, e.g. your application.

[This is the polyfill we recommend](https://github.com/github/fetch). It also has a [section for polyfilling AbortController](https://github.com/github/fetch#aborting-requests)
