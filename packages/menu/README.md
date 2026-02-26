[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Menu

`lion-menu` provides a menu component that is easily styleable and is accessible.

```js script
import { css, html } from '@lion/core';
import { LionMenu } from './src/LionMenu.js';
import './lion-menu-content.js';
import './lion-menu.js';

export default {
  title: 'Overlays/Menu',
};
```

```js preview-story
export const main = () => html`
  <lion-menu>
    <button slot="invoker">Edit</button>
    <lion-menu-content slot="content">
      <button menu-type="menu-item">Cut</button>
      <button menu-type="menu-item">Copy</button>
      <button menu-type="menu-item">Paste</button>
    </lion-menu-content>
  </lion-menu>
`;
```

## How to use

### Installation

```bash
npm i --save @lion/menu
```

```js
import { LionMenu, LionMenuContent, LionMenuItem } from '@lion/menu';
// or
import '@lion/menu/lion-menu.js';
import '@lion/menu/lion-menu-content.js';
```

### Example

```html
<lion-menu>
  <button slot="invoker">Edit</button>
  <lion-menu-content slot="content">
    <button menu-type="menu-item">Cut</button>
    <button menu-type="menu-item">Copy</button>
    <button menu-type="menu-item">Paste</button>
  </lion-menu-content>
</lion-menu>
```

## Menus

### Label

Labels are menu items that are not focusable and shouldn't perform an action when clicked. You can create a label by adding `role="presentation"` to the menu item.

```js preview-story
export const label = () => html`
  <lion-menu>
    <button slot="invoker">User</button>
    <lion-menu-content slot="content">
      <div menu-type="presentation">John Doe</div>
      <button menu-type="menu-item">Set status</button>
      <button menu-type="menu-item">Settings</button>
      <button menu-type="menu-item">Sign out</button>
    </lion-menu-content>
  </lion-menu>
`;
```

### Separator

```js preview-story
export const separator = () => html`
  <lion-menu>
    <button slot="invoker">System</button>
    <lion-menu-content slot="content">
      <button menu-type="menu-item">About</button>
      <hr menu-type="separator" />
      <button menu-type="menu-item">Sleep</button>
      <button menu-type="menu-item">Restart</button>
      <button menu-type="menu-item">Shutdown</button>
      <hr menu-type="separator" />
      <button menu-type="menu-item">Sign out</button>
    </lion-menu-content>
  </lion-menu>
`;
```

### Disabled

```js preview-story
export const disabled = () => html`
  <lion-menu>
    <button slot="invoker">Disabled item</button>
    <lion-menu-content slot="content">
      <button menu-type="menu-item">Submit a bug</button>
      <button menu-type="menu-item">Check for updates</button>
      <button menu-type="menu-item" disabled>Admin zone</button>
    </lion-menu-content>
  </lion-menu>
  <lion-menu disabled>
    <button slot="invoker">Disabled menu</button>
    <lion-menu-content slot="content">
      <button menu-type="menu-item">Cut</button>
      <button menu-type="menu-item">Copy</button>
      <button menu-type="menu-item">Paste</button>
    </lion-menu-content>
  </lion-menu>
`;
```

### Placements

You can easily change the placement of the content node relative to the invoker. Placement value will also change automatically according to invoker's position in the viewport. The possible placement values are:

- `top`
- `right`
- `bottom`
- `left`

Each placement supports a `-start` or `-end` variation. The default placement is `bottom-start`.

See the [Popper documentation](https://popper.js.org/docs/v1/#Popper.placements) for more on placements.

```js preview-story
export const placements = () => html`
  <style>
    div#placements {
      display: flex;
      place-items: center;
      place-content: center;
      gap: 8px;
      margin-top: 130px;
    }
  </style>
  <div id="placements">
    <lion-menu .config=${{ popperConfig: { placement: 'left-end' } }}>
      <button slot="invoker">Left-end</button>
      <lion-menu-content slot="content">
        <button menu-type="menu-item">Open</button>
        <button menu-type="menu-item">Save</button>
        <button menu-type="menu-item">Exit</button>
      </lion-menu-content>
    </lion-menu>
    <lion-menu .config=${{ popperConfig: { placement: 'top' } }}>
      <button slot="invoker">Top</button>
      <lion-menu-content slot="content">
        <button menu-type="menu-item">Open</button>
        <button menu-type="menu-item">Save</button>
        <button menu-type="menu-item">Exit</button>
      </lion-menu-content>
    </lion-menu>
    <lion-menu .config=${{ popperConfig: { placement: 'bottom' } }}>
      <button slot="invoker">Bottom</button>
      <lion-menu-content slot="content">
        <button menu-type="menu-item">Open</button>
        <button menu-type="menu-item">Save</button>
        <button menu-type="menu-item">Exit</button>
      </lion-menu-content>
    </lion-menu>
    <lion-menu .config=${{ popperConfig: { placement: 'right-start' } }}>
      <button slot="invoker">Right-start</button>
      <lion-menu-content slot="content">
        <button menu-type="menu-item">Open</button>
        <button menu-type="menu-item">Save</button>
        <button menu-type="menu-item">Exit</button>
      </lion-menu-content>
    </lion-menu>
  </div>
`;
```

### Arrow

By default, the arrow is disabled for our menu. Via the `has-arrow` property it can be enabled.

> As a Subclasser, you can decide to turn the arrow on by default if this fits your Design System

```js preview-story
export const arrow = () => html`
  <style>
    div#arrow {
      display: flex;
      place-items: center;
      place-content: center;
      gap: 8px;
      margin-top: 130px;
    }
  </style>

  <div id="arrow">
    <lion-menu has-arrow .config=${{ popperConfig: { placement: 'left' } }}>
      <button slot="invoker">Arrow left</button>
      <lion-menu-content slot="content">
        <button menu-type="menu-item">Cut</button>
        <button menu-type="menu-item">Copy</button>
        <button menu-type="menu-item">Paste</button>
      </lion-menu-content>
    </lion-menu>
    <lion-menu has-arrow .config=${{ popperConfig: { placement: 'top' } }}>
      <button slot="invoker">Arrow top</button>
      <lion-menu-content slot="content">
        <button menu-type="menu-item">Cut</button>
        <button menu-type="menu-item">Copy</button>
        <button menu-type="menu-item">Paste</button>
      </lion-menu-content>
    </lion-menu>
    <lion-menu has-arrow .config=${{ popperConfig: { placement: 'bottom' } }}>
      <button slot="invoker">Arrow bottom</button>
      <lion-menu-content slot="content">
        <button menu-type="menu-item">Cut</button>
        <button menu-type="menu-item">Copy</button>
        <button menu-type="menu-item">Paste</button>
      </lion-menu-content>
    </lion-menu>
    <lion-menu has-arrow .config=${{ popperConfig: { placement: 'right' } }}>
      <button slot="invoker">Arrow right</button>
      <lion-menu-content slot="content">
        <button menu-type="menu-item">Cut</button>
        <button menu-type="menu-item">Copy</button>
        <button menu-type="menu-item">Paste</button>
      </lion-menu-content>
    </lion-menu>
  </div>
