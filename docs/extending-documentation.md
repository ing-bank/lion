# A speedy Design System by extending a component library and it's documentation

(rewrite of original)
TODO: Check medium support for IDs in MarkDown
TODO: Add IDs
TODO: Make TOC
TODO: Consistent person

Lion is a set of white label cross-platform Web Components with accessibility and performance built-in. You can extend them with your own styling to create your own complete Design System with little effort! 
- [Read more about Lion](https://medium.com/ing-blog/ing-open-sources-lion-a-library-for-performant-accessible-flexible-web-components-22ad165b1d3d)
- [A demo of Lion](https://lion-web-components.netlify.app)
- [Lion on Github]()

Extending Lion is not limited to extending components. Documentation and demos can be reused as well. This removes duplicate work such as writing and maintaining documentation.

This article explains how to extend both components as well as documentation.

> A naming convention that is similar to `Lion*` for class names and `lion-*` for tag names is required for this to work. For this demo, we use the the names `ExampleButton` and `example-button`.

## Table of Contents

0. Setting up, and Extending Lion
1. Select documentation to re-use
2. Change input paths
3. Remove, add and replace sections
4. Conclusion

## Setting up, and extending Lion

This article assumes some basic terminal knowledge, and a working installation of npm. Yarn can work as well.

Create a new folder for our components using the terminal.

```sh
mkdir example-components
```

Enter the folder `example-components` and run the following command to scaffold a new project using [open-wc](https://open-wc.org).

```sh
npm init @open-wc
```

When presented with a menu, pick (at least) the following options.

```sh
What would you like to do today? › Scaffold a new project
✔ What would you like to scaffold? › Web Component
✔ What would you like to add? › Demoing (storybook)
✔ Would you like to use typescript? › No
✔ Would you like to scaffold examples files for? › Demoing (storybook)
✔ What is the tag name of your application/web component? example-button
```

Enter the folder `example-button` and run the following command to make lion-button a dependency. It is the component we will be extending.

```sh
npm i @lion/button --save
```

Within the folder `src`, open the following file:

```sh
example-button/src/ExampleButton.js
```

Replace the content with the following: 

```js
import { css } from 'lit-element';
import { LionButton } from '@lion/button';

export class ExampleButton extends LionButton {
  static get styles() {
    return [
      super.styles,
      css`
        /* our styles can go here */
      `
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupFeature();
  }

  _setupFeature() {
    // our code can go here
  }
}
```

You have now extended `<lion-button>` and created `<example-button>` from it. The component can be experienced in the browser by running `npm run storybook` inside the `example-button`-folder. 
Feel free to add styles and make it your own. This can be the start of a whole set of Web Components for your Design System.

For this article we assume you set up the project like mentioned before, using [Prebuilt Storybook](https://open-wc.org/demoing/) with [MDJS](https://open-wc.org/mdjs/). If you already have a repository, you can also add Storybook using [open-wc](https://open-wc.org). Enter the following:

```sh
npm init @open-wc
```

And pick 'upgrade an existing project'. Or install it manually by entering the following:

```sh
npm i @open-wc/demoing-storybook --save-dev
```

## Select documentation to re-use

We need to specify which stories to load in `.storybook/main.js`.

Change the following line:

```js
  stories: ['../stories/**/*.stories.{js,md,mdx}'],
```

to add the Lion readme

```js
  stories: ['../stories/**/*.stories.{js,md,mdx}', '../node_modules/@lion/button/README.md'],
```

This is where we extend the documentation of `LionButton`, for our own `ExampleButton`. This step, by itself, gives you the `LionButton` docs inside your own Storybook.


## Change input paths

We can change the import paths from `LionButton` to the new paths of `ExampleButton`. We use [Providence](https://lion-web-components.netlify.app/?path=/docs/tools-providence-main--run-providence) for this. This tool has a command that creates a full map of all the import paths of a reference project (`Lion`) and can replace them with the correct paths of a target project (`Example`).

Navigate the terminal to `example-button` and install this tool by adding it to our `package.json`:

```sh
npm i providence-analytics --save-dev
```

We can use it by adding a script to your `package.json`:

```json
"scripts": {
  "providence:extend": "providence extend-docs -r 'node_modules/@lion/*' --prefix-from lion --prefix-to example"
}
```

The `--prefix-from` is the prefix of the project you extend from (in this case `lion`). `--prefix-to` is the prefix of our own project (in this case `example`).
It will look for the classnames `Lion*` and `Example*`, and for the tagnames `lion-*` and `example-*`.

As we only use a single component from Lion, we can reduce the time the tool needs for analysis. Specify the single package by replacing `-r 'node_modules/@lion/*'` with  `-r 'node_modules/@lion/button'`.

We can review all from/to information in `providence-extend-docs-data.json`. Providence creates this critical file.


### Replacing paths and names

With the information in the JSON-file, we can start transforming the `LionButton` documentation to `ExampleButton` documentation. We created a `babel-plugin` called [babel-plugin-extend-docs](https://lion-web-components.netlify.app/?path=/docs/tools-babelpluginextenddocs--page) for this.

This plugin will analyse the content of the markdown files, and transform it on the fly in `es-dev-server` and when building with Rollup for production.

To install this plugin, we navigate the terminal back to `example-button` and install this plugin by adding it to our `package.json`:

```sh
npm i babel-plugin-extend-docs --save-dev
```

A `babel.config.js` in the root of our project is also needed. It should contain:

```js
const path = require('path');
const providenceExtendConfig = require('./providence-extend-docs-data.json');

const extendDocsConfig = {
  rootPath: path.resolve('.'),
  changes: providenceExtendConfig,
};

module.exports = {
  overrides: [
    {
      test: ['./node_modules/@lion/*/README.md', './node_modules/@lion/*/docs/*.md'],
      plugins: [['babel-plugin-extend-docs', extendDocsConfig]],
    },
  ],
};
```

We import the providence output file (`providence-extend-docs-data.json'`) and pass it to the plugin options as the `changes` property.

The babel plugin runs for the files that we specify in the `test` property, replaces the imports, and replaces the tag names inside JavaScript code snippets!

> It will only transform JavaScript snippets that use [MDJS](https://open-wc.org/mdjs/) syntax such as \`\`\`js script, \`\`\`js story and \`\`\`js preview-story

We also have to add Babel to our `es-dev-server`-configuration to make it work with Storybook.

Create a `.storybook/main.js` with the following content:

```js
module.exports = {
  stories: ['../node_modules/@lion/button/README.md', '../packages/**/!(*.override)*.md'],
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
    babel: true,
  },
};
```

We should now see the `LionButton` instances transformed into our own `ExampleButton`!


## Remove, add and replace sections

We might not want to show all examples of how to use a component. Sometimes information is `Lion` specific, or perhaps in your Design System people are not allowed to use a certain feature that we documented in `Lion`.

In our example, we will remove the `Rationale` section that we would normally inherit from the `Lion` documentation.

For this step we make use of a remark plugin for the MD content, similar to how we use a babel plugin for JS content. It is called [Remark extend](https://lion-web-components.netlify.app/?path=/docs/tools-remark-extend--page).
It lets us add, remove or replace sections or specific words.

Remark extend needs the following content added to `.storybook/main.js`:

```js
const fs = require('fs');
const { remarkExtend } = require('remark-extend');

function isLion(filePath) {
  return filePath.indexOf('@lion/') !== -1;
}

function getLocalOverridePath(filePath, root = process.cwd()) {
  const rel = filePath.substring(filePath.indexOf('/@lion/') + 7, filePath.length - 3);
  return `${root}/packages/${rel}.override.md`;
}

module.exports = {
  [...],
  setupMdjsPlugins: (plugins, filePath) => {
    if (!isLion(filePath)) {
      return plugins;
    }
    const newPlugins = [...plugins];
    const markdownIndex = newPlugins.findIndex(plugin => plugin.name === 'markdown');
    const overridePaths = [`${process.cwd()}/.storybook/all.override.md`];
    overridePaths.push(getLocalOverridePath(filePath));

    let i = 0;
    for (const overridePath of overridePaths.reverse()) {
      if (fs.existsSync(overridePath)) {
        const extendMd = fs.readFileSync(overridePath, 'utf8');
        newPlugins.splice(markdownIndex, 0, {
          name: `remarkExtend${i}`,
          plugin: remarkExtend.bind({}),
          options: { extendMd, filePath, overrideFilePath: overridePath },
        });
      }
      i += 1;
    }
    return newPlugins;
  },
  [...],
};
```

In the code example mentioned, we have two places in where we can do overrides: `./.storybook/all.override.md` for generic overrides and via `getLocalOverridePath` for each component. When needed, the `rel` needs to be the same in `lion` and our own project to be able to override the right file.

In each file we need to specify which section we want to override. We want to load `example-button` in the project:

````md
```
::addMdAfter(':root')
```

```js script
import '../example-button.js';
```
````

And then replace each `button` with it.

````md
```js ::replaceFrom(':root')
module.exports.replaceSection = node => {
  if (node.type === 'code' && node.value) {
    let newCode = node.value;
    newCode = newCode.replace(/<lion-button/g, '<example-button');
    node.value = newCode;
  }
  return node;
};
```
````

We can remove content by targeting a specific heading:

````md
```
::removeFrom('heading:has([value=Usage with native form])')
```
````

Or we can add an extra paragraph below the content:

````md
```
::addMdAfter(':scope:last-child')
```
````

The documentation of [Remark extend](https://lion-web-components.netlify.app/?path=/docs/tools-remark-extend--page) has many more options and insights

## Conclusion

Writing good extensive documentation can be hard and time consuming. Being able to extend both code (components) and documentation will increase your work speed.

We set up and adjusted the documentation to fit our extended component. please [contact](https://github.com/ing-bank/lion/tree/chore/docsBlog#user-content-contact) us if this article doesn't answer your questions.
