---
title: 'Extensions'
parts:
  - Select Rich
  - Extensions
eleventyNavigation:
  key: 'Select Rich: Extensions'
  order: 40
  parent: Select Rich
  title: Extensions
---

# Extensions

`LionSelectRich` renders the invoker and the option list as a consumer uses it (see `overview.md`).
**This page is about subclassing** — a class that extends `LionSelectRich` to change how the invoker
or the options look, e.g. to build a region picker with flags.

## Select Rich International

A visually advanced Subclasser implementation of `LionSelectRich`.

Inspired by:

- [intl-tel-input](https://intl-tel-input.com/)

```js script
import { html } from '@mdjs/mdjs-preview';
import { repeat } from 'lit/directives/repeat.js';
import './src/intl-select-rich.js';
import { regionMetaList } from './src/regionMetaList.js';
```

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
