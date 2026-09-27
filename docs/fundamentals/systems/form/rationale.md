---
parts:
  - Rationale
  - Form
  - Systems
title: 'Form: Rationale and Provenance'
eleventyNavigation:
  key: Systems >> Form >> Rationale
  title: Rationale
  order: 5
  parent: Systems >> Form
---

# Form: Rationale and Provenance

This page explains **why** the Form System exists, where it came from, and what it buys an
application that no framework-native form library can. It is the "opinions you are buying
into" page — read it before the [Overview](./overview.md).

## Where we came from: the Polymer era

Form behaviour used to live **inside every individual component, scattered across different
repositories**. Each element reimplemented, on its own:

- reading and writing a value (a raw, stringly-typed string — there was no notion of a typed
  `modelValue`);
- validation and its error messages;
- formatting/parsing (if at all) — ad hoc, per component;
- label/help-text/feedback wiring and, where it existed, ARIA wiring.

The cost was not one bad component — it was **distribution**. The same concerns were
reimplemented, and drifted, in repository after repository. That produced two compounding
problems:

- **Maintenance was multiplied.** A single UX fix (a validation message, an ARIA attribute)
  had to be found and applied in N places, and the copies diverged as they aged.
- **Consumers could not rely on a shared contract.** Every integration learned a *different
  dialect* — different value semantics, different events, different error shapes — so
  composing a form meant copy-paste, and "alignment" between teams was a manual, per-project
  effort instead of a property of the system.

The Form System fixes this by centralising the concerns **once**, in a small set of mixins,
so every control — platform-wrapped or fully custom — shares one contract. Fix it once; every
form in every application inherits it.

## What it buys you: the three ideas that make it different

1. **`modelValue` as the single source of truth, with a real value pipeline.**
   Not a string. The pipeline is
   `preprocessor → parser → modelValue → formatter → serializer`, and it has a first-class
   concept for "the user typed something we cannot interpret":
   [Unparseable](./formatting-and-parsing.md). Validation, interaction state and visibility
   are all *derived* from `modelValue`. This is the part competitors do **not** have: Formik,
   TanStack Form, React Hook Form and Formily all operate on primitive values you format
   yourself, per field, per app.

2. **A normalized `FormControl` API, so a group *is* a field.**
   `FormControlMixin` gives fields, fieldsets, choice groups and the form itself the same
   surface. A [fieldset](./overview.md) aggregates its children into a keyed `modelValue` /
   `serializedValue`, so it can be validated, reset and serialized as a unit — and composed
   recursively. Mixed, deeply nested forms work without per-component special-casing, and a
   new field gets the whole contract for free.

3. **Accessibility and validation are built at the DOM layer.**
   Label/help-text/feedback are wired (`aria-labelledby` / `aria-describedby`, with DOM-order
   correction), `aria-invalid` / `aria-required` are maintained, and feedback announces via
   `aria-live` (polite on focus, assertive on blur). Because it lives in the element — not in
   a framework adapter — it behaves identically in every framework and inside shadow roots.

The payoff: **one component, one contract, one place to fix it — usable from any framework
and testable without one.**

## Framework-free — and honest about the layers

"Framework-free" means something different at each layer, and we would rather state it
precisely than sell a slogan:

| Layer | Examples | Coupling |
| :--- | :--- | :--- |
| **Consumers** | app code using `<lion-input>` | **none** — a tag name, properties, DOM events. Works in Angular, React, Vue, Svelte or plain HTML. |
| **Element base** | `LionField`, `LionFieldset`, and the `FormControlMixin` render chain | **Lit** — this is the element you extend. You get Lit as a *transitive* dependency of the element; you never add it to your application, and it dictates nothing about the rest of your app. |
| **Core logic mixins** | `ValidateMixin`, `FormatMixin`, `InteractionStateMixin`, `FormRegistering/RegistrarMixin` | **Lit's *lifecycle*, not its templating.** They rely on `ReactiveElement` property/update semantics but add no rendering of their own. |

The accurate claim is therefore: **a framework-agnostic consumer surface, on a Lit-based
element base.** Two clarifications we want to be explicit about:

- We do **not** claim the mixins are "pure platform code with no Lit". They depend on Lit's
  reactive lifecycle. What is true is that **you don't import Lit to use them** — you extend
  `LionField` (or use the custom element), and Lit arrives with it.
- Because the logic mixins carry no rendering, the system is **composable**: you can adopt the
  value pipeline, or the validation, or the grouping, without taking the rest.

## How this compares

| System | Where the freedom lives | Value pipeline | A11y built in | Native form integration |
| :--- | :--- | :--- | :--- | :--- |
| Formik | nowhere (React-only) | ✗ | ✗ | ✗ |
| Angular Reactive Forms | nowhere | via CVA | ✗ | own `FormGroup` |
| TanStack Form | state/validation (headless) | ✗ (primitive values) | ✗ | ✗ |
| Formily | schema/state | transformers | ✗ | ✗ |
| Web Awesome / FAST / MWC | component layer | partial | partial | `ElementInternals` |
| **Lion Form System** | **the DOM/rendering layer** | **✓ (+ `Unparseable`)** | **✓** | ✗ (custom events — see [Roadmap](./roadmap.md)) |

Everyone else puts the freedom in *logic* and re-implements the UI per framework. Lion puts
it in the **component itself**: the same `<lion-input>`, with internationalized validation
and caret-aware formatting, is the same artifact in Angular, React and Vue.

See [Roadmap and known limitations](./roadmap.md) for the gaps we know about and how we intend
to close them without breaking the public API.
