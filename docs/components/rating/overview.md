# Rating >> Overview ||100

With Ratings element, users can share theirs opinions and experiences and they can submit a rating of their own. this element, provide an easy UI to implement a rating system in your project.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/rating/define';
```

```js preview-story
export const main = () => html`<lion-rating totalItemsToShow="5" currentRate="5"></lion-rating>`;
```

## Features

- show differnet numbers of stars (5 star is default )
- pre-defined rate or showing empty state that user can change the rate

## styles

This is the main classes for component.

- `rating__input`: input class
- `rating__label`: main class for label
- `ratintg__label_icon`: main class for icon that we use to show stars

## Installation

```bash
npm i --save @lion/rating
```

```js
import { LionPagination } from '@lion/rating';
// or
import '@lion/rating/define';
```

## props

- The `totalItemsToShow` parameter will define how many stars gonna be shown. 5 stars is showing by default if nothing passed to element.
- The `currentRate` parameter is used to show the current rate of the element. if nothing passed here, it will show default or zero stars which means no star has been selected.
- when user select a new rate, `on-rate-change` will be called which notify parent element about this change.

## Improvements

- validate `currentRate` and totalItemsToShow. `currentRate` or `totalItemsToShow` should not accept big numbers.
- validate `totalItemsToShow` or `currentRate` to prevent passing negative numbers.
- disable rating or make it readonly in some cases might be needed
