# Pagination

`lion-pagination` component that handles pagination.

```js script
import { html } from 'lit-html';

import './lion-pagination.js';

export default {
  title: 'Navigation/Pagination',
};
```

```js preview-story
export const main = () => html` <lion-pagination count="20" current="10"></lion-pagination> `;
```

## Features

- You can pass the total number of pages in the `count` parameter, and the current page in the `current` parameter. If `current` is not defined it will default to the value 1.
- On a click or parameter change of `current` it will fire an event back called `current-changed`.

## How to use

### Installation

```bash
npm i --save @lion/pagination
```

```js
import { LionPagination } from '@lion/pagination';
// or
import '@lion/pagination/lion-pagination.js';
```

### Usage

```html
<lion-pagination count="20" current="10"></lion-pagination>
```

### Examples

### Without current defined

```js preview-story
export const withoutCurrentPage = () => {
  return html` <lion-pagination count="20"></lion-pagination> `;
};
```

### Ensure a count value

Be sure to set a count value or you will get an "empty" pagination.

```js preview-story
export const ensureCount = () => {
  return html` <lion-pagination></lion-pagination> `;
};
```

#### Methods

There are the following methods available to control the pagination.

- `next()`: move forward in pagination
- `previous()`: goes back to pagination
- `first()`: to the first page
- `last()`: to the last page
- `goto(pageNumber)`: to the specific page

```js preview-story
export const methods = () => {
  setTimeout(() => {
    document.getElementById('pagination-method-demo').innerText = document.getElementById(
      'pagination-method',
    ).current;
  });

  return html`
    <p>The current page is: <span id="pagination-method-demo"></span></p>
    <lion-pagination
      id="pagination-method"
      count="100"
      current="75"
      @current-changed=${e => {
        const paginationState = document.getElementById('pagination-method-demo');
        paginationState.innerText = e.target.current;
      }}
    ></lion-pagination>
    <section style="margin-top:16px">
      <button @click=${() => document.getElementById('pagination-method').previous()}>
        Previous
      </button>
      <button @click=${() => document.getElementById('pagination-method').next()}>
        Next
      </button>
      <br />
      <br />
      <button @click=${() => document.getElementById('pagination-method').first()}>
        First
      </button>
      <button @click=${() => document.getElementById('pagination-method').last()}>
        Last
      </button>
      <br />
      <br />
      <button @click=${() => document.getElementById('pagination-method').goto(55)}>
        Go to 55
      </button>
    </section>
  `;
};
```

#### Event

`lion-pagination` fires an event on button click to notify the component's current state. It is useful for analytics purposes or to perform some actions on page change.

- `@current-changed`: triggers when the current page is changed

```js preview-story
export const event = () => {
  setTimeout(() => {
    document.getElementById('pagination-event-demo-text').innerText = document.getElementById(
      'pagination-event-demo',
    ).current;
  });

  return html`
    <p>The current page is: <span id="pagination-event-demo-text"></span></p>
    <lion-pagination
      id="pagination-event-demo"
      count="10"
      current="5"
      @current-changed=${e => {
        const paginationState = document.getElementById('pagination-event-demo-text');
        paginationState.innerText = e.target.current;
      }}
    ></lion-pagination>
  `;
};
```
