# Drawer >> Overview ||10

A combination of a button (the invoker) and a chunk of 'extra content'. This web component can be extended with an
animation to disclose the extra content.

There are three slots available respectively; `invoker` to specify the
drawer's invoker, `headline` for the optional headline and `content` for the content of the drawer.

Through the `position` property, the drawer can be placed on the `top`, `left` or `right` of the viewport.

```js script
import { html } from '@mdjs/mdjs-preview';
import { icons } from '@lion/icon';
import '@lion/drawer/define';
import '@lion/icon/define';
import { demoStyle } from './src/demoStyle.js';

icons.addIconResolver('lion', (iconset, name) => {
  switch (iconset) {
    case 'misc':
      return import('../icon/assets/iconset-misc.js').then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
});
```

```js preview-story
export const main = () => html`
  <style>
    ${demoStyle}
  </style>
  <div class="demo-container">
    <lion-drawer>
      <button slot="invoker">
        <lion-icon icon-id="lion:misc:arrowLeft" style="width: 16px; height: 16px;"></lion-icon>
      </button>
      <p slot="headline">Headline</p>
      <div slot="content" class="drawer">Hello! This is the content of the drawer</div>
      <button slot="bottom-invoker">
        <lion-icon icon-id="lion:misc:arrowLeft" style="width: 16px; height: 16px;"></lion-icon>
      </button>
    </lion-drawer>
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis, lorem sit amet
      sollicitudin egestas, dui lectus sodales leo, quis luctus nulla metus vitae lacus. In at
      imperdiet augue. Mauris mauris dolor, faucibus non nulla vel, vulputate hendrerit mauris.
      Praesent dapibus leo nec libero scelerisque, ac venenatis ante tincidunt. Nulla maximus
      vestibulum orci, ac viverra nisi molestie vel. Vivamus eget elit et turpis elementum tempor
      ultricies at turpis. Ut pretium aliquet finibus. Duis ullamcorper ultrices velit id luctus.
      Phasellus in ex luctus, interdum ex vel, eleifend dolor. Cras massa odio, sodales quis
      consectetur a, blandit eu purus. Donec ut gravida libero, sed accumsan arcu.
    </div>
  </div>
`;
```

## Installation

```bash
npm i --save @lion/drawer
```

```js
import { LionDrawer } from '@lion/drawer';
// or
import '@lion/drawer/define';
```
