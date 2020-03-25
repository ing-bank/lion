# Lion Web Components

Lion web components is a set of highly performant, accessible and flexible Web Components.
They provide an unopinionated, white label layer that can be extended to your own layer of components.

For some more details see the [announcement blog post](https://medium.com/ing-blog/ing-open-sources-lion-a-library-for-performant-accessible-flexible-web-components-22ad165b1d3d).

[![TODOs](https://badgen.net/https/api.tickgit.com/badgen/github.comgithub.com/ing-bank/lion)](https://www.tickgit.com/browse?repo=github.com/ing-bank/lion)

## Demos

We do have a [live Storybook](http://lion-web-components.netlify.com) which shows all our components.

**Please note:** This project uses Yarn [Workspaces](https://classic.yarnpkg.com/en/docs/workspaces). If you want to run all demos locally you need to get [Yarn](https://classic.yarnpkg.com/en/docs/install) and install all depencies by executing `yarn install`.

## How to install

```bash
npm i @lion/<package-name>
```

## Content

The accessibility column indicates whether the functionality is accessible in its core. Aspects like styling and content determine actual accessibility in usage.

| Package                                         | Version                                                                                                                              | Description                                            | Accessibility              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | -------------------------- |
| **-- Buttons --**                               |                                                                                                                                      |                                                        |                            |
| [button](./packages/button)                     | [![button](https://img.shields.io/npm/v/@lion/button.svg)](https://www.npmjs.com/package/@lion/button)                               | Button                                                 | ✔️                         |
| [switch](./packages/switch)                     | [![switch](https://img.shields.io/npm/v/@lion/switch.svg)](https://www.npmjs.com/package/@lion/switch)                               | Switch                                                 | ✔️                         |
| **-- Forms --**                                 |                                                                                                                                      |                                                        |                            |
| [form](./packages/form)                         | [![form](https://img.shields.io/npm/v/@lion/form.svg)](https://www.npmjs.com/package/@lion/form)                                     | Wrapper for multiple form elements                     | ✔️                         |
| [field](./packages/field)                       | [![field](https://img.shields.io/npm/v/@lion/field.svg)](https://www.npmjs.com/package/@lion/field)                                  | Base Class for all inputs                              | ✔️                         |
| [fieldset](./packages/fieldset)                 | [![fieldset](https://img.shields.io/npm/v/@lion/fieldset.svg)](https://www.npmjs.com/package/@lion/fieldset)                         | Group for form inputs                                  | ✔️                         |
| [validate](./packages/validate)                 | [![validate](https://img.shields.io/npm/v/@lion/validate.svg)](https://www.npmjs.com/package/@lion/validate)                         | Validation for form components                         | n/a                        |
| [checkbox](./packages/checkbox)                 | [![checkbox](https://img.shields.io/npm/v/@lion/checkbox.svg)](https://www.npmjs.com/package/@lion/checkbox)                         | Checkbox form element                                  | ✔️                         |
| [checkbox-group](./packages/checkbox-group)     | [![checkbox-group](https://img.shields.io/npm/v/@lion/checkbox-group.svg)](https://www.npmjs.com/package/@lion/checkbox-group)       | Group of checkboxes                                    | ✔️                         |
| [input](./packages/input)                       | [![input](https://img.shields.io/npm/v/@lion/input.svg)](https://www.npmjs.com/package/@lion/input)                                  | Input element for strings                              | ✔️                         |
| [input-amount](./packages/input-amount)         | [![input-amount](https://img.shields.io/npm/v/@lion/input-amount.svg)](https://www.npmjs.com/package/@lion/input-amount)             | Input element for amounts                              | ✔️                         |
| [input-date](./packages/input-date)             | [![input-date](https://img.shields.io/npm/v/@lion/input-date.svg)](https://www.npmjs.com/package/@lion/input-date)                   | Input element for dates                                | ✔️                         |
| [input-datepicker](./packages/input-datepicker) | [![input-datepicker](https://img.shields.io/npm/v/@lion/input-datepicker.svg)](https://www.npmjs.com/package/@lion/input-datepicker) | Input element for dates with a datepicker              | ✔️                         |
| [input-email](./packages/input-email)           | [![input-email](https://img.shields.io/npm/v/@lion/input-email.svg)](https://www.npmjs.com/package/@lion/input-email)                | Input element for e-mails                              | ✔️                         |
| [input-iban](./packages/input-iban)             | [![input-iban](https://img.shields.io/npm/v/@lion/input-iban.svg)](https://www.npmjs.com/package/@lion/input-iban)                   | Input element for IBANs                                | ✔️                         |
| [input-range](./packages/input-range)           | [![input-range](https://img.shields.io/npm/v/@lion/input-range.svg)](https://www.npmjs.com/package/@lion/input-range)                | Input element for a range of values                    | ✔️                         |
| [radio](./packages/radio)                       | [![radio](https://img.shields.io/npm/v/@lion/radio.svg)](https://www.npmjs.com/package/@lion/radio)                                  | Radio from element                                     | ✔️                         |
| [radio-group](./packages/radio-group)           | [![radio-group](https://img.shields.io/npm/v/@lion/radio-group.svg)](https://www.npmjs.com/package/@lion/radio-group)                | Group of radios                                        | ✔️                         |
| [select](./packages/select)                     | [![select](https://img.shields.io/npm/v/@lion/select.svg)](https://www.npmjs.com/package/@lion/select)                               | Simple native dropdown element                         | ✔️                         |
| [textarea](./packages/textarea)                 | [![textarea](https://img.shields.io/npm/v/@lion/textarea.svg)](https://www.npmjs.com/package/@lion/textarea)                         | Multiline text input                                   | ✔️                         |
| **-- Overlays --**                              |                                                                                                                                      |                                                        |                            |
| [overlays](./packages/overlays)                 | [![overlays](https://img.shields.io/npm/v/@lion/overlays.svg)](https://www.npmjs.com/package/@lion/overlays)                         | Overlay System                                         | ✔️                         |
| [dialog](./packages/dialog)                     | [![dialog](https://img.shields.io/npm/v/@lion/dialog.svg)](https://www.npmjs.com/package/@lion/dialog)                               | Dialog element                                         | ✔️                         |
| [tooltip](./packages/tooltip)                   | [![tooltip](https://img.shields.io/npm/v/@lion/tooltip.svg)](https://www.npmjs.com/package/@lion/tooltip)                            | Tooltip element                                        | [#175][i175]               |
| **-- Icons --**                                 |                                                                                                                                      |                                                        |                            |
| [icon](./packages/icon)                         | [![icon](https://img.shields.io/npm/v/@lion/icon.svg)](https://www.npmjs.com/package/@lion/icon)                                     | Display our svg icons                                  | [#173][i173], [#172][i172] |
| **-- Navigation --**                            |                                                                                                                                      |                                                        |                            |
| [steps](./packages/steps)                       | [![steps](https://img.shields.io/npm/v/@lion/steps.svg)](https://www.npmjs.com/package/@lion/steps)                                  | Multi Step System                                      | n/a                        |
| [tabs](./packages/tabs)                         | [![tBS](https://img.shields.io/npm/v/@lion/tabs.svg)](https://www.npmjs.com/package/@lion/tabs)                                      | Move between a small number of equally important views | n/a                        |
| **-- Others --**                                |                                                                                                                                      |                                                        |                            |
| [core](./packages/core)                         | [![core](https://img.shields.io/npm/v/@lion/core.svg)](https://www.npmjs.com/package/@lion/core)                                     | Core System (exports LitElement, lit-html)             | n/a                        |
| [calendar](./packages/calendar)                 | [![calendar](https://img.shields.io/npm/v/@lion/calendar.svg)](https://www.npmjs.com/package/@lion/calendar)                         | Standalone calendar                                    | [#195][i195], [#194][i194] |
| [localize](./packages/localize)                 | [![localize](https://img.shields.io/npm/v/@lion/localize.svg)](https://www.npmjs.com/package/@lion/localize)                         | Localize and translate your application/components     | n/a                        |
| [ajax](./packages/ajax)                         | [![ajax](https://img.shields.io/npm/v/@lion/ajax.svg)](https://www.npmjs.com/package/@lion/ajax)                                     | Fetching data via ajax request                         | n/a                        |

## How to use

### Use a Web Component

```html
<script type="module">
  import '@lion/input/lion-input.js';
</script>

<lion-input name="firstName"></lion-input>
```

### Use a JavaScript system

```html
<script type="module">
  import { ajax } from '@lion/ajax';

  ajax.get('data.json').then(response => {
    // most likely you will use response.data
  });
</script>
```

### Extend a Web Component

```js
import { LionInput } from '@lion/input';

class MyInput extends LionInput {}
customElements.define('my-input', MyInput);
```

## Key Features

- High Performance - Focused on great performance in all relevant browsers with a minimal number of dependencies
- Accessibility - Aimed at compliance with the WCAG 2.0 AA standard to create components that are accessible for everybody
- Flexibility - Provides solutions through Web Components and JavaScript classes which can be used, adopted and extended to fit all needs

## Technologies

Lion Web Components aims to be future proof and use well-supported proven technology. The stack we have chosen should reflect this.

- [lit-html](https://lit-html.polymer-project.org) and [lit-element](https://lit-element.polymer-project.org)
- [npm](http://npmjs.com)
- [yarn](https://yarnpkg.com)
- [open-wc](https://open-wc.org)
- [Karma](https://karma-runner.github.io)
- [Mocha](https://mochajs.org)
- [Chai](https://www.chaijs.com)
- [ESLint](https://eslint.org)
- [prettier](https://prettier.io)
- [Storybook](https://storybook.js.org)
- [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- Lots and lots of tests

## Rationale

We know from experience that making high quality, accessible UI components is hard and time consuming:
it takes many iterations, a lot of development time and a lot of testing to get a generic component that works in every
context, supports many edge cases and is accessible in all relevant screen readers.

Lion aims to do the heavy lifting for you.
This means you only have to apply your own Design System: by delivering styles, configuring components and adding a minimal set of custom logic on top.

## Coding guidlines

Check out our [coding guidelines](./docs/README.md) for more detailed information.

## How to contribute

Lion Web Components are only as good as its contributions.
Read our [contribution guide](./CONTRIBUTING.md) and feel free to enhance/improve Lion. We keep feature requests closed while we're not working on them.

## Scoped elements

The [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) provides methods for registering custom elements. One of the limitations of working with this global registry is that multiple versions of the same element cannot co-exist. This causes bottlenecks in software delivery that should be managed by the teams and complex build systems. [Scoped Custom Element Registries](https://github.com/w3c/webcomponents/issues/716) is a proposal that will solve the problem. Since this functionality won't be available (especially not cross browser) anytime soon, we've adopted [OpenWC's Scoped Elements](https://open-wc.org/scoped-element).

Whenever a lion component uses composition (meaning it uses another lion component inside), we
apply ScopedElementsMixin to make sure it uses the right version of this internal component.

```js
import { ScopedElementsMixin, LitElement, html } from '@lion/core';

import { LionInput } from '@lion/input';
import { LionButton } from '@lion/button';

class MyElement extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'lion-input': LionInput,
      'lion-button': LionButton,
    };
  }

  render() {
    return html`
      <lion-input label="Greeting" name="greeting" .modelValue=${'Hello world'}></lion-input>
      <lion-button>Save</lion-button>
    `;
  }
}
```

### Query selectors

Since Scoped Elements changes tagnames under the hood, a tagname querySelector should be written
like this:

```js
this.querySelector(this.constructor.getScopedTagName('lion-input'));
```

### CSS selectors

Avoid tagname css selectors (we already avoid query selectors internally in lion, but just be aware
that a selector like `lion-input {...}` will stop working ).

### Edge cases

Sometimes we need to render parts of a template to light dom for [accessibility](https://wicg.github.io/aom/explainer.html). For instance we render a node via lit-html that we append to the host element, so
it gets slotted in the right position.
In this case, we should also make sure that we also scope the rendered element.

We can do this as follows:

```js
_myLightTemplate() {
  return html`
    This template may be overridden by a Subclasser.
    Even I don't end up in shadow root, I need to be scoped to constructor.scopedElements as well.
    <div>
      <lion-button>True</lion-button>
      <lion-input label="xyz"></lion-input>
    </div>
  `;
}

__getLightDomNode() {
  const renderParent = document.createElement('div');
  this.constructor.render(this._myLightTemplate(), renderParent, {
    scopeName: this.localName,
    eventContext: this,
  });
  // this node will be appended to the host
  return renderParent.firstElementChild;
}

connectedCallback() {
  super.connectedCallback();
  this.appendChild(this.__getLightDomNode());
}
```

In a less complex case, we might just want to add a child node to the dom.

```js
import { ScopedElementsMixin, LitElement } from '@lion/core';

...

__getLightDomNode() {
  return document.createElement(this.constructor.getScopedTagName('lion-input'));
}
```

We encourage you to have a look at [OpenWC's Scoped elements](https://open-wc.org/scoped-elements).

## Contact

Feel free to create a github issue for any feedback or questions you might have.
You can also find us on the Polymer slack in the [#lion](https://polymer.slack.com/messages/CJGFWJN9J/convo/CE6D9DN05-1557486154.187100/) channel.

You can join the Polymer slack by visiting [https://www.polymer-project.org/slack-invite](https://www.polymer-project.org/slack-invite).

## Support and issues

As stated above "support and issues time" is currently rather limited: feel free to open a discussion.
However, we can not guarantee any response times.

[i172]: https://github.com/ing-bank/lion/issues/172
[i173]: https://github.com/ing-bank/lion/issues/173
[i175]: https://github.com/ing-bank/lion/issues/175
[i194]: https://github.com/ing-bank/lion/issues/194
[i195]: https://github.com/ing-bank/lion/issues/195
