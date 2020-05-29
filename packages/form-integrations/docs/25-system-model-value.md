[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# ModelValue

```js script
export default {
  title: 'Forms/System/ModelValue',
};
```

The modelValue or model can be considered as the ‘aorta’ of our form system.
It is the single source of truth; not only for the current state
of the form, also for all derived states: interaction, validation, visibility and other states are
computed from a modelValue change.

## Single source of truth

ModelValues are designed to provide the Application Developer a single way of programmatical
interaction with the form for an Application Developer.

### One single concept for Application Developers

Application Developers need to only care about interacting with the modelValue on a form control
level, via:

- `.modelValue`
- `@model-value-changed`

> Internal/private concepts like viewValue, formattedValue, serializedValue are therefore not
> recommended as a means of interaction.

For more information about parsing and the Unparseable type, see [Formatting and Parsing](?path=/docs/forms-system-formatting-and-parsing--parser)
