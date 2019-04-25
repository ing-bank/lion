# Custom Validator Tutorial

Validators consist of an array in the format of `[<function>, <?params>, <?opts>]`.
They are implemented via pure functions and can be coupled to localized messages.
They should be used in conjunction with a [`Form Control`](../../../field/docs/FormFundaments.md) that implements
the [`ValidateMixin`](../../).

This tutorial will show you how to build your own custom iban validator, including a factory
function that makes it easier to apply and share it.

## Adding a validation method

It's a good habit to make your Validator compatible with as many locales and languages as possible.
For simplicity, this tutorial will only support Dutch and US zip codes.

As a best practice, create your validator in a new file from which it can be exported for eventual
reuse.
As can be read in [`Validate`](../ValidationSystem.md), a validator applied to
`.errorValidators` expects an array with a function, a parameters object and an additional
configuration object.

First we will define the most important part, the function. We will start with the function body:

```js
export function ibanValidateFunction() {
  return {
    isIban : true;
  }
}
```

As you can see, the validator returns an object with the name, followed by an expression
determining its validity.

```js
export function ibanValidateFunction(modelValue) {
  return {
    isIban : /\d{5}([ \-]\d{4})?$/.test(modelValue.trim());
  }
}
```

The above function validates ibans for the United States ('us').
As you can see, the first parameter of a validator is always the
[`modelValue`](../../../field/docs/FormattingAndParsing.md). This is the value that our validity should depend upon.
Suppose we want to support 'nl' ibans as well. Since our validator is a pure function,
we need a parameter for it:

```js
export function ibanValidateFunction(modelValue, { country } = {}) {
  const regexes = {
    'us' : /\d{5}([ \-]\d{4})?$/,
    'nl' : /^[1-9]{1}[0-9]{3} ?[a-zA-Z]{2}$/,
  }

  return {
    isIban : regexes(country || 'us').test(modelValue.trim());
  }
}
```

## Adding an error message

<!-- TODO: increase DX here and probably deprecate this approach.
Also, make it possible to reuse validators and override messages.
Consider a local approach, since namespace are just objects that can be supplied as arguments
in prebaked factory functions. There's no need for a global namespace then.
On top/better: consider a less coupled design (localization outside of validation and strings being passed
to feedback renderer) -->

Now, we want to add an error message. For this, we need to have a bit more knowledge about how the
ValidateMixin handles translation resources.

As can be read in [Validate](../../), the `ValidateMixin` considers all namespaces
configured via `get loadNamespaces`. By default, this contains at least the `lion-validate`
namespace which is added by the `ValidateMixin`. On top of this, for every namespace found, it adds
an extra `{namespace}-{validatorName}` namespace.
Let's assume we apply our validator on a regular `<lion-input>`. That would mean on validation these
two namespaces are considered, and in this order:

* lion-validate+isIban
* lion-validate

One should be aware that localize namespaces are defined in a global scope, therefore the approach
above would only work fine when the iban validator would be part of the core code base (lion-web).

As long as validators are part of an application, we need to avoid global namespace clashes.
Therefore, we recommend to prefix the application name, like this:

```js
export function ibanValidateFunction(modelValue, { country } = {}) {
  ...
  return {
    'my-app-isIban' : regexes(country || 'us').test(modelValue.trim());
  }
}
```

The resulting `lion-validate+my-app-isIban` namespace is now guarantueed to be unique.

In order for the localization data to be found, the translation files need to be added to the
manager of [localize](../../../localize/).
The recommended way to do this (inside your `validators.js` file):

```js
localize.loadNamespace({
  'lion-validate+my-app-isIban': (locale) => {
    return import(`./translations/${locale}.js`);
  },
})
```

In (for instance) `./translations/en-GB.js`, we will see:

```js
export default {
  error: {
    'my-app-isIban': 'Please enter a(n) valid IBAN number for {fieldName}.',
  },
  warning: {
    'my-app-isIban': 'Please enter a(n) valid IBAN number for {fieldName}.',
  },
}
```
<!-- TODO: use error messages for warning validators as backup, so they can be omitted for almost all use cases -->

## Creating a factory function

Now, with help of the __validate function__, we will create the __Validator__: a factory function.

```js
export const IbanValidator = (...factoryParams) => [
  (...params) => ({ country: ibanValidateFunction(...params) }),
  ...factoryParams,
];
```

## Conclusion

We are now good to go to reuse our validator in external contexts.
After importing it, using the validator would be as easy as this:

```html
<validatable-el .errorValidators="${[IbanValidator({ country: 'nl' })]}"></validatable-el>
```
