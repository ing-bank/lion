# Ajax

[//]: # (AUTO INSERT HEADER PREPUBLISH)

`ajax` is the global manager for handling all ajax requests.
It is a promise based system for fetching data, based on [axios](https://github.com/axios/axios)

## Features
- only JS functions, no (unnecessarily expensive) web components
- supports GET, POST, PUT, DELETE, REQUEST, PATCH and HEAD methods
- can be used with or without XSRF token


## How to use

### Installation
```sh
npm i --save @lion/ajax
```

### Example
```js
import { ajax } from '@lion/ajax';

ajax.get('data.json')
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
```

### Create own instances for custom options

#### Cancel
```js
import { AjaxClass } from '@lion/ajax';

const myAjax = AjaxClass.getNewInstance({ cancelable: true });
myAjax.get('data.json')
  .then((response) => {
    document.querySelector('#canceled').innerHTML = JSON.stringify(response.data);
  })
  .catch((error) => {
    document.querySelector('#canceled').innerHTML = `I got cancelled: ${error.message}`;
  });
setTimeout(() => {
  myAjax.cancel('too slow');
}, 1);
```

#### Cancel previous on new request
```js
import { AjaxClass } from '@lion/ajax'

const myAjax = AjaxClass.getNewInstance({ cancelPreviousOnNewRequest: true });
myAjax.get('data.json')
  .then((response) => {
    document.querySelector('#request1').innerHTML = 'Request 1: ' + JSON.stringify(response.data);
  })
  .catch((error) => {
    document.querySelector('#request1').innerHTML = `Request 1: I got cancelled: ${error.message}`;
  });
myAjax.get('data2.json')
  .then((response) => {
    document.querySelector('#request2').innerHTML = 'Request 2: ' + JSON.stringify(response.data);
  })
  .catch((error) => {
    document.querySelector('#request2').innerHTML = `Request 2: I got cancelled: ${error.message}`;
  });
```

## Considerations

> Due to a [bug in axios](https://github.com/axios/axios/issues/385) options may leak in to other instances. So please avoid setting global options in axios. Interceptors have no issues.

## Future plans

- Endplan is to remove axios and replace it with fetch
- This wrapper exist so that this switch should not mean any breaking changes for our users
