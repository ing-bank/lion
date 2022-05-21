# Rating >> Overview ||100

A web component that handles rating.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/rating/define';
```

```js preview-story
export const main = () =>
  html`<lion-rating
    totalItemsToShow="6"
    currentRate="6"
    @onRateChange="function() { conole.log('')}"
  ></lion-rating>`;
```

## Features

## Installation

```bash
npm i --save @lion/rating
```

```js
import { LionPagination } from '@lion/rating';
// or
import '@lion/rating/define';
```
