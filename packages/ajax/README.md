# Ajax

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`ajax` is the global manager for handling all ajax requests.
It is a promise based system for fetching data, based on [axios](https://github.com/axios/axios)

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/fetch-system-ajax) for a live demo and documentation

## How to use

### Installation

```sh
npm i --save @lion/ajax
```

### Example

```js
import { ajax } from '@lion/ajax';

ajax.get('data.json').then(response => console.log(response));
```
