# Astro Starter Kit: Minimal

```
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`. Note comment out/ uncomment the `remarkPlugins:` related to either `ing-web` or `lion` portal in `astro.config.mjs`       |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

# Site search integration by PageFind
> Pagefind is a fully static search library that aims to perform well on large sites, while using as little of your users’ bandwidth as possible, and without hosting any infrastructure.
The feature is advertised by Astro website: https://starlight.astro.build/guides/site-search/
## How it is integrated
* Note, follow https://pagefind.app/docs/ for more details. For tests purposes, add a UI markup to any astro page to enable search component on a page:
```javascript
    <link href="/pagefind/pagefind-ui.css" rel="stylesheet">
    <script src="/pagefind/pagefind-ui.js" is:inline></script>
    <div id="search"></div>
    <script is:inline>
        window.addEventListener('DOMContentLoaded', (event) => {
            new PagefindUI({ element: "#search", showSubResults: true });
        });
    </script>
```
## How to run
* Run `npm run build` to generate static html files
* Run `npm run pageFind` to index static html files in `dist` folder and generate files in `dist/pagefind/` that we import in the UI search component part in the snippet above. Note, the UI search component will not show up on the page if this step is not run
* Run `npm run preview`. This will run the app from the dist folder

# Migration of ing-bank/lion/packages-node

## rocket-preset-extend-lion-docs
* It is not possible to use `rocket-preset-extend-lion-docs` out of the box. The reason is that its code relies on some Rocket specific global JS variable names (f.e. `plugins` variable in node_modules/plugins-manager/src/addPlugin.js). Also it specifies the order among existing plugins to inject the its internal plugins (see more for details https://github.com/ing-bank/lion/blob/master/packages-node/rocket-preset-extend-lion-docs/preset/extendLionDocs.js#L66). We can't reuse that order. Same applies to the dependent `remarkUrlToLocal` plugin. To integrate `rocket-preset-extend-lion-docs` the following steps were done:
    * `src/utils/remark-plugings/wrapper-for-rocket-preset-extend-lion-docs/assets` contains the patched files taken from the original plugins. Then during the installation those files are copied to `node_modules`. The script for copying is defined in `src/utils/remark-plugings/wrapper-for-rocket-preset-extend-lion-docs/copy.sh` and it is currently triggered by `postinstall` command in `package.json`
    * `src/utils/remark-plugings/wrapper-for-rocket-preset-extend-lion-docs/wrapper.js` contains a copy of `P00019-ing-web/rocket.config.mjs`. That is configuration setup where we specify the replacement rules. F.e here we specify that `<lion-` should be changed to `<ing-button`.
## remark-extend
`remark-extend` is setup by `src/utils/remark-plugings/wrapper-for-rocket-preset-extend-lion-docs/wrapper.js`
## babel-plugin-extend-docs
`babel-plugin-extend-docs` is setup by `src/utils/remark-plugings/wrapper-for-rocket-preset-extend-lion-docs/wrapper.js`


# How to migrate components documentation

## Lion Portal
In this section there are steps for migrating a component directly from `https://github.com/ing-bank/lion/tree/master/docs` to Astro portal. For the sake of the example let's migrate a button component from https://github.com/ing-bank/lion/tree/master/docs/components/button. Here are the steps:

* Migrate assets and extensions
    * In this repo create a directory called `public/components/button`. The name should match the component directory name. Note files in `/public` directory are going to be available at runtime by URL  `host:port/`. F.e. `public/components/button/src/icon.svg.js` is available by URL `host:port/components/button/src/icon.svg.js`
    * Copy all assets into the created directory from the Lion repo. These files need to be copied:
        * `public/components/button/extensions/BootstrapButtonTypes.ts`
        * `public/components/button/extensions/bootstrap-button.mjs`
        * `public/components/button/src/icon.svg.js`
    * Inside the copied files replace the `imports` for `js`/`mjs` files so that the files which are located in `node_modules`, imported directly from `node_modules`:
        * Inside `bootstrap-button.mjs` replace
            ```
            import { LionButton } from '@lion/ui/button.js';
            import { css } from 'lit';
            ```
          with
            ```
            import { LionButton } from '/node_modules/@lion/ui/button.js';
            import { css } from '/node_modules/lit';
            ```
* Migrate docs
    * In this repo create a directory called `src/content/demo/button`. The name should match the component directory name
    * Copy all `md` files into the created directory from the Lion repo
    * Inside `md` files identify all `imports` inside the blocks wrapped by the ` ```js script` block.
        * Replace all `relative imports`. F.e. in `button/examples.md` replace
        ```
        import iconSvg from './src/icon.svg.js';
        ```
      with
        ```
        import iconSvg from '/components/button/src/icon.svg.js';
        ```
        * The imports which refer to `node_modules` should stay untouched. F.e. `import { html } from '@mdjs/mdjs-preview';` should not be changed
* Update Astro configuration
    * Go throught every `md` file in `src/content/demo/button` and`js`, `mdjs` file in `public/components/button/`,
    * Copy the js file name that are imported and then
    * Add those file name into Astro-Lion integration here: `src/utils/astrojs-integration/lion/lion-integration.js`

## Ing-web Portal
* Follow all the steps from `Lion Portal` section but for components located in `https://dev.azure.com/INGCDaaS/IngOne/_git/P00019-ing-web?path=/docs/components`
* Replace all relative imports that refer to a package in `node_modules` as follows: replace `import '#define/ing-button.js';` with `import 'ing-web/button.js';`

# Futher improvements
* Propose the solution where the existing `docs` directory is kept untouched (or almost untouched) and via the build script all the files are copied to the structure Astro requires. That way we can keep the relative paths and it will make the development experience almost the same as now
    * Note. Consider the `watch` feature. Whenever any file inside `docs` is changed, Astro rerender those changes as it happens now on Rocket
    * Note. `docs` might be put into `content` directory. Then every md file should be provided with the proper tas, such as: `component`, `category` (Development, Changelog, Design), `platform` (web, ios, android). Those are required to render based on secondary navigation input (category + platform)
* In the current setup the ing-web is installed as a dependency as is referred as `node_modules/ing-web`. Should it instead be refered as `packages/ing-web`
* Update `rocket-preset-extend-lion-docs` and `remarkUrlToLocal` properly. See details in the `Migration of ing-bank/lion/packages-node` section.
* With the current limitation of having one `md` file per route, consider combining file mantually for the same route. F.e. on lion there is directory `docs/components/button`. That one contains multiple `md` files. And all those are for web platform. Consider combining those to one `web.md` file. The proposal assumes that there will be docs for the multiple platforms and then the doc for Design and Changelog.
    * As a consiquence update the way in-page navigation (right side menu) works. It shdould be updated as follows:
        * Build the menu dynamically based on `H2` tags found on the page
        * Write a `remark` plugin or reuse existing one to add anchor tags with IDs for every `##` hearder
* `src/utils/remark-plugings/wrapper-for-rocket-preset-extend-lion-docs/wrapper.js` contains some replacement pattern based on the URLs used in Rocket. We need to review those replacements according to our new endpoints
* What is `docs/components/button/status.mjs` and how we reuse it?
* `rocket-preset-extend-lion-docs` should be cleaned up from everything related to Rocket. The name `Rocket` should gone
