# Input Datepicker

`lion-input-datepicker` component is based on the date text input field. Its purpose is to provide a way for users to fill in a date with a datepicker.
For an input field with a big range, such as `birthday-input`, a datepicker is not the ultimate tool, so use the standard [lion-input-date](../input-date).

## Features

- input field with a datepicker to help to choose a date
- based on [lion-input-date](../input-date)
- makes use of [lion-calendar](../calendar) inside the datepicker
- makes use of [formatDate](../localize/docs/date.md) for formatting and parsing.
- option to overwrite locale to change the formatting and parsing
- can make use of date specific [validators](../validate/docs/DefaultVaValidationSystemlidators.md) with corresponding error messages in different languages
  - IsDate (default)
  - MinDate
  - MaxDate
  - MinMaxDate
  - IsDateDisabled

## How to use

### Installation

```sh
npm i --save @lion/input-datepicker
```

```js
import '@lion/input-datepicker/lion-input-datepicker.js';

// validator import example
import { Required, MinDate } from '@lion/validate';
```

### Example

```html
<lion-input-datepicker
  name="date"
  .validators="${[new Required(), new MinDate(new Date('2018/05/24'))]}"
></lion-input-datepicker>
```
