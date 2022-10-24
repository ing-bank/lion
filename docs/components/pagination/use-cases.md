# Pagination >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/components/define/lion-pagination.js';
```

## Without current defined

```js preview-story
export const withoutCurrentPage = () => {
  return html` <lion-pagination count="20"></lion-pagination> `;
};
```

## Ensure a count value

Be sure to set a count value or you will get an "empty" pagination.

```js preview-story
export const ensureCount = () => {
  return html` <lion-pagination></lion-pagination> `;
};
```

### Methods

There are the following methods available to control the pagination.

- `next()`: move forward in pagination
- `previous()`: goes back to pagination
- `first()`: to the first page
- `last()`: to the last page
- `goto(pageNumber)`: to the specific page

```js preview-story
export const methods = ({ shadowRoot }) => {
  setTimeout(() => {
    shadowRoot.getElementById('pagination-method-demo').innerText =
      shadowRoot.getElementById('pagination-method').current;
  });

  return html`
    <p>The current page is: <span id="pagination-method-demo"></span></p>
    <lion-pagination
      id="pagination-method"
      count="100"
      current="75"
      @current-changed=${e => {
        const paginationState = shadowRoot.getElementById('pagination-method-demo');
        paginationState.innerText = e.target.current;
      }}
    ></lion-pagination>
    <section style="margin-top:16px">
      <button @click=${() => shadowRoot.getElementById('pagination-method').previous()}>
        Previous
      </button>
      <button @click=${() => shadowRoot.getElementById('pagination-method').next()}>Next</button>
      <br />
      <br />
      <button @click=${() => shadowRoot.getElementById('pagination-method').first()}>First</button>
      <button @click=${() => shadowRoot.getElementById('pagination-method').last()}>Last</button>
      <br />
      <br />
      <button @click=${() => shadowRoot.getElementById('pagination-method').goto(55)}>
        Go to 55
      </button>
    </section>
  `;
};
```

### Event

`lion-pagination` fires an event on button click to notify the component's current state. It is useful for analytics purposes or to perform some actions on page change.

- `@current-changed`: triggers when the current page is changed

```js preview-story
export const event = ({ shadowRoot }) => {
  setTimeout(() => {
    shadowRoot.getElementById('pagination-event-demo-text').innerText =
      shadowRoot.getElementById('pagination-event-demo').current;
  });

  return html`
    <p>The current page is: <span id="pagination-event-demo-text"></span></p>
    <lion-pagination
      id="pagination-event-demo"
      count="10"
      current="5"
      @current-changed=${e => {
        const paginationState = shadowRoot.getElementById('pagination-event-demo-text');
        paginationState.innerText = e.target.current;
      }}
    ></lion-pagination>
  `;
};
```
