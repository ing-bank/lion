# Systems >> Localize >> Overview ||10

Is meant to translate text into multiple languages.
In it's simplest form it is a function that returns the translated text for a namespace + key.

## Features

- Uses es modules
- Formatting of numbers, amounts
- Formatting of dates

Further examples and a more in depth description can be found at the [Use Cases Page](./use-cases.md).

## Content

| Feature                                  | Description                                   |
| ---------------------------------------- | --------------------------------------------- |
| [Translate Text](../localize/text.md)    | Load and translate text in multiple languages |
| [Format Numbers](../localize/numbers.md) | Format numbers in multiple languages          |
| [Format Dates](../localize/dates.md)     | Format dates in multiple languages            |

## Installation

```bash
npm i --save @lion/localize
```

```js
import { localize } from '@lion/localize';
```

### Example

The locale which will be loaded by default is accessed via the `localize.locale`.

The single source of truth for page's locale is `<html lang="my-LOCALE">`.
At the same time the interaction should happen via `localize.locale` getter/setter to be able to notify and react to the change.

```js
import { localize } from '@lion/localize.js';

localize.addEventListener('localeChanged', () => {
  // do smth when data is loaded for a new locale
});

// changes locale, syncs to `<html lang="es-ES">` and fires the event above
localize.locale = 'es-ES';
```
