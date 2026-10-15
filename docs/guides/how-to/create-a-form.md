---
parts:
  - How To
  - Create a form
title: 'How To: Create a form'
eleventyNavigation:
  key: 'How To: Create a form'
  order: 15
  parent: How To
  title: Create a form
---

# How To: Create a form

Creating your own forms as an Application Developer is really simple. Only two rules need to be followed.

There are two supported ways to work with lion. **Consume** lion's components directly — compose them
into your app, optionally wrapped in your own components — which is what application code normally does
and what the `lion-ui` skill documents. Or **subclass** them to give them your own tag names, branding
and styling: that path belongs to the team that builds your Design System (see
[Extending form components](#extending-form-components) below).

This guide is written for Application Developers that work with a fully styled and configured extension of Lion.
Say for instance we have a 'Wolf' extension layer with a set of styled/configured Lion form components:

- wolf-form
- wolf-fieldset
- wolf-input
- wolf-textarea
- ...and all other form components

## Two simple rules

When building a form, keep these things in mind:

- give the form and its controls one shared DOM: sub forms must not have a shadow root
- do not extend form components

## Avoiding shadow roots

Large or complex forms might need to be split up into multiple files. This composition could be achieved via:

- shared templates
- (web) components

In the latter case: make sure that your components don't have a shadow root. This can be achieved by rendering into Light DOM. The form registration mechanism relies on light dom by design: as soon as you do start to use shadow roots, you will notice that your form components won't register themselves anymore to their parents.

### The overarching component, and sub forms

A form and its controls share one DOM. The component that owns `lion-form` and the native `<form>`
element is the **overarching component**, and everything it renders inside that form lives in the same
tree:

- **the overarching component** applies `ScopedElementsMixin` and registers the lion components it
  renders in its scoped registry (`static scopedElements = { 'lion-form': LionForm, 'lion-input-iban':
LionInputIban }`). It **may** have a shadow root: it is the form's boundary, and its scoped registry —
  not global registration — is what makes the controls upgrade.
- **sub forms** - components that live _inside_ the form and carry controls - **must not** have a shadow
  root, so they stay in the same DOM as `lion-form` and `<form>`. Registration travels up the DOM, so a
  shadow root in between makes the controls inside it stop registering to their parents, and validation
  and serialization lose them silently. `createRenderRoot()` returning the host is what achieves that.

A second component also means a second template context. So when you only need to split a large form
into several files, prefer a **shared template**: a plain lit-html template function renders in the
overarching component's context, where the parent's scoped registry resolves every tag and no extra
boundary is introduced.

### Never use the `define` entrypoints

Registration goes through the **scoped registry of the host** (`ScopedElementsMixin`), never through
`@lion/ui/define/...`. A `define` entrypoint registers a tag globally on the page, which is exactly what
scoped elements exist to avoid: it opts out of the host's registry, it makes a second version of the same
tag impossible, and inside a scoped host it is unnecessary. Import the class and register it in
`static scopedElements`.

> Today, rendering to light dom is the only way to [stay accessible](../../fundamentals/rationales/accessibility.md#shadow-roots-and-accessibility).

### Example of a component that renders into Light DOM

Rendering into Light DOM can be achieved in LitElement by providing the host as render root:

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
