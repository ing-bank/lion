## @mdjs/core@0.20.0

### mdjsStoryParse.js

The original file URL is here: [URL](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js)

#### Why

Astro does not call [mdjsStoryParse](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js#L53) every time an md file is changed while `watching`. The function is called only once. However some [shared variables](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js#L58-L59) are set on the level of the `mdjsStoryParse`. That leads to the situation that those variable are shared among all md files which is not according to the design. The orignal idea is to share those per an md file. As a result when generating `__mdjs-stories.js` files, they get polluted with the data from other files.

#### About the fix

- [nodeCodeVisitor](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js#L68) function was moved under the [transformer](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js#L182C18-L182C29) function
- [Shared variables](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsStoryParse.js#L58-L59) were moved under the `transformer` function

This way the shared variables instantiated on every `transformer` function call.

### mdjsParse.js

#### Why patching

Astro does not call [mdjsParse](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsParse.js#L7) every time an md file is changed while `watching`. The function is called only once. However some [shared variables](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsParse.js#L8) are set on the level of the `mdjsParse`. That leads to the situation that those variable are shared among all md files which is not according to the design. The orignal idea is to share those per an md file. As a result when generating `__mdjs-stories.js` files, they get polluted with the data from other files.

#### About the patch

- [Shared variables](https://github.com/modernweb-dev/rocket/blob/%40mdjs/core%400.20.0/packages/mdjs-core/src/mdjsParse.js#L8) were moved under the `transformer` function

This way the shared variables instantiated on every `transformer` function call.

### mdjsSetupCode.js

Dynamic `imports` for `@mdjs/mdjs-preview/define` and `@mdjs/mdjs-story/define` were removed. These imports are inlined into `__mdjs-story.js` by `copyMdjsStories.mjs` remark plugin. This is done to enable `dist` bundling.

## @astrojs/markdown-remark

The patch is done to inhance the `id` naming of <H> tag `HTML` elements.

### Why updating naming

In the current implementation of the portal we need to concatenate `md` pages. Astro creates unique values for the `id` attributes for `<H>` tags (`h1`, `h2`, etc. ). The problem is that the `id`'s are not longer unique after concatenation. There might be multiple `overview` `id`'s which is not correct for navigation.

### What the solution is about

The solution is to add the parent directory name to the each <H> id as a prefix. That is if the `md` file being parsed is called `docs/tools/my.md` and let's say there is an `h2` tag in with id called `overview`, then after applying patch, the new `id` value becomes `tools-overview`.

## lit

The patch is required to make `astro build` work correctly. `lit` is added as an `external` library for the build option in `astro.config.mjs`. And without the patch the build throws errors.
