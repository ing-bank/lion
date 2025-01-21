# How To >> Create a form ||15

Creating your own forms as an Application Developer is really simple. Only two rules need to be followed.

This guide is written for Application Developers that work with a fully styled and configured extension of Lion.
Say for instance we have a 'Wolf' extension layer with a set of styled/configured Lion form components:

- wolf-form
- wolf-fieldset
- wolf-input
- wolf-textarea
- ...and all other form components

## Two simple rules

When building a form, keep these things in mind:

- avoid shadow roots inside your form
- do not extend form components

## Avoiding shadow roots

Large or complex forms might need to be split up into multiple files. This composition could be achieved via:

- shared templates
- (web) components

In the latter case: make sure that your components don't have a shadow root.
This can be achieved in LitElement by providing the host as render root:

```js
class MySubForm extends LitElement {
  // This will make sure the component does not have a shadow root
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <wolf-fieldset name="my-fieldset">
        <wolf-input name="my-input"></wolf-input>
        <wolf-texarea name="my-texarea"></wolf-texarea>
      </wolf-fieldset>
    `;
  }
}
customElements.define('my-sub-form', MySubForm);
```

Our component can be used in our form like this:

```js
class MyForm extends LitElement {
  render() {
    return html`
      <wolf-form>
        <form>
          <my-sub-form></my-sub-form>
        </form>
      </wolf-form>
    `;
  }
}
```

> Today, rendering to light dom is the only way to [stay accessible](../../fundamentals/rationales/accessibility.md#shadow-roots-and-accessibility).

The registration mechanism relies on light dom by design: as soon as you do start to use shadow roots, you will notice that your form components won't register themselves anymore to their parents.

## Extending form components

Extending form components is not recommended for Application Developers: it should be left to the team that creates a Design System (Subclassers).
This team will add the styling and default configuration needed to make it fit the particular Design System.

With the toolbox provided by the team that creates your Design System, you should be able to build all your forms. Only if you have a really good reason, look into
[exceptional cases](#exceptional-cases) below.

### Exceptional cases

If the form component you need is still missing, you have two options:

- is it a generic primitive that should be part of Lion? Request it in [Lion discussions](https://github.com/ing-bank/lion/discussions)
- is it a non generic component that is unique to your app?
  - follow [create a custom field](./create-a-custom-field.md)
  - follow [extend a native input](./extend-a-native-input.md)

It's also possible to extend other components, like LionListbox or LionCombobox. You need to be aware that you're building on top of protected apis.
Changing/overriding functionality is only recommended if the source code in `form-core` is fully understood.
