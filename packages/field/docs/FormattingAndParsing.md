# Formatting and parsing

The `FormatMixin` keeps track of the `modelValue`, `formattedValue` and `serializedValue`.
It is designed to work in conjunction with `LionField`.

## Concepts of different values

### modelValue

The model value is the result of the parser function.
It should be considered as the internal value used for validation and reasoning/logic.
The model value is 'ready for consumption' by the outside world (think of a Date object
or a float). The modelValue can (and is recommended to) be used as both input value and
output value of the `<lion-field>`.

Examples:

- For a date input: a String '20/01/1999' will be converted to new Date('1999/01/20')
- For a number input: a formatted String '1.234,56' will be converted to a Number: 1234.56

### formattedValue

The view value is the result of the formatter function (when available).
The result will be stored in the native \_inputNode (usually an input[type=text]).

Examples:

- For a date input, this would be '20/01/1999' (dependent on locale).
- For a number input, this could be '1,234.56' (a String representation of modelValue
  1234.56).

A value will not get formatted if it is invalid, so the user won't get rewarded for a falsy input.

### serializedValue

The serialized version of the model value.
This value exists for maximal compatibility with the platform API.
The serialized value can be an interface in context where data binding is not supported
and a serialized string needs to be set.

Examples:

- For a date input, this would be the iso format of a date, e.g. '1999-01-20'.
- For a number input this would be the String representation of a float ('1234.56' instead
  of 1234.56)

When no parser is available, the value is usually the same as the formattedValue (being \_inputNode.value)

## Formatters, parsers and (de)serializers

In order to create advanced user experiences (automatically formatting a user input or an input
set imperatively by an Application Developer).

Below some concrete examples can be found of implementations of formatters and parsers,
extrapolating the example of a date input.

### Formatters

A formatter should return a `formattedValue`:

```js
function formatDate(modelValue, options) {
  if (!(modelValue instanceof Date)) {
    return options.formattedValue;
  }
  return formatDateLocalized(modelValue, options);
}
```

Note: the options object holds a fallback value that shows what should be presented on
screen when the user input resulted in an invalid modelValue

### Parsers

A parser should return a `modelValue`:

```js
function parseDate(formattedValue, options) {
  return formattedValue === '' ? undefined : parseDateLocalized(formattedValue);
}
```

Notice that when it's not possible to create a valid modelValue based on the formattedValue,
one should return `undefined`.

### Serializers and deserializers

A serializer should return a `serializedValue`:

```js
function serializeDate(modelValue, options) {
  return modelValue.toISOString();
}
```

A deserializer should return a `modelValue`:

```js
function deserializeDate(serializeValue, options) {
  return new Date(serializeValue);
}
```

## Flow diagram

The following flow diagram is based on both end user input and interaction programmed by the
developer. It shows how the 'computation loop' for modelValue, formattedValue and serializedValue
is triggered.

[Flow diagram](./formatterParserFlow.svg)
