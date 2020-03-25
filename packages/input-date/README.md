# Input Date

`lion-input-date` component is based on the generic text input field. Its purpose is to provide a way for users to fill in a date.

```js script
import { html } from 'lit-html';
import { loadDefaultFeedbackMessages, MinDate, MinMaxDate, MaxDate } from '@lion/validate';
import { formatDate } from '@lion/localize';

import './lion-input-date.js';

export default {
  title: 'Forms/Input Date',
};
loadDefaultFeedbackMessages();
```

```js preview-story
export const main = () => html` <lion-input-date label="Date"></lion-input-date> `;
```

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/forms-input-date--default-story) for a live demo and API documentation

## Features

- Based on [lion-input](?path=/docs/forms-input--default-story)
- Makes use of [formatDate](?path=/docs/localize-dates--formatting)) for formatting and parsing.
- Option to override locale to change the formatting and parsing
- Default label in different languages
- Can make use of date specific [validators](?path=/docs/forms-validation-overview--page) with corresponding error messages in different languages
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
import { LionInputDate } from '@lion/input-date';
// or
import '@lion/input-date/lion-input-date.js';
```

## Examples

### Is a date

```js preview-story
export const isADate = () => html`
  <lion-input-date label="IsDate" .modelValue=${new Date('foo')}> </lion-input-date>
`;
```

### With minimum date

```js preview-story
export const withMinimumDate = () => html`
  <lion-input-date
    label="MinDate"
    help-text="Enter a date greater than or equal to today."
    .modelValue=${new Date('2018/05/30')}
    .validators=${[new MinDate(new Date())]}
  >
  </lion-input-date>
`;
```

### With maximum date

```js preview-story
export const withMaximumDate = () => html`
  <lion-input-date
    label="MaxDate"
    help-text="Enter a date smaller than or equal to today."
    .modelValue=${new Date('2100/05/30')}
    .validators=${[new MaxDate(new Date())]}
  ></lion-input-date>
`;
```

### With minimum and maximum date

```js preview-story
export const withMinimumAndMaximumDate = () => html`
  <lion-input-date
    label="MinMaxDate"
    .modelValue=${new Date('2018/05/30')}
    .validators=${[new MinMaxDate({ min: new Date('2018/05/24'), max: new Date('2018/06/24') })]}
  >
    <div slot="help-text">
      Enter a date between ${formatDate(new Date('2018/05/24'))} and ${formatDate(
        new Date('2018/06/24'),
      )}.
    </div>
  </lion-input-date>
`;
```

### Faulty prefilled

```js preview-story
export const faultyPrefilled = () => html`
  <lion-input-date
    label="Date"
    help-text="Faulty prefilled input will be cleared"
    .modelValue=${'foo'}
  ></lion-input-date>
`;
```
