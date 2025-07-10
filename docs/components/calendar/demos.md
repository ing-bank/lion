---
parts:
  - Calendar
  - Demos
title: 'Calendar: Demos'
eleventyNavigation:
  key: 'Calendar: Demos'
  order: 10
  parent: Calendar
  title: Demos
---

# Calendar: Demos

A reusable and accessible calendar view web component.

```js script
import { html, css } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-calendar.js';
```

## Simple Lion Calendar

```js mdjs-sandbox
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionCalendar } from '@lion/ui/calendar.js';
import { html, LitElement } from 'lit';

class CalendarDemo extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'lion-calendar': LionCalendar,
  };

  render() {
    return html` <lion-calendar>Lion Button</lion-calendar> `;
  }
}

customElements.define('button-demo', CalendarDemo);
```

```

```
