# Inputs >> Overview || 10

This page should be used as a starting point when first using the Form System.
It provides an overview of its essential building blocks and provides links to detailed explanations of most of its core concepts.

## Building Blocks

Our Form System is built from a set of very fundamental building blocks: `form control`s, `field`s and `fieldset`s.

### Form Controls

`Form control`s are the most fundamental building blocks of our Form System.
They are the fundament of both `field`s, and `fieldset`s and provide a normalized, predictable api throughout the whole form. Every form element inherits from `FormControlMixin`.

`FormControlMixin` creates the default html structure and accessibility is designed to be used in conjunction with the ValidateMixin and the FormatMixin.

## Fields

Fields (think of an input, textarea, select) are the actual form controls the end user interacts with. They extend `LionField`, which in turn uses the `FormControlMixin`. Fields provide a normalized api for both platform components and custom made form controls.

On top of this, they feature:

- [formatting/parsing/serializing](../../docs/systems/form/formatting-and-parsing.md) of view values.
- Advanced [validation](../../docs/systems/form/validate.md) possibilities.
- Creation of advanced user interaction scenarios via [interaction states](../../docs/systems/form/interaction-states.md).
- Provision of labels and help texts in an easy, declarative manner.
- accessibility out of the box.
- Advanced styling possibilities: map your own Design System to the internal HTML structure
  `Form control`s are the most fundamental building block of the Forms. They are the basis of
  both `field`s and `fieldset`s, and the `form` itself.

### Platform fields (wrappers)

- [LionInput](./input/overview.md), a wrapper for `<input>`.
- [LionTextarea](./textarea/overview.md), a wrapper for `<textarea>`.
- [LionSelect](./select/overview.md), a wrapper for `<select>`.

### Custom fields (wrappers)

Whenever a native form control doesn't exist or is not sufficient, a [custom form field](?path=/docs/forms-field-custom-fields-tutorial--page) should be created. One could think of components like:

- [LionCombobox](./combobox/overview.md), a custom implementation of a combobox.
- [LionDate](./input-date/overview.md), an alternative for `<input type="date">`.
- [LionDatepicker](./input-datepicker/overview.md), an alternative for `<input type="date">` including a calendar dropdown.
- [LionListbox](./listbox/overview.md), a custom implementation of a listbox.
- [LionInputAmount](./input-amount/overview.md), an alternative for `<input type="number">` special for amounts.
- [LionInputEmail](./input-email/overview.md), an alternative for `<input type="email">`.
- [LionInputIban](./input-iban/overview.md), an ING specific for an input with IBAN numbers.
- [LionInputRange](./input-range/overview.md), an alternative for `<input type="range">`.
- [LionInputStepper](./input-stepper/overview.md), an alternative for `<input type="number">`.
- [LionSelectRich](./select-rich/overview.md), an alternative for `<select>` with multiline options.

### Choice Input Fields

For form controls which return a `checked-state` you can use the `lion-choice-input` mixin. It is used in:

- [LionCheckbox](./checkbox-group/overview.md), a wrapper for `<input type="checkbox">`.
- LionOption, an alternative for `<option>`.
- [LionRadio](./radio-group/overview.md), a wrapper for `<input type="radio">`.
- [LionSwitch](../interaction/switch/overview.md), a custom implementation of a switch.

Which contains the following features:

- Get or set the value of the choice - `choiceValue()`.
- Get or set the modelValue (value and checked-state) of the choice - `.modelValue`.
- Pre-select an option by setting the `checked` boolean attribute.

## Fieldsets

Fieldsets are groups of fields. They can be considered fields on their own as well, since they partly share the normalized api via `FormControlMixin`. Fieldsets are the basis for:

- [LionFieldset](./fieldset/overview.md), a wrapper around multiple input fields or other fieldsets.
- [LionForm](./form/overview.md), enhances the functionality of the native `<form>` component.
- [LionCheckboxGroup](./checkbox-group/overview.md), a wrapper component for multiple checkboxes.
- [LionRadioGroup](./radio-group/overview.md), a wrapper component for multiple radio inputs.

## Other Resources

- [Model Value](../../docs/systems/form/model-value.md)
- [Formatting and parsing](../../docs/systems/form/formatting-and-parsing.md)
- [Interaction states](../../docs/systems/form/interaction-states.md)
- [Validation System](../../docs/systems/form/validate.md)
