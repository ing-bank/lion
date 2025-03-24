# Icon >> Overview ||10

A web component for displaying icons.

```js script
import { html } from '@mdjs/mdjs-preview';
import { icons } from '@lion/ui/icon.js';
import '@lion/ui/define/lion-icon.js';

icons.addIconResolver('lion', (iconset, name) => {
  switch (iconset) {
    case 'bugs':
      return import('./assets/iconset-bugs.js').then(module => module[name]);
    case 'space':
      return import('./assets/iconset-space.js').then(module => module[name]);
    case 'misc':
      return import('./assets/iconset-misc.js').then(module => module[name]);
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

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionIcon } from '@lion/ui/icon.js';
// or
import '@lion/ui/define/lion-icon.js';
```
