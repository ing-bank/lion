---
title: Lion without polyfills
published: true
description: Lion has been a long user of the scoped registry - always requiring a polyfill - but no more. Load the polyfill only if you need it.
date: 2022-04-05
tags: [javascript, polyfills]
cover_image: /blog/images/introducing-lions-website-cover-image.jpg
---

The only reason Lion always loaded a polyfill was because of its usage of [@open-wc/scoped-elements](https://open-wc.org/docs/development/scoped-elements/). From today on this polyfill became optional.

When using [component composition](https://lit.dev/docs/composition/component-composition/) in a Lion Component we always made it very explicit which sub-components are used.
On top of that we scoped these [sub components](https://open-wc.org/docs/development/scoped-elements/) to the [current shadow root](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md) allowing multiple version to be used simultaneously.

This means that you can use a Lion Component like `lion-listbox` (which uses component composition) and never have to worry about if the internally used components clash with others you are already using.

## How does it work?

1. Within Lion classes we only import other classes (e.g. in class `MyCard` we use `MyCardHeader` via composition)
2. We define them as `scopedElements` (`my-card-header: MyCardHeader`) and let the ScopedElementsMixin handle the rest

To clarify: within Lion class files we never import files that run `customElement.define`

```js
import { LitElement, html, ScopedElementsMixin } from '@lion/core';
import { MyCardHeader } from './MyCardHeader.js';

export class MyCard extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'my-card-header': MyCardHeader,
  };

  render() {
    return html`
      <div>
        <my-card-header></my-card-header>
        <slot></slot>
      </div>
    `;
  }
}
```

## Known challenges in previous releases

The code above totally makes sense - however we always assumed that a scoped registry will be available.
Which was somewhat of a valid assumption as all our components are using the `ScopedElementsMixin` and it in turn loads a polyfill for the scoped registry.

We however over time got feedback from multiple consumers that lion components "break the app as soon as you load them".
The reasons is/was that not everyone is always using `ScopedElementsMixin` or in full control of the app (or its load order).

To quote the release notes of the latest version of `ScopedElementsMixin`:

> ScopedElementsMixin 2.x tried to be as convenient as possible by automatically loading the scoped custom elements registry polyfill.
> This however led to a fatal error whenever you registered any component before ScopedElementsMixin was used.

And this was the case.

## How do we fix it?

With the latest release of Lion we now updated to the latest version of `ScopedElementsMixin` which means Lion now works in all apps as long as there is no need for actual scoping.

To rephrase it:

> Lion works without loading any polyfills

If you extend Lion components and you imperatively create scoped custom elements, you should now use a helper function that will work in scoped and unscoped cases.

```diff
-  const myButton = this.shadowRoot.createElement('my-button');
+  const myButton = this.createScopedElement('my-button');
```

## Be explicit and stay forward compatible

Be sure to always define **ALL** the sub elements you are using in your template within your `scopedElements` property.

```js
import { LitElement, html, ScopedElementsMixin } from '@lion/core';
import { MyCardHeader } from './MyCardHeader.js';

export class MyCard extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'my-card-header': MyCardHeader,
  };

  render() {
    return html`
      <div>
        <my-card-header></my-card-header>
        <slot></slot>
        <my-card-footer></my-card-footer>
      </div>
    `;
  }
}
```

☝️ here we are missing a definition for `my-card-footer` in `scopedElements`.

This means as soon as there is support for the scoped registry (be it native of via a polyfill) this component will not be available anymore because every new scoped registry starts off empty (there is no inheritance of a global or parent registry).

Therefore **always** define all your sub elements.

## How to get scoping

You need scoping if you want to:

- use 2 major versions of a web component (e.g. in an SPA pageA uses 1.x and pageB uses 2.x of color-picker)
- use the same tag name with different implementations (use tag color-picker from foo here and from bar here)

This usually is only needed in bigger Single Page Applications.
In smaller applications or static sites (like 11ty, wordpress, ...) these tag name clashes are unlikely.

If you need scoping and the browser you are using does not support a [scoped registry](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md) yet (which is none in April 2022) then you need to install and load a polyfill first thing in your HTML.

```bash
npm i @webcomponents/scoped-custom-element-registry
```

It could look something like this:

```html
<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
```

or if you have an SPA you can load it at the top of your app shell code

```js
import '@webcomponents/scoped-custom-element-registry';
```

## Learn more

If you want to learn more please check the

- [Release blog post](https://open-wc.org/blog/scoped-elements-without-polyfill/)
- [Change log of ScopedElementsMixin](https://github.com/open-wc/open-wc/blob/master/packages/scoped-elements/CHANGELOG.md#210)
