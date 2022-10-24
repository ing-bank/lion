# Input Date >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import { MinDate, MinMaxDate, MaxDate } from '@lion/components/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/components/validate-messages.js';
import { formatDate } from '@lion/components/localize.js';
import '@lion/components/define/lion-input-date.js';
```

## Is a date

```js preview-story
export const isADate = () => html`
  <lion-input-date label="IsDate" .modelValue=${new Date('foo')}> </lion-input-date>
`;
```

## With minimum date

```js preview-story
export const withMinimumDate = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-date
      label="MinDate"
      help-text="Enter a date greater than or equal to today."
      .modelValue=${new Date('2018/05/30')}
      .validators=${[new MinDate(new Date())]}
    >
    </lion-input-date>
  `;
};
```

## With maximum date

```js preview-story
export const withMaximumDate = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-date
      label="MaxDate"
      help-text="Enter a date smaller than or equal to today."
      .modelValue=${new Date('2100/05/30')}
      .validators=${[new MaxDate(new Date())]}
    ></lion-input-date>
  `;
};
```

## With minimum and maximum date

```js preview-story
export const withMinimumAndMaximumDate = () => {
  loadDefaultFeedbackMessages();
  return html`
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
};
```

## Faulty prefilled

```js preview-story
export const faultyPrefilled = () => html`
  <lion-input-date
    label="Date"
    help-text="Faulty prefilled input will be cleared"
    .modelValue=${'foo'}
  ></lion-input-date>
`;
```
