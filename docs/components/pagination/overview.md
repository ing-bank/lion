# Pagination >> Overview ||10

A web component that handles pagination.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-pagination.js';
```

```js preview-story
export const main = () => html` <lion-pagination count="20" current="10"></lion-pagination> `;
```

## Features

- You can pass the total number of pages in the `count` parameter, and the current page in the `current` parameter. If `current` is not defined it will default to the value 1.
- On a click or parameter change of `current` it will fire an event back called `current-changed`.

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionPagination } from '@lion/ui/pagination.js';
// or
import '@lion/ui/define/lion-pagination.js';
```
