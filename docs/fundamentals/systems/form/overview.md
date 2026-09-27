---
parts:
  - Overview
  - Form
  - Systems
title: 'Form: Overview'
eleventyNavigation:
  key: Systems >> Form >> Overview
  title: Overview
  order: 10
  parent: Systems >> Form
---

# Form: Overview

The Form System is a set of building blocks — `form control`s, `field`s and `fieldset`s —
that give every form element in the application **one normalized, accessible, typed contract**.
Build a form once, the same way in every app, and fix it in one place.

New here? Read [Rationale and Provenance](./rationale.md) first (why it exists and the
problem it solves), then [Roadmap and Known Limitations](./roadmap.md) (our honest gaps).

## Why you would use it

- **One contract, every control.** A `my-checkbox` and a `my-input` no longer have different
  value semantics, events or error shapes. Everything shares one API, so forming and
  composing is predictable instead of copy-paste.
- **Typed values, not strings.** `modelValue` is a real `Date`, `Number`, `Boolean` — not a
  stringly-typed string. A full `preprocessor → parser → modelValue → formatter → serializer`
  pipeline, plus a first-class [Unparseable](./formatting-and-parsing.md) for what the user
  typed but we cannot interpret. See [Model Value](./model-value.md).
- **A group *is* a field.** Fields, fieldsets, choice groups and the form share the same
  surface, so a group can be validated, reset and serialized as a unit — and composed
  recursively. Deeply nested forms need no per-component special-casing. See
  [Formatting and Parsing](./formatting-and-parsing.md) and
  [Interaction States](./interaction-states.md).
- **Validation built for real UX.** `error` / `warning` / `info` / `success`, sync and async,
  localized out of the box in ~20 locales. See [Validate](./validate.md).
- **Accessibility built in, not bolted on.** Labels, help text and feedback are wired
  (`aria-labelledby` / `aria-describedby`, with DOM-order correction), `aria-invalid` /
  `aria-required` are maintained, and feedback announces politely/assertively with focus —
  inside shadow roots too.
- **Framework-free consumers.** `<lion-input>` is usable from Angular, React, Vue, Svelte or
  plain HTML via tag name, properties and DOM events. The element base is Lit; you inherit it
  with `LionField` and never wire it up yourself. See the scope note in
  [Rationale](./rationale.md).
- **Composable by design.** The logic mixins carry no rendering, so you can adopt the value
  pipeline, the validation, or the grouping — without taking the rest.

## Building Blocks

Our Form System is built from a set of very fundamental building blocks: `form control`s,
`field`s and `fieldset`s.

### Form Controls

`Form control`s are the most fundamental building blocks of our Form System.
They are the fundament of both `field`s and `fieldset`s and provide a normalized, predictable
API throughout the whole form. Every form element inherits from `FormControlMixin`.

`FormControlMixin` creates the default HTML structure, and its accessibility is designed to be
used in conjunction with the `ValidateMixin` and the `FormatMixin`.

### Fields

Fields (think of an input, textarea, select) are the actual form controls the end user
interacts with. They extend `LionField`, which in turn uses the `FormControlMixin`. Fields
provide a normalized API for both platform components and custom-made form controls.

On top of this, they feature:

- [formatting/parsing/serializing](./formatting-and-parsing.md) of view values.
- Advanced [validation](./validate.md) possibilities.
- Creation of advanced user interaction scenarios via [interaction states](./interaction-states.md).
- Provision of labels and help texts in an easy, declarative manner.
- Accessibility out of the box.
- Advanced styling possibilities: map your own Design System to the internal HTML structure.

#### Platform fields (wrappers)

- [LionInput](../../../components/input/overview.md), a wrapper for `<input>`.
- [LionTextarea](../../../components/textarea/overview.md), a wrapper for `<textarea>`.
- [LionSelect](../../../components/select/overview.md), a wrapper for `<select>`.

#### Custom fields (wrappers)

Whenever a native form control doesn't exist or is not sufficient, a
[custom form field](../../../guides/how-to/create-a-custom-field.md) should be created. One
could think of components like:

- [LionCombobox](../../../components/combobox/overview.md), a custom implementation of a combobox.
- [LionDate](../../../components/input-date/overview.md), an alternative for `<input type="date">`.
- [LionDatepicker](../../../components/input-datepicker/overview.md), an alternative for `<input type="date">` including a calendar dropdown.
- [LionListbox](../../../components/listbox/overview.md), a custom implementation of a listbox.
- [LionInputAmount](../../../components/input-amount/overview.md), an alternative for `<input type="number">` special for amounts.
- [LionInputEmail](../../../components/input-email/overview.md), an alternative for `<input type="email">`.
- [LionInputIban](../../../components/input-iban/overview.md), an ING specific for an input with IBAN numbers.
- [LionInputRange](../../../components/input-range/overview.md), an alternative for `<input type="range">`.
- [LionInputStepper](../../../components/input-stepper/overview.md), an alternative for `<input type="number">`.
- [LionSelectRich](../../../components/select-rich/overview.md), an alternative for `<select>` with multiline options.

#### Choice Input Fields

For form controls which return a `checked-state` you can use the `lion-choice-input` mixin. It
is used in:

- [LionCheckbox](../../../components/checkbox-group/overview.md), a wrapper for `<input type="checkbox">`.
- LionOption, an alternative for `<option>`.
- [LionRadio](../../../components/radio-group/overview.md), a wrapper for `<input type="radio">`.
- [LionSwitch](../../../components/switch/overview.md), a custom implementation of a switch.

Which contains the following features:

- Get or set the value of the choice - `choiceValue`.
- Get or set the modelValue (value and checked-state) of the choice - `.modelValue`.
- Pre-select an option by setting the `checked` boolean attribute.

### Fieldsets

Fieldsets are groups of fields. They can be considered fields on their own as well, since they
share the normalized API via `FormControlMixin`. Fieldsets are the basis for:

- [LionFieldset](../../../components/fieldset/overview.md), a wrapper around multiple input fields or other fieldsets.
- [LionForm](../../../components/form/overview.md), enhances the functionality of the native `<form>` component.
- [LionCheckboxGroup](../../../components/checkbox-group/overview.md), a wrapper component for multiple checkboxes.
- [LionRadioGroup](../../../components/radio-group/overview.md), a wrapper component for multiple radio inputs.

## When this may not be what you need

- If you are on a single framework and want to stay fully inside it (e.g. React-only with an
  existing schema-validation library), a framework-native solution (React Hook Form, TanStack
  Form) may integrate with less ceremony. See [Rationale](./rationale.md) for the comparison.
- If you need native `<form>` submission / `FormData` participation *today*, read the
  [Roadmap](./roadmap.md) first: this is an active work item.

## Other Resources

- [Rationale and Provenance](./rationale.md)
- [Roadmap and Known Limitations](./roadmap.md)
- [Model Value](./model-value.md)
- [Formatting and parsing](./formatting-and-parsing.md)
- [Interaction states](./interaction-states.md)
- [Validation System](./validate.md)
