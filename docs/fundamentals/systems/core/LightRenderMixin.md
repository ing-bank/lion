---
parts:
  - LightRenderMixin
  - Core
  - Systems
title: 'Core: LightRenderMixin'
eleventyNavigation:
  key: Systems >> Core >> LightRenderMixin
  title: LightRenderMixin
  order: 30
  parent: Systems >> Core
---

# Core: LightRenderMixin

```js script
import { html } from '@mdjs/mdjs-preview';
import './MyAccessibleControl.mjs';
```

`LightRenderMixin` lets a component **author** render part of their template in the light dom instead
of the shadow dom, while keeping the ergonomics of a normal Lit render.

```js preview-story
export const accessibleControl = () => html`
  <my-accessible-control label="Label rendered in the light dom"></my-accessible-control>
`;
```

You normally author for shadow dom and only the consumer writes light dom. For accessible relations
this is not always enough: an `id` relation cannot cross a shadow boundary, so a label, description,
error message or `aria-activedescendant` target that lives in another tree cannot be referred to from
the inside. Read [Rationales: Accessibility](../../rationales/accessibility.md#shadow-roots-and-accessibility)
for why this is not going to be solved by a spec you can wait for.

## Why light dom instead of element reflection

JavaScript element reflection (`ariaLabelledByElements`, `ariaDescribedByElements`,
`ariaControlsElements`, `ariaActiveDescendantElement`) is shipped, but it does not remove the need:

- It only exists as a **JavaScript** API (Chrome 135+, Firefox 136+, Safari 16.4+). It cannot be
  expressed in markup, so it is unavailable to declarative rendering and to crawlers.
- **Server side rendering** of components that depend on it would need hydration before the relation
  exists, so there is a window where the page is rendered and inaccessible.
- **Declarative shadow dom is inert to crawlers**: content inside a `<template>` is ignored by the
  AI/GEO and SEO indexers that decide whether your content is found, while light dom is read.
- The relation is not visible in the DOM a consumer inspects or a test asserts on.

Light dom is the only target where such a relation can be expressed as markup a consumer can read.

## Server side rendering

The mixin implements the light dom protocol of `@lit-labs/ssr`: `renderLight()` returns the slot
templates, and lit-ssr serializes the result as the light dom of the host element. So the light dom
is in the initial response — no hydration — and it is plain markup a crawler reads.

Ask for it in the template that is server rendered, with the `renderLight()` directive:

```js
import { renderLight } from '@lit-labs/ssr-client/directives/render-light.js';

// server template
html`<my-input>${renderLight()}</my-input>`;
```

Measured output of a component with an `input` and a `label` slot:

```html
<ssr-control
  ><template shadowroot="open" shadowrootmode="open"
    ><div class="wrapper"><slot name="label"></slot><slot name="input"></slot></div
  ></template>
  <div slot="input" data-light-render="ssr"><input id="the-input" /></div>
  <div slot="label" data-light-render="ssr">
    <label for="the-input">server rendered label</label>
  </div></ssr-control
>
```

The label/input relation is in the response, the declarative shadow root is still there (so the
component is interactive once it hydrates), and a conditional slot (a template returning `undefined`)
is left out.

On the client, `connectedCallback` removes the server rendered wrappers (they are marked
`data-light-render="ssr"`) and renders the light dom itself, so the light dom after connect is
exactly the same as it is for an element that was never server rendered, and nothing is duplicated.
This also means the _server_ markup has the slots wrapped in one extra element per slot (the only
node the mixin can put the `slot` attribute on); the client render replaces those wrappers with the
nodes as authored.

Without the `renderLight()` directive in your template there is no light dom in the response, only
the declarative shadow root — the content of a `<template>` is ignored by AI/GEO and SEO indexers.

## Usage

Declare which slot templates you want rendered to light dom. In the shadow dom template you call the
template function like you always would; the mixin renders the slot outlet in its place.

```js
import { LitElement, html } from 'lit';
import { LightRenderMixin } from '@lion/ui/core.js';

class MyAccessibleControl extends LightRenderMixin(LitElement) {
  static properties = { label: { type: String } };

  get slots() {
    return [
      { name: 'input', template: this.renderInput },
      { name: 'label', template: this.renderLabel },
    ];
  }

  render() {
    return html`<div class="wrapper">${this.renderInput()}${this.renderLabel()}</div>`;
  }

  renderInput() {
    return html`<input />`;
  }

  renderLabel() {
    return html`<label>${this.label}</label>`;
  }
}
```

The rendered result is:

```html
<my-accessible-control>
  <!--_start_slot_input_--><input
    slot="input"
  /><!--_end_slot_input_--><!--_start_slot_label_--><label slot="label">My label</label
  ><!--_end_slot_label_-->
  #shadow-root
  <div class="wrapper">
    <slot name="input"></slot>
    <slot name="label"></slot>
  </div>
</my-accessible-control>
```

Just like a shadow render, the light dom render happens on **every** update, so a reactive property
in a slot template updates as you would expect.

## What the consumer provides wins

A slot that the consumer filled in is left alone: the mixin only renders slots that are "private".
`_isPrivateSlot(slotName)` tells you whether a slot was created by the mixin or provided by the user.

## Slot templates

A template can be any function that returns a `TemplateResult`, or `undefined` to conditionally skip
a slot. Both of these work:

```js
class WithMethods extends LightRenderMixin(LitElement) {
  get slots() {
    return [{ name: 'input', template: this.renderInput }];
  }

  renderInput() {
    return html`<input />`;
  }
}

class WithFields extends LightRenderMixin(LitElement) {
  renderInput = () => html`<input />`;

  get slots() {
    return [{ name: 'input', template: this.renderInput }];
  }
}
```

`slots` has to be a getter: the host type declares it as an accessor, and a class field would
shadow the accessor that `...super.slots` composition relies on. Templates themselves can be
methods or instance fields, and are resolved when the getter runs.

## Migrating from SlotMixin

`SlotMixin` is not affected by this mixin, and existing `SlotMixin` components keep working. To move a
component over, you can keep the legacy shape while migrating: the `get slots()` map is accepted next
to the array shape, and a legacy `SlotRerenderObject` template is unwrapped.

```js
class LegacyStyle extends LightRenderMixin(LitElement) {
  get slots() {
    return { input: () => html`<input />` };
  }

  render() {
    return html`<div class="wrapper"><slot name="input"></slot></div>`;
  }
}
```

Differences to be aware of when migrating:

|                  | `SlotMixin`                                                        | `LightRenderMixin`                                                       |
| :--------------- | :----------------------------------------------------------------- | :----------------------------------------------------------------------- |
| declaration      | `get slots() { return { name: fn } }`                              | `get slots() { return [{ name, template }] }` (legacy map also accepted) |
| light dom render | once, on `connectedCallback`                                       | on every update, like a shadow render                                    |
| rerender         | only for `SlotRerenderObject` slots                                | all slot templates                                                       |
| template options | `firstRenderOnConnected`, `afterRender`, `renderAsDirectHostChild` | not supported; content is always a direct host child                     |
| marker protocol  | `_start_slot_<name>_` / `_end_slot_<name>_`                        | identical, for interop                                                   |

Do not mix `SlotMixin` and `LightRenderMixin` in one class: both would render the same slot.

Migrated so far: `LionSelectInvoker` (select-rich). Its inheritance chain contains exactly one
`SlotMixin` application (`SlotMixin(LionButton)`), which is what makes migrating a single class safe.
The components that compose their map with `...super.slots` inherit `SlotMixin` from form-core, so
they cannot be migrated one by one: the form-core class they chain into has to be migrated first, or
both mixins end up rendering the same slot.

### The legacy options we do not honour yet

`firstRenderOnConnected`, `afterRender` and `renderAsDirectHostChild` are not implemented. That is a
deliberate "not yet" rather than a decision: dropping an option is only safe when we know what it is
used for, and today we do not have that knowledge in this repo.

An internal consumer survey of Lion usage exists (anonymized: per option, how many components and call
sites use it and with what timing expectations, without product, team or customer names). It belongs
in this repo before those options are declared gone, because it decides:

- whether `firstRenderOnConnected` semantics have to survive as an option (content available before the
  first paint, and therefore a *write outside* the update cycle that the new mixin does not have), and
- whether `renderAsDirectHostChild: false` (keep the wrapper element in the light dom) still has to be
  reachable, which is the one case where the mixin's "content is always a direct host child" rule would
  have to become configurable,
- and it turns "we believe nobody uses this" into a reviewable claim instead of an assumption.

Until that data lands, migrating a component that relies on one of these options is a behaviour change,
not a refactor — say so in the PR that migrates it.

## Scoped elements

Per the spec, scoped elements are bound to the shadow root of their host. Because the content is
rendered to the light dom for the accessible relations it enables, the mixin creates its render target
in the shadow root so that scoped element registration keeps working as it does in a shadow render.