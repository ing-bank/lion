<p align="center">
  <img
    width="20%"
    src="./docs/_assets/logo.svg"
    alt="Lion"
  />
  <h1 style="text-align: center;">Lion</h1>
</p>

<p align="center">
  <a href="https://github.com/ing-bank/lion/issues"
    ><img
      src="https://badgen.net/github/open-issues/ing-bank/lion"
      alt="Lion open issues status"
  /></a>
  <a href="https://github.com/ing-bank/lion/pulls"
    ><img
      src="https://badgen.net/github/open-prs/ing-bank/lion/"
      alt="GitHub open pull requests status"
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
  <a href="https://lion-web.netlify.app/fundamentals/">Fundamentals</a>
  ·
  <a href="https://lion-web.netlify.app/guides/">Guides</a>
  ·
  <a href="https://lion-web.netlify.app/components/">Components</a>
  ·
  <a href="https://lion-web.netlify.app/blog/">Blog</a>
</p>

**Lion is a set of highly performant, accessible and flexible Web Components.!**

They provide an unopinionated, white-label layer that can be extended to your own layer of components.

- **High Performance:** Focused on great performance in all relevant browsers with a minimal number of dependencies.
- **Accessibility:** Aimed at compliance with the WCAG 2.2 AA standard to create components that are accessible for everybody.
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
npm i @lion/ui
```

## How to use

### Extend a Web Component

**This is the main use case for lion**. To import component classes, and extend them for your own design system's components.

```js
import { css } from 'lit';
import { LionInput } from '@lion/ui/input.js';

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
  import { ajax } from '@lion/ui/ajax.js';

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

<lion-input name="firstName"></lion-input>
```

## Issues

If you encounter an issue with any of the packages we are offering please open a [new bug issue](https://github.com/ing-bank/lion/issues/new?assignees=&labels=&template=bug_report.md&title=). Be sure to include a description of the expected and the current behavior - additional adding a [reproduction](https://webcomponents.dev/edit/kpZmz1CJN580OaXsk56f?pm=1) always helps.

## Feature requests

When you have an idea on how we could improve, please check our [discussions](https://github.com/ing-bank/lion/discussions) to see if there are similar ideas or feature requests. If there are none, please [start](https://github.com/ing-bank/lion/discussions/new) your feature request as a new discussion topic. Add the title `[Feature Request] My awesome feature` and a description of what you expect from the improvement and what the use case is.

## Content

| Name                                                                                                                        | version                                                                                                                   | description                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@lion/ui](https://github.com/ing-bank/lion/tree/master/packages/ui)                                                        | <img src="https://img.shields.io/npm/v/@lion/ui.svg" alt="@lion/ui version"/>                                             | Set of components                                                                                                                                                                                                                                                                                                          |
| [@lion/ajax](https://github.com/ing-bank/lion/tree/master/packages/ajax)                                                    | <img src="https://img.shields.io/npm/v/@lion/ajax.svg" alt="@lion/ajax version"/>                                         | A small wrapper around fetch                                                                                                                                                                                                                                                                                               |
| [Singleton-manager](https://github.com/ing-bank/lion/tree/master/packages/singleton-manager)                                | <img src="https://img.shields.io/npm/v/singleton-manager.svg" alt="Singleton-manager version"/>                           | A singleton manager provides a way to make sure a singleton instance loaded from multiple file locations stays a singleton. Primarily useful if two major version of a package with a singleton is used.                                                                                                                   |
| [Babel plugin extend docs](https://github.com/ing-bank/lion/tree/master/packages-node/babel-plugin-extend-docs)             | <img src="https://img.shields.io/npm/v/babel-plugin-extend-docs.svg" alt="babel-plugin-extend-docs version"/>             | A plugin which rewrites imports and templates according to a configuration. This enables the reuse of existing documentation from source packages while still using your extensions code.                                                                                                                                  |
| [Providence analytics](https://github.com/ing-bank/lion/tree/master/packages-node/providence-analytics)                     | <img src="https://img.shields.io/npm/v/providence-analytics.svg" alt="providence-analytics version"/>                     | Providence is the 'All Seeing Eye' that generates usage statistics by analyzing code. It measures the effectivity and popularity of your software. With just a few commands you can measure the impact for (breaking) changes, making your release process more stable and predictable.                                    |
| [Publish docs](https://github.com/ing-bank/lion/tree/master/packages-node/publish-docs)                                     | <img src="https://img.shields.io/npm/v/publish-docs.svg" alt="publish-docs version"/>                                     | A tool that copies and processes your documentation (in a monorepo) so it can be published/shipped with your package.                                                                                                                                                                                                      |
| [Remark extend](https://github.com/ing-bank/lion/tree/master/packages-node/remark-extend)                                   | <img src="https://img.shields.io/npm/v/remark-extend.svg" alt="remark-extend version"/>                                   | A plugin for remark to extend markdown by importing from source files.                                                                                                                                                                                                                                                     |
| [Rocket preset extend lion docs](https://github.com/ing-bank/lion/tree/master/packages-node/rocket-preset-extend-lion-docs) | <img src="https://img.shields.io/npm/v/rocket-preset-extend-lion-docs.svg" alt="rocket-preset-extend-lion-docs version"/> | When maintaining your own extension layer of lion you most likely want to maintain a similar documentation. Copying and rewriting the markdown files works, but whenever something changes you need copy and rewrite again. To do this automatically you can use this preset for [rocket](https://rocket.modern-web.dev/). |

## Technologies

Lion Web Components aims to be future-proof and use well-supported proven technology. The stack we have chosen should reflect this.

- [lit](https://lit.dev/)
- [npm](http://npmjs.com)
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

Check out our [coding guidelines](https://lion-web.netlify.app/guides/principles/definitions-and-terms/) for more detailed information.

## How to contribute

**Please note:** This project uses Npm [Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces). If you want to run all demos locally you need to get at least npm 7+ and install all dependencies by executing `npm install`.

Lion Web Components are only as good as its contributions.
Read our [contribution guide](https://github.com/ing-bank/lion/blob/master/CONTRIBUTING.md) and feel free to enhance/improve Lion. We keep feature requests closed while we're not working on them.

## Contact

Feel free to create a github issue for any feedback or questions you might have.
