---
parts:
  - Principles
  - Scoped Elements
  - Form association
title: 'formAssociated cannot be scoped'
---

# `formAssociated` cannot be scoped

A future version of Lion wants to adopt `formAssociated` for its form components: today a form
control registers with an ancestor form through a native light-DOM `<input>`, while a form-associated
version could talk to the form through `ElementInternals` and stop needing light DOM.

The obstacle, measured: **`formAssociated` is a property of the tag name for the whole page, decided
at the tag's first definition — not of a registry.** So "one version has it, one version has not" is
representable natively, but not in a polyfilled environment.

## Both define orders

The tag (`lion-input`) is declared in two scoped registries — once as today's `LionInput`, once as a
`formAssociated` subclass of it — and each order needs its own page:

| environment                             | today's version defines first                    | form-associated version defines first |
| --------------------------------------- | ------------------------------------------------ | ------------------------------------- |
| native support                          | works                                            | works                                 |
| redesign polyfill (`v1`)                | the adopter **loses** it                         | works                                 |
| redesign + tag reserved (`v1-reserved`) | works                                            | works                                 |
| 0.x polyfill (npm today)                | the adopter **loses** it                         | today's version **wrongly gains** it  |
| no scoped registries                    | the versions collapse onto one global definition | same                                  |

Failure text from the 0.x polyfill, first order — the value published through `ElementInternals`
never reaches the form:

```
the *future* version must be form-associated, but the tag was already defined by the
version without it: {"associated":false,"error":"NotSupportedError: ... not a form-associated custom element."}
form data: [["future",""]]: expected false to equal true
```

and from the second order:

```
the *current* version must not be form-associated, but it is ({"associated":true,"form":"form"})
```

Demos: `packages/ui/components/input/test/lion-input.form-associated-scopes.demo.js` (first order) and
`...-future-first.demo.js` (second), run with `npm run demo:form-associated-scopes[:future-first]`.

## The escape hatch, and its limits

The redesign documents one: list the tag in `window.CustomElementRegistryPolyfill.formAssociated` (a
`Set`) **before** the polyfill loads. Measured, it works and it is selective — the adopting class gets
the capability, the class that has not adopted it still cannot `attachInternals`. But it is page-wide
and pre-load, so it cannot be owned by the version that needs it, and it does nothing for the 0.x
polyfill (whose stand-in claims form association for every tag anyway).

Separately: under the redesign `formAssociatedCallback` is **not** invoked even when the element is
properly form-associated (native support does invoke it). Worth reporting upstream.

## Adoption: additively, and last

The measurable bridge is to adopt `formAssociated` additively: keep publishing the value through the
mechanism that exists today (the light-DOM `<input>` the form submits) **and additionally** publish
through `ElementInternals` whenever the page really made the element form-associated. Then the _data_
contract migrates first and the _feature_ — dropping the light-DOM input — only materialises where the
capability is granted:

| mode              | form receives the value | capability granted |
| ----------------- | ----------------------- | ------------------ |
| `v1` redesign     | yes                     | no (deferred)      |
| `v1-reserved`     | yes                     | yes                |
| `v0` 0.x polyfill | yes                     | no (deferred)      |
| native support    | yes                     | yes                |

`npm run demo:form-associated-bridge` asserts the first column (normalization: `no-support` collapses,
so the bridge method is absent there and the demo drives the native input instead).

Since neither the define order nor the reserve is something a library version can own, the options for
a future major are: a **versioned tag** for the adopting version, a documented **app-level reservation**
of the tag before the polyfill loads, or waiting until the per-tag decision is scoped or fixed.
