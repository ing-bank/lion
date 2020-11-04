# Extending Lion Documentation

```js script
export default {
  title: 'Guidelines/Extending documentation',
};
```

If you extend [Lion](https://lion-web-components.netlify.app/) components, you don't only want to reuse the components, but you probably want to reuse the documentation (Storybook demos) as well. Wouldn't it be nice to just take it all from lion, but replace it with your own design system extension, so you don't have the extra maintenance of essentially copying the docs from `Lion` for your own design system implementation?

In this blog we will explain how `Lion` supports this use case, and allows you to extend not just the components, but also the documentation.

> Important to note is that you must have a naming convention in your extension that is similar to `Lion*` for class names and `lion-*` for tag names, e.g. `LeaTabs` and `lea-tabs`. So essentially, have a consistent prefix for all your extension classes and tagnames.

## Steps involved

In order to extend documentation, there are a few things that we need to enable you to do:

1. Control which documentation MD files you extend, and which you leave out entirely. Because perhaps `LionTabs` is the only component that you extend.
2. Support codified demos but replace the `Lion` component with the design system component equivalent. This means that the import paths for the component need to be altered to the path where your design system component lives.
3. Allow to create overrides for the documentation. If we reference `lion-tabs`, but your tabs is called `lea-tabs`, you should be able to replace this piece of text easily. Or maybe we reference that amongst a list of browsers, we support IE11, but your design system doesn't. Then it should be easy to remove that piece of text from your extension docs.
4. Allow to remove sections of documentation from Lion, add sections, and replace sections easily.

Lastly, it needs to be possible for this to work locally (when running Storybook prebuilt using es-dev-server) as well as in production (when building the full storybook with rollup and deploying it).

## Storybook Main file

For step 1, we can use `@open-wc/demoing-storybook` version 2 or higher, which uses [Prebuilt Storybook](https://open-wc.org/demoing/) with [MDJS](https://open-wc.org/mdjs/). Using this is a prerequisite for the rest of this blog.

Install it manually (and see the docs for configuring):

```sh
npm i @open-wc/demoing-storybook --save-dev
```

Or scaffold it with basic configuration by doing

```sh
npm init @open-wc
```

And adding/upgrading `Demoing`.

Now we need to specify in our `.storybook/main.js` which stories to load, as well as specifying some `es-dev-server` configuration options. Only `nodeResolve` is required, but `watch` and `open` are a nice bonus!

```js
module.exports = {
  stories: ['../node_modules/@lion/tabs/README.md', '../packages/**/!(*.override)*.md'],
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
  },
};
```

> Later in this blog in the `Adjust Documentation` section we will explain about why we exclude \*.override.md files here, since they are used for specific overrides and not to be included as independent story files. This file name syntax is configurable.

So here we only extend the documentation of `LionTabs`, for our own `LeaTabs`. But our repository is a monorepository with multiple other packages that don't use `Lion`, which we want to include as well, so we also add the second line to include those.

This step alone should already give you the `LionTabs` docs inside your own Storybook, but not yet transformed to your `LeaTabs` extension of it, which we will explain next.

## Replacing imports and tagnames

### Analysing paths

Potentially the hardest part is to analyse your extension `LeaTabs`, and to figure out how we should transform the import paths for `LionTabs` to new paths to your `LeaTabs`.

To do this we make use of [Providence](https://lion-web-components.netlify.app/?path=/docs/tools-providence-main--run-providence). This tool has a command that creates a full map of all the import paths of a reference project (`Lion`) and can replace them with the correct paths of a target project (`Lea`).

So lets install it:

```sh
npm i providence-analytics --save-dev
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
  "upgrade:lion": "npx update-by-scope @lion && npm run providence:extend",
  "providence:extend": "providence extend-docs -r 'node_modules/@lion/*' --prefix-from lion --prefix-to ing"
}
```

> Note that if you want to fix your lion versions, you have to do this manually or write your own script for updating by scope. `update-by-scope` does not support passing `--save-exact` flag sadly (or any flag for that matter).

### Replacing paths & template tagnames

Now that we have a JSON file with all the information we need to know about to replace import paths and tagnames inside templates, we can start transforming the `LionTabs` documentation to `LeaTabs` documentation.

For this, we created a `babel-plugin` called [babel-plugin-extend-docs](https://lion-web-components.netlify.app/?path=/docs/tools-babelpluginextenddocs--page).

This will analyse the JavaScript script and story content inside the markdown files, which uses [MDJS](https://open-wc.org/mdjs/) syntax, and transform it on the fly in `es-dev-server`, as well as on rollup build for production.

So all you need to do is to install this plugin:

```sh
npm i babel-plugin-extend-docs --save-dev
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
    const overridePaths = [getLocalOverridePath(filePath), `${process.cwd()}/.storybook/all.override.md`];

    let i = 0;
    for (const overridePath of overridePaths) {
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

We insert a remarkExtend plugin instance for both the local overrides and the global overrides, and pass the necessary arguments. Then we return the new array of plugins for Mdjs.

In each file you need to add a specifier which section you want to override. As a first step we want to load `lea-tab` and `lea-tab-panel` also in the project. We need to add some imports to the top of the file.

Use triple backtick \` to create a fenced codeblock ` ``` `, and put inside it:

```md
::addMdAfter(':root')
```

Then below that, create another fenced codeblock with `js script` annotation with your imports inside it:

```js
import '../lea-tab.js';
import '../lea-tab-panel.js';
```

And then replace each reference to `lion-tab` with `lea-tab` inside the documentation content, this also covers `lion-tab` and `lion-tab-panel`. We exclude JS snippets 'nodes', those are handled by the babel plugin already.

Create another fenced codeblock with `js ::replaceFrom(':root')` annotation:

```js
module.exports.replaceSection = node => {
  if (node.type !== 'code' && node.value) {
    let newCode = node.value;
    newCode = newCode.replace(/lion-tab/g, 'lea-tab');
    node.value = newCode;
  }
  return node;
};
```

You can remove content as well. Create a fenced codeblock:

```md
::removeFrom('heading:has([value=Distribute New Elements])')
```

Or you can add an extra paragraph below the content. Create a fenced codeblock:

```md
::removeMdAfter(':scope:last-child')
```

> See [Remark extend](https://lion-web-components.netlify.app/?path=/docs/tools-remark-extend--page) for more information

### Lea Tabs Special Feature

```js
export const specialFeature = () =>
  html`
    <lea-tabs>
      <lea-tab slot="tab">Info</lea-tab>
      <lea-tab-panel slot="panel"> Info page with lots of information about us. </lea-tab-panel>
      <lea-tab slot="tab">Work</lea-tab>
      <lea-tab-panel slot="panel"> Work page that showcases our work. </lea-tab-panel>
    </lea-tabs>
  `;
```

## Summary

Writing good extensive documentation is hard and time consuming, so being able to extend not only the code, but also the documentation will increase your work speed.

We showed you how to set it up and how you can adjust the documentation to fit your extended component.

And since this can be achieved with 3 separate tools, you can also use it to extend other documentation.
