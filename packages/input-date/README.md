# Input Date

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-input-date` component is based on the generic text input field. Its purpose is to provide a way for users to fill in a date.

## Features

- based on [lion-input](../input)
- makes use of [formatDate](../localize/docs/date.md) for formatting and parsing.
- option to overwrite locale to change the formatting and parsing
- default label in different languages
- can make use of date specific [validators](../validate/docs/ValidationSystem.md) with corresponding error messages in different languages
  - IsDate (default)
  - MinDate
  - MaxDate
  - MinMaxDate

## How to use

### Installation

```sh
npm i --save @lion/input-date
```

```js
import '@lion/input-date/lion-input-date.js';

// validator import example
import { Required, MinDate } from '@lion/validate';
```

### Example

```html
<lion-input-date
  name="date"
  .validators="${[new Required(), new MinDate(new Date('2018/05/24'))]}"
></lion-input-date>
```
