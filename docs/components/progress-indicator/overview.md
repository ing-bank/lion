---
title: 'Overview'
parts:
  - Progress Indicator
  - Overview
eleventyNavigation:
  key: 'Progress Indicator: Overview'
  order: 10
  parent: Progress Indicator
  title: Overview
---

# Overview

A web component that implements accessibility requirements for progress indicators.

## Compose it, or extend it?

Decide this first:

- **You want to show progress in your own UI** (a page, a bar inside a layout) — **compose** the
  documented element: write your own `LitElement`, apply `ScopedElementsMixin`, register
  `LionProgressIndicator` in `static scopedElements`, and render `<lion-progress-indicator>` in your
  template. Do **not** write `class MyElem extends LionProgressIndicator` for this — a subclass without
  a template of its own renders nothing.
- **You want to change how the progress indicator _itself_ looks** — **extend**
  `LionProgressIndicator` to add custom visuals. That is the subclassing job, documented on the
  Extensions page (`extensions.md` on the docs site), which stays out of this component reference.

The consumer shape:

```js
import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionProgressIndicator } from '@lion/ui/progress-indicator.js';

export class MyElem extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'lion-progress-indicator': LionProgressIndicator };

  render() {
    return html`
      <lion-progress-indicator aria-label="Interest rate" value="50"></lion-progress-indicator>
    `;
  }
}
```

`ScopedElementsMixin` comes from `@open-wc/scoped-elements/lit-element.js`; no `@lion/ui` entrypoint
exports it — `@lion/ui/core.js` in particular does not.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-progress-indicator.js';
```

```html
<lion-progress-indicator aria-label="Interest rate" value="50"></lion-progress-indicator>
```

## Features

The element renders the accessible progressbar on its own. It is designed to be _extended_ only when you
want to add custom visuals (see the Examples page) — the plain `<lion-progress-indicator>` is what you use
as a consumer.

- Can be indeterminate or determinate, depending on whether it has a value.
- Accessibility compliant
- Localized "Loading" label in case of an indeterminate progress-indicator
- Implementation independent of visuals
- `value`: progress value, setting this makes the progress-indicator determinate.
- `min`: progress min value
- `max`: progress max value

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionProgressIndicator } from '@lion/ui/progress-indicator.js';
// or
import '@lion/ui/define/lion-progress-indicator.js';
```
