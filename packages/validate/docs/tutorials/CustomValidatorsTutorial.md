# Custom Validator Tutorial

Validators consist of an array in the format of `[<function>, <?params>, <?opts>]`.
They are implemented via pure functions and can be coupled to localized messages.
They should be used in conjunction with a [`Form Control`](../../../field/docs/FormFundaments.md) that implements the [`ValidateMixin`](../../).

This tutorial will show you how to build your own custom IBAN validator, including a validator factory function that makes it easy to apply and share it.

## Implement the validation logic

It's a good habit to make your validators compatible with as many locales and languages as possible.
For simplicity, this tutorial will only support Dutch and US zip codes.

As a best practice, create your validator in a new file from which it can be exported for eventual reuse.

We will start with this simple function body:

```js
export function validateIban() {
  return true;
}
```

It return a boolean, which is `true` if the value is valid.

Which value? The [modelValue](../../../field/docs/FormattingAndParsing.md) like this:

```js
export function validateIban(modelValue) {
  return /\d{5}([ \-]\d{4})?$/.test(modelValue.trim());
}
```

The above function validates IBANs for the United States ('us').

Suppose we want to support 'nl' IBANs as well.
Since our validator is a pure function, we need a parameter for it:

```js
export function validateIban(modelValue, { country } = {}) {
  const regexpes = {
    us: /\d{5}([ \-]\d{4})?$/,
    nl: /^[1-9]{1}[0-9]{3} ?[a-zA-Z]{2}$/,
  };

  return regexpes[country || 'us'].test(modelValue.trim());
}
```

## Creating a validate function

As can be read in [validate](../ValidationSystem.md), a validator applied to `.errorValidators` expects an array with a validate function, a parameters object and an additional configuration object.

It expects a function with such an interface:

```js
export function isIban(...args) {
  return {
    'my-app-isIban': validateIban(...args),
  };
}
```

`my-app-isIban` is the unique id of the validator.
The naming convention for this unique id will be explained later in this document.

## Creating a reusable factory function

But this is way easier to create a factory function which will automatically create an array for `.errorValidators`.
We recommend using this approach and from now on when saying a validator function we mean this one:

```js
export const isIbanValidator = (...factoryParams) => [
  (...params) => ({ 'my-app-isIban': isIban(...params) }),
  ...factoryParams,
];
```

Here the naming convention is `validator name` + `Validator`.
Thus, `isIbanValidator` is your validator factory function.

## Adding an error message

<!-- TODO: increase DX here and probably deprecate this approach.
Also, make it possible to reuse validators and override messages.
Consider a local approach, since namespace are just objects that can be supplied as arguments
in prebaked factory functions. There's no need for a global namespace then.
On top/better: consider a less coupled design (localization outside of validation and strings being passed
to feedback renderer) -->

Now, we want to add an error message.
For this, we need to have a bit more knowledge about how the `ValidateMixin` handles translation resources.

As can be read in [validate](../../), the `ValidateMixin` considers all namespaces configured via `get loadNamespaces`.
By default, this contains at least the `lion-validate` namespace which is added by the `ValidateMixin`.
On top of this, for every namespace found, it adds an extra `{namespace}-{validatorUniqueId}` namespace.
Let's assume we apply our validator on a regular `<lion-input>`.
If our `validatorUniqueId` was `isIban`, that would mean on validation these two namespaces are considered, and in this order:

- lion-validate+isIban
- lion-validate

One should be aware that localize namespaces are defined in a global scope.
Therefore the approach above would only work fine when the IBAN validator would be part of the core code base ([validate](../../)).

As long as validators are part of an application, we need to avoid global namespace clashes.
Therefore, we recommend to prefix the application name, like this: `my-app-isIban`.

The resulting `lion-validate+my-app-isIban` namespace is now guaranteed to be unique.

In order for the localization data to be found, the translation files need to be added to the manager of [localize](../../../localize/).
The recommended way to do this (inside your `validators.js` file):

```js
localize.loadNamespace({
  'lion-validate+my-app-isIban': locale => {
    return import(`./translations/${locale}.js`);
  },
});
```

In (for instance) `./translations/en.js`, we will see:

```js
export default {
  error: {
    'my-app-isIban':
      'Please enter a(n) valid {validatorParams.country} IBAN number for {fieldName}.',
  },
  warning: {
    'my-app-isIban':
      'Please enter a(n) valid {validatorParams.country} IBAN number for {fieldName}.',
  },
};
```

<!-- TODO: use error messages for warning validators as backup, so they can be omitted for almost all use cases -->

`validatorParams` is the second argument passed to the validator.
In this case this is the object `{ country: '%value%' }` where `%value%` is the one passed by an app developer.

## Conclusion

We are now good to go to reuse our validator in external contexts.
After importing it, using the validator would be as easy as this:

```html
<validatable-el .errorValidators="${[isIbanValidator({ country: 'nl' })]}"></validatable-el>
```