`;
```

#### Use a custom arrow

If you plan on providing a custom arrow, you can extend the `lion-menu`.

All you need to do is override the `_arrowTemplate` method to pass your own SVG, and extend the styles to pass the proper dimensions of your arrow.
The rest of the work is done by Popper.js (for positioning) and the `lion-menu-arrow` (arrow dimensions, rotation, etc.).

```js preview-story
export const customArrow = () => {
  if (!customElements.get('custom-menu')) {
    customElements.define(
      'custom-menu',
      class extends LionMenu {
        static get styles() {
          return [
            super.styles,
            css`
              :host {
                --menu-arrow-width: 20px;
                --menu-arrow-height: 8px;
              }
            `,
          ];
        }
        constructor() {
          super();
          this.hasArrow = true;
        }
        _arrowTemplate() {
          return html`
            <svg viewBox="0 0 20 8" fill="deeppink">
              <path d="M 0,0 h 20 L 10,8 z"></path>
            </svg>
          `;
        }
      },
    );
  }
  return html`
    <custom-menu>
      <button slot="invoker">Edit</button>
      <lion-menu-content slot="content">
        <button menu-type="menu-item">Cut</button>
        <button menu-type="menu-item">Copy</button>
        <button menu-type="menu-item">Paste</button>
      </lion-menu-content>
    </custom-menu>
  `;
};
```
