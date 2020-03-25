[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Form Fundaments

```js script
export default {
  title: 'Forms/Field/Overview',
};
```

`Form control`s are the most fundamental building block of the Forms. They are the basis of
both `field`s and `fieldset`s, and the `form` itself.

## Fields

Fields are the actual form controls the end user interacts with.
They extend the `Field` class, which on its turn uses the `FormControlMixin`.
Fields provide a normalized, predictable API for platform components and custom made form controls.
On top of this, they feature:

- data synchronization with models
- formatting of view values
- advanced validation possibilities
- creation of advanced user interaction scenarios via `interaction states`
- provision of labels and help texts in an easy, declarative manner
- better focus management
- accessibility out of the box
- advanced styling possibilities: map your own Design System to the internal HTML structure

### Platform fields (wrappers)

- [LionInput](?path=/docs/forms-input--main), a wrapper for `<input>`
- [LionTextarea](?path=/docs/forms-textarea--main), a wrapper for `<textarea>`
- [LionSelect](?path=/docs/forms-select--main), a wrapper for `<select>`
- [LionRadio](?path=/docs/forms-radio-group--main), a wrapper for `<input type="radio">`
- [LionCheckbox](?path=/docs/forms-checkbox-group--main), a wrapper for `<input type="checkbox">`

### Custom fields (wrappers)

Whenever a native form control doesn't exist or is not sufficient, a [custom form field](?path=/docs/forms-field-custom-fields-tutorial--page) should be created. One could think of components like:

- slider
- combobox
- autocomplete
- etc...

## Fieldsets

Fieldsets are groups of fields. They can be considered fields on their own as well, since they
partly share the normalized api via `FormControlMixin`.
Fieldsets are the basis for:

- [LionFieldset](?path=/docs/forms-fieldset-overview--main)
- [LionForm](?path=/docs/forms-form-overview--main)
- [LionRadioGroup](?path=/docs/forms-radio-group--main)
- [LionCheckboxGroup](?path=/docs/forms-checkbox-group--main)

## Other Resources

- [Form fundamentals](?path=/docs/forms-field-fundaments--page)
- [Formatting and parsing](?path=/docs/forms-field-formatting-and-parsing--page)
- [Custom Fields](?path=/docs/forms-field-custom-fields-tutorial--page)
