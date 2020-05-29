# Validation Messages

A set of localized messages for default Validators. One method `loadDefaultFeedbackMessages` is
called, it will make sure that all validators provided in `@lion/form-core` will have a default
error message.
It uses the `@lion/localize` system to provide these translations and has support for more than
15 locales.

```js script
import { html } from 'lit-html';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { Required } from '@lion/form-core';
import '@lion/form-core/lion-field.js';

loadDefaultFeedbackMessages();

export default {
  title: 'Forms/ValidateMessages',
};
```

```js preview-story
export const main = () =>
  html`
    <lion-field name="value" label="label" fieldName="value" .validators="${[new Required()]}"
      ><input slot="input"
    /></lion-field>
  `;
```

## Features

- Sets default error messages for validators supported by `@lion/form-core`

## How to use

### Installation

```bash
npm i --save @lion/validate-messages
```

```js
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
```
