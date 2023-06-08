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

To get started with consuming lion's UI components install package `@lion/ui` as follows:

```bash
npm i @lion/ui
```

You can install lion's ajax package with:

```bash
npm i @lion/ajax
```

You can install lion's singleton-manager package with:

```bash
npm i --save singleton-manager
```

### Extend a Web Component

**This is the main use case for lion**. To import component classes, and extend them for your own design system's components.

```js
import { css } from 'lit';
import { LionInput } from '@lion/ui/input.js';

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

  ajax
    .fetch('data.json')
    .then(response => response.json())
    .then(data => {
      // do something with the data
    });
</script>
```

### Use a Web Component

You can also use the lion elements directly, although this is likely not a common use case.

```html
<script type="module">
  import '@lion/ui/define/lion-input.js';
</script>

<lion-input name="firstName" label="First name"></lion-input>
```

### Code Completion for VS Code

The @lion/ui package includes a file named vscode.html-custom-data.json that allows you to define custom elements to be recognized by Visual Studio Code. This enables code completion for @lion/ui components. To activate this feature, follow these steps after having installed `@lion/ui`:

1. Navigate to the root of your project
2. Add the following to root level of object in file `.vscode/settings.json` (create file if it doesn't exist):

```json
  "html.customData": ["./node_modules/@lion/ui/vscode.html-custom-data.json"]
```

3. Restart your Visual Studio Code for the changes to take effect.
