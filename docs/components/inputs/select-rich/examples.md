# Inputs >> Select Rich >> Examples ||30

```js script
import { html } from '@mdjs/mdjs-preview';
import { repeat } from '@lion/core';
import '@lion/select-rich/define';
import './src/intl-select-rich.js';
import { regionMetaList } from './src/regionMetaList.js';
```

## Select Rich International

A visually advanced Subclasser implementation of `LionSelectRich`.

Inspired by:

- [intl-tel-input](https://intl-tel-input.com/)

```js story
export const IntlSelectRich = () => html`
  <intl-select-rich label="Choose a region" name="regions">
    ${repeat(
      regionMetaList,
      regionMeta => regionMeta.regionCode,
      regionMeta =>
        html` <intl-option .choiceValue="${regionMeta.regionCode}" .regionMeta="${regionMeta}">
        </intl-option>`,
    )}
  </intl-select-rich>
`;
```
