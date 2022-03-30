# Tools >> Ajax >> Overview ||10

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
