# Validation

Our validation system is designed to:

- allow for advanced UX scenarios by updating validation state on every value change
- provide a powerful way of writing validations via pure functions

## When validation happens

Validation happens on every change of `modelValue`. A change in modelValue can be originated from
either user interaction or an imperative action from an Application Developer.
We could therefore say validation happens 'realtime'. This is aligned with the platform.

## When validation feedback will be shown

Although validation happens realtime under the hood, displaying validity feedback in realtime may
not always lead to the desired User Experience.
Together with [interaction states](../../field/docs/InteractionStates.md), validity states can determine whether
a validation message should be shown along the input field.

## Validators

All validators are provided via pure functions. They should be applied to the element implementing
`ValidateMixin` as follows:

```html
<validatable-el
  .errorValidators="${[[ myValidatorFunction, { myParam: 'foo' }, { extra: 'options' } ]]}">
</validatable-el>
```

As you can see the 'errorValidators' property expects a map (an array of arrays).
So, every Validator is an array consisting of:

- validator function
- validator parameters (optional)
- validator config (optional)

### Factory functions

A more readable and therefore recommended notation is the factory function, which is described in
detail here: [Custom Validator Tutorial](./tutorials/CustomValidatorsTutorial.md).
When we talk about validators, we usually refer to factory functions.

Below example has two validators (as factory functions) applied:

```html
<validatable-el
  .errorValidators="${[minLengthValidator({ min: 3 }), isZipCodeValidator()]}">
</validatable-el>
```

### Default Validators

By default, the validate system ships with the following validators:

- 'required'
- isStringValidator
- equalsLengthValidator, minLengthValidator, maxLengthValidator, minMaxLengthValidator
- isNumberValidator, minNumberValidator, maxNumberValidator, minMaxNumberValidator
- isDateValidator, minDateValidator, maxDateValidator, minMaxDateValidator
- isEmailValidator

As you can see, 'required' is placed in a string notation. It is the exception to the rule,
since the implementation of required is context dependent: it will be different for a regular input
than for a (multi)select and therefore not rely on one external function.

All other validators are considered self explanatory due to their explicit namings.

### Custom Validators

On top of default validators, application developers can write their own.
See [Custom Validator Tutorial](./tutorials/CustomValidatorsTutorial.md) for an example of writing a
custom validator.

### Localization

The `ValidateMixin` supports localization out of the box via the [localize system](../../localize/).
By default, all error messages are translated in the following languages (depicted by iso code):
bg, cs, de, en, es, fr, hu, it, nl, pl, ro ,ru, sk and uk.

## Asynchronous validation

By default, all validations are run synchronously. However, for instance when validation can only
take place on server level, asynchronous validation will be needed

Asynchronous validators are not yet supported. Please create a feature request if you need them in
your application: it is quite vital this will be handled inside lion-web at `FormControl` level,
in order to create the best UX and accessibility (via (audio)visual feedback.

## Types of validators

The most common use case for validation is the assessment of whether the input is in error state.
An error state would be considered blocking: it prevents a form from being submitted to the server.

However, the validation system also supports three non blocking validation feedback types. Summed
up, we have the following four types:

- **error**: blocking the field from being submitted to the server. For example:
  "Please enter an amount higher than 1000,00 euro."
- **warning**: something looks wrong, but it is not blocking. For example an optional email input:
  "Please enter a valid e-mail address in the format "name@example.com"."
- **info**: shows extra information. For example a message of a scheduled payment planner:
  "Ends on 15/05/2020 after 5 payments."
- **success**: will only be triggered if there was a Message from one of the above validation types
  and is now correct. For example: "Ok, correct."

The api for warning validators and info validators are as follows:

```html
<validatable-field
  .warningValidators="${[myWarningValidator()]}"
  .infoValidators="${[myInfoValidator()]}">
</validatable-field>
```

### Success validators

Success validators work a bit differently. Their success state is defined by the lack of a
previously existing erroneous state (which can be an error or warning state).

So, an error validator going from invalid (true) state to invalid(false) state, will trigger the
success validator. `ValidateMixin` has applied the `randomOkValidator`.

If we take a look at the translations file belonging to `ValidateMixin`:

```js
...
  success: {
    defaultOk: 'Okay',
    randomOk: 'success.defaultOk,success.correct,success.succeeded,success.ok,success.thisIsRight,success.changed,success.okCorrect',
    correct: 'Correct',
    succeeded: 'Succeeded',
    ok: 'Ok!',
    thisIsRight: 'This is right.',
    changed: 'Changed!',
    okCorrect: 'Ok, correct.',
  },
...
```

You an see that the translation message of `randomOk` references the other success translation
keys. Every time the randomOkValidator is triggered, one of those messages will be randomly
displayed.

<!-- TODO (nice to have)

## Retrieving validity states imperatively

## Difference between errorState, error, errorShow etc

## Styling hooks

## Events

-->
