# Drawer >> Use Cases ||20

`lion-drawer`

```js script
import { html } from '@mdjs/mdjs-preview';
import { icons } from '@lion/icon';
import '@lion/drawer/define';
import '@lion/icon/define';
import { demoStyle } from './src/demoStyle.js';

icons.addIconResolver('lion', (iconset, name) => {
  switch (iconset) {
    case 'bugs':
      return import('../icon/assets/iconset-bugs.js').then(module => module[name]);
    case 'space':
      return import('../icon/assets/iconset-space.js').then(module => module[name]);
    case 'misc':
      return import('../icon/assets/iconset-misc.js').then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
});
```

## Default left

By default, the drawer is positioned on the left side of the viewport.

With the `position` property it can be positioned at the top or on the right of the screen.

## Top

```js preview-story
export const top = () => html`
  <style>
    .demo-container {
      height: 400px;
      display: flex;
      flex-direction: column;
      background-color: #f6f8fa;
    }

    .demo-container div {
      padding: 8px;
    }

    lion-drawer {
      height: auto;
    }
  </style>
  <div class="demo-container">
    <lion-drawer position="top">
      <button slot="invoker">
        <lion-icon icon-id="lion:misc:arrowLeft" style="width: 16px; height: 16px;"></lion-icon>
      </button>
      <p slot="headline">Headline</p>
      <div slot="content" class="drawer">Hello! This is the content of the drawer</div>
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

## Right

```js preview-story
export const right = () => html`
  <style>
    .demo-container {
      height: 400px;
      display: flex;
      flex-direction: row-reverse;
      background-color: #f6f8fa;
    }

    .demo-container div {
      padding: 8px;
    }

    lion-drawer {
      height: 400px;
    }
  </style>
  <div class="demo-container">
    <lion-drawer position="right">
      <button slot="invoker">
        <lion-icon icon-id="lion:misc:arrowLeft" style="width: 16px; height: 16px;"></lion-icon>
      </button>
      <p slot="headline">Headline</p>
      <div slot="content" class="drawer">Hello! This is the content of the drawer</div>
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
