---
parts:
  - Dialog
  - Overview
title: 'Dialog: Overview'
eleventyNavigation:
  key: 'Dialog: Overview'
  order: 10
  parent: Dialog
  title: Overview
---

# Dialog: Overview

A web component that wraps a modal dialog controller.
Its purpose is to make it easy to use our Overlay System declaratively.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-dialog.js';
import { LitElement, nothing } from 'lit';
import { cache } from 'lit/directives/cache.js';
import '@lion/ui/define/lion-tabs.js';
import { demoStyle } from './src/demoStyle.js';
```

```js preview-story
export const main = () => {
  const dialog = html` <lion-dialog>
    <button slot="invoker" class="invoker-button">Click me to open dialog</button>
    <div slot="content" class="demo-dialog-content">
      Hello! You can close this dialog here:
      <button
        class="close-button"
        @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
      >
        ⨯
      </button>
    </div>
  </lion-dialog>`;

  /**
   * Note, inactive tab content is **destroyed** on every tab switch.
   */
  class Wrapper extends LitElement {
    static properties = {
      ...super.properties,
      activeTabIndex: { type: Number },
    };

    constructor() {
      super();
      this.activeTabIndex = 0;
    }

    /**
     * @param {number} index
     */
    changeActiveTabIndex(index) {
      this.activeTabIndex = index;
    }

    render() {
      const changeActiveTabIndexRef = this.changeActiveTabIndex.bind(this);
      return html`
        <lion-tabs>
          <button slot="tab" class="first-button" @click=${() => changeActiveTabIndexRef(0)}>
            First
          </button>
          <p slot="panel">
            <!-- buggy case -->
            <!-- ${cache(this.activeTabIndex === 0 ? dialog : nothing)} -->
            <!-- working case -->
            ${this.activeTabIndex === 0 ? dialog : nothing}
          </p>
          <button slot="tab" class="second-button" @click=${() => changeActiveTabIndexRef(1)}>
            Second
          </button>
          <p slot="panel">Info page with lots of information about us.</p>
        </lion-tabs>
      `;
    }
  }
  customElements.define('lion-wrapper', Wrapper);
  return html`<style>
    ${demoStyle}
  </style>
  <lion-wrapper></ing-wrapper>`;
};
```

## Features

- Show content when clicking the invoker
- Respond to close event in the slot="content" element, to close the content
- Have a `.config` object to set or update the OverlayController's configuration

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionDialog } from '@lion/ui/dialog.js';
// or
import '@lion/ui/define/lion-dialog.js';
```

- To close the overlay from within the content node, you need to dispatch a `close-overlay` event that bubbles.
  It has to be able to reach the content node (if you need to traverse shadow boundaries, you will have to add `composed: true` as well).

## Changing the configuration

You can use the `.config` property on the dialog to change the configuration.
The documentation of the full config object can be found in the `overlays` folder or here in [Overlay System - Configuration](../../fundamentals/systems/overlays/configuration.md).

The `config` property uses a setter to merge the passed configuration with the current, so you only **overwrite what you pass** when updating `config`.
