# ModelValue

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
recommended as a means of interaction.

### One single concept for internals
Internally, all derived states are computed from model-value-changed events.
Since the modelValue is computed 'realtime' and reflects all user interaction, visibility and
validation states, we can guarantee a system that enables the best User Experience
(see Interaction States).


## Unparseable modelValues
A modelValue can demand a certain type (Date, Number, Iban etc.). A correct type will always be
translatable into a String representation (the value presented to the end user) via the `formatter`.
When the type is not valid (usually as a consequence of a user typing in an invalid or incomplete
viewValue), the current truth is captured in the `Unparseable` type.
For example: a viewValue can't be parsed (for instance 'foo' when the type should be Number).

The model(value) concept as implemented in lion-web is conceptually comparable to those found in
popular frameworks like Angular and Vue.

The Unparseable type is an addition on top of this that mainly is added for the following two
purposes:
- restoring user sessions
- realtime updated with all value changes

### Restoring user sessions
As a modelValue is always a single source of truth

### Realtime updated with all value changes
As an Application Developer, you will be notified when a user tries to write the correct type of
a value. This might be handy for giving feedback to the user.

In order to check whether the input is correct, an Application Developer can do the following:

```html
<lion-input @model-value-changed="${handleChange}"></lion-input>
```

```js
function handleChange({ target: { modelValue, errorState } }) {
  if (!(modelValue instanceof Unparseable) && !errorState) {
    // do my thing
  }
}
```
