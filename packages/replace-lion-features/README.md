# Convert Lion Modules

This package functions as a middleware for [es-dev-server](https://github.com/open-wc/open-wc/tree/master/packages/es-dev-server).

It replaces instances of lion with your own custom prefix.
The most common use case for this package is serving the `lion` Storybook demos but for your own design system / extension layer,
where you use a different prefix.
Currently, this use case is hard-coded in replace middleware creator function, since it checks URL for requests to the lion Storybook MDX files.
You can use this as an example if you want to use it for other use cases.

For this README, we are taking imaginary `wolf` design system as an example.

In Lion, classes are always prefixed with `Lion` and tags are prefixed with `lion`. Paths are always to `/node_modules` if you are a user, but your extensions live in your source code.

This package is intended to act as a middleware for the `es-dev-server` and convert all these lion-specific things in the filesystem to ones that align with your extension layer, **on runtime**.

Examples:

- `LionRadioGroup` --> `WolfRadioGroup`
- `<lion-calendar>` --> `<wolf-calendar>`
- Import statement from somewhere in `/node_modules/` where `@lion` is installed, `... from '../LionInput.js';` --> `... from '../../../../packages/input/WolfInput.js';`

## How es-dev-server + middleware works

In essence, the process, for example with Storybook served by `es-dev-server`:

1. Client goes to Storybook URL for a demo about `WolfTooltip`
2. Browser creates requests to localhost with the URL path
3. `es-dev-server` takes the request and looks into the filesystem
4. If it finds the file, it calls all registered transformers/middlewares
5. It finds our LionModuleConverter which is passed on the content of the file on the file system
6. The content is transformed / converted
7. `es-dev-server` sends the final fully processed file to the client

## How to configure

For Storybook powered with `es-dev-server`, you can set configuration in `/.storybook/es-dev-server.config.js`.

In your `es-dev-server` configuration, import the middleware

```js
const { createLionFeaturesReplaceMiddleware } = require('../../index.js');
```

and then configure it with some options

```js
module.exports = {
  responseTransformers: [
    createLionFeaturesReplaceMiddleware({
      outPrefix: 'wolf',
      getIndexClassImportPath: ({ outPackageName }) => {
        if (outPackageName === 'input-email') {
          return '../../../../forms.js';
        }
        return `../../../../packages/${outPackageName}/index.js`;
      },
      getTagImportPath: ({ outTagName }) => {
        return `../../../../packages/replace-lion-features/demo/${outTagName}.js`;
      },
    }),
  ],
};
```

### Options

- inPrefix, by default this is `lion` because you probably use our components
- outPrefix, for example in this README we have used `wolf`
- currentPackage, important to pass which package is being evaluated, this information will be in the URL that the client is visiting, you have access to this in the middleware function (`/packages/<package>/stories/index.stories.mdx` where `<package>` is the currentPackage)
- componentNames, for which of `lion`s components you want to apply the middleware, by default it will take all of them
- classNames, since we also have packages that are not components, we do this separately, by default it will take all of them
- getClassImportPath, by default we assume your class imports are located at `../../../../packages/<package>/src/<ClassName>.js`; from the `lion` file location, but your folder structure may be different
- getTagImportPath, by default we assume your tag imports are separate, and located at `../../../../packages/<package>/<tag-name>.js`;
- getIndexClassImportPath, by default we assume your own index.js files are located at `../../../../packages/<package>/index.js`;
