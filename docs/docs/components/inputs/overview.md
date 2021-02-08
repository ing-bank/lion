# Components >> Inputs >> Overview || 10

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

- [formatting/parsing/serializing](/docs/systems/form/formatting-and-parsing/) of view values.
- Advanced [validation](/docs/systems/form/validate/) possibilities.
- Creation of advanced user interaction scenarios via [interaction states](/docs/systems/form/interaction-states/).
- Provision of labels and help texts in an easy, declarative manner.
- accessibility out of the box.
- Advanced styling possibilities: map your own Design System to the internal HTML structure
  `Form control`s are the most fundamental building block of the Forms. They are the basis of
  both `field`s and `fieldset`s, and the `form` itself.

### Platform fields (wrappers)

- [LionInput](/docs/components/inputs/input/overview/), a wrapper for `<input>`.
- [LionTextarea](/docs/components/inputs/textarea/overview/), a wrapper for `<textarea>`.
- [LionSelect](/docs/components/inputs/select/overview/), a wrapper for `<select>`.

### Custom fields (wrappers)

Whenever a native form control doesn't exist or is not sufficient, a [custom form field](?path=/docs/forms-field-custom-fields-tutorial--page) should be created. One could think of components like:

- [LionCombobox](/docs/components/inputs/combobox/overview/), a custom implementation of a combobox.
- [LionDate](/docs/components/inputs/input-date/overview/), an alternative for `<input type="date">`.
- [LionDatepicker](/docs/components/inputs/input-datepicker/overview/), an alternative for `<input type="date">` including a calendar dropdown.
- [LionListbox](/docs/components/inputs/listbox/overview/), a custom implementation of a listbox.
- [LionInputAmount](/docs/components/inputs/input-amount/overview/), an alternative for `<input type="number">` special for amounts.
- [LionInputEmail](/docs/components/inputs/input-email/overview/), an alternative for `<input type="email">`.
- [LionInputIban](/docs/components/inputs/input-iban/overview/), an ING specific for an input with IBAN numbers.
- [LionInputRange](/docs/components/inputs/input-range/overview/), an alternative for `<input type="range">`.
- [LionInputStepper](/docs/components/inputs/input-stepper/overview/), an alternative for `<input type="number">`.
- [LionSelectRich](/docs/components/inputs/select-rich/overview/), an alternative for `<select>` with multiline options.

### Choice Input Fields

For form controls which return a `checked-state` you can use the `lion-choice-input` mixin. It is used in:

- [LionCheckbox](/docs/components/inputs/checkbox-group/overview/), a wrapper for `<input type="checkbox">`.
- LionOption, an alternative for `<option>`.
- [LionRadio](/docs/components/inputs/radio-group/overview/), a wrapper for `<input type="radio">`.
- [LionSwitch](/docs/components/interaction/switch/overview/), a custom implementation of a switch.

Which contains the following features:

- Get or set the value of the choice - `choiceValue()`.
- Get or set the modelValue (value and checked-state) of the choice - `.modelValue`.
- Pre-select an option by setting the `checked` boolean attribute.

## Fieldsets

Fieldsets are groups of fields. They can be considered fields on their own as well, since they partly share the normalized api via `FormControlMixin`. Fieldsets are the basis for:

- [LionFieldset](/docs/components/inputs/fieldset/overview/), a wrapper around multiple input fields or other fieldsets.
- [LionForm](/docs/components/inputs/form/overview/), enhances the functionality of the native `<form>` component.
- [LionCheckboxGroup](/docs/components/inputs/checkbox-group/overview/), a wrapper component for multiple checkboxes.
- [LionRadioGroup](/docs/components/inputs/radio-group/overview/), a wrapper component for multiple radio inputs.

## Other Resources

- [Model Value](/docs/systems/form/model-value/)
- [Formatting and parsing](/docs/systems/form/formatting-and-parsing/)
- [Interaction states](/docs/systems/form/interaction-states/)
- [Validation System](/docs/systems/form/validate/)
