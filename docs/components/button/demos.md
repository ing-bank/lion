---
parts:
  - Button
  - Demos
title: 'Button: Demos'
eleventyNavigation:
  key: 'Button: Demos'
  order: 10
  parent: Button
  title: Demos
---

# Button: Demos

A button web component that is easily stylable and accessible.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-button.js';
```

## Simple Lion Button

```js mdjs-sandbox
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionButton } from '@lion/ui/button.js';
import { html, LitElement } from 'lit';

class ButtonDemo extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'lion-button': LionButton,
  };

  render() {
    return html` <lion-button>Lion Button</lion-button> `;
  }
}

customElements.define('button-demo', ButtonDemo);

window.__ButtonDemo = ButtonDemo;
```

## With click handler

```js mdjs-sandbox
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionButton } from '@lion/ui/button.js';
import { html, LitElement } from 'lit';

class ButtonClickDemo extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'lion-button': LionButton,
  };

  handleClick(evt) {
    console.log('clicked/spaced/entered', evt);
  }

  render() {
    return html`
      <lion-button @click=${this.handleClick}>Click | Space | Enter me and see log</lion-button>
    `;
  }
}

customElements.define('button-click-demo', ButtonClickDemo);
```

## Disabled button

```js mdjs-sandbox
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionButton } from '@lion/ui/button.js';
import { html, LitElement } from 'lit';

class ButtonDisabledDemo extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'lion-button': LionButton,
  };

  render() {
    return html` <lion-button disabled>Click Me</lion-button> `;
  }
}

customElements.define('button-disabled-demo', ButtonDisabledDemo);
```

## Minimum click area

```js mdjs-sandbox
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionButton } from '@lion/ui/button.js';
import { html, LitElement, css } from 'lit';

class ButtonMinimumClickDemo extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'lion-button': LionButton,
  };

  static styles = [
    css`
      .small {
        padding: 4px;
        line-height: 1em;
      }
      .small::before {
        border: 1px dashed #000;
      }
    `,
  ];

  render() {
    return html` <lion-button class="small">Click Me</lion-button> `;
  }
}

customElements.define('button-minimum-click-demo', ButtonMinimumClickDemo);
```
