<p align="center">
  <img
    width="20%"
    src="./docs/_assets/logo.svg"
    alt="Lion"
  />
  <h1 style="text-align: center;">Lion</h1>
</p>

<p align="center">
  <a href="https://github.com/modernweb-dev/rocket/actions"
    ><img
      src="https://img.shields.io/github/workflow/status/modernweb-dev/rocket/Release/main?label=workflow&style=flat-square"
      alt="GitHub Actions workflow status"
  /></a>
  <a href="https://github.com/modernweb-dev/rocket/actions"
    ><img
      src="https://img.shields.io/github/workflow/status/modernweb-dev/rocket/Release/main?label=workflow&style=flat-square"
      alt="GitHub Actions workflow status"
  /></a>
  <a href="https://www.tickgit.com/browse?repo=github.com/ing-bank/lion"
    ><img
      src="https://badgen.net/https/api.tickgit.com/badgen/github.comgithub.com/ing-bank/lion"
      alt="Todos"
  /></a>
</p>

<p align="center">
  <a href="https://lion-web.netlify.app">Website</a>
  ·
  <a href="https://lion-web.netlify.app/guides/">Guides</a>
  ·
  <a href="https://lion-web.netlify.app/components/">Components</a>
  ·
  <a href="https://lion-web.netlify.app/docs/">Documentation</a>
  ·
  <a href="https://lion-web.netlify.app/blog/">Blog</a>
</p>

**Lion is a set of highly performant, accessible and flexible Web Components.!**

They provide an unopinionated, white-label layer that can be extended to your own layer of components.

- **High Performance:** Focused on great performance in all relevant browsers with a minimal number of dependencies.
- **Accessibility:** Aimed at compliance with the WCAG 2.1 AA standard to create components that are accessible for everybody.
- **Flexibility:** Provides solutions through Web Components and JavaScript classes which can be used, adopted and extended to fit all needs.
- **Modern Code:** Lion is distributes as pure es modules.
- **Exposes functions/classes and Web Components:** Ships a functionality in it's most appropriate form.

> Note: Our demos may look a little bland but that is on purpose. They only come with functional stylings.
> This makes sense as the main use case is to extend those components and if you do you do not want to override existing stylings.

<p align="center">
  <a href="https://lion-web.netlify.app/guides/"><strong>Explore the Lion Guides&nbsp;&nbsp;▶</strong></a>
</p>

## How to install

```bash
npm i @lion/<package-name>
```

## How to use

### Extend a Web Component

**This is the main use case for lion**. To import component classes, and extend them for your own design system's components.

```js
import { css } from '@lion/core';
import { LionInput } from '@lion/input';

class MyInput extends LionInput {
  static get styles() {
    return [
      super.styles,
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
  import '@lion/input/define';
</script>

<lion-input name="firstName"></lion-input>
```

## Issues

