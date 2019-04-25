# Number

The number formatter returns a number based on the locale by using [Intl NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) specification.

## Features
- **formatNumber**: returns a formatted number based on locale
- **formatNumberToParts**: returns a formatted number in parts based on locale
- **getFractionDigits**: returns the fraction digit for a certain currency
- **getGroupSeparator**: returns the group separator based on locale
- **getDecimalSeparator**: returns the decimal separator based on locale

## How to use

### Installation
```
npm i --save @lion/localize;
```

### Example

```js
import { formatNumber } from '@lion/localize';

function numberExampleFunction () {
  const number = 2000;
  const options = {  style: 'currency', currency: 'EUR', currencyDisplay: 'code' };
  return formatNumber(number, options) // 'EUR 2,000.00' for British locale
}
```
