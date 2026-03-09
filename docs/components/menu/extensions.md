---
title: 'Menu: Extensions'
parts:
  - Menu
  - Extensions
eleventyNavigation:
  key: 'Menu: Extensions'
  order: 30
  parent: Menu
  title: Extensions
---

# Menu: Extensions

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-menu.js';
import '@lion/ui/define/lion-item.js';
import '@lion/ui/define/lion-menu-overlay.js';
import '@lion/ui/define/lion-input-stepper.js';
import './src/lion-tree.js';
import './src/lion-toolbar.js';
import { applyMenuDemoStyles } from './src/applyMenuDemoStyles.js';

applyMenuDemoStyles();
```

## Toolbar

From [wai aria toolbar](https://www.w3.org/TR/wai-aria-practices-1.2/examples/toolbar/toolbar.html)

```html preview-story
<lion-toolbar>
  <div>
    <button data-item title="bold" aria-label="Bold">
      <span class="fas fa-bold" aria-hidden="true"></span>
    </button>
    <button data-item title="italic" aria-label="Italic">
      <span class="fas fa-italic" aria-hidden="true"></span>
    </button>
    <button data-item title="underline" aria-label="Underline">
      <span class="fas fa-underline" aria-hidden="true"></span>
    </button>
  </div>
  <div role="separator"></div>
  <div role="radiogroup" aria-label="Text Alignment">
    <button data-item role="radio" aria-label="Text Align Left">
      <span class="fas fa-align-left" aria-hidden="true"></span>
    </button>
    <button data-item role="radio" aria-label="Text Align Center">
      <span class="fas fa-align-center" aria-hidden="true"></span>
    </button>
    <button data-item role="radio" aria-label="Text Align Right">
      <span class="fas fa-align-right" aria-hidden="true"></span>
    </button>
  </div>
  <div role="separator"></div>

  <lion-input-stepper data-item value="20" min="12" max="40" unit="px"></lion-input-stepper>
  <div role="separator"></div>

  <div>
    <div role="menuitem" data-invoker>Font</div>
    <lion-menu-overlay aria-label="Font" data-content>
      <div role="menuitemradio">Sans-serif</div>
      <div role="menuitemradio">Serif</div>
      <div role="menuitemradio">Monospace</div>
      <div role="menuitemradio">Fantasy</div>
    </lion-menu-overlay>
  </div>
  <div>
    <div role="menuitem" data-invoker>Style/Color</div>
    <lion-menu-overlay aria-label="Style/Color" data-content>
      <div role="menuitemcheckbox" aria-checked="true">Bold</div>
      <div role="menuitemcheckbox" aria-checked="true">Italic</div>
      <div role="separator"></div>
      <div role="group" aria-label="Text Color">
        <div role="menuitemradio" aria-checked="false">Black</div>
        <div role="menuitemradio" aria-checked="false">Blue</div>
        <div role="menuitemradio" aria-checked="true">Red</div>
        <div role="menuitemradio" aria-checked="false">Green</div>
      </div>
      <div role="separator"></div>
      <div role="group" aria-label="Text Decoration">
        <div role="menuitemradio" aria-checked="true">None</div>
        <div role="menuitemradio" aria-checked="false">Overline</div>
        <div role="menuitemradio" aria-checked="false">Line-through</div>
        <div role="menuitemradio" aria-checked="false">Underline</div>
      </div>
    </lion-menu-overlay>
  </div>
</lion-toolbar>
```

## Tree

```html preview-story
<lion-tree>
  <div>
    <div role="treeitem">Fruits</div>
    <lion-tree>
      <div role="treeitem">Peek Call Hierarchy</div>
      <div role="treeitem">Peek Definition</div>
    </lion-tree>
  </div>
  <div>
    <div role="treeitem">Vegetables</div>
    <lion-tree>
      <div role="treeitem">Peek Call Hierarchy</div>
      <div>
        <div role="treeitem">Peek</div>
        <lion-tree>
          <div role="treeitem">Peek Call Hierarchy</div>
          <div role="treeitem">Peek Definition</div>
        </lion-tree>
      </div>
    </lion-tree>
  </div>
  <div>
    <div role="treeitem">Grains</div>
    <lion-tree>
      <div role="treeitem">Peek Call Hierarchy</div>
      <div role="treeitem">Peek Definition</div>
    </lion-tree>
  </div>
</lion-tree>
```

### Tree with lion-item

```html preview-story
<lion-tree>
  <lion-item item-role="treeitem">
    <div>Fruits</div>
    <lion-tree>
      <lion-item item-role="treeitem">Peek Call Hierarchy</lion-item>
      <lion-item item-role="treeitem">Peek Definition</lion-item>
    </lion-tree>
  </lion-item>
  <lion-item item-role="treeitem">
    <div>Vegetables</div>
    <lion-tree>
      <lion-item item-role="treeitem">Peek Call Hierarchy</lion-item>
      <lion-item item-role="treeitem">
        <div>Peek</div>
        <lion-tree>
          <lion-item item-role="treeitem">Peek Call Hierarchy</lion-item>
          <lion-item item-role="treeitem">Peek Definition</lion-item>
        </lion-tree>
      </lion-item>
    </lion-tree>
  </lion-item>
  <lion-item item-role="treeitem">
    <div>Grains</div>
    <lion-tree>
      <lion-item item-role="treeitem">Peek Call Hierarchy</lion-item>
      <lion-item item-role="treeitem">Peek Definition</lion-item>
    </lion-tree>
  </lion-item>
</lion-tree>
```


