# Extending Lion Documentation

(rewrite of original)
TODO: Check medium support for IDs in MarkDown
TODO: Add IDs
TODO: Make TOC

Extending [Lion](https://lion-web-components.netlify.app/) is not limited to extending components. Documentation and demos can be reused as well. This removes removes duplicate work such as writing and maintenance.

This article explains how to extend both components and documentation.

> A naming convention that is similar to `Lion*` for class names and `lion-*` for tag names is required for this to work. We use the example of `Lea` e.g. `LeaTabs` and `lea-tabs`.

## Table of Contents

<<<<<<< HEAD
0. Setting up, and Extending Lion
=======
0. Extending Lion
>>>>>>> 5c40b43c42c7423a46dd13ed115bb4dd191f177e
1. Make a selection
2. Alter input paths
3. Override the original
4. Remove, add and replace sections
5. Run locally

<<<<<<< HEAD
## Setting up, and extending Lion

This article assumes some basic terminal knowledge, and a working installation of npm. Yarn would work as well.
=======
## Extending Lion

```sh
mkdir example-components
```

```sh
npm init @open-wc
```

```sh
What would you like to do today? › Scaffold a new project
✔ What would you like to scaffold? › Web Component
✔ What would you like to add? › Demoing (storybook)
✔ Would you like to use typescript? › No
✔ Would you like to scaffold examples files for? › Demoing (storybook)
✔ What is the tag name of your application/web component? example-button
```

```sh
npm i @lion/button
```

```sh
example-button/src/ExampleButton.js
```

```js
import { css } from 'lit-element';
import { LionButton } from '@lion/button';

export class ExampleButton extends LionButton {
  static get styles() {
    return [
      super.styles,
      css`
        /* your styles go here */
      `
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupFeature();
  }

  _setupFeature() {
    // your code goes here
  }
}
```


## Make a Selection

If you already have a repository, you can add Storybook.

`@open-wc/demoing-storybook` uses [Prebuilt Storybook](https://open-wc.org/demoing/) with [MDJS](https://open-wc.org/mdjs/) starting from version 2. This tooling is assumed for this article.
>>>>>>> 5c40b43c42c7423a46dd13ed115bb4dd191f177e

Create a new folder for your components using the terminal.

```sh
mkdir example-components
```

Enter the folder and run the following command to scaffold a new project using [open-wc](https://open-wc.org).

```sh
npm init @open-wc
```

When presented with a menu, (at least) pick the following options.

```sh
What would you like to do today? › Scaffold a new project
✔ What would you like to scaffold? › Web Component
✔ What would you like to add? › Demoing (storybook)
✔ Would you like to use typescript? › No
✔ Would you like to scaffold examples files for? › Demoing (storybook)
✔ What is the tag name of your application/web component? example-button
```

Enter the folder and run the following command to make lion-button a dependency. It is the component we will be extending.

```sh
npm i @lion/button --save
```

Within the src-folder, open the following file:

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
        /* your styles go here */
      `
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupFeature();
  }

  _setupFeature() {
    // your code goes here
  }
}
```

You have now extended `<lion-button>` and created `<example-button>` from it. The component can be experienced in the browser by running `npm run storybook` inside the `example-button`-folder. 
Feel free to add styles and make it your own. This can be the start of a whole set of Web Components for your Design System.

For this article we assume you set up the project like mentioned before, using [Prebuilt Storybook](https://open-wc.org/demoing/) with [MDJS](https://open-wc.org/mdjs/). If you already have a repository, you can also add Storybook using [open-wc](https://open-wc.org). Enter the following:

```sh
npm init @open-wc
```

And pick upgrade an existing project. Or install it manually by entering the following:

```sh
npm i @open-wc/demoing-storybook --save-dev
```

## Make a Selection

We need to specify which stories to load in `.storybook/main.js`.

Change the following line:

```js
  stories: ['../stories/**/*.stories.{js,md,mdx}'],
```

to add the Lion readme

```js
  stories: ['../stories/**/*.stories.{js,md,mdx}', '../node_modules/@lion/button/README.md'],
```

So here we only extend the documentation of `LionButton`, for our own `ExampleButton`. This step alone should already give you the `LionButton` docs inside your own Storybook.

//////

## Change Input Paths

## Override Original Documentation

## Remove, Add and Replace Sections

## Run Locally

## Conclusion



## Replacing imports and tagnames

### Analysing paths

Potentially the hardest part is to analyse your extension `LeaTabs`, and to figure out how we should transform the import paths for `LionTabs` to new paths to your `LeaTabs`.

To do this we make use of [Providence](https://lion-web-components.netlify.app/?path=/docs/tools-providence-main--run-providence). This tool has a command that creates a full map of all the import paths of a reference project (`Lion`) and can replace them with the correct paths of a target project (`Lea`).

So lets install it:

```sh
yarn add providence-analytics --dev
```

And to use it, let's add a script to your projects `package.json`:

```json
"scripts": {
  "providence:extend": "providence extend-docs -r 'node_modules/@lion/*' --prefix-from lion --prefix-to lea"
}
```

The `--prefix-from` and `--prefix-to` are the prefixes of the project you extend from (most of the times `lion`) and your own projects prefix (in this case `lea`). For classnames it will look for `Lion*` and `Lea*` respectively, for tagnames it will look for `lion-*` and `lea-*` respectively.

If you know you only use a single component from lion, you can reduce the time the tool needs for analysis, by specifying this package `-r 'node_modules/@lion/tabs'`.

Running the script will create a `providence-extend-docs-data.json` file, with all from/to information. You can change the name / location of the output file, refer to [Providence Documentation](https://lion-web-components.netlify.app/?path=/docs/tools-providence-main--run-providence) for this.

#### Running it automatically when upgrading lion dependency

Inside ING, our design system also makes use of this providence tool to create this data JSON file. But since the analysis takes a few minutes, we only run it, automatically, when we upgrade our lion dependencies. We do this with the following two `package.json` scripts:

```json
"scripts": {
  "upgrade:lion": "yarn upgrade --scope @lion --latest --exact && yarn providence:extend",
  "providence:extend": "providence extend-docs -r 'node_modules/@lion/*' --prefix-from lion --prefix-to ing"
}
```

### Replacing paths & template tagnames

Now that we have a JSON file with all the information we need to know about to replace import paths and tagnames inside templates, we can start transforming the `LionTabs` documentation to `LeaTabs` documentation.

For this, we created a `babel-plugin` called [babel-plugin-extend-docs](https://lion-web-components.netlify.app/?path=/docs/tools-babelpluginextenddocs--page).

This will analyse the JavaScript script and story content inside the markdown files, which uses [MDJS](https://open-wc.org/mdjs/) syntax, and transform it on the fly in `es-dev-server`, as well as on rollup build for production.

So all you need to do is to install this plugin:

```sh
yarn add babel-plugin-extend-docs --dev
```

and create a `babel.config.js` file in the root of your project:

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

As you can see, we import the providence output file and pass it to the plugin options as the `changes` property.

Now, the babel plugin will run for the files that we specify in `test` property, and replace the imports properly, as well as the tag names inside JavaScript code snippets!

> For the JavaScript code snippets, it only transforms the ones that use [MDJS](https://open-wc.org/mdjs/) syntax, e.g. \`\`\`js script, \`\`\`js story and \`\`\`js preview-story

To ensure babel actually runs for your Storybook, you will have to add it to your es-dev-server configuration:

`.storybook/main.js`:

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

You should now see the `LionTabs` instances transformed into your own `LeaTabs`!

<<<<<<< HEAD
## Adjust documentation content

In some cases you don't want to show all examples of how to use a component. Sometimes information is `Lion` specific, or perhaps in your design system you are not allowed to use a certain feature that we documented in `Lion`.
=======
So here we only extend the documentation of `LionButton`, for our own `ExampleButton`. But our repository is a monorepository with multiple other packages that don't use `Lion`, which we want to include as well, so we also add the second line to include those.

This step alone should already give you the `LionButton` docs inside your own Storybook, but not yet transformed to your `ExampleButton` extension of it, which we will explain next.
>>>>>>> 5c40b43c42c7423a46dd13ed115bb4dd191f177e

In our example, we will show you have to remove the `Rationale` section that you would normally inherit from the `Lion` documentation.

For this step we make use of a remark plugin for the MD content, similar to how you would use a babel plugin for JS content. It is called [Remark extend](https://lion-web-components.netlify.app/?path=/docs/tools-remark-extend--page).
It will let you add, remove or replace sections or specific words.

First of all we need to add the plugin to the `.storybook/main.js`:

```js
const fs = require('fs');
const { remarkExtend } = require('remark-extend');

<<<<<<< HEAD
=======
## Conclusion



## Replacing imports and tagnames

### Analysing paths

Potentially the hardest part is to analyse your extension `LeaTabs`, and to figure out how we should transform the import paths for `LionTabs` to new paths to your `LeaTabs`.

To do this we make use of [Providence](https://lion-web-components.netlify.app/?path=/docs/tools-providence-main--run-providence). This tool has a command that creates a full map of all the import paths of a reference project (`Lion`) and can replace them with the correct paths of a target project (`Lea`).

So lets install it:

```sh
yarn add providence-analytics --dev
```

And to use it, let's add a script to your projects `package.json`:

```json
"scripts": {
  "providence:extend": "providence extend-docs -r 'node_modules/@lion/*' --prefix-from lion --prefix-to lea"
}
```

The `--prefix-from` and `--prefix-to` are the prefixes of the project you extend from (most of the times `lion`) and your own projects prefix (in this case `lea`). For classnames it will look for `Lion*` and `Lea*` respectively, for tagnames it will look for `lion-*` and `lea-*` respectively.

If you know you only use a single component from lion, you can reduce the time the tool needs for analysis, by specifying this package `-r 'node_modules/@lion/tabs'`.

Running the script will create a `providence-extend-docs-data.json` file, with all from/to information. You can change the name / location of the output file, refer to [Providence Documentation](https://lion-web-components.netlify.app/?path=/docs/tools-providence-main--run-providence) for this.

#### Running it automatically when upgrading lion dependency

Inside ING, our design system also makes use of this providence tool to create this data JSON file. But since the analysis takes a few minutes, we only run it, automatically, when we upgrade our lion dependencies. We do this with the following two `package.json` scripts:

```json
"scripts": {
  "upgrade:lion": "yarn upgrade --scope @lion --latest --exact && yarn providence:extend",
  "providence:extend": "providence extend-docs -r 'node_modules/@lion/*' --prefix-from lion --prefix-to ing"
}
```

### Replacing paths & template tagnames

Now that we have a JSON file with all the information we need to know about to replace import paths and tagnames inside templates, we can start transforming the `LionTabs` documentation to `LeaTabs` documentation.

For this, we created a `babel-plugin` called [babel-plugin-extend-docs](https://lion-web-components.netlify.app/?path=/docs/tools-babelpluginextenddocs--page).

This will analyse the JavaScript script and story content inside the markdown files, which uses [MDJS](https://open-wc.org/mdjs/) syntax, and transform it on the fly in `es-dev-server`, as well as on rollup build for production.

So all you need to do is to install this plugin:

```sh
yarn add babel-plugin-extend-docs --dev
```

and create a `babel.config.js` file in the root of your project:

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

As you can see, we import the providence output file and pass it to the plugin options as the `changes` property.

Now, the babel plugin will run for the files that we specify in `test` property, and replace the imports properly, as well as the tag names inside JavaScript code snippets!

> For the JavaScript code snippets, it only transforms the ones that use [MDJS](https://open-wc.org/mdjs/) syntax, e.g. \`\`\`js script, \`\`\`js story and \`\`\`js preview-story

To ensure babel actually runs for your Storybook, you will have to add it to your es-dev-server configuration:

`.storybook/main.js`:

```js
module.exports = {
  stories: ['../node_modules/@lion/tabs/README.md', '../packages/**/!(*.override)*.md'],
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
    babel: true,
  },
};
```

You should now see the `LionTabs` instances transformed into your own `LeaTabs`!

## Adjust documentation content

In some cases you don't want to show all examples of how to use a component. Sometimes information is `Lion` specific, or perhaps in your design system you are not allowed to use a certain feature that we documented in `Lion`.

In our example, we will show you have to remove the `Rationale` section that you would normally inherit from the `Lion` documentation.

For this step we make use of a remark plugin for the MD content, similar to how you would use a babel plugin for JS content. It is called [Remark extend](https://lion-web-components.netlify.app/?path=/docs/tools-remark-extend--page).
It will let you add, remove or replace sections or specific words.

First of all we need to add the plugin to the `.storybook/main.js`:

```js
const fs = require('fs');
const { remarkExtend } = require('remark-extend');

>>>>>>> 5c40b43c42c7423a46dd13ed115bb4dd191f177e
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

In the code above we have 2 places in where you can do overrides: `./.storybook/all.override.md` for generic overrides and via `getLocalOverridePath` for each component, when needed, the `rel` needs to be the same in `lion` and your own project to be able to override the right file.

In each file you need to add a specifier which section you want to override, as a first step we want to load `lea-tab` and `lea-tab-panel` also in the project:

````md
```
::addMdAfter(':root')
```

```js script
import '../lea-tab.js';
import '../lea-tab-panel.js';
```
````

And then replace each `button` or `paragraph` with them.

````md
```js ::replaceFrom(':root')
module.exports.replaceSection = node => {
  if (node.type === 'code' && node.value) {
    let newCode = node.value;
    newCode = newCode.replace(/<button slot="tab"/g, '<lea-tab slot="tab"');
    newCode = newCode.replace(/<\/button>/g, '</lea-tab>');
    newCode = newCode.replace(/<p slot="panel"/g, '<lea-tab-panel slot="panel"');
    newCode = newCode.replace(/<\/p>/g, '</lea-tab-panel>');
    node.value = newCode;
  }
  return node;
};
```
````

You can remove content:

````md
```
::removeFrom('heading:has([value=Distribute New Elements])')
```
````

Or you can add an extra paragraph below the content:

````md
```
::removeMdAfter(':scope:last-child')
```

### Lea Tabs Special Feature

```js preview-story
export const specialFeature = () =>
  html`
    <lea-tabs>
      <lea-tab slot="tab">Info</lea-tab>
      <lea-tab-panel slot="panel">
        Info page with lots of information about us.
      </lea-tab-panel>
      <lea-tab slot="tab">Work</lea-tab>
      <lea-tab-panel slot="panel">
        Work page that showcases our work.
      </lea-tab-panel>
    </lea-tabs>
  `;
```
````

> It was not possible to extend the `lion-tabs` story for `lea-tabs`, since that would modify the original source. So that documentation page is just a hard copy of the real `lion-tabs` story.

## Summary

Writing good extensive documentation is hard and time consuming, so being able to extend not only the code, but also the documentation will increase your work speed.

We showed you how to set it up and how you can adjust the documentation to fit your extended component.

<<<<<<< HEAD
And since this can be achieved with 3 separate tools, you can also use it to extend other documentation.
=======
And since this can be achieved with 3 separate tools, you can also use it to extend other documentation.
>>>>>>> 5c40b43c42c7423a46dd13ed115bb4dd191f177e
