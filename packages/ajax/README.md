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

### Example requests

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

## Fetch Polyfill

For IE11 you will need a polyfill for fetch. You should add this on your top level layer, e.g. your application.

[This is the polyfill we recommend](https://github.com/github/fetch). It also has a [section for polyfilling AbortController](https://github.com/github/fetch#aborting-requests)
