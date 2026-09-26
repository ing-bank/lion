# @lion/lit-ssr-patch-tests

**Temporary, in-repo home for the tests that cover the `@lit-labs/ssr` patch.**

The patch lives in [`patches/@lit-labs+ssr+4.1.0.patch`](../../patches/README.md) and
makes `@lit-labs/ssr` run _element directives_ (`<div ${myDirective()}>`) while
rendering on the server, which upstream deliberately does not do. These tests
are what proves the patch actually does that — and that it keeps doing it on
the next `@lit-labs/ssr` bump.

## Why a separate package instead of living in `@lion/astro-lit`

These tests used to sit in `packages-node/astro-lit/test-node/`. They do not
test the Astro integration, though: they import `@lit-labs/ssr` and
`lit` only, never `@lion/astro-lit`. Kept there they read as _Astro
integration_ tests, and a file inside a Lion-private package cannot be handed
to upstream.

Here they are a self-contained suite whose subject is the upstream package, in
a package of their own, so the whole directory can move to
[`lit`](https://github.com/lit/lit) together with the patch.

This package is scaffolding, not a deliverable: it is `"private": true`, it is
not published, and nothing imports it. When the patch goes upstream, this
package should go with it and disappear from this repo.

## Running

```bash
npm run test:node -w packages-node/lit-ssr-patch-tests
```

It is picked up by the repo-wide `npm run test:node`
(`--workspaces --if-present`) and therefore by the `node-tests` job in
`verify-pr`, on both ubuntu and windows. No extra npm script and no workflow
change is needed.

Run against the _pristine_ package to see what the patch is buying you — same
tree, only `patches/` removed:

| `@lit-labs/ssr`  | result                                                                          |
| ---------------- | ------------------------------------------------------------------------------- |
| 4.1.0 (pristine) | fails: element directives never run, `FallbackRenderer#getAttribute` is missing |
| 4.1.0 + patch    | green                                                                           |

That is the coverage proof: every assertion here fails without the patch.

## Files

| file                                  | covers                                                                                                                                                                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `test-node/directives.test.js`        | an element directive runs during SSR, its attributes are serialized, `part.element.getAttribute()` reads back, `part.options.host` is populated, light DOM via `renderLight()`, and server-only (non-hydratable) templates no longer throw |
| `test-node/fallback-renderer.test.js` | `FallbackRenderer` stringifies `setAttribute` values like a browser and gained `getAttribute`                                                                                                                                              |
| `test-node/fixtures.js`               | the directives/components the two suites share, plus `renderToString()`                                                                                                                                                                    |

The one step that _is_ specific to this repo is `@lion/astro-lit`'s own
`astro-lit.test.js`, which checks the container renderer. It stays in
`packages-node/astro-lit/test-node/`.

## Lifting these upstream

Both files are written to travel. Two things have to change when they go into
`lit`'s `packages/labs/ssr`:

1. **Test framework.** Here they are `mocha` + `chai` node tests; upstream runs
   its ssr tests through `@web/test-runner` with browser globals. The template
   bodies carry over; the imports and the runner config do not.
2. **The deep import.** `fallback-renderer.test.js` reaches into
   `@lit-labs/ssr/lib/element-renderer.js`, which is not a public subpath. In a
   lit PR it becomes a relative import into `src/`, or whatever
   `private-ssr-support` chooses to expose — that decision belongs to the
   upstream PR, not here.

`patches/README.md` documents the source changes these tests pin.
