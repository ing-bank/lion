# Rating >> Use Cases ||100

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/rating/define';
```

## props

### with No totalItemsToShow prop

it will show 5 stars by default if you don't pass totalItemsToShow to the component.

```js preview-story
export const withoutCurrentPage = () => {
  return html` <lion-pagination></lion-pagination> `;
};
```

### with totalItemsToShow prop

if you pass totalItemsToShow, it will render based on this number.

```js preview-story
export const withoutCurrentPage = () => {
  return html` <lion-pagination totalItemsToShow="5"></lion-pagination> `;
};
```

### with currentRate prop

if you don't pass currentRate, it will render empty stars(none will be selected) but if you pass currentRate, it will highlight stars based on this number

```js preview-story
export const withoutCurrentPage = () => {
  return html` <lion-pagination totalItemsToShow="5" currentRate="4"></lion-pagination> `;
};
```

## Event

`lion-rating` fires an event when user changes the rate and notify the component's current state. It is useful for to perform some actions on page change.

- `@on-rate-change`: triggers when the current page is changed

```js preview-story
export const event = ({ shadowRoot }) => {
  setTimeout(() => {
    document.getElementById('rating-event-demo-text').innerText =
      document.getElementById('rating-event-demo').currentRate;
  });

  return html`
    <p>The current page is: <span id="rating-event-demo-text"></span></p>
    <lion-rating
      id="rating-event-demo"
      @on-rate-change=${e => {
        const ratingState = document.getElementById('rating-event-demo-text');
        ratingState.innerText = e.target.currentRate;
      }}
    ></lion-rating>
  `;
};
```
