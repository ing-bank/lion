# Systems >> Form >> ModelValue ||20

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

For more information about parsing and the Unparseable type, see [Formatting and Parsing](../../../fundamentals/systems/form/formatting-and-parsing.md)

### Event meta

`model-value-changed` events have a `detail` object, containing the following meta data:

- `isTriggeredByUser`: a boolean that determines whether a change originated
  from a user or was triggered programmatically
- `formPath`: an array of FormControls. It contains the path an event follows to go from a 'leaf
  element' (for instance a lion-input) to a top element (for instance lion-form). An example path
  could be [lionForm, lionFieldset, lionInput]
- `initialize`: whether this is the first time the event is fired (on first render of the FormControl)
