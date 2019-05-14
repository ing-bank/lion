> ## 🛠 Status: Pilot Phase
>
> Lion Web Components are still in an early alpha stage; they should not be considered production ready yet.
>
> The goal of our pilot phase is to gather feedback from a private group of users.
> Therefore, during this phase, we kindly ask you to:
>
> - not publicly promote or link us yet: (no tweets, blog posts or other forms of communication about Lion Web Components)
> - not publicly promote or link products derived from/based on Lion Web Components
>
> As soon as Pilot Phase ends we will let you know (feel free to subscribe to this issue https://github.com/ing-bank/lion/issues/1)

# Lion Web Components

Lion web components is a set of highly performant, accessible and flexible Web Components.
They provide an unopinionated, white label layer that can be extended to your own layer of components.

## Demos

We do have a [live Storybook](http://lion-web-components.netlify.com) which shows all our components.

## How to install

```bash
npm i @lion/<package-name>
```

## Content

| Package                                     | Version                                                                                                                        | Description                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| **-- [Forms](./docs/forms.md) --**          |                                                                                                                                |                                                    |
| [checkbox](./packages/checkbox)             | [![checkbox](https://img.shields.io/npm/v/@lion/checkbox.svg)](https://www.npmjs.com/package/@lion/checkbox)                   | Checkbox form element                              |
| [checkbox-group](./packages/checkbox-group) | [![checkbox-group](https://img.shields.io/npm/v/@lion/checkbox-group.svg)](https://www.npmjs.com/package/@lion/checkbox-group) | Group of checkboxes                                |
| [field](./packages/field)                   | [![field](https://img.shields.io/npm/v/@lion/field.svg)](https://www.npmjs.com/package/@lion/field)                            | Base Class for all inputs                          |
| [form](./packages/form)                     | [![form](https://img.shields.io/npm/v/@lion/form.svg)](https://www.npmjs.com/package/@lion/form)                               | Wrapper for multiple form elements                 |
| [input](./packages/input)                   | [![input](https://img.shields.io/npm/v/@lion/input.svg)](https://www.npmjs.com/package/@lion/input)                            | Input element for strings                          |
| [input-amount](./packages/input-amount)     | [![input-amount](https://img.shields.io/npm/v/@lion/input-amount.svg)](https://www.npmjs.com/package/@lion/input-amount)       | Input element for amounts                          |
| [input-date](./packages/input-date)         | [![input-date](https://img.shields.io/npm/v/@lion/input-date.svg)](https://www.npmjs.com/package/@lion/input-date)             | Input element for dates                            |
| [input-email](./packages/input-email)       | [![input-email](https://img.shields.io/npm/v/@lion/input-email.svg)](https://www.npmjs.com/package/@lion/input-email)          | Input element for e-mails                          |
| [input-iban](./packages/input-iban)         | [![input-iban](https://img.shields.io/npm/v/@lion/input-iban.svg)](https://www.npmjs.com/package/@lion/input-iban)             | Input element for IBANs                            |
| [radio](./packages/radio)                   | [![radio](https://img.shields.io/npm/v/@lion/radio.svg)](https://www.npmjs.com/package/@lion/radio)                            | Radio from element                                 |
| [radio-group](./packages/radio-group)       | [![radio-group](https://img.shields.io/npm/v/@lion/radio-group.svg)](https://www.npmjs.com/package/@lion/radio-group)          | Group of radios                                    |
| [select](./packages/select)                 | [![select](https://img.shields.io/npm/v/@lion/select.svg)](https://www.npmjs.com/package/@lion/select)                         | Simple native dropdown element                     |
| [textarea](./packages/textarea)             | [![textarea](https://img.shields.io/npm/v/@lion/textarea.svg)](https://www.npmjs.com/package/@lion/textarea)                   | Multiline text input                               |
| [validate](./packages/validate)             | [![validate](https://img.shields.io/npm/v/@lion/validate.svg)](https://www.npmjs.com/package/@lion/validate)                   | Validation for form components                     |
| **-- [Icons](./packages/icon) --**          |                                                                                                                                |                                                    |
| [icon](./packages/icon)                     | [![icon](https://img.shields.io/npm/v/@lion/icon.svg)](https://www.npmjs.com/package/@lion/icon)                               | Display our svg icons                              |
| **-- [Localize](./packages/localize) --**   |                                                                                                                                |                                                    |
| [localize](./packages/localize)             | [![localize](https://img.shields.io/npm/v/@lion/localize.svg)](https://www.npmjs.com/package/@lion/localize)                   | Localize and translate your application/components |
| **-- [Overlays](./docs/overlays.md) --**    |                                                                                                                                |                                                    |
| [overlays](./packages/overlays)             | [![overlays](https://img.shields.io/npm/v/@lion/overlays.svg)](https://www.npmjs.com/package/@lion/overlays)                   | Overlays System using lit-html for rendering       |
| [popup](./packages/popup)                   | [![popup](https://img.shields.io/npm/v/@lion/popup.svg)](https://www.npmjs.com/package/@lion/popup)                            | Popup element                                      |
| [tooltip](./packages/tooltip)               | [![tooltip](https://img.shields.io/npm/v/@lion/tooltip.svg)](https://www.npmjs.com/package/@lion/tooltip)                      | Popup element                                      |
| **-- [Steps](./packages/steps) --**         |                                                                                                                                |                                                    |
| [steps](./packages/steps)                   | [![steps](https://img.shields.io/npm/v/@lion/steps.svg)](https://www.npmjs.com/package/@lion/steps)                            | Multi Step System                                  |
| **-- Individual Packages --**               |                                                                                                                                |                                                    |
| [core](./packages/core)                     | [![core](https://img.shields.io/npm/v/@lion/core.svg)](https://www.npmjs.com/package/@lion/core)                               | Core System (exports LitElement, lit-html)         |
| [ajax](./packages/ajax)                     | [![ajax](https://img.shields.io/npm/v/@lion/ajax.svg)](https://www.npmjs.com/package/@lion/ajax)                               | Fetching data via ajax request                     |
| [button](./packages/button)                 | [![button](https://img.shields.io/npm/v/@lion/button.svg)](https://www.npmjs.com/package/@lion/button)                         | Button                                             |
| [calendar](./packages/calendar)             | [![calendar](https://img.shields.io/npm/v/@lion/calendar.svg)](https://www.npmjs.com/package/@lion/calendar)                   | Standalone calendar                                |

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
- [webpack](https://webpack.js.org)
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

## How to contribute

Lion Web Components are only as good as its contributions.
Read our [contribution guide](./CONTRIBUTING.md) and feel free to enhance/improve our product.

## Contact

Feel free to create a github issue for any feedback or questions you might have.
You can also find us on the Polymer slack in the [#lion](https://polymer.slack.com/messages/CJGFWJN9J/convo/CE6D9DN05-1557486154.187100/) channel.

You can join the Polymer slack by visiting [Polymer Slack Invite](https://join.slack.com/t/polymer/shared_invite/enQtNTAzNzg3NjU4ODM4LTkzZGVlOGIxMmNiMjMzZDM1YzYyMzdiYTk0YjQyOWZhZTMwN2RlNjM5ZDFmZjMxZWRjMWViMDA1MjNiYWFhZWM).

## Support and issues

As stated above "support and issues time" is currently rather limited: feel free to open a discussion.
However, we can not guarantee any response times.
