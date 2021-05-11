# Tools >> Ajax >> Features ||20

```js script
import { html } from '@lion/core';
import { renderLitAsNode } from '@lion/helpers';
import { Ajax, createCacheRequestInterceptor, createCacheResponseInterceptor } from '@lion/ajax';
import '@lion/helpers/define';

const getCacheIdentifier = () => {
  let userId = localStorage.getItem('lion-ajax-cache-demo-user-id');
  if (!userId) {
    localStorage.setItem('lion-ajax-cache-demo-user-id', '1');
    userId = '1';
  }
  return userId;
};

const cacheOptions = {
  useCache: true,
  timeToLive: 1000 * 60 * 10, // 10 minutes
};

const ajax = new Ajax();

ajax.addRequestInterceptor(createCacheRequestInterceptor(getCacheIdentifier, cacheOptions));
ajax.addResponseInterceptor(createCacheResponseInterceptor(getCacheIdentifier, cacheOptions));
```

## GET request

```js preview-story
export const getRequest = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);
  const ajax = new Ajax();

  const fetchHandler = name => {
    ajax
      .fetch(`../assets/${name}.json`)
      .then(response => response.json())
      .then(result => {
        actionLogger.log(JSON.stringify(result, null, 2));
      });
  };
  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click=${() => fetchHandler('pabu')}>Fetch Pabu</button>
    <button @click=${() => fetchHandler('naga')}>Fetch Naga</button>
    ${actionLogger}
  `;
};
```

## POST request

```js
import { Ajax } from '@lion/ajax';

const ajax = new Ajax();
const response = await ajax.fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ username: 'steve' }),
});
const newUser = await response.json();
```

### JSON requests

We usually deal with JSON requests and responses. With `fetchJson` you don't need to specifically stringify the request body or parse the response body.

The result will have the Response object on `.response` property, and the decoded json will be available on `.body`.

## GET JSON request

```js preview-story
export const getJsonRequest = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);
  const ajax = new Ajax();

  const fetchHandler = name => {
    ajax.fetchJson(`../assets/${name}.json`).then(result => {
      console.log(result.response);
      actionLogger.log(JSON.stringify(result.body, null, 2));
    });
  };
  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click=${() => fetchHandler('pabu')}>Fetch Pabu</button>
    <button @click=${() => fetchHandler('naga')}>Fetch Naga</button>
    ${actionLogger}
  `;
};
```

## POST JSON request

```js
import { Ajax } from '@lion/ajax';
const ajax = new Ajax();

const { response, body } = await ajax.fetchJson('/api/users', {
  method: 'POST',
  body: { username: 'steve' },
});
```

### Error handling

Different from fetch, `Ajax` throws when the server returns a 4xx or 5xx, returning the request and response:

```js preview-story
export const errorHandling = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);
  const ajax = new Ajax();

  const fetchHandler = async () => {
    try {
      const users = await ajax.fetchJson('/api/users');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          // handle a specific status code, for example 400 bad request
        } else {
          actionLogger.log(error);
        }
      } else {
        // an error happened before receiving a response,
        // ex. an incorrect request or network error
        actionLogger.log(error);
      }
    }
  };
  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click=${fetchHandler}>Fetch</button>
    ${actionLogger}
  `;
};
```

## Fetch Polyfill

For IE11 you will need a polyfill for fetch. You should add this on your top level layer, e.g. your application.

[This is the polyfill we recommend](https://github.com/github/fetch). It also has a [section for polyfilling AbortController](https://github.com/github/fetch#aborting-requests)

## Ajax Cache

A caching library that uses `@lion/ajax` and adds cache interceptors to provide caching for use in
frontend `services`.

The **request interceptor**'s main goal is to determine whether or not to
**return the cached object**. This is done based on the options that are being
passed.

The **response interceptor**'s goal is to determine **when to cache** the
requested response, based on the options that are being passed.

### Getting started

Create an `ajax` instance and add interceptors to it, using a cache configuration
which is applied on application level. If a developer wants to add specifics to cache behavior
they have to provide a cache config per action (`get`, `post`, etc.) via `cacheOptions` field of local ajax config,
see examples below.

> **Note**: make sure to add the **interceptors** only **once**. This is usually
> done on app-level

```js
import {
  Ajax,
  createCacheRequestInterceptor,
  createCacheResponseInterceptor,
} from '@lion-web/ajax';

