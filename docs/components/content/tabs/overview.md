# Content >> Tabs >> Overview ||10

A web component that allows users to quickly move between a small number of equally important views.

```js script
import { LitElement, html } from '@mdjs/mdjs-preview';
import '@lion/tabs/define';
```

```js preview-story
export const main = () => html`
  <lion-tabs>
    <button slot="tab">Info</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <button slot="tab">Work</button>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`;
```

## Installation

```bash
npm i --save @lion/tabs;
```

```js
import { LionTabs } from '@lion/tabs';
// or
import '@lion/tabs/define';
```

## Rationale

### No separate active/focus state when using keyboard

We will immediately switch content as all our content comes from light dom (e.g. no latency)

See Note at <https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-19>

> It is recommended that tabs activate automatically when they receive focus as long as their
> associated tab panels are displayed without noticeable latency. This typically requires tab
> panel content to be preloaded.

### Panels are not focusable

Focusable elements should have a means to interact with them. Tab panels themselves do not offer any interactivity.
If there is a button or a form inside the tab panel then these elements get focused directly.
