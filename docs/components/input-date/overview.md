# Input Date >> Overview ||10

A web component based on the generic text input field. Its purpose is to provide a way for users to fill in a date.

```js script
import { html } from '@mdjs/mdjs-preview';
import { MinDate, MinMaxDate, MaxDate } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import { formatDate } from '@lion/ui/localize.js';
import '@lion/ui/define/lion-input-date.js';
```

```js preview-story
export const main = () => html` <lion-input-date label="Date"></lion-input-date> `;
```

## Features

- Based on our [input](../input/overview.md)
- Makes use of [formatDate](../../fundamentals/systems/localize/dates.md) for formatting and parsing.
- Option to override locale to change the formatting and parsing
- Default label in different languages
- Can make use of date specific [validators](../../fundamentals/systems/form/validate.md) with corresponding error messages in different languages
  - IsDate (default)
  - MinDate
  - MaxDate
  - MinMaxDate

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionInputDate } from '@lion/ui/input-date.js';
// or
import '@lion/ui/define/lion-input-date.js';
```
