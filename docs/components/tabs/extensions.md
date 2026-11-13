---
title: 'Extensions'
parts:
  - Tabs
  - Extensions
eleventyNavigation:
  key: 'Tabs: Extensions'
  order: 40
  parent: Tabs
  title: Extensions
---

# Extensions

`LionTabs` renders and switches its own panels, so a consumer that only needs tabs uses the plain
element (`overview.md`) and does not extend anything. **This page is about subclassing** — giving the
tabs your own tag name and styling.

## Styled tabs (lea-tabs)

Learn how to create the `lea tabs` in our ["introducing lion" blogpost](../../blog/ing-open-sources-lion.md).

```js script
import { LitElement, html } from '@mdjs/mdjs-preview';
import './src/lea-tabs.js';
import './src/lea-tab.js';
import './src/lea-tab-panel.js';
```

```js preview-story
export const main = () => html`
  <lea-tabs>
    <lea-tab slot="tab">Info</lea-tab>
    <lea-tab-panel slot="panel"> Info page with lots of information about us. </lea-tab-panel>
    <lea-tab slot="tab">Work</lea-tab>
    <lea-tab-panel slot="panel"> Work page that showcases our work. </lea-tab-panel>
  </lea-tabs>
`;
```
