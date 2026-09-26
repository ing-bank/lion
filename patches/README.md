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

Dynamic `imports` for `@mdjs/mdjs-preview/define` and `@mdjs/mdjs-story/define` were removed. These imports are inlined into `__mdjs-story.js` by `remarkProcessDemos.mjs` remark plugin. This is done to enable `dist` bundling.

## @astrojs/markdown-remark

The patch is done to inhance the `id` naming of <H> tag `HTML` elements.

### Why updating naming

In the current implementation of the portal we need to concatenate `md` pages. Astro creates unique values for the `id` attributes for `<H>` tags (`h1`, `h2`, etc. ). The problem is that the `id`'s are not longer unique after concatenation. There might be multiple `overview` `id`'s which is not correct for navigation.

### What the solution is about

The solution is to add the parent directory name to the each <H> id as a prefix. That is if the `md` file being parsed is called `docs/tools/my.md` and let's say there is an `h2` tag in with id called `overview`, then after applying patch, the new `id` value becomes `tools-overview`.

## lit

The patch is required to make `astro build` work correctly. `lit` is added as an `external` library for the build option in `astro.config.mjs`. And without the patch the build throws errors.

## @lit-labs/ssr

### Why this patch exists

Upstream `lit-labs/ssr` deliberately does not run *element directives* while
rendering on the server. A directive bound to an element part
(`<div ${myDirective()}>`) is skipped entirely: its `update()` callback is never
called, and nothing is emitted for it. Server-only (non-hydratable) templates
even throw:

> Server-only templates don't support element parts, as their API does not
> currently give them any way to render anything on the server.

Lion renders parts through element directives (see
`src/components/shared/UIPartDirective.js`) in both shadow DOM and light DOM.
Skipping them on the server means attributes/refs that a directive sets are
missing from the server-rendered markup, which breaks (and de-hydrates wrongly)
anything that relies on them.

### What the patch changes

- `lib/render-value.js`
  - the `element-part` opcode now carries the `ElementPart` constructor and the
    tag name, and no longer throws for server-only templates
  - the `element-part` render step creates an `ElementPart`, instantiates the
    directive, calls its `update()` and serializes the attributes the directive
    set on the element (its "light DOM" node)
  - `ElementPart` is destructured from `lit-html`'s `private-ssr-support`
    (it is not used by upstream `lit-labs/ssr` 4.x anymore)
- `lib/element-renderer.js`
  - `FallbackRenderer#setAttribute()` coerces values to strings, like a browser
  - `FallbackRenderer#getAttribute()` is added, so a directive can read back an
    attribute off the element renderer it is attached to

### Tests

`packages-node/astro-lit/test-node/` covers this (`npm run test:node -w
packages-node/astro-lit`, or `npm run test:node` for the whole monorepo): it
renders templates containing element directives with `render()` and asserts on
the produced HTML. Removing the patch makes those tests fail.

### Updating

The patch is tied to an exact `@lit-labs/ssr` version (the filename carries it,
and the root `package.json` `overrides` pin it). When bumping `@lit-labs/ssr`:

1. bump the version in `package.json` (`devDependencies` + `overrides`)
2. reapply the change above to the new `node_modules/@lit-labs/ssr` sources
   (the code around it moved between 3.x and 4.x)
3. run `npx patch-package @lit-labs/ssr` to regenerate the patch file
4. run `npm run test:ssr` to confirm it still does the right thing

## @astrojs/lit

No longer used. The integration is inlined in `src/integrations/lit/` so it can
track this repo's `@lit-labs/ssr` version and its patch instead of being pinned
to whatever lit-labs/ssr range `@astrojs/lit` supports.
