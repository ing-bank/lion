# Guides ||30

Lion is a set of white label Web Components that can be extended to your own styled layer of components.

We know from experience that making high quality, accessible UI components is hard and time consuming: it takes many iterations, a lot of development time and a lot of testing to get a generic component that works in every context, supports many edge cases and is accessible in all relevant screen readers.

Lion aims to do the heavy lifting for you. This means you only have to apply your own Design System: by delivering styles, configuring components and adding a minimal set of custom logic on top.

## Consuming Developer

Developers consuming our web components inside an application (not extending them).
`Application Developers` are only allowed to interact with `public` properties and methods.
Can be abbreviated as `AD`. Sometimes also called `Consuming Developer`.

- [Definitions and Terms](./principles/definitions-and-terms.md)
- [Styling](./principles/styling.md)
- [Scoped Elements](./principles/scoped-elements.md)

## Extending Developer

Developers extending our web components, for instance: `class MaterialInput extends LionInput` are called `subclassers`. Subclassers have access to protected methods (prefixed with an underscore or marked as protected), but not to private methods.

Especially for subclassers we have some extra documentation:

- [Subclasser APIs](./principles/subclasser-apis.md)
- [Extend documentation](../blog/extending-documentation.md)

## How To

Next to that we have some specific "How To" documentations.

- [Get started](./how-to/get-started.md)
- [Create a custom field](./how-to/create-a-custom-field.md)
- [Extend a native input](./how-to/extend-a-native-input.md)