If you encounter an issue with any of the packages we are offering please open a [new bug issue](https://github.com/ing-bank/lion/issues/new?assignees=&labels=&template=bug_report.md&title=). Be sure to include a description of the expected and the current behavior - additional adding a [reproduction](https://webcomponents.dev/edit/kpZmz1CJN580OaXsk56f?pm=1) always helps.

## Feature requests

When you have an idea on how we could improve, please check our [discussions](https://github.com/ing-bank/lion/discussions) to see if there are similar ideas or feature requests. If there are none, please [start](https://github.com/ing-bank/lion/discussions/new) your feature request as a new discussion topic. Add the title `[Feature Request] My awesome feature` and a description of what you expect from the improvement and what the use case is.

## Content

Lion web components is logically organized in groups of systems.

The accessibility column indicates whether the functionality is accessible in its core. Aspects like styling and content determine actual accessibility in usage.

| Package                                                                                                       | Version                                                                                                                                 | Description                                                                                    | Accessibility              |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------- |
| **-- [Form System](https://lion-web-components.netlify.app/?path=/docs/forms-intro--page) --**                |                                                                                                                                         | A system that lets you make complex forms with ease, including: validation, translations.      | ✔️                         |
| [combobox](https://lion-web-components.netlify.app/?path=/docs/forms-combobox-overview--main)                 | [![combobox](https://img.shields.io/npm/v/@lion/combobox.svg)](https://www.npmjs.com/package/@lion/form)                                | Text box controlling popup listbox                                                             | ✔️                         |
| [form](https://lion-web-components.netlify.app/?path=/docs/forms-form-overview--main)                         | [![form](https://img.shields.io/npm/v/@lion/form.svg)](https://www.npmjs.com/package/@lion/form)                                        | Wrapper for multiple form elements                                                             | ✔️                         |
| [form-core](https://lion-web-components.netlify.app/?path=/docs/forms-system-overview--page)                  | [![form-core](https://img.shields.io/npm/v/@lion/form-core.svg)](https://www.npmjs.com/package/@lion/form-core)                         | Core functionality for all form controls                                                       | ✔️                         |
| [form-integrations](https://lion-web-components.netlify.app/?path=/docs/forms-features-overview--main)        | [![form-integrations](https://img.shields.io/npm/v/@lion/form-integrations.svg)](https://www.npmjs.com/package/@lion/form-integrations) | Shows form elements in an integrated way                                                       | ✔️                         |
| [fieldset](https://lion-web-components.netlify.app/?path=/docs/forms-fieldset-overview--main)                 | [![fieldset](https://img.shields.io/npm/v/@lion/fieldset.svg)](https://www.npmjs.com/package/@lion/fieldset)                            | Group for form inputs                                                                          | ✔️                         |
| [checkbox-group](https://lion-web-components.netlify.app/?path=/docs/forms-checkbox-group--main)              | [![checkbox-group](https://img.shields.io/npm/v/@lion/checkbox-group.svg)](https://www.npmjs.com/package/@lion/checkbox-group)          | Group of checkboxes                                                                            | ✔️                         |
| [input](https://lion-web-components.netlify.app/?path=/docs/forms-input--main)                                | [![input](https://img.shields.io/npm/v/@lion/input.svg)](https://www.npmjs.com/package/@lion/input)                                     | Input element for strings                                                                      | ✔️                         |
| [input-amount](https://lion-web-components.netlify.app/?path=/docs/forms-input-amount--main)                  | [![input-amount](https://img.shields.io/npm/v/@lion/input-amount.svg)](https://www.npmjs.com/package/@lion/input-amount)                | Input element for amounts                                                                      | ✔️                         |
| [input-date](https://lion-web-components.netlify.app/?path=/docs/forms-input-date--main)                      | [![input-date](https://img.shields.io/npm/v/@lion/input-date.svg)](https://www.npmjs.com/package/@lion/input-date)                      | Input element for dates                                                                        | ✔️                         |
| [input-datepicker](https://lion-web-components.netlify.app/?path=/docs/forms-input-datepicker--main)          | [![input-datepicker](https://img.shields.io/npm/v/@lion/input-datepicker.svg)](https://www.npmjs.com/package/@lion/input-datepicker)    | Input element for dates with a datepicker                                                      | ✔️                         |
| [input-email](https://lion-web-components.netlify.app/?path=/docs/forms-input-email--main)                    | [![input-email](https://img.shields.io/npm/v/@lion/input-email.svg)](https://www.npmjs.com/package/@lion/input-email)                   | Input element for e-mails                                                                      | ✔️                         |
| [input-iban](https://lion-web-components.netlify.app/?path=/docs/forms-input-iban--main)                      | [![input-iban](https://img.shields.io/npm/v/@lion/input-iban.svg)](https://www.npmjs.com/package/@lion/input-iban)                      | Input element for IBANs                                                                        | ✔️                         |
| [input-range](https://lion-web-components.netlify.app/?path=/docs/forms-input-range--main)                    | [![input-range](https://img.shields.io/npm/v/@lion/input-range.svg)](https://www.npmjs.com/package/@lion/input-range)                   | Input element for a range of values                                                            | ✔️                         |
| [input-stepper](https://lion-web-components.netlify.app/?path=/docs/forms-input-stepper--main)                | [![input-stepper](https://img.shields.io/npm/v/@lion/input-stepper.svg)](https://www.npmjs.com/package/@lion/input-stepper)             | Input stepper element for the predefined range                                                 | ✔️                         |
| [listbox](https://lion-web-components.netlify.app/?path=/docs/forms-listbox-overview--main)                   | [![listbox](https://img.shields.io/npm/v/@lion/listbox.svg)](https://www.npmjs.com/package/@lion/form)                                  | Interactive list with selectable options                                                       | ✔️                         |
| [radio-group](https://lion-web-components.netlify.app/?path=/docs/forms-radio-group--main)                    | [![radio-group](https://img.shields.io/npm/v/@lion/radio-group.svg)](https://www.npmjs.com/package/@lion/radio-group)                   | Group of radios                                                                                | ✔️                         |
| [select](https://lion-web-components.netlify.app/?path=/docs/forms-select--main)                              | [![select](https://img.shields.io/npm/v/@lion/select.svg)](https://www.npmjs.com/package/@lion/select)                                  | Simple native dropdown element                                                                 | ✔️                         |
| [select-rich](https://lion-web-components.netlify.app/?path=/docs/forms-select-rich--main)                    | [![select-rich](https://img.shields.io/npm/v/@lion/select-rich.svg)](https://www.npmjs.com/package/@lion/select-rich)                   | 'rich' version of the native dropdown element                                                  | [#243][i243]               |
| [textarea](https://lion-web-components.netlify.app/?path=/docs/forms-textarea--main)                          | [![textarea](https://img.shields.io/npm/v/@lion/textarea.svg)](https://www.npmjs.com/package/@lion/textarea)                            | Multiline text input                                                                           | ✔️                         |
| **-- [Button System](https://lion-web-components.netlify.app/?path=/docs/buttons-intro--page) --**            |                                                                                                                                         | These web components bring common UX patterns while still full integrated with (native) forms. |                            |
| [button](https://lion-web-components.netlify.app/?path=/docs/buttons-button--main)                            | [![button](https://img.shields.io/npm/v/@lion/button.svg)](https://www.npmjs.com/package/@lion/button)                                  | Button                                                                                         | ✔️                         |
| [switch](https://lion-web-components.netlify.app/?path=/docs/buttons-switch--main)                            | [![switch](https://img.shields.io/npm/v/@lion/switch.svg)](https://www.npmjs.com/package/@lion/switch)                                  | Switch                                                                                         | ✔️                         |
| **-- [Overlay System](https://lion-web-components.netlify.app/?path=/docs/overlays-intro--page) --**          |                                                                                                                                         | If something needs to overlay content this is your place.                                      |                            |
| [overlays](https://lion-web-components.netlify.app/?path=/docs/overlays-system-overview--main)                | [![overlays](https://img.shields.io/npm/v/@lion/overlays.svg)](https://www.npmjs.com/package/@lion/overlays)                            | Overlay System                                                                                 | ✔️                         |
| [dialog](https://lion-web-components.netlify.app/?path=/docs/overlays-dialog--main)                           | [![dialog](https://img.shields.io/npm/v/@lion/dialog.svg)](https://www.npmjs.com/package/@lion/dialog)                                  | Dialog element                                                                                 | ✔️                         |
| [tooltip](https://lion-web-components.netlify.app/?path=/docs/overlays-tooltip--main)                         | [![tooltip](https://img.shields.io/npm/v/@lion/tooltip.svg)](https://www.npmjs.com/package/@lion/tooltip)                               | Tooltip element                                                                                | [#175][i175]               |
| **-- [Navigation System](https://lion-web-components.netlify.app/?path=/docs/navigation-intro--page) --**     |                                                                                                                                         | Components which are used to guide users                                                       |                            |
| [accordion](https://lion-web-components.netlify.app/?path=/docs/navigation-accordion--main)                   | [![accordion](https://img.shields.io/npm/v/@lion/accordion.svg)](https://www.npmjs.com/package/@lion/accordion)                         | Accordion                                                                                      | ✔️                         |
| [pagination](https://lion-web-components.netlify.app/?path=/docs/navigation-pagination--main)                 | [![pagination](https://img.shields.io/npm/v/@lion/pagination.svg)](https://www.npmjs.com/package/@lion/pagination)                      | Pagination                                                                                     | ✔️                         |
| [steps](https://lion-web-components.netlify.app/?path=/docs/navigation-steps--main)                           | [![steps](https://img.shields.io/npm/v/@lion/steps.svg)](https://www.npmjs.com/package/@lion/steps)                                     | Multi Step System                                                                              | n/a                        |
| [tabs](https://lion-web-components.netlify.app/?path=/docs/navigation-tabs--main)                             | [![tBS](https://img.shields.io/npm/v/@lion/tabs.svg)](https://www.npmjs.com/package/@lion/tabs)                                         | Move between a small number of equally important views                                         | n/a                        |
| **-- [localize System](https://lion-web-components.netlify.app/?path=/docs/localize-intro--page) --**         |                                                                                                                                         | Localize text, numbers, dates and a way to store/fetch these data.                             |                            |
| [localize](https://lion-web-components.netlify.app/?path=/docs/localize-intro--page)                          | [![localize](https://img.shields.io/npm/v/@lion/localize.svg)](https://www.npmjs.com/package/@lion/localize)                            | Localize and translate your application/components                                             | n/a                        |
| **-- [Icon System](https://lion-web-components.netlify.app/?path=/docs/icons-intro--page) --**                |                                                                                                                                         | Loading and displaying icons                                                                   |                            |
| [icon](https://lion-web-components.netlify.app/?path=/docs/icons-icon--main)                                  | [![icon](https://img.shields.io/npm/v/@lion/icon.svg)](https://www.npmjs.com/package/@lion/icon)                                        | Display our svg icons                                                                          | [#173][i173], [#172][i172] |
| **-- [Others](https://lion-web-components.netlify.app/?path=/docs/others-intro--page) --**                    |                                                                                                                                         | Features not fitting any other category                                                        |                            |
| [core](https://lion-web-components.netlify.app/?path=/docs/others-system-core--page)                          | [![core](https://img.shields.io/npm/v/@lion/core.svg)](https://www.npmjs.com/package/@lion/core)                                        | Core System (exports LitElement, lit-html)                                                     | n/a                        |
| [ajax](https://lion-web-components.netlify.app/?path=/docs/others-ajax--performing-get-requests)              | [![ajax](https://img.shields.io/npm/v/@lion/ajax.svg)](https://www.npmjs.com/package/@lion/ajax)                                        | Fetching data via ajax request                                                                 | n/a                        |
| [calendar](https://lion-web-components.netlify.app/?path=/docs/others-calendar--main)                         | [![calendar](https://img.shields.io/npm/v/@lion/calendar.svg)](https://www.npmjs.com/package/@lion/calendar)                            | Standalone calendar                                                                            | [#195][i195], [#194][i194] |
| [collapsible](https://lion-web-components.netlify.app/?path=/docs/others-collapsible--main)                   | [![collapsible](https://img.shields.io/npm/v/@lion/collapsible.svg)](https://www.npmjs.com/package/@lion/collapsible)                   | Combination of a button and a chunk of extra content                                           | ✔️                         |
| **-- [Helpers](https://lion-web-components.netlify.app/?path=/docs/helpers-intro--page) --**                  | [![helpers](https://img.shields.io/npm/v/@lion/helpers.svg)](https://www.npmjs.com/package/@lion/helpers)                               | Helpers to make your and your life easier                                                      |                            |
| [sb-action-logger](https://lion-web-components.netlify.app/?path=/docs/helpers-storybook-action-logger--main) |                                                                                                                                         | Storybook action logger                                                                        |

## Technologies

Lion Web Components aims to be future-proof and use well-supported proven technology. The stack we have chosen should reflect this.

- [lit-html](https://lit-html.polymer-project.org) and [lit-element](https://lit-element.polymer-project.org)
- [npm](http://npmjs.com)
- [yarn](https://yarnpkg.com)
- [Open Web Components](https://open-wc.org)
- [Modern Web](https://modern-web.dev)
- [Mocha](https://mochajs.org)
- [Chai](https://www.chaijs.com)
- [ESLint](https://eslint.org)
- [prettier](https://prettier.io)
- [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- Lots and lots of tests

## Rationale

We know from experience that making high quality, accessible UI components is hard and time consuming:
it takes many iterations, a lot of development time and a lot of testing to get a generic component that works in every
context, supports many edge cases and is accessible in all relevant screen readers.

Lion aims to do the heavy lifting for you.
This means you only have to apply your own Design System: by delivering styles, configuring components and adding a minimal set of custom logic on top.

## Coding guidelines

Check out our [coding guidelines](https://lion-web-components.netlify.app/?path=/docs/guidelines-intro--page) for more detailed information.

## How to contribute

**Please note:** This project uses Yarn [Workspaces](https://classic.yarnpkg.com/en/docs/workspaces). If you want to run all demos locally you need to get [Yarn](https://classic.yarnpkg.com/en/docs/install) and install all dependencies by executing `yarn install`.

Lion Web Components are only as good as its contributions.
Read our [contribution guide](https://github.com/ing-bank/lion/blob/master/CONTRIBUTING.md) and feel free to enhance/improve Lion. We keep feature requests closed while we're not working on them.

## Contact

Feel free to create a github issue for any feedback or questions you might have.
You can also find us on the Polymer slack in the [#lion](https://polymer.slack.com/messages/CJGFWJN9J/convo/CE6D9DN05-1557486154.187100/) channel.

You can join the Polymer slack by visiting [https://www.polymer-project.org/slack-invite](https://www.polymer-project.org/slack-invite).

[i172]: https://github.com/ing-bank/lion/issues/172
[i173]: https://github.com/ing-bank/lion/issues/173
[i175]: https://github.com/ing-bank/lion/issues/175
[i194]: https://github.com/ing-bank/lion/issues/194
[i195]: https://github.com/ing-bank/lion/issues/195
[i243]: https://github.com/ing-bank/lion/issues/243
