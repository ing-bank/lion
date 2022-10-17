# Drawer >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import { icons } from '@lion/icon';
import '@lion/drawer/define';
import '@lion/icon/define';

icons.addIconResolver('lion', (iconset, name) => {
  switch (iconset) {
    case 'misc':
      return import('../icon/assets/iconset-misc.js').then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
});
```

## Positioning

### Default left

By default, the drawer is positioned on the left side of the viewport.

With the `position` property it can be positioned at the top or on the right of the screen.

### Top

```js preview-story
export const top = () => html`
  <style>
    .demo-container-top {
      height: 400px;
      display: flex;
      flex-direction: column;
      background-color: #f6f8fa;
    }

    .demo-container-top div {
      padding: 8px;
    }

    .demo-container-top lion-drawer {
      height: auto;
      width: 100%;
    }

    button {
      all: revert !important;
      border: 2px solid #000000;
      background-color: rgb(239, 239, 239);
    }
  </style>
  <div class="demo-container-top">
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

### Right

```js preview-story
export const right = () => html`
  <style>
    .demo-container-right {
      height: 400px;
      display: flex;
      flex-direction: row-reverse;
      background-color: #f6f8fa;
    }

    .demo-container-right div {
      padding: 8px;
    }

    .demo-container-right lion-drawer {
      height: 400px;
    }
  </style>
  <div class="demo-container-right">
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

## Opened

Add the `opened` attribute to display the drawer opened.

```js preview-story
export const opened = () => html`
  <style>
    .demo-container-opened {
      height: 400px;
      display: flex;
      flex-direction: row;
      background-color: #f6f8fa;
    }

    .demo-container-opened div {
      padding: 8px;
    }

    .demo-container-opened lion-drawer {
      height: 400px;
    }
  </style>
  <div class="demo-container">
    <lion-drawer opened>
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

## Methods

There are the following methods available to control the extra content for the drawer.

- `toggle()`: toggle the extra content
- `show()`: show the extra content
- `hide()`: hide the extra content

```js preview-story
export const methods = ({ shadowRoot }) => html`
  <style>
    .demo-container {
      height: 400px;
      display: flex;
      flex-direction: row;
      background-color: #f6f8fa;
    }

    .demo-container div {
      padding: 8px;
    }

    lion-drawer {
      height: 400px;
    }
  </style>
  <section style="margin-top:16px">
    <button @click=${() => shadowRoot.querySelector('#drawer').toggle()}>Toggle content</button>
    <button @click=${() => shadowRoot.querySelector('#drawer').show()}>Show content</button>
    <button @click=${() => shadowRoot.querySelector('#drawer').hide()}>Hide content</button>
  </section>

  <div class="demo-container">
    <lion-drawer id="drawer">
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

## Events

`lion-drawer` fires an event on `invoker` click to notify the component's current state. It is useful for analytics purposes or to perform some actions while expanding and collapsing the component.

- `@opened-changed`: triggers when drawer either gets opened or closed

```js preview-story
export const events = ({ shadowRoot }) => html`
  <style>
    .demo-container {
      height: 400px;
      display: flex;
      flex-direction: row;
      background-color: #f6f8fa;
    }

    .demo-container div {
      padding: 8px;
    }

    lion-drawer {
      height: 400px;
    }
  </style>

  <div class="demo-custom-collapsible-state-container">
    <strong id="collapsible-state"></strong>
  </div>
  <div class="demo-container">
    <lion-drawer
      @opened-changed=${ev => {
        const collapsibleState = shadowRoot.querySelector('#collapsible-state');
        collapsibleState.innerText = `Opened: ${ev.target.opened}`;
      }}
    >
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
