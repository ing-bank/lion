# Lion Web Components

```js script
export default {
  title: 'Intro/Lion Web Components',
};
```

Lion web components is a set of highly performant, accessible and flexible Web Components.
They provide an unopinionated, white label layer that can be extended to your own layer of components.

For some more details see the [announcement blog post](https://medium.com/ing-blog/ing-open-sources-lion-a-library-for-performant-accessible-flexible-web-components-22ad165b1d3d).

[![TODOs](https://badgen.net/https/api.tickgit.com/badgen/github.comgithub.com/ing-bank/lion)](https://www.tickgit.com/browse?repo=github.com/ing-bank/lion)

## Demos

We do have a [live Storybook](http://lion-web-components.netlify.com) which shows all our components.

**Please note:** This project uses Yarn [Workspaces](https://classic.yarnpkg.com/en/docs/workspaces). If you want to run all demos locally you need to get [Yarn](https://classic.yarnpkg.com/en/docs/install) and install all depencies by executing `yarn install`.

## Features

- pure es modules
- exposes functions/classes and web components
- provides pure functionality
- fully accessible
- built to be extended

> Note: These demos may look a little bland but that is on purpose. They only come with functional stylings.
> This makes sense as the main use case is to extend those components and if you do you do not want to override existing stylings.

## Systems

Lion web components is logically organized in groups of systems.

| System                                           | Description                                                                                                                                           |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Forms](?path=/docs/forms-intro--page)           | A system that lets you make complex forms with ease. Add validation, translations and use a wide range of pre made form controls.                     |
| [Buttons](?path=/docs/buttons-intro--page)       | Every application needs buttons to allow interactions. These web components bring common UX patterns while still full integrated with (native) forms. |
| [Overlays](?path=/docs/overlays-intro--page)     | If something needs to overlay content this is your place. Dialogs, Tooltips and a full overlay system to build more if needed                         |
| [Navigation](?path=/docs/navigation-intro--page) | Components which are used to guide users                                                                                                              |
| [Localize](?path=/docs/localize-intro--page)     | Localize text, numbers, dates and a way to store/fetch these data within web components                                                               |
| [Icons](?path=/docs/icons-intro--page)           | Loading and displaying icons                                                                                                                          |
| [Others](?path=/docs/others-intro--page)         | Features not fitting any other category                                                                                                               |
| [Helpers](?path=/docs/helpers-intro--page)       | Helpers to make your and your life easier                                                                                                             |

## How to install

```bash
npm i @lion/<package-name>
```

## Content

The accessibility column indicates whether the functionality is accessible in its core. Aspects like styling and content determine actual accessibility in usage.

| Package                                                               | Version                                                                                                                              | Description                                            | Accessibility              |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | -------------------------- |
| **-- Forms --**                                                       |                                                                                                                                      |                                                        | ✔️                         |
| [form](?path=/docs/forms-form-overview--page)                         | [![form](https://img.shields.io/npm/v/@lion/form.svg)](https://www.npmjs.com/package/@lion/form)                                     | Wrapper for multiple form elements                     | ✔️                         |
| [field](?path=/docs/forms-system-overview--page)                      | [![field](https://img.shields.io/npm/v/@lion/field.svg)](https://www.npmjs.com/package/@lion/field)                                  | Base Class for all inputs                              | ✔️                         |
| [fieldset](?path=/docs/forms-fieldset-overview--page)                 | [![fieldset](https://img.shields.io/npm/v/@lion/fieldset.svg)](https://www.npmjs.com/package/@lion/fieldset)                         | Group for form inputs                                  | ✔️                         |
| [validate](?path=/docs/form-system-validate-system--page)             | [![validate](https://img.shields.io/npm/v/@lion/validate.svg)](https://www.npmjs.com/package/@lion/validate)                         | Validation for form components                         | n/a                        |
| [checkbox](?path=/docs/forms-checkbox--default-story)                 | [![checkbox](https://img.shields.io/npm/v/@lion/checkbox.svg)](https://www.npmjs.com/package/@lion/checkbox)                         | Checkbox form element                                  | ✔️                         |
| [checkbox-group](?path=/docs/forms-checkbox-group--default-story)     | [![checkbox-group](https://img.shields.io/npm/v/@lion/checkbox-group.svg)](https://www.npmjs.com/package/@lion/checkbox-group)       | Group of checkboxes                                    | ✔️                         |
| [input](?path=/docs/forms-input--default-story)                       | [![input](https://img.shields.io/npm/v/@lion/input.svg)](https://www.npmjs.com/package/@lion/input)                                  | Input element for strings                              | ✔️                         |
| [input-amount](?path=/docs/forms-input-amount--default-story)         | [![input-amount](https://img.shields.io/npm/v/@lion/input-amount.svg)](https://www.npmjs.com/package/@lion/input-amount)             | Input element for amounts                              | ✔️                         |
| [input-date](?path=/docs/forms-input-date--default-story)             | [![input-date](https://img.shields.io/npm/v/@lion/input-date.svg)](https://www.npmjs.com/package/@lion/input-date)                   | Input element for dates                                | ✔️                         |
| [input-datepicker](?path=/docs/forms-input-datepicker--default-story) | [![input-datepicker](https://img.shields.io/npm/v/@lion/input-datepicker.svg)](https://www.npmjs.com/package/@lion/input-datepicker) | Input element for dates with a datepicker              | ✔️                         |
| [input-email](?path=/docs/forms-input-email--default-story)           | [![input-email](https://img.shields.io/npm/v/@lion/input-email.svg)](https://www.npmjs.com/package/@lion/input-email)                | Input element for e-mails                              | ✔️                         |
| [input-iban](?path=/docs/forms-input-iban--default-story)             | [![input-iban](https://img.shields.io/npm/v/@lion/input-iban.svg)](https://www.npmjs.com/package/@lion/input-iban)                   | Input element for IBANs                                | ✔️                         |
| [input-range](?path=/docs/forms-input-range--default-story)           | [![input-range](https://img.shields.io/npm/v/@lion/input-range.svg)](https://www.npmjs.com/package/@lion/input-range)                | Input element for a range of values                    | ✔️                         |
| [radio](?path=/docs/forms-radio--default-story)                       | [![radio](https://img.shields.io/npm/v/@lion/radio.svg)](https://www.npmjs.com/package/@lion/radio)                                  | Radio from element                                     | ✔️                         |
| [radio-group](?path=/docs/forms-radio-group--default-story)           | [![radio-group](https://img.shields.io/npm/v/@lion/radio-group.svg)](https://www.npmjs.com/package/@lion/radio-group)                | Group of radios                                        | ✔️                         |
| [select](?path=/docs/forms-select--default-story)                     | [![select](https://img.shields.io/npm/v/@lion/select.svg)](https://www.npmjs.com/package/@lion/select)                               | Simple native dropdown element                         | ✔️                         |
| [textarea](?path=/docs/forms-textarea--default-story)                 | [![textarea](https://img.shields.io/npm/v/@lion/textarea.svg)](https://www.npmjs.com/package/@lion/textarea)                         | Multiline text input                                   | ✔️                         |
| **-- Buttons --**                                                     |                                                                                                                                      |                                                        |                            |
| [button](?path=/docs/buttons-button--default-story)                   | [![button](https://img.shields.io/npm/v/@lion/button.svg)](https://www.npmjs.com/package/@lion/button)                               | Button                                                 | ✔️                         |
| [switch](?path=/docs/buttons-switch--default-off)                     | [![switch](https://img.shields.io/npm/v/@lion/switch.svg)](https://www.npmjs.com/package/@lion/switch)                               | Switch                                                 | ✔️                         |
| **-- Overlays --**                                                    |                                                                                                                                      |                                                        |                            |
| [overlays](?path=/docs/overlays-system-overview--default-story)       | [![overlays](https://img.shields.io/npm/v/@lion/overlays.svg)](https://www.npmjs.com/package/@lion/overlays)                         | Overlay System                                         | ✔️                         |
| [dialog](?path=/docs/overlays-dialog--default-story)                  | [![dialog](https://img.shields.io/npm/v/@lion/dialog.svg)](https://www.npmjs.com/package/@lion/dialog)                               | Dialog element                                         | ✔️                         |
| [tooltip](?path=/docs/overlays-tooltip--default-story)                | [![tooltip](https://img.shields.io/npm/v/@lion/tooltip.svg)](https://www.npmjs.com/package/@lion/tooltip)                            | Tooltip element                                        | [#175][i175]               |
| **-- Icons --**                                                       |                                                                                                                                      |                                                        |                            |
| [icon](?path=/docs/icons-icon--default-story)                         | [![icon](https://img.shields.io/npm/v/@lion/icon.svg)](https://www.npmjs.com/package/@lion/icon)                                     | Display our svg icons                                  | [#173][i173], [#172][i172] |
| **-- Navigation --**                                                  |                                                                                                                                      |                                                        |                            |
| [steps](?path=/docs/navigation-steps--default-story)                  | [![steps](https://img.shields.io/npm/v/@lion/steps.svg)](https://www.npmjs.com/package/@lion/steps)                                  | Multi Step System                                      | n/a                        |
| [tabs](?path=/docs/navigation-tabs--default-story)                    | [![tBS](https://img.shields.io/npm/v/@lion/tabs.svg)](https://www.npmjs.com/package/@lion/tabs)                                      | Move between a small number of equally important views | n/a                        |
| **-- Others --**                                                      |                                                                                                                                      |                                                        |                            |
| [core](?path=/docs/deep-dives-core--page)                             | [![core](https://img.shields.io/npm/v/@lion/core.svg)](https://www.npmjs.com/package/@lion/core)                                     | Core System (exports LitElement, lit-html)             | n/a                        |
| [localize](?path=/docs/localize-localize--default-story)              | [![localize](https://img.shields.io/npm/v/@lion/localize.svg)](https://www.npmjs.com/package/@lion/localize)                         | Localize and translate your application/components     | n/a                        |
| [ajax](?path=/docs/others-ajax--default-story)                        | [![ajax](https://img.shields.io/npm/v/@lion/ajax.svg)](https://www.npmjs.com/package/@lion/ajax)                                     | Fetching data via ajax request                         | n/a                        |
| [calendar](?path=/docs/calendar--default-story)                       | [![calendar](https://img.shields.io/npm/v/@lion/calendar.svg)](https://www.npmjs.com/package/@lion/calendar)                         | Standalone calendar                                    | [#195][i195], [#194][i194] |

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

## Contact

Feel free to create a github issue for any feedback or questions you might have.
You can also find us on the Polymer slack in the [#lion](https://polymer.slack.com/messages/CJGFWJN9J/convo/CE6D9DN05-1557486154.187100/) channel.

You can join the Polymer slack by visiting [https://www.polymer-project.org/slack-invite](https://www.polymer-project.org/slack-invite).

[i172]: https://github.com/ing-bank/lion/issues/172
[i173]: https://github.com/ing-bank/lion/issues/173
[i175]: https://github.com/ing-bank/lion/issues/175
[i194]: https://github.com/ing-bank/lion/issues/194
[i195]: https://github.com/ing-bank/lion/issues/195
