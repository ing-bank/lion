# Tools >> Ajax >> Overview ||10

```js script
import { html } from '@lion/core';
import { renderLitAsNode } from '@lion/helpers';
import {
  ajax,
  Ajax,
  createCacheRequestInterceptor,
  createCacheResponseInterceptor,
} from '@lion/ajax';
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

ajax.addRequestInterceptor(createCacheRequestInterceptor(getCacheIdentifier, cacheOptions));
ajax.addResponseInterceptor(createCacheResponseInterceptor(getCacheIdentifier, cacheOptions));
```

`ajax` is a small wrapper around `fetch` which:

- Allows globally registering request and response interceptors
- Throws on 4xx and 5xx status codes
- Prevents network request if a request interceptor returns a response
- Supports a JSON request which automatically encodes/decodes body request and response payload as JSON
- Adds accept-language header to requests based on application language
- Adds XSRF header to request if the cookie is present

## Installation

```bash
npm i --save @lion/ajax
```

### Relation to fetch

`ajax` delegates all requests to fetch. `ajax.fetch` and `ajax.fetchJson` have the same function signature as `window.fetch`, you can use any online resource to learn more about fetch. [MDN](http://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) is a great start.
