---
title: 'Input Datepicker: Use Cases'
parts:
  - Input Datepicker
  - Use Cases
eleventyNavigation:
  key: 'Input Datepicker: Use Cases'
  order: 20
  parent: Input Datepicker
  title: Use Cases
---

# Input Datepicker: Use Cases

```js script
import { html } from '@mdjs/mdjs-preview';
import { MinMaxDate, IsDateDisabled } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import { formatDate } from '@lion/ui/localize.js';
import '@lion/ui/define/lion-input-datepicker.js';
loadDefaultFeedbackMessages();
```

## Minimum and maximum date

Below are examples of different validators for dates.

```js preview-story
export const minimumAndMaximumDate = () => html`
  <lion-input-datepicker
    label="MinMaxDate"
    .modelValue="${new Date('2018/05/30')}"
    .validators="${[new MinMaxDate({ min: new Date('2018/05/24'), max: new Date('2018/06/24') })]}"
  >
    <div slot="help-text">
      Enter a date between ${formatDate(new Date('2018/05/24'))} and
      ${formatDate(new Date('2018/06/24'))}.
    </div>
  </lion-input-datepicker>
`;
```

## Disable specific dates

```js preview-story
export const disableSpecificDates = () => html`
  <lion-input-datepicker
    label="IsDateDisabled"
    help-text="You're not allowed to choose any 15th."
    .modelValue="${new Date('2023/06/15')}"
    .validators="${[new IsDateDisabled(d => d.getDate() === 15)]}"
  ></lion-input-datepicker>
`;
```

## Calendar heading

You can modify the heading of the calendar with the `.calendarHeading` property or `calendar-heading` attribute for simple values.

By default, it will take the label value.

```js preview-story
export const calendarHeading = () => html`
  <lion-input-datepicker
    label="Date"
    .calendarHeading="${'Custom heading'}"
    .modelValue="${new Date()}"
  ></lion-input-datepicker>
`;
```

## Disabled

You can disable datepicker inputs.

```js preview-story
export const disabled = () => html`
  <lion-input-datepicker label="Disabled" disabled></lion-input-datepicker>
`;
```

## Read only

You can set datepicker inputs to `readonly`, which will prevent the user from opening the calendar popup.

```js preview-story
export const readOnly = () => html`
  <lion-input-datepicker label="Readonly" readonly .modelValue="${new Date()}">
  </lion-input-datepicker>
`;
```

## Faulty prefilled

Faulty prefilled input will be cleared

```js preview-story
export const faultyPrefilled = () => html`
  <lion-input-datepicker label="Faulty prefilled" .modelValue="${new Date('30/01/2022')}">
  </lion-input-datepicker>
`;
```

## Accessibility

For improved accessibility, it is highly advisable to provide a `name`, `label`, or `fieldName` attribute to your input so the aria-label is set correctly.

By default, the aria-label will be set to "Open {fieldName} picker". The `fieldName` (or `label`, then `name`) is used to create a descriptive label. The priority order is: `fieldName` > `label` > `name` > `"date"`.

### Default (no field identifier)

```js preview-story
export const ariaLabelDefault = () => html` <lion-input-datepicker> </lion-input-datepicker> `;
```

### Using name attribute

```js preview-story
export const ariaLabelName = () => html`
  <lion-input-datepicker name="StartDate"> </lion-input-datepicker>
`;
```

### Using label attribute

```js preview-story
export const ariaLabelLabel = () => html`
  <lion-input-datepicker name="StartDate" label="Field label"> </lion-input-datepicker>
`;
```

### Using fieldName property (highest priority)

```js preview-story
export const ariaLabelFieldName = () => html`
  <lion-input-datepicker name="StartDate" label="Field label" .fieldName="${'Field name'}">
  </lion-input-datepicker>
`;
```

> **Important:** When using multiple datepickers on the same page, ensure each has a unique `fieldName`, `label`, or `name` so the generated aria-labels are distinct and meaningful to users.
