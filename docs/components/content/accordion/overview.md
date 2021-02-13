# Content >> Accordion >> Overview ||10

`lion-accordion` is a component used to toggle the display of sections of content.
Its purpose is to reduce the need to scroll when presenting multiple sections of content on a single page. Accordions often allow users to get the big picture before focusing on details.

```js script
import { html } from '@lion/core';
import '@lion/accordion/lion-accordion.js';
```

```js preview-story
export const main = () => html`
  <lion-accordion>
    <h3 slot="invoker">
      <button>Lorem</button>
    </h3>
    <p slot="content">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
    <h3 slot="invoker">
      <button>Laboriosam</button>
    </h3>
    <p slot="content">
      Laboriosam sequi odit cumque, enim aut assumenda itaque quis voluptas est quos fugiat unde
      labore reiciendis saepe, iure, optio officiis obcaecati quibusdam.
    </p>
  </lion-accordion>
`;
```

## Features

> tbd

## Installation

```bash
npm i --save @lion/accordion
```

```js
import { LionAccordion } from '@lion/accordion';
// or
import '@lion/accordion/lion-accordion.js';
```

## Rationals

### Contents are not focusable

Focusable elements should have a means to interact with them. Contents themselves do not offer any interactiveness.
If there is a button or a form inside the tab panel then these elements get focused directly.
