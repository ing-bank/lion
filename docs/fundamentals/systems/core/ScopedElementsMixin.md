---
parts:
  - ScopedElementsMixin
  - Core
  - Systems
title: 'Core: ScopedElementsMixin'
eleventyNavigation:
  key: Systems >> Core >> ScopedElementsMixin
  title: ScopedElementsMixin
  order: 30
  parent: Systems >> Core
---

# Core: ScopedElementsMixin

`ScopedElementsMixin` gives a component its own custom element registry, so the elements it renders
are resolved from _that_ registry instead of the global one. This is the default assumption for
`@lion/ui` usage: a usage example is rendered inside a host `LitElement` that applies the mixin.

## Why scope instead of registering globally

Global registration allows exactly one version of a tag per page. Two consumers shipping different
versions of the same component then collide, and a page cannot run two major versions side by side.
A scoped registry removes that constraint, because each host resolves the tag in its own registry.

## Usage

```js
import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionInputIban } from '@lion/ui/input-iban.js';

class MyForm extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'lion-input-iban': LionInputIban,
  };

  render() {
    return html`<lion-input-iban name="account" label="Account"></lion-input-iban>`;
  }
}
```

## Best practices

- Import the component **class** from its `@lion/ui/<name>.js` entrypoint. `scopedElements` maps a
  tag to a class; the side-effect `@lion/ui/define/lion-<name>.js` entrypoints register globally
  and give you no class to scope.
- Declare `static scopedElements` on the host. The same tag may map to different classes in
  different hosts, which is the point of scoping.
- Do **not** detect a component with `customElements.get('<tag>')`. Under a scoped registry the
  element is intentionally absent from the global registry, so that probe is always `undefined`.
  Assert on the rendered DOM, or use `instanceof` against the class you registered.
- Keep the mapping to what the host actually renders: each host instance creates a registry for the
  components it declares.
- `@open-wc/scoped-elements` uses the native scoped registry where the browser provides one and the
  `@webcomponents/scoped-custom-element-registry` polyfill otherwise. Load the polyfill once in the
  test runner for browsers without native support, as lion's own test setup does.

## Scoped elements and forms

Scoping applies to the elements a component _renders_. It does not change the light-dom requirement
for form registration: a custom form control that must register with an ancestor form still needs to
render into light dom (see the _create a form_ guide). A component that _contains_ a form needs
neither — the form and its controls share one tree, so registration works across its shadow root.
