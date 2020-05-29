[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Form System Overview

```js script
export default {
  title: 'Forms/System/Overview',
};
```

This page should be used as a starting point when first using the Form System.
It provides an overview of its essential building blocks and provides links to detailed explanations
of most of its core concepts.

## Building Blocks

Our Form System is built from a set of very fundamental building blocks: `form control`s, `field`s and `fieldset`s.

### Form Controls

`Form control`s are the most fundamental building blocks of our Form System.
They are the fundament of both `field`s, and `fieldset`s and provide a normalized, predictable api
throughout the whole form.
Every form element inherits from `FormControlMixin`.

`FormControlMixin` creates the default html structure
and accessibility is designed to be used in conjunction with the ValidateMixin and the FormatMixin.

### Fields

Fields (think of an input, texarea, select) are the actual form controls the end user interacts with.
They extend `LionField`, which in turn uses the `FormControlMixin`.
Fields provide a normalized api for both platform components and custom made form controls.
On top of this, they offer:

- [formatting/parsing/serializing](?path=/docs/forms-system-formatting-and-parsing--parser) of view values
- advanced [validation](?path=/docs/forms-validation-overview--page) possibilities
- creation of advanced user interaction scenarios via [interaction states](?path=/docs/forms-system-interaction-states--interaction-states)
- provision of labels and help texts in an easy, declarative manner
- accessibility out of the box
- advanced styling possibilities: map your own Design System to the internal HTML structure

#### Platform fields (wrappers)

Platform field wrappers add all of the functionality described above to native form elements.

- [LionInput](?path=/docs/forms-input--default-story), a wrapper for `<input>`
- [LionTextarea](?path=/docs/forms-textarea--default-story), a wrapper for `<textarea>`
- [LionSelect](?path=/docs/forms-select--default-story), a wrapper for `<select>`
- [LionRadio](?path=/docs/forms-radio-group--default-story), a wrapper for `<input type="radio">`
- [LionCheckbox](?path=/docs/forms-checkbox-group--default-story), a wrapper for `<input type="checkbox">`
- [LionInputRange](?path=/docs/forms-input-range--default-story), a wrapper for `<input type="range">`

### Dedicated fields

Dedicated fields are less generic fields in a sense that they by default expect a certain type of
modelValue. This means that they have validators, parsers and formatters preconfigured.

- [LionInputDate](?path=/docs/forms-input-date--default-story)
- [LionInputDatepicker](?path=/docs/forms-input-datepicker--default-story)
- [LionInputEmail](?path=/docs/forms-input-email--default-story)
- [LionInputAmount](?path=/docs/forms-input-amount--default-story)
- [LionInputIban](?path=/docs/forms-input-iban--default-story)

### Custom fields

Instead of wrapping native elements, this category of fields contains custom built
form elements.

- [LionSelectRich](?path=/docs/forms-select-rich--default-story), an advanced (rich) version of `<select>`

One could also think of components like:

- listbox
- combobox
- autocomplete
- etc...

For more information about writing a custom field, please see [How to write a custom field](?path=/docs/forms-system-creating-a-custom-field--page)

## Fieldsets

Fieldsets are groups of fields. They can be considered fields on their own as well, since they
partly share the normalized api via `FormControlMixin`.
Fieldsets are at the base of:

- [LionFieldset](?path=/docs/forms-fieldset-overview--page)
- [LionForm](?path=/docs/forms-form-overview--page)
- [LionRadioGroup](?path=/docs/forms-radio-group--default-story)
- [LionCheckboxGroup](?path=/docs/forms-checkbox-group--default-story)

## Other Resources

- [Model Value](?path=/docs/forms-system-modelvalue--page)
- [Formatting and parsing](?path=/docs/forms-system-formatting-and-parsing--parser)
- [Interaction states](?path=/docs/forms-system-interaction-states--interaction-states)
- [Validation System](?path=/docs/forms-validation-overview--page)
