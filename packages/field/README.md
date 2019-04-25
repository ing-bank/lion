# Form Fundaments

[//]: # (AUTO INSERT HEADER PREPUBLISH)

Fields are the most fundamental building block of the Form System. They are the basis of
both `field`s and `fieldset`s.

## What are fields?
Fields are the actual form controls the end user interacts with.
They extend the `LionField` class, which on its turn uses the `FormControlMixin`.
Fields provide a normalized, predictable API for platform components and customly made form controls.
On top of this, they feature:
- data synchronization with models
- formatting of view values
- advanced validation possibilities
- creation of advanced user interaction scenarios via `interaction states`
- provision of labels, help texts in an easy, declaritive manner
- better focus management
- accessibility out of the box
- advanced styling possibilities: map your own Design System to the internal HTML structure

### Platform wrappers
- `LionInput`, a wrapper for `<input>`
- `LionTextarea`, a wrapper for `<textarea>`
- `LionSelect`, a wrapper for `<select>`

### Custom wrappers
Whenever a native form control doesn't exist or is not sufficient, a custom form control should
be created. One could think of components like:
- slider
- combobox
- autocomplete
- etc...

## What are fieldsets?
Fieldsets are groups of fields. They can be considered fields on their own as well, since they
partly share the normalized api via `FormControlMixin`.
Fieldsets are the basis for:
- `LionFieldset`
- `LionForm`
- `LionRadioGroup`
- `LionCheckboxGroup`


# Other Resources
- `FormControlMixin` (TODO: document)
- `LionField` (TODO: document)
- [`Model values`](./docs/modelValue.md)
- [`FormatMixin`](./docs/FormatMixin.md)
- `InteractionStateMixin` (TODO: document)
- `ValidateMixin` (TODO: document)
- `FocusMixin` (TODO: document)
- `FieldCustomMixin` (TODO: document)
