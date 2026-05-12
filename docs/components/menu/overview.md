---
title: 'Menu: Overview'
parts:
  - Menu
  - Overview
eleventyNavigation:
  key: 'Menu: Overview'
  order: 10
  parent: Menu
  title: Overview
---

# Menu: Overview

A menu is a widget that offers a list of choices to the user, such as a set of actions or functions. A menu is usually opened, or made visible, by activating a menu button, choosing an item in a menu that opens a sub menu, or by invoking a command, such as Shift + F10 in Windows, that opens a context specific menu. When a user activates a choice in a menu, the menu usually closes unless the choice opened a submenu.

A menu that is visually persistent is a menubar. A menubar is typically horizontal and is often used to create a menu bar similar to those found near the top of the window in many desktop applications, offering the user quick access to a consistent set of commands.

A common convention for indicating that a menu item launches a dialog box is to append "…" (ellipsis) to the menu item label, e.g., "Save as …".

> From [menu wai-aria best practices](https://www.w3.org/TR/wai-aria-practices/#menu)

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

```js preview-story
export const menuButton = () => html`
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
`;
```

```js preview-story
export const menuButtonZ = () => html`
  <nav>
    <button data-invoker for="menu">Open menu</button>
    <lion-menu id="menu">
      <lion-menuitem> Go to Definition </lion-menuitem>
      <lion-menuitem> Go to Type Definition </lion-menuitem>
      <lion-menuitem>
        <button slot="invoker">Peek</button>
        <lion-menu>
          <lion-menuitem type="radio"> Peek Call Hierarchy </lion-menuitem>
          <div role="separator"></div>
          <lion-menuitem type="radio"> Peek Definition </lion-menuitem>
        </lion-menu>
      </lion-menuitem>
      <div role="separator"></div>
      <lion-menuitem type="checkbox"> Find all References </lion-menuitem>
    </lion-menu>
  </nav>
`;
```

## Groups, menuitemradios and menuitemcheckboxes

From [wai aria menu fragment](https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-2/menubar-2.html)

```js preview-story
export const groups = () => html`
  <lion-menu bar invoker-interaction="hover">
    <div>
      <div role="menuitem">Font</div>
      <lion-menu-overlay aria-label="Font">
        <div role="menuitemradio">Sans-serif</div>
        <div role="menuitemradio">Serif</div>
        <div role="menuitemradio">Monospace</div>
        <div role="menuitemradio">Fantasy</div>
      </lion-menu-overlay>
    </div>
    <div>
      <div role="menuitem">Style/Color</div>
      <lion-menu-overlay aria-label="Style/Color">
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
  </lion-menu>
`;
```

## Tree

```js preview-story
export const tree = () => html`
  <lion-tree>
    <div role="treeitem">Fruits</div>
    <lion-tree>
      <div role="treeitem">Peek Call Hierarchy</div>
      <div role="treeitem">Peek Definition</div>
    </lion-tree>
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
    <div role="treeitem">Grains</div>
    <lion-tree>
      <div role="treeitem">Peek Call Hierarchy</div>
      <div role="treeitem">Peek Definition</div>
    </lion-tree>
  </lion-tree>
`;
```

## Disclosure menu

See <https://www.w3.org/TR/wai-aria-practices-1.1/examples/disclosure/disclosure-navigation.html>

```js preview-story
export const disclosureMenu = () => html`
  <nav aria-label="Mythical University">
    <lion-menu bar ._activeMode="${'tabbable-disclosure'}">
      <div role="listitem">
        <button data-invoker>About</button>
        <lion-menu-overlay>
          <div role="listitem">
            <a href="#mythical-page-content">Overview</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Administration</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Facts</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Campus Tours</a>
          </div>
        </lion-menu-overlay>
      </div>
      <div role="listitem">
        <button data-invoker>Admissions</button>
        <lion-menu-overlay id="id_admissions_menu">
          <div role="listitem">
            <a href="#mythical-page-content">Apply</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Tuition</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Sign Up</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Visit</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Photo Tour</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Connect</a>
          </div>
        </lion-menu-overlay>
      </div>
      <div role="listitem">
        <button data-invoker>Academics</button>
        <lion-menu-overlay>
          <div role="listitem">
            <a href="#mythical-page-content">Colleges & Schools</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Programs of Study</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Honors Programs</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Online Courses</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Course Explorer</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Register for Class</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Academic Calendar</a>
          </div>
          <div role="listitem">
            <a href="#mythical-page-content">Transcripts</a>
          </div>
        </lion-menu-overlay>
      </div>
    </lion-menu>
  </nav>
`;
```

## Disclosure menu with anchors on L1

See <https://codepen.io/aardrian/pen/abyXxGw>

```js preview-story
export const disclosureMenuWithAnchorsOnL1 = () => html`
 <nav aria-label="Mythical University">
   <lion-menu bar ._activeMode="${'tabbable-disclosure'}">
    <div role="listitem">
      <a href="#mythical-page-content">About</a>
      <button data-invoker aria-label="More About Pages">▼</button>
      <lion-menu-overlay>
        <div role="listitem">
          <a href="#mythical-page-content">Overview</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Administration</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Facts</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Campus Tours</a>
        </div>
      </lion-menu-overlay>
    </div>
    <div role="listitem">
      <a href="#mythical-page-content">Admissions</a>
      <button data-invoker aria-label="More Admissions Pages">
        ▼
      </button>
      <lion-menu-overlay id="id_admissions_menu">
        <div role="listitem">
          <a href="#mythical-page-content">Apply</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Tuition</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Sign Up</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Visit</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Photo Tour</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Connect</a>
        </div>
      </lion-menu-overlay>
    </div>
    <div role="listitem">
      <a href="#mythical-page-content">Academics</a>
      <button data-invoker aria-label="More Academics Pages">▼</button>
      <lion-menu-overlay>
        <div role="listitem">
          <a href="#mythical-page-content">Colleges & Schools</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Programs of Study</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Honors Programs</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Online Courses</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Course Explorer</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Register for Class</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Academic Calendar</a>
        </div>
        <div role="listitem">
          <a href="#mythical-page-content">Transcripts</a>
        </div>
      </lion-menu-overlay>
    </div>
  </ul>
</nav>
`;
```

## Toolbar

From [wai aria toolbar](https://www.w3.org/TR/wai-aria-practices-1.2/examples/toolbar/toolbar.html)

```js preview-story
export const toolbar = () => html`
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

    <lion-spinbutton data-item now="20" min="12" max="40" unit="px"></lion-spinbutton>
    <div role="separator"></div>

    <div>
      <div role="menuitem">Font</div>
      <lion-menu-overlay aria-label="Font">
        <div role="menuitemradio">Sans-serif</div>
        <div role="menuitemradio">Serif</div>
        <div role="menuitemradio">Monospace</div>
        <div role="menuitemradio">Fantasy</div>
      </lion-menu-overlay>
    </div>
    <div>
      <div role="menuitem">Style/Color</div>
      <lion-menu-overlay aria-label="Style/Color">
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
`;
```

## Tree lion-item

```js preview-story
export const treeItem = () => html`
  <lion-tree>
    <lion-item>
      <div>Fruits</div>
      <lion-tree>
        <lion-item>Peek Call Hierarchy</lion-item>
        <lion-item>Peek Definition</lion-item>
      </lion-tree>
    </lion-item>
    <lion-item>
      <div>Vegetables</div>
      <lion-tree>
        <lion-item>Peek Call Hierarchy</lion-item>
        <lion-item>
          <div>Peek</div>
          <lion-tree>
            <lion-item>Peek Call Hierarchy</lion-item>
            <lion-item>Peek Definition</lion-item>
          </lion-tree>
        </lion-item>
      </lion-tree>
    </lion-item>
    <lion-item>
      <div>Grains</div>
      <lion-tree>
        <lion-item>Peek Call Hierarchy</lion-item>
        <lion-item>Peek Definition</lion-item>
      </lion-tree>
    </lion-item>
  </lion-tree>
`;
```
