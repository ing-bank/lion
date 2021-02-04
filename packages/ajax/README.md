# Ajax

`ajax` is the global manager for handling all ajax requests.
It is a promise based system for fetching data, based on [axios](https://github.com/axios/axios)

```js script
import { html } from '@lion/core';
import { ajax } from './src/ajax.js';
import { AjaxClass } from './src/AjaxClass.js';

export default {
  title: 'Others/Ajax',
};
```

## Features

- only JS functions, no (unnecessarily expensive) web components
- supports GET, POST, PUT, DELETE, REQUEST, PATCH and HEAD methods
- can be used with or without XSRF token

## How to use

### Installation

```bash
npm i --save @lion/ajax
```

```js
import { ajax, AjaxClass } from '@lion/ajax';
```

### Example

```js
import { ajax } from '@lion/ajax';

ajax.get('data.json').then(response => console.log(response));
```

### Performing requests

Performing a `GET` request:

```js preview-story
export const performingGetRequests = () => html`
  <button
    @click=${() => {
      ajax
        .get('./packages/ajax/docs/assets/data.json')
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }}
  >
    Execute Request to Action Logger
  </button>
`;
```

To post data to the server, pass the data as the second argument in the `POST` request:

```js
const body = {
  ant: {
    type: 'insect',
    limbs: 6,
  },
};
ajax
  .post('zooApi/animals/addAnimal', body)
  .then(response => {
    console.log(`POST successful: ${response.status} ${response.statusText}`);
  })
  .catch(error => {
    console.log(error);
  });
```

## Configuration

### JSON prefix

The called API might add a JSON prefix to the response in order to prevent hijacking.
The prefix renders the string syntactically invalid as a script so that it cannot be hijacked.
This prefix should be stripped before parsing the string as JSON.
Pass the prefix with the `jsonPrefix` option.

```js
const myAjax = new AjaxClass({ jsonPrefix: ")]}'," });
myAjax
  .get('./packages/ajax/docs/assets/data.json')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });
```

### Additional headers

Add additional headers to the requests with the `headers` option.

```js preview-story
export const additionalHeaders = () => html`
  <button
    @click=${() => {
      const myAjax = new AjaxClass({ headers: { 'MY-HEADER': 'SOME-HEADER-VALUE' } });
      myAjax
        .get('./packages/ajax/docs/assets/data.json')
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }}
  >
    Execute Request to Action Logger
  </button>
`;
```

When executing the request above, check the Network tab in the Browser's dev tools and look for the Request Header on the GET call.

### Cancelable Request

It is possible to make an Ajax request cancelable, and then call `cancel()` to make the request provide a custom error once fired.

```js preview-story
export const cancelableRequests = () => html`
  <button
    @click=${() => {
      const myAjax = new AjaxClass({ cancelable: true });
      requestAnimationFrame(() => {
        myAjax.cancel('too slow');
      });
      myAjax
        .get('./packages/ajax/docs/assets/data.json')
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }}
  >
    Execute Request to Action Logger
  </button>
`;
```

### Cancel concurrent requests

You can cancel concurrent requests with the `cancelPreviousOnNewRequest` option.

```js preview-story
export const cancelConcurrentRequests = () => html`
  <button
    @click=${() => {
      const myAjax = new AjaxClass({ cancelPreviousOnNewRequest: true });
      myAjax
        .get('./packages/ajax/docs/assets/data.json')
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error.message);
        });
      myAjax
        .get('./packages/ajax/docs/assets/data.json')
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error.message);
        });
    }}
  >
    Execute Both Requests to Action Logger
  </button>
`;
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

ajax.interceptors.request.use(
  cacheRequestInterceptorFactory(getCacheIdentifier, globalCacheOptions),
);
ajax.interceptors.response.use(
  cacheResponseInterceptorFactory(getCacheIdentifier, globalCacheOptions),
);

ajax.get('/my-url').then(response => {
  return response.data;
});
```

### Ajax cache example

```js
import {
  ajax,
  cacheRequestInterceptorFactory,
  cacheResponseInterceptorFactory,
} from '@lion-web/ajax.js';

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

Due to a [bug in axios](https://github.com/axios/axios/issues/385) options may leak in to other instances.
So please avoid setting global options in axios. Interceptors have no issues.

## Future plans

- Eventually we want to remove axios and replace it with [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- This wrapper exist to prevent this switch from causing breaking changes for our users
