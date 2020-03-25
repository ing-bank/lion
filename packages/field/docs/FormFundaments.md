[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Form Fundaments

```js script
export default {
  title: 'Forms/Field/Fundaments',
};
```

`Form control`s are the most fundamental building block of the Forms. They are the basis of
both `field`s and `fieldset`s, and the `form` itself.

## Fields

Fields are the actual form controls the end user interacts with.
They extend the `Field`(), which on its turn uses the `FormControlMixin`.
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

- [`LionInput`](../../input/), a wrapper for `<input>`
- [`LionTextarea`](../../textarea/), a wrapper for `<textarea>`
- [`LionSelect`](../../select/), a wrapper for `<select>`
- [`LionRadio`](../../radio/), a wrapper for `<input type="radio">`
- [`LionCheckbox`](../../checkbox/), a wrapper for `<input type="checkbox">`

### Custom fields (wrappers)

Whenever a native form control doesn't exist or is not sufficient, a custom form control should
be created. One could think of components like:

- slider
- combobox
- autocomplete
- etc...

## Fieldsets

Fieldsets are groups of fields. They can be considered fields on their own as well, since they
partly share the normalized api via `FormControlMixin`.
Fieldsets are the basis for:

- [`LionFieldset`](../../fieldset/)
- [`LionForm`](../../form/)
- [`LionRadioGroup`](../../radio-group/)
- [`LionCheckboxGroup`](../../checkbox-group/)

## Other Resources

- [Model Value](./modelValue.md)
- [Formatting and parsing](./FormattingAndParsing.md)
- [Interaction states](./InteractionStates.md)
- [Validation System](../../validate/docs/ValidationSystem.md)
- [FieldCustomMixin](./FieldCustomMixin.md)
