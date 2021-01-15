# Lion Ajax Cache

A caching library that uses `lion-web/ajax` and adds cache interceptors to provide caching for use in
frontend `services`.

> Technical documentation and decisions can be found in
> [./docs/technical-docs.md](./docs/technical-docs.md)

## Getting started

Consume the global `ajax` instance and add the interceptors to it, using a cache configuration
which is applied on application level. If a developer wants to add specifics to cache behavior
he or she has to provide a cache config per action (get etc) via `lionCacheOptions` field of local ajax config,
see examples below.

> **Note**: make sure to add the **interceptors** only **once**. This is usually
> done on app-level

```js
import { ajax } from '@lion-web/ajax.js';
import {
  lionCacheRequestInterceptorFactory,
  lionCacheResponseInterceptorFactory,
} from '@lion-web/ajax-cache.js';

const globalCacheOptions = {
  useCache: 'always',
  timeToLive: 1000 * 60 * 5, // 5 minutes
};
const getCacheIdentifier = () => getActiveProfile().refreshToken;

ajax.interceptors.request.use(
  lionCacheRequestInterceptorFactory(getCacheIdentifier, globalCacheOptions),
);
ajax.interceptors.response.use(
  lionCacheResponseInterceptorFactory(getCacheIdentifier, globalCacheOptions),
);

ajax.get('/my-url').then(response => {
  return response.data;
});
```

## Small example

```js
import { ajax } from '@lion-web/ajax.js';
import {
  lionCacheRequestInterceptorFactory,
  lionCacheResponseInterceptorFactory,
} from '@lion-web/ajax-cache.js';
import { getActiveProfile } from 'token-manager'; //example, not real package

const getCacheIdentifier = () => getActiveProfile().refreshToken;

const globalCacheOptions = {
  useCache: 'never',
  timeToLive: 50, // default: one hour (the cache instance will be replaced in 1 hour, regardless of this setting)
  methods: ['get'], // default: ['get'] NOTE for now only 'get' is supported
  // requestIdentificationFn: (requestConfig) => { }, // see docs below for more info

  // Note:
  // invalidateUrls: not available for global cache config, see docs below for more info
  // invalidateUrlsRegex: not available for global cache config, see docs below for more info
};

// pass a function to the interceptorFactory that retrieves a cache identifier
ajax.interceptors.request.use(lionCacheRequestInterceptorFactory(getCacheIdentifier, cacheOptions));
ajax.interceptors.response.use(
  lionCacheResponseInterceptorFactory(getCacheIdentifier, cacheOptions),
);

class TodoService {
  constructor() {
    this.localAjaxConfig = {
      lionCacheOptions: {
        invalidateUrls: ['/api/todosbykeyword'], // default: []
        // invalidateUrlsRegex: RegExp, // see docs below for more info
        // requestIdentificationFn: (requestConfig) => { }, // see docs below for more info
      },
    };
  }

  /**
   * Returns all todos from cache if not older than 5 minutes
   */
  getTodos() {
    return ajax.get(`//api.${hostname}/api/todos`, this.localAjaxConfig);
  }

  /**
   *
   */
  getTodosByKeyword(keyword) {
    return ajax.get(`//api.${hostname}/api/todosbykeyword/${keyword}`, this.localAjaxConfig);
  }

  /**
   * Creates new todo and invalidates cache.
   * `getTodos` will NOT take the response from cache
   */
  saveTodo(todo) {
    return ajax.post(`//api.${hostname}/api/todos`, { data: todo }, this.localAjaxConfig);
  }
}
```

## Docs

### CacheOptions

```js
const cacheOptions = {
  // `useCache`: determines wether or not to use the cache
  // can be string 'always' | 'never'
  // default: 'never'
  useCache: 'always',

  // `timeToLive`: is the time the cache should be kept in ms
  // default: 0
  // Note: regardless of this setting, the cache instance holding all the caches
  //       will be invalidated after one hour
  timeToLive: 1000 * 60 * 5,

  // `methods`: an array of methods on which this configuration is applied
  // Note: when `useCache` is `never` this will not be used
  // NOTE: ONLY GET IS SUPPORTED
  // default: ['get']
  methods: ['get'],

  // `invalidateUrls`: an array of strings that for each string that partially
  // occurs as key in the cache, will be removed
  // default: []
  // This option can be used only in cache config per action (get, post etc)
  // Note: can be invalidated only by non-get request to the same url
  invalidateUrls: ['/api/todosbykeyword'],

  // `invalidateUrlsRegex`: a RegExp object to match and delete
  // each matched key in the cache
  // This option can be used only in cache config per action (get, post etc)
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
