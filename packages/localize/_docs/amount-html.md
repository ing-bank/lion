# Amount

The amount formatter returns a number based on the locale by using [Intl NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) specification.

## Features

- **formatAmountHtml**: returns a formatted amount based on locale to be used in lit-html
- **formatAmountHtmlString**: returns a formatted amount based on locale as a string

## How to use

### Installation

```sh
npm i --save @lion/localize
```

### Example

```js
import { formatAmountHtml } from '@lion/localize';

// inside your webcomponent
render () {
  return html`
    The current cart values is ${formatAmountHtml(1999.9)}.
  `;
}

// output (depending on locale)
// The current cart values is EUR 1.999,<span style="">90</span>.
```
