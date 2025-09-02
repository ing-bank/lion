---
parts:
  - Select Rich
  - Overview
title: 'Select Rich: Overview'
eleventyNavigation:
  key: 'Select Rich: Overview'
  order: 10
  parent: Select Rich
  title: Overview
---

# Select Rich: Overview

This web component is a 'rich' version of the native `<select>` element.
It allows providing fully customized options and a fully customized invoker button and is meant to be used whenever the native `<select>` doesn't provide enough styling, theming or user interaction opportunities.

Its implementation is based on the following Design pattern:
<https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html>

```js script
import { LitElement, html, nothing } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-tabs.js';
import { cache } from 'lit/directives/cache.js';
```

```js preview-story
export const main = () => {
  const colours = [
    {
      label: 'Red',
      value: 'red',
    },
    {
      label: 'Blue',
      value: 'blue',
    },
  ];

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

    render() {
      return html`
        <lion-tabs>
          <button
            slot="tab"
            @click=${function () {
              this.activeTabIndex = 0;
            }}
          >
            Info
          </button>
          <p slot="panel">
            ${cache(
              this.activeTabIndex === 0
                ? html`<lion-select-rich name="favoriteColor" label="Favorite color">
                    ${colours.map(
                      (colour, index) =>
                        html`<lion-option .choiceValue="${colour.value}"
                          >${colour.label}</lion-option
                        >`,
                    )}
                  </lion-select-rich>`
                : nothing,
            )}
          </p>
          <button
            slot="tab"
            @click=${function () {
              this.activeTabIndex = 1;
            }}
          >
            Work
          </button>
          <p slot="panel">Info page with lots of information about us.</p>
        </lion-tabs>
      `;
    }
  }

  customElements.define('lion-wrapper', Wrapper);
  return html`<lion-wrapper></lion-wrapper>`;
};
```

## Features

- Fully accessible
- Flexible API
- Fully customizable option elements
- Fully customizable invoker element
- Mimics native select interaction mode (windows/linux and mac)

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionSelectRich } from '@lion/ui/select-rich.js';
import { LionOptions, LionOption } from '@lion/ui/listbox.js';
// or
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';
```