const globalCacheOptions = {
  useCache: true,
  timeToLive: 1000 * 60 * 5, // 5 minutes
};
// Cache is removed each time an identifier changes,
// for instance when a current user is logged out
const getCacheIdentifier = () => getActiveProfile().profileId;
const ajax = new Ajax();

ajax.addRequestInterceptor(createCacheRequestInterceptor(getCacheIdentifier, globalCacheOptions));
ajax.addResponseInterceptor(createCacheResponseInterceptor(getCacheIdentifier, globalCacheOptions));

const { response, body } = await ajax.fetchJson('/my-url');
```

Alternatively, most often for subclassers, you can extend or import `Ajax` yourself, and pass cacheOptions when instantiating the ajax.

```js
import { Ajax } from '@lion/ajax';

export const ajax = new Ajax({
  cacheOptions: {
    useCache: true,
    timeToLive: 1000 * 60 * 5, // 5 minutes
    getCacheIdentifier: () => getActiveProfile().profileId,
  },
});
```

### Ajax cache example

> Let's assume that we have a user session, for this demo purposes we already created an identifier function for this and set the cache interceptors.

We can see if a response is served from the cache by checking the `response.fromCache` property,
which is either undefined for normal requests, or set to true for responses that were served from cache.

```js preview-story
export const cache = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);
  const ajax = new Ajax();

  const fetchHandler = name => {
    ajax.fetchJson(`../assets/${name}.json`).then(result => {
      actionLogger.log(`From cache: ${result.response.fromCache || false}`);
      actionLogger.log(JSON.stringify(result.body, null, 2));
    });
  };
  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click=${() => fetchHandler('pabu')}>Fetch Pabu</button>
    <button @click=${() => fetchHandler('naga')}>Fetch Naga</button>
    ${actionLogger}
  `;
};
```

You can also change the cache options per request, which is handy if you don't want to remove and re-add the interceptors for a simple configuration change.

In this demo, when we fetch naga, we always pass `useCache: false` so the Response is never a cached one.

```js preview-story
export const cacheActionOptions = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);
  const ajax = new Ajax();

  const fetchHandler = name => {
    let actionCacheOptions;
    if (name === 'naga') {
      actionCacheOptions = {
        useCache: false,
      };
    }

    ajax.fetchJson(`../assets/${name}.json`, { cacheOptions: actionCacheOptions }).then(result => {
      actionLogger.log(`From cache: ${result.response.fromCache || false}`);
      actionLogger.log(JSON.stringify(result.body, null, 2));
    });
  };
  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click=${() => fetchHandler('pabu')}>Fetch Pabu</button>
    <button @click=${() => fetchHandler('naga')}>Fetch Naga</button>
    ${actionLogger}
  `;
};
```

### Invalidating cache

Invalidating the cache, or cache busting, can be done in multiple ways:

- Going past the `timeToLive` of the cache object
- Changing cache identifier (e.g. user session or active profile changes)
- Doing a non GET request to the cached endpoint
  - Invalidates the cache of that endpoint
  - Invalidates the cache of all other endpoints matching `invalidatesUrls` and `invalidateUrlsRegex`

## Time to live

In this demo we pass a timeToLive of three seconds.
Try clicking the fetch button and watch fromCache change whenever TTL expires.

After TTL expires, the next request will set the cache again, and for the next 3 seconds you will get cached responses for subsequent requests.

```js preview-story
export const cacheTimeToLive = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);
  const ajax = new Ajax();

  const fetchHandler = () => {
    ajax
      .fetchJson(`../assets/pabu.json`, {
        cacheOptions: {
          timeToLive: 1000 * 3, // 3 seconds
        },
      })
      .then(result => {
        actionLogger.log(`From cache: ${result.response.fromCache || false}`);
        actionLogger.log(JSON.stringify(result.body, null, 2));
      });
  };
  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click=${fetchHandler}>Fetch Pabu</button>
    ${actionLogger}
  `;
};
```

## Changing cache identifier

For this demo we use localStorage to set a user id to `'1'`.

Now we will allow you to change this identifier to invalidate the cache.

