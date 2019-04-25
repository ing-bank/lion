# Interaction States

`InteractionStateMixin` saves meta information about interaction states. It allows the
Application Developer to create advanced UX scenarios.
Examples of such scenarios are:

- show the validation message of an input only after the user has blurred the input field
- hide the validation message when an invalid value becomes valid
- show a red border around the input right after the input became invalid

The meta information that InteractionStateMixin collects, is stored in the properties:

- `touched` : the user blurred the field
- `dirty` : the value in the field has changed
- `prefilled` : a prepopulated field is non empty

## Listenening for changes

Application Developers can subscribe to the events `touched-changed` and `dirty-changed`.

## Advanced use cases

### Overriding interaction states

When creating a [custom wrapper or platform wrapper](./FormFundaments.md), it can be needed to
override the way prefilled values are 'computed'. The example below shows how this is done for
checkboxes/radio-inputs.

```js
/**
 * @override
 */
static _isPrefilled(modelValue) {
  return modelValue.checked;
}
```

## How interaction states are preconfigured

We show the validity feedback when one of the following conditions is met:

- prefilled:
The user already filled in something, or the value is prefilled
when the form is initially rendered.

- touched && dirty && !prefilled:
When a user starts typing for the first time in a field with for instance `required` validation,
error message should not be shown until a field becomes `touched` (a user leaves(blurs) a field).
When a user enters a field without altering the value (making it `dirty` but not `touched`),
an error message shouldn't be shown either.

- submitted:
If the form is submitted, always show the error message.
