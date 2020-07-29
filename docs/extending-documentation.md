# Extending Lion Documentation

(rewrite of original)
TODO: Check medium support for IDs in MarkDown
TODO: Add IDs
TODO: Make TOC

Extending [Lion](https://lion-web-components.netlify.app/) is not limited to extending components. Documentation and demos can be reused as well. This removes removes duplicate work such as writing and maintenance.

This article explains how to extend both components and documentation.

> A naming convention that is similar to `Lion*` for class names and `lion-*` for tag names is required for this to work. We use the example of `Lea` e.g. `LeaTabs` and `lea-tabs`.

## Table of Contents

1. Make a selection
2. Alter input paths
3. Override the original
4. Remove, add and replace sections
5. Run locally

## Make a Selection

`@open-wc/demoing-storybook` uses [Prebuilt Storybook](https://open-wc.org/demoing/) with [MDJS](https://open-wc.org/mdjs/) starting from version 2. This tooling is assumed for this article.

`@open-wc/demoing-storybook` can be installed manually.

```sh
yarn add @open-wc/demoing-storybook --dev
```

It can also be scaffolded with a basic configuration.

```sh
npm init @open-wc
```

In this case, you should add/upgrade `Demoing` in the menu. More details can be found in the documentation of open-wc under [Demoing via storybook](https://open-wc.org/demoing/).

//////

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

## Change Input Paths

## Override Original Documentation

## Remove, Add and Replace Sections

## Run Locally

## Conclusion
