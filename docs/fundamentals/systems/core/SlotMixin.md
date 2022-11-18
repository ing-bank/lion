# Systems >> Core >> SlotMixin ||20

The SlotMixin is made for solving accessibility challenges that inherently come with the usage of shadow dom.
Until [AOM](https://wicg.github.io/aom/explainer.html) is in place, it is not possible to create relations between different shadow doms.
The need for this can occur in the following situations:

- A user-defined slot. For instance:

```html
<my-input>
  <div slot="help-text">Input description</div>
</my-input>
```

The help text here needs to be connected to the input element that may live in shadow dom. The input needs to have `aria-describedby="help-text-id".`

- An interplay of multiple nested web components. For instance:

```html
<my-fieldset>
  <my-input><input aria-describedby="parent-msg" /></my-input>
  <my-input><input aria-describedby="parent-msg" /></my-input>
  <div id="parent-msg">Group errror message</div>
</my-fieldset>
```

In the case above, all inputs need to be able to refer the error message of their parent.

**In a nutshell**: SlotMixin helps you with everything related to rendering light dom (i.e. rendering to slots).
You can build accessible ui components with ease, while delegating all edge cases to SlotMixin.

Edge cases that SlotMixin solves:

- **mediates** between light dom provided by the user ('public slots') and light dom provided by the component author ('private slots').
- allows to hook into the reactive update loop of LitElement (**rerendering** on property changes)
- respects the **scoped registry** belonging to the shadow root.

## The api

So, what does the api look like? SlotMixin can be used like this:

```js
class MyAccessibleControl extends SlotMixin(LitElement) {
  get slots() {
    return {
      ...super.slots,
      'public-element-slot': () => document.createElement('input'),
      '_private-template-slot': () => html`<wc-rendered-to-light-dom></wc-rendered-to-light-dom>`,
    };
  }
}
```

## SlotFunctionResults

The `SlotFunctionResult` is the output of the functions provided in `get slots()`. It can output these four types, which are explained in detail below:

```ts
Element | TemplateResult | SlotRerenderObject | undefined;
```

Below configuration gives an example of all of them, after which we explain when each type should be used

```js
class MyAccessibleControl extends SlotMixin(LitElement) {
 get slots() {
   return {
     ...super.slots,
     // Element
     'public-element-slot': () => document.createElement('input'),
     // TemplateResult
     '_private-template-slot': () => html`<wc-rendered-to-light-dom></wc-rendered-to-light-dom>`,
     // SlotRerenderObject
     'rerenderable-slot': () => {
       return {
         template: html`<w-c>${this.litProperty}</w-c>`,
         afterRender: () => { /** sync some state */ },
       }
     },
     // undefined (conditional slot)
     '' => () => {
        if (conditionApplies) {
          return html`<div>default slot</div>`;
        }
        return undefined;
      },
   };
 }
}
```

### Element

For simple cases, an element can be returned. Use this when no web component is needed.

### TemplateResult

Return a TemplateResult when you need web components in your light dom. They will be automatically scoped correctly (to the scoped registry belonging to your shadowRoot)
If your template needs to rerender as well, use a `SlotRerenderObject`.

### SlotRerenderObject

A `SlotRerenderObject` looks like this:

```ts
{
 template: TemplateResult;
 afterRender?: Function;
};
```

It is meant for complex templates that need rerenders. Normally - when rendering into shadow dom via `LitElement.render` - we get rerenders
"for free" via [property effects](https://lit.dev/docs/components/properties/#when-properties-change).
When we configure `SlotFunctionResult` to return a `SlotRerenderObject`, we get the same behavior for light dom.
For this rerendering to work predictably (no focus and other interaction issues), the slot will be created with a wrapper div.

### Undefined

Whether the slot should be rendered can be dependent on a global or instance configuration.
When `undefined` or nothing (implicitly `undefined`) is returned, SlotMixin will not render the slot

```js
if (this.conditionApplies) {
  // Here we can return `Element | TemplateResult | SlotRerenderObject`
  return html`<div>default slot</div>`;
}
return undefined;
```

## Private and public slots

Some elements provide a property/attribute api with a fallback to content projection as a means to provide more advanced html.
For instance, a simple text label is provided like this:

```html
<my-input label="My label"></my-input>
```

A more advanced label (using html that can't be provided via a string) can be provided like this:

```html
<my-input>
  <label slot="label"><my-icon aria-hidden="true"></my-icon>My label</label>
</my-input>
```

In the property/attribute case, SlotMixin adds the `<label slot="label">` under the hood, **unless** the developer already provided the slot.
This will make sure that the slot provided by the user always takes precedence and only one slot instance will be available in light dom per slot.

### Default slot

As can be seen in the example of [SlotFunctionResults](#slotfunctionresults), '' can be used to add content to the default slot
