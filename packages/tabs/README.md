# Tabs

`lion-tabs` implements Tabs view to allow users to quickly move between a small number of equally important views

## How to use

### Installation

```sh
npm i --save @lion/tabs;
```

### Usage

```js
import '@lion/tabs/lion-tabs.js';
```

```html
<lion-tabs>
  <button slot="tab">Info</button>
  <p slot="panel">
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laboriosam sequi odit cumque, enim aut
    assumenda itaque quis voluptas est quos fugiat unde labore reiciendis saepe, iure, optio
    officiis obcaecati quibusdam.
  </p>
  <div slot="tab">About</div>
  <p slot="panel">
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laboriosam sequi odit cumque, enim aut
    assumenda itaque quis voluptas est quos fugiat unde labore reiciendis saepe, iure, optio
    officiis obcaecati quibusdam.
  </p>
</lion-tabs>
```

Rationales:

- **No separate active/focus state when using keyboard**

  We will immediately switch content as all our content comes from light dom (e.g. no latency)

  See Note at <https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-19>

  > It is recommended that tabs activate automatically when they receive focus as long as their
  > associated tab panels are displayed without noticeable latency. This typically requires tab
  > panel content to be preloaded.

- **Panels are not focusable**

  Focusable elements should have a means to interact with them. Tab panels themselves do not offer any interactiveness.
  If there is a button or a form inside the tab panel then these elements get focused directly.
