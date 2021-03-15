# Inputs >> Input Date >> Overview ||10

`lion-input-date` component is based on the generic text input field. Its purpose is to provide a way for users to fill in a date.

```js script
import { html } from '@lion/core';
import { MinDate, MinMaxDate, MaxDate } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { formatDate } from '@lion/localize';
import '@lion/input-date/define';
```

```js preview-story
export const main = () => html` <lion-input-date label="Date"></lion-input-date> `;
```

## Features

- Based on [lion-input](../input/overview.md)
- Makes use of [formatDate](../../../docs/systems/localize/dates.md) for formatting and parsing.
- Option to override locale to change the formatting and parsing
- Default label in different languages
- Can make use of date specific [validators](../../../docs/systems/form/validate.md) with corresponding error messages in different languages
  - IsDate (default)
  - MinDate
  - MaxDate
  - MinMaxDate

## Installation

```bash
npm i --save @lion/input-date
```

```js
import { LionInputDate } from '@lion/input-date';
// or
import '@lion/input-date/define';
```
