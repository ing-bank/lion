[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Input Datepicker

`lion-input-datepicker` component is based on the date text input field. Its purpose is to provide a way for users to fill in a date with a datepicker.
For an input field with a big range, such as `birthday-input`, a datepicker is not the best choice due to the high variance between possible inputs.
We encourage using the standard [lion-input-date](?path=/docs/form-component-input-date) for this.

```js script
import { html } from 'lit-html';
import { MinMaxDate, IsDateDisabled } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { formatDate } from '@lion/localize';

import './lion-input-datepicker.js';

export default {
  title: 'Forms/Input Datepicker',
};
loadDefaultFeedbackMessages();
```

```js preview-story
export const main = () => {
  return html` <lion-input-datepicker label="Date" name="date"></lion-input-datepicker> `;
};
```

## Features

- Input field with a datepicker to help to choose a date
- Based on [lion-input-date](?path=/docs/forms-input-date--main#input)
- Makes use of [lion-calendar](?path=/docs/others-calendar--main#calendar) inside the datepicker
- Makes use of [formatDate](?path=/docs/localize-dates--formatting#date-localization) for formatting and parsing.
- Option to overwrite locale to change the formatting and parsing
- Can make use of date specific [validators](?path=/docs/forms-validation-overview--main#validate) with corresponding error messages in different languages
  - IsDate (default)
  - MinDate
  - MaxDate
  - MinMaxDate
  - IsDateDisabled

## How to use

### Installation

```bash
npm i --save @lion/input-datepicker
```

```js
import { LionInputDatepicker } from '@lion/input-datepicker';
// or
import '@lion/input-datepicker/lion-input-datepicker.js';
```

## Examples

### Minimum and maximum date

Below are examples of different validators for dates.

```js preview-story
export const minimumAndMaximumDate = () => html`
  <lion-input-datepicker
    label="MinMaxDate"
    .modelValue=${new Date('2018/05/30')}
    .validators=${[new MinMaxDate({ min: new Date('2018/05/24'), max: new Date('2018/06/24') })]}
  >
    <div slot="help-text">
      Enter a date between ${formatDate(new Date('2018/05/24'))} and ${formatDate(
        new Date('2018/06/24'),
      )}.
    </div>
  </lion-input-datepicker>
`;
```

### Disable specific dates

```js preview-story
export const disableSpecificDates = () => html`
  <lion-input-datepicker
    label="IsDateDisabled"
    help-text="You're not allowed to choose any 15th."
    .validators=${[new IsDateDisabled(d => d.getDate() === 15)]}
  ></lion-input-datepicker>
`;
```

### Calendar heading

You can modify the heading of the calendar with the `.calendarHeading` property or `calendar-heading` attribute for simple values.

By default, it will take the label value.

```js preview-story
export const calendarHeading = () => html`
  <lion-input-datepicker
    label="Date"
    .calendarHeading="${'Custom heading'}"
    .modelValue=${new Date()}
  ></lion-input-datepicker>
`;
```

### Disabled

You can disable datepicker inputs.

```js preview-story
export const disabled = () => html`
  <lion-input-datepicker label="Disabled" disabled></lion-input-datepicker>
`;
```

### Read only

You can set datepicker inputs to `readonly`, which will prevent the user from opening the calendar popup.

```js preview-story
export const readOnly = () => html`
  <lion-input-datepicker label="Readonly" readonly .modelValue="${new Date()}">
  </lion-input-datepicker>
`;
```
