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

# Menu

A menu is a widget that offers a list of choices to the user, such as a set of actions or functions. A menu is usually opened, or made visible, by activating a menu button, choosing an item in a menu that opens a sub menu, or by invoking a command, such as Shift + F10 in Windows, that opens a context specific menu. When a user activates a choice in a menu, the menu usually closes unless the choice opened a submenu.

A menu that is visually persistent is a menubar. A menubar is typically horizontal and is often used to create a menu bar similar to those found near the top of the window in many desktop applications, offering the user quick access to a consistent set of commands.

A common convention for indicating that a menu item launches a dialog box is to append "…" (ellipsis) to the menu item label, e.g., "Save as …".

> From [menu wai-aria best practices](https://www.w3.org/TR/wai-aria-practices/#menu)

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-menu.js';
import '@lion/ui/define/lion-item.js';
import '@lion/ui/define/lion-menu-overlay.js';
import { applyMenuDemoStyles } from './src/applyMenuDemoStyles.js';

applyMenuDemoStyles();
```

```html preview-story
<nav>
  <button data-invoker>Open menu</button>
  <lion-menu>
    <div role="menuitem">Go to Definition</div>
    <div role="menuitem">Go to Type Definition</div>
    <div>
      <div role="menuitem" data-invoker>Peek</div>
      <lion-menu>
        <div role="menuitem">Peek Call Hierarchy</div>
        <div role="separator"></div>
        <div role="menuitem">Peek Definition</div>
      </lion-menu>
    </div>
    <div role="separator"></div>
    <div role="menuitem">Find all References</div>
  </lion-menu>
</nav>
```

### With menuitem

```html preview-story
<nav>
  <button data-invoker for="menu">Open menu</button>
  <lion-menu id="menu">
    <lion-item item-role="menuitem"> Go to Definition </lion-item>
    <lion-item item-role="menuitem"> Go to Type Definition </lion-item>
    <lion-item item-role="menuitem">
      <button slot="invoker">Peek</button>
      <lion-menu>
        <lion-item item-role="menuitemradio"> Peek Call Hierarchy </lion-item>
        <div role="separator"></div>
        <lion-item item-role="menuitemradio"> Peek Definition </lion-item>
      </lion-menu>
    </lion-item>
    <div role="separator"></div>
    <lion-item item-role="menuitemcheckbox"> Find all References </lion-item>
  </lion-menu>
</nav>
```

## Groups, menuitemradios and menuitemcheckboxes

From [wai aria menu fragment](https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-2/menubar-2.html)

```html preview-story
<lion-menu bar invoker-interaction="hover">
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
</lion-menu>
```

## Disclosure menu

See https://www.w3.org/TR/wai-aria-practices-1.1/examples/disclosure/disclosure-navigation.html

```html preview-story
 <nav aria-label="Mythical University">
   <lion-menu bar ._activeMode="${'disclosure'}">
    <lion-item>
      <button data-invoker>About</button>
      <lion-menu data-content>
        <lion-item>
          <a href="#mythical-page-content">Overview</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Administration</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Facts</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Campus Tours</a>
        </lion-item>
      </lion-menu>
    </lion-item>
    <lion-item>
      <button data-invoker>Admissions</button>
      <lion-menu id="id_admissions_menu" data-content>
        <lion-item>
          <a href="#mythical-page-content">Apply</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Tuition</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Sign Up</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Visit</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Photo Tour</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Connect</a>
        </lion-item>
      </lion-menu>
    </lion-item>
    <lion-item>
      <button data-invoker>Academics</button>
      <lion-menu data-content>
        <lion-item>
          <a href="#mythical-page-content">Colleges & Schools</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Programs of Study</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Honors Programs</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Online Courses</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Course Explorer</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Register for Class</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Academic Calendar</a>
        </lion-item>
        <lion-item>
          <a href="#mythical-page-content">Transcripts</a>
        </lion-item>
      </lion-menu>
    </lion-item>
  </lion-menu>
</nav>
```
