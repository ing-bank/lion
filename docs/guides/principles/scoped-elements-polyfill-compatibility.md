---
parts:
  - Principles
  - Scoped Elements
  - Polyfill compatibility
title: 'Polyfill compatibility and the test modes'
---

# Polyfill compatibility and the test modes

`ScopedElementsMixin` (the implementation is `ScopedElementsMixinV4` in
`packages/ui/components/core/src/`) talks to whichever contract the page provides, so a consumer can
adopt the new polyfill or native support without changing application code. This page records what
that is worth, how it is verified, and the one configuration that is not supported.

## Test modes

`web-test-runner.polyfills.mjs` resolves `SCOPED_POLYFILL` to the scripts the test page loads:

| mode          | what is loaded                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `v0`          | the polyfill that is on npm today (0.x)                                                                                         |
| `v1`          | the redesign (1.x), forced with `window.CustomElementRegistryPolyfill = { force: true }`                                        |
| `v1-reserved` | as `v1`, plus `lion-input` listed in `CustomElementRegistryPolyfill.formAssociated` before the polyfill runs                    |
| `none`        | no polyfill: the browser's own support                                                                                          |
| `no-support`  | no polyfill, and Chromium started with `--disable-blink-features=ScopedCustomElementRegistry`, i.e. no scoped registries at all |
| `v0+v1`       | both polyfills, old one first — _not a supported configuration_, kept to reproduce the clash                                    |

`web-test-runner.scoped-spec.config.mjs` runs the scoped-elements suites in one mode;
`web-test-runner.scoped-full.config.mjs` runs the whole `@lion/ui` suite in one mode (it only
overrides `browsers` and `testRunnerHtml`, so every test, group, SSR plugin and coverage threshold
stays in force).

```bash
npm run test:scoped-elements:v0            # or :v1, :none, :no-support
npm run test:browser:scoped-v1             # the whole suite on the redesign, forced
npm run test:browser:scoped-none           # the whole suite on native support
npm run test:browser:scoped-no-support     # the whole suite with no scoped registries at all
npm run demo:polyfill-choice               # see below
```

The redesign is not on npm, so a build of the PR branch is vendored in
`packages/ui/components/core/test/scoped-registry-v1/` and regenerated with
`npm run update:scoped-registry-polyfill` (pinned commit unless `--latest`; `--check` verifies the
vendored file). Delete both once it ships.

## What has been measured

Whole `@lion/ui` suite, chromium, 166 files:

| mode                                | result                            |
| ----------------------------------- | --------------------------------- |
| `v0` (0.x polyfill)                 | 3528 passed, 0 failed, 35 skipped |
| `v1` (redesign, forced)             | 3526 passed, 0 failed, 37 skipped |
| `none` (native support)             | 3528 passed, 0 failed, 35 skipped |
| `no-support` (no scoped registries) | 3528 passed, 0 failed, 35 skipped |

The two extra skips in `v1` are the "when scoped registries are not supported" tests in
`ScopedElementsMixin.test.js`: they simulate the absence of support by taking the DOM features away,
which is meaningless underneath a force-loaded 1.x polyfill (the fallback host does not even get a
shadow root). They run for real in `no-support` mode instead.

Scoped-elements suites only (11 tests): `v0` 11 pass · `v1` 9 pass + 2 skipped · `none` 11 pass ·
`no-support` 11 pass.

## Do not load both polyfills

They patch the same DOM APIs and both replace `window.customElements` and
`window.CustomElementRegistry`, so they contradict each other. Measured, with both loaded:

| load order | 0.x contract                 | 1.x contract                                                                                                         |
| ---------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| old first  | works                        | `TypeError: Failed to read 'customElementRegistry' from ShadowRootInit`                                              |
| new first  | resolves the **wrong class** | `NotSupportedError: a global registry must be the document's registry`, plus an internal `TypeError` in the redesign |

Old-first "works" only in the sense that everything which speaks 0.x keeps working — the compat mixin
included, because it detects 0.x and speaks it — while the 1.x model it was loaded _for_ is unusable.
New-first is strictly broken.

## Which polyfill does a page need?

One polyfill per page; it is a page-global shim, shared by every scoped registry on the page. Which
one is decided by the **oldest** version of the library on that page:

- a version that still speaks the 0.x contract needs `shadowRoot.createElement`, so the page must
  load the **0.x** polyfill;
- a page can move to the redesign only once every version on it carries the compat mixin;
- on a browser with native support the polyfill can be dropped.

`npm run demo:polyfill-choice` demonstrates this (`SCOPED_POLYFILL` selects the mode), and
`packages/ui/components/input/test/two-lion-versions-polyfill-choice.demo.js` asserts each mode's
actual outcome. In this repository the only place that touched the contract besides the mixin was
`core/src/SlotMixin.js`, which had its own `!!ShadowRoot.prototype.createElement` check and now goes
through `createScopedElement`; any extension layer that copied that idiom is the thing to grep for.
