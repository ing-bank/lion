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

This page explains **why** the Form System exists, where it came from, and which
problems it solves that are not solved by the frameworks we build on. It is the
"opinions you are buying into" page: read it before the [Overview](./overview.md).

## Where we came from: the Polymer era

Before the Form System, form behaviour lived **inside every individual component**.
Each field reimplemented, on its own:

- reading and writing a value (a raw string, stringly-typed — there was no notion of a
  typed `modelValue`);
- validation and error messages;
- formatting/parsing (if at all) — ad hoc, per component;
- label/help-text/feedback wiring and, where it existed, ARIA wiring.

Consequences we still pay for in the wild:

- **No normalized API.** A `my-checkbox` and a `my-input` had different value semantics,
  different events, different error shapes. Composition was copy-paste.
- **Stringly-typed values.** A date was a string; an amount was a string. Every consumer
  re-parsed, re-formatted, re-validated — inconsistently.
- **No grouping.** There was no concept of a fieldset behaving like a field, so a group of
  controls could not be validated, reset, or serialized as one unit.
- **Accessibility was best-effort and per component**, often wrong in shadow DOM.

The Form System centralizes those concerns once, in a small set of mixins, so that every
control — platform-wrapped or fully custom — shares one contract.

## The three ideas that make it different

1. **`modelValue` as the single source of truth, with a real value pipeline.**
   Not a string. The pipeline is
   `preprocessor → parser → modelValue → formatter → serializer`, and it has a first-class
   concept for "the user typed something we cannot interpret": [Unparseable](./formatting-and-parsing.md).
   Validation, interaction state and visibility are all derived from `modelValue`.
   This is the part competitors do **not** have: Formik, TanStack Form, React Hook Form and
   Formily all operate on primitive values you format yourself.

2. **A normalized `FormControl` API, so a group *is* a field.**
   `FormControlMixin` gives fields, fieldsets, choice groups and the form itself the same
   surface. A [fieldset](../form/overview.md) aggregates its children into a keyed
   `modelValue` / `serializedValue`, so it can be validated, reset and serialized as a unit
   and composed recursively. This is what makes mixed, deeply nested forms possible without
   per-component special-casing.

3. **Accessibility and validation are built at the DOM layer.**
   Label/help-text/feedback are wired (`aria-labelledby` / `aria-describedby`, with DOM-order
   correction), `aria-invalid` / `aria-required` are maintained, and feedback announces via
   `aria-live` (polite on focus, assertive on blur). Because it lives in the element, it works
   the same in every framework and inside shadow roots.

## Framework-free — and honest about the scope

There are three layers, and "framework-free" means something different for each:

| Layer | Examples | Framework coupling |
| :--- | :--- | :--- |
| **Consumers** | app code using `<lion-input>` | **none** — tag name, properties, DOM events. Works in Angular, React, Vue, Svelte, or plain HTML. |
| **Core logic mixins** | `ValidateMixin`, `FormatMixin`, `InteractionStateMixin`, `FormRegistering/RegistrarMixin` | **none** — no `lit` import; they are plain platform code and can be applied to any `HTMLElement`. |
| **Rendering mixins** | `FormControlMixin`, `LionField`, `ChoiceInputMixin`, `FormGroupMixin` | **`lit`** — they render templates (`html`/`css`). |

So the accurate claim is: **framework-agnostic consumer API and platform-only logic, with a
Lit-based rendering layer.** Lit is a dependency of the *implementation*, not of the
*semantics*: it does not dictate anything about the rest of a consumer application, and the
logic mixins can be reused without it. We deliberately do **not** claim that the rendering
layer is Lit-free; the honest story is better than the slogan.

## How this compares

| System | Where the freedom lives | Value pipeline | A11y built in | Native form integration |
| :--- | :--- | :--- | :--- | :--- |
| Formik | nowhere (React-only) | ✗ | ✗ | ✗ |
| Angular Reactive Forms | nowhere | via CVA | ✗ | own `FormGroup` |
| TanStack Form | state/validation (headless) | ✗ (primitive values) | ✗ | ✗ |
| Formily | schema/state | transformers | ✗ | ✗ |
| Web Awesome / FAST / MWC | component layer | partial | partial | `ElementInternals` |
| **Lion Form System** | **the DOM/rendering layer** | **✓ (+ `Unparseable`)** | **✓** | ✗ (custom events — see [Roadmap](./roadmap.md)) |

See [Roadmap and known limitations](./roadmap.md) for the gaps we know about and how we
intend to close them without breaking the public API.
