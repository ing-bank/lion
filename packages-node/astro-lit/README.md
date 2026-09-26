# @lion/astro-lit

Astro integration that server-renders Lit components (through
[`@lit-labs/ssr`](https://lit.dev/docs/ssr/)) and hydrates them in the browser.

It is an in-repo replacement for [`@astrojs/lit`](https://docs.astro.build/en/guides/integrations-guide/lit/).

## Why it is in this repo

`@astrojs/lit` pins `@lit-labs/ssr` to a range (`^3.2.2` at the time of
writing), and this repo pins an exact `@lit-labs/ssr` version plus a local patch
on it (`patches/@lit-labs+ssr+*.patch`, see `patches/README.md`). Lion renders
its parts through _element directives_ (`<div ${part()}>`), which upstream
lit-labs/ssr does not run on the server at all, so the patch is what makes the
server-rendered output complete. Keeping the integration here means the two can
be bumped together instead of the integration capping the lit-labs/ssr version.

## Entrypoints

| subpath                          | purpose                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `@lion/astro-lit`                | the Astro integration (default export); also exports `getContainerRenderer()` for the Container API |
| `@lion/astro-lit/server.js`      | server container renderer — `check()` + `renderToStaticMarkup()`                                    |
| `@lion/astro-lit/client.js`      | client entrypoint used by Astro for hydrated (`client:*`) islands                                   |
| `@lion/astro-lit/client-shim.js` | declarative-shadow-DOM ponyfill, injected inline into `<head>`                                      |

The integration passes entrypoints as package subpaths (as `@astrojs/mdx` does).
That is deliberate: Astro uses the client entrypoint string both as a Vite build
input and as the key of the client manifest that hydrated islands point at.
Non-string (URL) entrypoints are dropped from the client build, which then fails
per island with `Cannot find the built path for ...`.

## What changed relative to `@astrojs/lit`

The old server entry was written against lit-labs/ssr 3.x. Three things had to
change for 4.x:

1. **`renderShadow()` returns thunks, not strings.** In 3.x it yielded HTML
   strings, so `yield* instance.renderShadow(renderInfo)` was correct. In 4.x it
   yields thunks, which have to be trampolined — the server entry now feeds them
   through lit-labs/ssr's `RenderResultIterator`. Without this, the thunk source
   is emitted verbatim, e.g.
   `<template shadowroot="open">() => renderValue(this.element.render(), renderInfo)</template>`.
2. **The render context grew.** 4.x `renderValue()` reads `slotStack` and
   `eventTargetStack`, and lit-labs/ssr itself pushes `customElementHostStack`
   while rendering. `@astrojs/lit` passed four keys; the renderer here passes a
   complete context.
3. **Entrypoint plumbing moved into this package.** `@astrojs/lit` exposed
   `server.js`, `dist/client.js`, `client-shim.min.js` and
   `hydration-support.js` from its own package; those are now the subpaths above.

Unchanged on purpose: the renderer API it relies on (`LitElementRenderer` with
`setProperty`, `setAttribute`, `renderAttributes`, `renderShadow`,
`shadowRootOptions`) and the client semantics (`client:only` handling, rewriting
the `slot` attribute of slotted children, removing `defer-hydration`, assigning
props that exist on `Component.prototype` as properties).

## Tests

```bash
npm run test:node -w packages-node/astro-lit
```

`test-node/` covers the container renderer — declarative shadow root, reactive
props, named slots, and that element directives run through it:

- `astro-lit.test.js` — the container renderer
- `fixtures.js` — the `part` directive it renders

The lit-labs/ssr element-directive behaviour itself is not tested here: those
tests live in `@lion/lit-ssr-patch-tests`, where they target `@lit-labs/ssr`
directly instead of a Lion package, so they can move upstream with the patch
(see [`patches/README.md`](../../patches/README.md)). With a pristine
(unpatched) `@lit-labs/ssr` the test here that renders a `part` fails — which is
exactly what it is there to catch.