```js preview-story
export const changeCacheIdentifier = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);
  const ajax = new Ajax();

  const fetchHandler = () => {
    ajax.fetchJson(`../assets/pabu.json`).then(result => {
      actionLogger.log(`From cache: ${result.response.fromCache || false}`);
      actionLogger.log(JSON.stringify(result.body, null, 2));
    });
  };

  const changeUserHandler = () => {
    const currentUser = parseInt(localStorage.getItem('lion-ajax-cache-demo-user-id'), 10);
    localStorage.setItem('lion-ajax-cache-demo-user-id', `${currentUser + 1}`);
  };

  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click=${fetchHandler}>Fetch Pabu</button>
    <button @click=${changeUserHandler}>Change user</button>
    ${actionLogger}
  `;
};
```

## Non-GET request

In this demo we show that by doing a PATCH request, you invalidate the cache of the endpoint for subsequent GET requests.

Try clicking the GET pabu button twice so you see a cached response.
Then click the PATCH pabu button, followed by another GET, and you will see that this one is not served from cache, because the PATCH invalidated it.

The rationale is that if a user does a non-GET request to an endpoint, it will make the client-side caching of this endpoint outdated.
This is because non-GET requests usually in some way mutate the state of the database through interacting with this endpoint.
Therefore, we invalidate the cache, so the user gets the latest state from the database on the next GET request.

> Ignore the browser errors when clicking PATCH buttons, JSON files (our mock database) don't accept PATCH requests.

```js preview-story
export const nonGETRequest = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);
  const ajax = new Ajax();

  const fetchHandler = (name, method) => {
    ajax.fetchJson(`../assets/${name}.json`, { method }).then(result => {
      actionLogger.log(`From cache: ${result.response.fromCache || false}`);
      actionLogger.log(JSON.stringify(result.body, null, 2));
    });
  };
  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click=${() => fetchHandler('pabu', 'GET')}>GET Pabu</button>
    <button @click=${() => fetchHandler('pabu', 'PATCH')}>PATCH Pabu</button>
    <button @click=${() => fetchHandler('naga', 'GET')}>GET Naga</button>
    <button @click=${() => fetchHandler('naga', 'PATCH')}>PATCH Naga</button>
    ${actionLogger}
  `;
};
```

## Invalidate Rules

There are two kinds of invalidate rules:

- `invalidateUrls` (array of URL like strings)
- `invalidateUrlsRegex` (RegExp)

If a non-GET method is fired, by default it only invalidates its own endpoint.
Invalidating `/api/users` cache by doing a PATCH, will not invalidate `/api/accounts` cache.

However, in the case of users and accounts, they may be very interconnected, so perhaps you do want to invalidate `/api/accounts` when invalidating `/api/users`.

This is what the invalidate rules are for.

In this demo, invalidating the `pabu` endpoint will invalidate `naga`, but not the other way around.

> For invalidateUrls you need the full URL e.g. `<protocol>://<domain>:<port>/<url>` so it's often easier to use invalidateUrlsRegex

```js preview-story
export const invalidateRules = () => {
  const actionLogger = renderLitAsNode(html`<sb-action-logger></sb-action-logger>`);
  const ajax = new Ajax();

  const fetchHandler = (name, method) => {
    const actionCacheOptions = {};
    if (name === 'pabu') {
      actionCacheOptions.invalidateUrlsRegex = /\/packages\/ajax\/docs\/naga.json/;
    }

    ajax
      .fetchJson(`../assets/${name}.json`, {
        method,
        cacheOptions: actionCacheOptions,
      })
      .then(result => {
        actionLogger.log(`From cache: ${result.response.fromCache || false}`);
        actionLogger.log(JSON.stringify(result.body, null, 2));
      });
  };
  return html`
    <style>
      sb-action-logger {
        --sb-action-logger-max-height: 300px;
      }
    </style>
    <button @click=${() => fetchHandler('pabu', 'GET')}>GET Pabu</button>
    <button @click=${() => fetchHandler('pabu', 'PATCH')}>PATCH Pabu</button>
    <button @click=${() => fetchHandler('naga', 'GET')}>GET Naga</button>
    <button @click=${() => fetchHandler('naga', 'PATCH')}>PATCH Naga</button>
    ${actionLogger}
  `;
};
```
