# Date

The date formatter returns a date based on the locale by using [Intl DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) specification.

## Features

- **formatDate**: returns a formatted date based on locale
- **parseDate**: returns a date Object
- **getDateFormatBasedOnLocale**: returns the date format based on locale

## How to use

### Installation

```bash
npm i --save @lion/localize
```

### Example

```js
import { parseDate, formatDate } from '@lion/localize';

function dateExampleFunction() {
  const parsedDate = parseDate('21-05-2012');
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  };

  return formatDate(parsedDate, options); // 'Monday, 21 May 2012' for British locale
}
```
