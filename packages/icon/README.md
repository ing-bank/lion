# Icon

A web component for displaying icons.

```js script
import { html } from '@lion/core';
import { icons } from './index.js';
import './docs/icons/iconset-bugs.js';
import './docs/icons/iconset-misc.js';
import * as spaceSet from './docs/icons/iconset-space.js';

import './lion-icon.js';

export default {
  title: 'Icons/Icon',
};

icons.addIconResolver('lion', (iconset, name) => {
  switch (iconset) {
    case 'bugs':
      return import('./docs/icons/iconset-bugs.js').then(module => module[name]);
    case 'space':
      return import('./docs/icons/iconset-space.js').then(module => module[name]);
    case 'misc':
      return import('./docs/icons/iconset-misc.js').then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
});
```

```js preview-story
export const main = () => html`
  <lion-icon icon-id="lion:space:alienSpaceship" style="width: 50px; height: 50px;"></lion-icon>
`;
```

## How to use

### Installation

```bash
npm i --save @lion/icon
```

```js
import { LionIcon } from '@lion/icon';
// or
import '@lion/icon/lion-icon.js';
```

### Icon sets

Icons are displayed using icon sets. These are collections of icons, lazily loaded on demand for performance.
See the [system documentation](?path=/docs/icons-system--page) to learn more about icon sets.

```js preview-story
export const iconSets = () => html`
  ${Object.keys(spaceSet).map(
    name => html`
      <style>
        .demo-icon__container {
          display: inline-flex;
          position: relative;
          flex-grow: 1;
          flex-direction: column;
          align-items: center;
          width: 80px;
          height: 80px;
          padding: 4px;
        }
        .demo-icon__name {
          font-size: 10px;
        }
      </style>
      <div class="demo-icon__container">
        <lion-icon icon-id="lion:space:${name}" aria-label="${name}"></lion-icon>
        <span class="demo-icon__name">${name}</span>
      </div>
    `,
  )}
`;
```

If for some reason you don't want to lazy load icons, you can still import and use them
synchronously.

### Accessibility

It is recommended to add an `aria-label` to provide information to visually impaired users:

A `lion-icon` without an `aria-label` attribute will be automatically given an `aria-hidden` attribute.

```js preview-story
export const accessibleLabel = () => html`
  <lion-icon icon-id="lion:misc:arrowLeft" aria-label="Pointing left"></lion-icon>
`;
```

### Styling

By default, a `lion-icon` will be `1em` × `1em` (the current line-height).

`lion-icon` uses SVGs and may be styled with CSS, including using CSS properties such as `fill`:

```js preview-story
export const Styling = () => html`
  <style>
    .demo-icon {
      width: 160px;
      height: 160px;
      fill: blue;
    }
  </style>
  <lion-icon icon-id="lion:bugs:bug02" aria-label="Bug" class="demo-icon"></lion-icon>
`;
```

See <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS" target="_blank">SVG and CSS</a> on MDN web docs for more information.
