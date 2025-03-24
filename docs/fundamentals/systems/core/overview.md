# Systems >> Core >> Overview ||10

The core package is mostly for in-depth usage.
It handles the version of `lit-element` and `lit-html`.

To be sure a compatible version is used you should import it via this package.

```js
// DO
import { LitElement, html, render } from 'lit';

// DON'T
import { LitElement, html, render } from 'lit-element';
```

## Features

- [function to deduplicate mixins (dedupeMixin)](#deduping-of-mixins)
- Mixin to handle disabled (DisabledMixin)
- Mixin to handle disabled AND tabIndex (DisabledWithTabIndexMixin)
- Mixin to manage auto-generated needed slot elements in light dom (SlotMixin)
- Mixin to create scoped styles in LightDOM-using components (ScopedStylesMixin)

> These features are not well documented - care to help out?

## Installation

```bash
npm i --save @lion/ui
```

```js
import { dedupeMixin, LitElement } from 'lit';
```

### Example

```js
const BaseMixin = dedupeMixin((superClass) => {
  return class extends superClass { ... };
});
```

## Deduping of mixins

### Why is deduping of mixins necessary?

Imagine you are developing web components and creating ES classes for Custom Elements. You have two generic mixins (let's say `M1` and `M2`) which require independently the same even more generic mixin (`BaseMixin`). `M1` and `M2` can be used independently, that means they have to inherit from `BaseMixin` also independently. But they can be also used in combination. Sometimes `M1` and `M2` are used in the same component and can mess up the inheritance chain if `BaseMixin` is applied twice.
In other words, this may happen to the protoype chain `... -> M2 -> BaseMixin -> M1 -> BaseMixin -> ...`.

An example of this may be a `LocalizeMixin` used across different components and mixins. Some mixins may need it and many components need it too and can not rely on other mixins to have it by default, so must inherit from it independently.

The more generic the mixin is, the higher the chance of being applied more than once. As a mixin author you can't control how it is used, and can't always predict it. So as a safety measure it is always recommended to create deduping mixins.

### Usage of dedupeMixin()

This is an example of how to make a conventional ES mixin deduping.

```js
const BaseMixin = dedupeMixin((superClass) => {
  return class extends superClass { ... };
});

// inherits from BaseMixin
const M1 = dedupeMixin((superClass) => {
  return class extends BaseMixin(superClass) { ... };
});

// inherits from BaseMixin
const M2 = dedupeMixin((superClass) => {
  return class extends BaseMixin(superClass) { ... };
});

// component inherits from M1
// MyCustomElement -> M1 -> BaseMixin -> BaseCustomElement;
class MyCustomElement extends M1(BaseCustomElement) { ... }

// component inherits from M2
// MyCustomElement -> M2 -> BaseMixin -> BaseCustomElement;
class MyCustomElement extends M2(BaseCustomElement) { ... }

// component inherits from both M1 and M2
// MyCustomElement -> M2 -> M1 -> BaseMixin -> BaseCustomElement;
class MyCustomElement extends M2(M1(BaseCustomElement)) { ... }
```
