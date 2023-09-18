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
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

# How Astro-Lion integration works

# How to migrate components documentation 

## Lion Portal
For the sake of the example let's migrate a button component from https://github.com/ing-bank/lion/tree/master/docs/components/button. Here are the steps:

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
