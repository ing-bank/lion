---
parts:
  - Overview
  - Form
  - Systems
title: 'Overview'
eleventyNavigation:
  key: Systems >> Form >> Overview
  title: Overview
  order: 10
  parent: Systems >> Form
---

# Overview

This page should be used as a starting point when first using the Form System.
It provides an overview of its essential building blocks and provides links to detailed explanations of most of its core concepts.

## Compose it, or extend it?

Decide this first:

- **You want a form in your own UI** (a page that collects and submits data) — **compose** the
  documented components: write your own `LitElement`, apply `ScopedElementsMixin`, register the form and
  the controls it renders in `static scopedElements`, and render `<lion-form>` / `<lion-input>` in your
  template. Do **not** write `class MyElem extends LionForm` (or `extends LionInput`) for this — a
  subclass without a template of its own renders nothing.
- **You want to change how a form control _itself_ looks or behaves** — **extend** it. That is the
  subclassing job, which belongs to the team that builds a Design System, not to application code.

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
exports it — `@lion/ui/core.js` in particular does not. The [create a form guide](../../../guides/how-to/create-a-form.md)
covers the light-dom and registration rules a form and its controls depend on.

## Building Blocks

Our Form System is built from a set of very fundamental building blocks: `form control`s, `field`s and `fieldset`s.

### Form Controls

`Form control`s are the most fundamental building blocks of our Form System.
They are the fundament of both `field`s, and `fieldset`s and provide a normalized, predictable API throughout the whole form. Every form element inherits from `FormControlMixin`.

`FormControlMixin` creates the default html structure and accessibility is designed to be used in conjunction with the ValidateMixin and the FormatMixin.

## Fields

Fields (think of an input, textarea, select) are the actual form controls the end user interacts with. They extend `LionField`, which in turn uses the `FormControlMixin`. Fields provide a normalized API for both platform components and custom made form controls.

On top of this, they feature:

- [formatting/parsing/serializing](./formatting-and-parsing.md) of view values.
- Advanced [validation](./validate.md) possibilities.
- Creation of advanced user interaction scenarios via [interaction states](./interaction-states.md).
- Provision of labels and help texts in an easy, declarative manner.
- Accessibility out of the box.
- Advanced styling possibilities: map your own Design System to the internal HTML structure.
  `Form control`s are the most fundamental building block of the Forms. They are the basis of
  both `field`s and `fieldset`s, and the `form` itself.

### Platform fields (wrappers)

- [LionInput](../../../components/input/overview.md), a wrapper for `<input>`.
- [LionTextarea](../../../components/textarea/overview.md), a wrapper for `<textarea>`.
- [LionSelect](../../../components/select/overview.md), a wrapper for `<select>`.

### Custom fields (wrappers)

Whenever a native form control doesn't exist or is not sufficient, a [custom form field](../../../guides/how-to/create-a-custom-field.md) should be created. One could think of components like:

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

### Choice Input Fields

For form controls which return a `checked-state` you can use the `lion-choice-input` mixin. It is used in:

- [LionCheckbox](../../../components/checkbox-group/overview.md), a wrapper for `<input type="checkbox">`.
- LionOption, an alternative for `<option>`.
- [LionRadio](../../../components/radio-group/overview.md), a wrapper for `<input type="radio">`.
- [LionSwitch](../../../components/switch/overview.md), a custom implementation of a switch.

Which contains the following features:

- Get or set the value of the choice - `choiceValue()`.
- Get or set the modelValue (value and checked-state) of the choice - `.modelValue`.
- Pre-select an option by setting the `checked` boolean attribute.

## Fieldsets

Fieldsets are groups of fields. They can be considered fields on their own as well, since they partly share the normalized API via `FormControlMixin`. Fieldsets are the basis for:

- [LionFieldset](../../../components/fieldset/overview.md), a wrapper around multiple input fields or other fieldsets.
- [LionForm](../../../components/form/overview.md), enhances the functionality of the native `<form>` component.
- [LionCheckboxGroup](../../../components/checkbox-group/overview.md), a wrapper component for multiple checkboxes.
- [LionRadioGroup](../../../components/radio-group/overview.md), a wrapper component for multiple radio inputs.

## Other Resources

- [Model Value](./model-value.md)
- [Formatting and parsing](./formatting-and-parsing.md)
- [Interaction states](./interaction-states.md)
- [Validation System](./validate.md)
