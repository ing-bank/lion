# How To >> Get Started ||10

## Technologies Used

Lion Web Components aims to be future proof and use well-supported proven technology. The stack we have chosen should reflect this.

Checkout the documentation of our main stack.

- [lit](https://lit.dev/) - Building on top of the Web Components standards, Lit adds just what you need to be happy and productive: reactivity, declarative templates and a handful of thoughtful features to reduce boilerplate and make your job easier.
- [modern-web](https://modern-web.dev) - Guides, tools and libraries for modern web development.
- [open-wc](https://open-wc.org) - Open Web Components provides guides, tools and libraries for developing web components.

## How to get started

Make sure you have `npm`, if you don't have it yet: [get npm](https://www.npmjs.com/get-npm).

And create a repo, we suggest to use [the generator from open-wc](https://open-wc.org/docs/development/generator/):

```bash
npm init @open-wc
```

### Install lion packages

```bash
npm i @lion/<package-name>
```

### Extend a Web Component

**This is the main use case for lion**. To import component classes, and extend them for your own design system's components.

```js
import { css } from '@lion/core';
import { LionInput } from '@lion/input';

class MyInput extends LionInput {
  static get styles() {
    return [
      ...super.styles,
      css`
        /* your styles here */
      `,
    ];
  }
}
customElements.define('my-input', MyInput);
```

### Use a JavaScript system

There's a couple of "systems" in lion which have a JavaScript API. Examples are `localize`, `overlays`, `ajax`, etc.

```html
<script type="module">
  import { ajax } from '@lion/ajax';

  ajax.get('data.json').then(response => {
    // most likely you will use response.data
  });
</script>
```

### Use a Web Component

You can also use the lion elements directly, although this is likely not a common use case.

```html
<script type="module">
  import '@lion/input/lion-input.js';
</script>

<lion-input name="firstName" label="First name"></lion-input>
```
