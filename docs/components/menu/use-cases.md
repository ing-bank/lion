---
title: 'Menu: Overview'
parts:
  - Menu
  - Use Cases
eleventyNavigation:
  key: 'Menu: Use Cases'
  order: 20
  parent: Menu
  title: Use Cases
---

# Use Cases

```js script
import { html } from 'lit';
import '@lion/ui/define/lion-item.js';
import '@lion/ui/define/lion-menu.js';
import '@lion/ui/define/lion-menu-overlay.js';
import '@lion/ui/define/lion-tree.js';
import '@lion/ui/define/lion-toolbar.js';
import { applyMenuDemoStyles } from './applyMenuDemoStyles.js';

applyMenuDemoStyles();
```

## Default

```html preview-story
<nav>
  <button data-invoker>Open menu</button>
  <lion-menu-overlay>
    <div role="menuitem">Go to Definition</div>
    <div role="menuitem">Go to Type Definition</div>
    <div>
      <button role="menuitem" data-invoker>Peek</button>
      <lion-menu-overlay>
        <div role="menuitem">Peek Call Hierarchy</div>
        <div role="separator"></div>
        <div role="menuitem">Peek Definition</div>
      </lion-menu-overlay>
    </div>
    <div role="separator"></div>
    <div role="menuitem">Find all References</div>
  </lion-menu-overlay>
</nav>
```

## Overflow

## Attributes & Properties

### Bar

By adding the `bar` attribute the orientation will be set to horizontal and the role will be set to menubar.

```html preview-story
<nav>
  <lion-menu bar>
    <div>
      <a role="menuitem" data-invoker href="#home">home</a>
    </div>
    <div role="menuitem">Go to Definition</div>
    <div role="menuitem">Go to Type Definition</div>
    <div>
      <button role="menuitem" data-invoker>Details</button>
      <lion-menu-overlay>
        <div role="menuitem">Peek Call Hierarchy</div>
        <div role="separator"></div>
        <div role="menuitem">Peek Definition</div>
      </lion-menu-overlay>
    </div>
    <div role="separator"></div>
    <div role="menuitem">Find all References</div>
  </lion-menu>
</nav>
```
