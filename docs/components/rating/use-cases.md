# Rating >> Use Cases ||100

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/rating/define';
```

## Event

`lion-rating` fires an event on button click to notify the component's current state. It is useful for analytics purposes or to perform some actions on page change.

- `@current-changed`: triggers when the current page is changed

```js preview-story
export const event = ({ shadowRoot }) => {
  console.log(shadowRoot);
  console.log(
    'asd',
    document.getElementById('rating-event-demo-text'),
    'asdadsdasd',
    document.getElementById('rating-event-demo'),
  );
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
