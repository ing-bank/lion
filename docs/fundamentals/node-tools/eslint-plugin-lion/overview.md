---
parts:
  - Overview
  - ESLint Plugin Lion
  - Node Tools
title: 'ESLint Plugin Lion: Overview'
eleventyNavigation:
  key: Node Tools >> ESLint Plugin Lion >> Overview
  title: Overview
  order: 51
  parent: Node Tools >> ESLint Plugin Lion
---

# ESLint Plugin Lion: Overview

`eslint-plugin-lion` identifies browser performance patterns that can trigger unnecessary style recalculation, layout work, or overly broad rendering.

## Installation

```bash
npm i -D eslint-plugin-lion
```

Enable the recommended rules in an ESLint legacy configuration:

```js
export default {
  extends: ['plugin:lion/recommended'],
};
```

Or configure them individually:

```js
export default {
  plugins: ['lion'],
  rules: {
    'lion/no-forced-layout-reads': 'error',
    'lion/prefer-check-visibility': 'warn',
    'lion/prefer-css-containment': 'warn',
  },
};
```

## Rules

### `lion/no-forced-layout-reads`

Reports geometry reads that can force synchronous layout when they occur after a DOM/style mutation or inside a loop. It covers common geometry properties such as `offsetWidth`, `clientWidth`, and `scrollHeight`, as well as `getBoundingClientRect()`, `getClientRects()`, and `getComputedStyle()`.

Read layout values before DOM writes, batch writes together, or move layout-dependent work to a scheduled frame or observer.

```js
// Avoid: each iteration can force layout.
for (const item of items) {
  item.classList.add('selected');
  total += item.offsetWidth;
}

// Prefer: read before writing.
const widths = items.map(item => item.offsetWidth);
for (const item of items) item.classList.add('selected');
```

### `lion/prefer-check-visibility`

Suggests `element.checkVisibility()` when `offsetWidth`, `offsetHeight`, or `getClientRects()` is used as a visibility test. These geometry reads can flush layout; `checkVisibility()` answers the intended question directly.

```js
// Avoid
if (element.offsetWidth > 0) {
  // ...
}

// Prefer
if (element.checkVisibility()) {
  // ...
}
```

### `lion/prefer-css-containment`

Suggests adding CSS containment to component classes whose names indicate UI that commonly hosts isolated rendering work: overlays, dropdowns, popovers, modals, dialogs, drawers, listboxes, selects, options, collapsibles, and accordions. The rule examines static `css` template literals and reports when they do not declare `contain`.

```js
static get styles() {
  return css`
    :host {
      contain: layout paint;
    }
  `;
}
```

Choose the smallest containment value compatible with the component's layout and rendering requirements. CSS containment deliberately changes how descendants participate in layout, paint, and size calculations.
