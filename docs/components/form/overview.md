---
title: 'Overview'
parts:
  - Form
  - Overview
eleventyNavigation:
  key: 'Form: Overview'
  order: 10
  parent: Form
  title: Overview
---

# Overview

## Compose it, or extend it?

Decide this first:

- **You want a form in your own UI** (a page that collects and submits data) — **compose** the
  documented components: write your own `LitElement`, apply `ScopedElementsMixin`, register `LionForm`
  and the controls it renders in `static scopedElements`, and render `<lion-form>` / `<lion-input>` in
  your template. Do **not** write `class MyElem extends LionForm` for this — a subclass without a
  template of its own renders nothing.
- **You want to change how the form _itself_ looks or behaves** — **extend** `LionForm`. That is the
  subclassing job, documented on the Extensions page (`extensions.md` on the docs site), which stays out
  of this component reference.

The consumer shape:

```js
import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionForm } from '@lion/ui/form.js';
import { LionInput } from '@lion/ui/input.js';

export class MyElem extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'lion-form': LionForm, 'lion-input': LionInput };

  render() {
    return html`
      <lion-form>
        <form>
          <lion-input name="firstName" label="First Name"></lion-input>
        </form>
      </lion-form>
    `;
  }
}
```

`ScopedElementsMixin` comes from `@open-wc/scoped-elements/lit-element.js`; no `@lion/ui` entrypoint
exports it — `@lion/ui/core.js` in particular does not. Read the [form system](../../fundamentals/systems/form/overview.md)
for the light-dom and registration rules a form and its controls depend on.

```js script
import { html } from '@mdjs/mdjs-preview';

import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-form.js';
```

A web component that enhances the functionality of the native `form` component.
It is designed to interact with (instances of) the [form controls](../../fundamentals/systems/form/overview.md).

```js preview-story
export const main = () => {
  const submitHandler = ev => {
    const formData = ev.target.serializedValue;
    console.log('formData', formData);
    fetch('/api/foo/', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  };
  return html`
    <lion-form @submit="${submitHandler}">
      <form @submit="${ev => ev.preventDefault()}">
        <lion-input name="firstName" label="First Name" .modelValue="${'Foo'}"></lion-input>
        <lion-input name="lastName" label="Last Name" .modelValue="${'Bar'}"></lion-input>
        <button>Submit</button>
      </form>
    </lion-form>
  `;
};
```

## Features

- Data synchronization with models
- Easy retrieval of form data based on field names
- Advanced validation possibilities
- Advanced user interaction scenarios via [interaction states](../../fundamentals/systems/form/interaction-states.md)
- Registration mechanism for form controls
- Accessible out of the box

For more information about fields that are designed for our `form`, please read [form system](../../fundamentals/systems/form/overview.md).

## Installation

```bash
npm i --save @lion/ui
```

```js
import '@lion/ui/define/lion-form.js';
```
