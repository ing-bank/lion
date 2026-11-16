---
title: 'Examples'
parts:
  - Tabs
  - Examples
eleventyNavigation:
  key: 'Tabs: Examples'
  order: 30
  parent: Tabs
  title: Examples
---

# Examples

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-tabs.js';
```

## Plain tabs

You do not have to extend `LionTabs` to use tabs: the element switches its own panels. Give each tab a
`tab` slot and each panel a `panel` slot.

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

See `extensions.md` for a styled tabs example: that one extends `LionTabs`, which is a different job
from using tabs as a consumer.
