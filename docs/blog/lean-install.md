---
title: A root install that can no longer run the website's toolchain
published: true
description: A root install no longer runs the website's toolchain. Lock entries went from 2,845 to 1,579 (-44.5%) and distinct package names from 1,457 to 1,009 (-30.7%), taking out the largest single block of unused supply-chain surface with nothing added.
date: 2026-10-30
tags: [javascript, security, tooling]
cover_image: /blog/images/lean-install.png
cover_credits: "plate, scene and mark - Lion"
eleventyNavigation:
  key: A root install that can no longer run the website's toolchain
  title: A root install that can no longer run the website's toolchain
---

Every `npm install` is a decision to execute other people's code on your machine, and in CI, with your secrets in the environment. We were making that decision about 2,845 times per checkout, and a large part of those packages existed only to build our website.

No product code changed and the published packages are untouched:

| what we measure             | before | after     | delta  |
| --------------------------- | -----: | --------: | -----: |
| `package-lock.json` entries |  2,845 | **1,579** | −44.5% |
| distinct package names      |  1,457 | **1,009** | −30.7% |

**Nothing was added.** Every number comes from `npm install --package-lock-only` against the existing lock - no version drift in the delta, an unchanged control in the same harness.

## The four changes, in the order they landed

Each change landed with its own regenerated lockfile, so its effect is visible alone:

| change                                                        | lock entries | delta |
| ------------------------------------------------------------- | -----------: | ----: |
| starting point                                                |        2,845 |       |
| take the legacy rocket build out of the root install          |        2,668 |  −177 |
| drop unused tooling, replace `npm-run-all` with `wireit`      |        2,006 |  −662 |
| move the astro source out of the workspace                    |        1,628 |  −378 |
| drop the stale screenshot harness, swap `globby` for `fsGlob` |    **1,579** |   −49 |

Landed after the repository's own `bundlesize` and rollup work; no version is downgraded.

## The website was the biggest offender

Two whole toolchains lived in the root `package.json`: the Astro portal that owns the site root, and the legacy "rocket" snapshot under `/prev`. Neither builds the library, yet both were installed on every checkout, including CI runs that only touch `packages/`.

The rocket build is a frozen 2021/2022 snapshot - `puppeteer@13`, `sax-wasm`, `check-html-links`, its own copies of pre-1.0 `@lion/*`. It now lives outside the `workspaces` globs: `cd prev-portal && npm install && npm run build` writes `_site/prev`, still building cleanly (`Copied 225 files / Wrote 200 files`, exit 0), with one documented limit - the `api-table` pages come from a gitignored generated file.

The Astro portal was the bigger tree: astro, `@astrojs/*`, vite, shiki, pagefind and friends. It is now an Astro project in its own directory, reading the library's `docs/` for its content collections and writing to the `_site` the root `deploy` publishes. It consumes `@lion/ui` and `@lion/astro-lit` through `file:` links, **so a portal build always renders the checkout you are in** - no skew between what you edited and what the site shows. The install is 569 packages and builds 237 pages, exit 0, with `node_modules/astro` absent at the repo root.

The work was not moving files but the assumptions that only held at the root: five content-collection bases from `./docs` to `../docs`, a remark plugin that derived the repo root by counting `..` segments from its own filename, and a portal `package.json` that had to start declaring two hoisted arrivals.

That last point is the general lesson: **hoisting hides undeclared dependencies, and undeclared dependencies are how a package you never chose ends up running install scripts on your CI.**

## A test path nobody ran

The clearest case of pure surface was the BrowserStack path. Its config was last touched in February 2023. CI runs only the Playwright launcher across firefox, chromium and webkit, the `test:browserstack` script had no caller in the repository, and our own `comments.toBeRemoved` list already said those dependencies existed only for that config. Dependabot still opened upgrade PRs for the subtree.

Measured as a name-level closure from the root test devDependencies, a narrower scope than the table above:

| root test devDeps closure     | before |   after |
| ----------------------------- | -----: | ------: |
| unique package names          |    579 | **340** |
| reachable lock entries        |    598 |     359 |
| footprint on disk             |  193MB | **89MB** |
| packages with install scripts |      4 |   **1** |
| - of which binary downloaders |      2 |       0 |

`edgedriver` and `geckodriver` installed native binaries during `npm i`; with them gone the only install-script package left is mac-only `fsevents`, a watcher transitive that installs nothing.

The lock loses 76 entries - inside the 204 npm's own regeneration drops, the rest newer dedupe decisions.

## The vulnerability hiding in a duplicate

One removal was not about size. `@lit-labs/testing` asked for `@web/test-runner-commands@^0.6.1` while the root wanted `^0.9.0`, so npm nested a second copy, dragging in an older test-runner stack and `ip@1.1.9` - inside the affected range of **GHSA-2p57-rm9w-gvfp** (SSRF improper categorization in `isPublic`, high).

The plugin never imports that package: `lib/lit-ssr-plugin.js` implements `executeCommand` itself, and only the client-side fixture helper uses `executeServerCommand`, an API that did not change. One root override was enough - a single 0.9.0 instance, ten entries gone, `ip` out of the tree, SSR fixtures untouched, browser suite green.

**The vulnerable package was not one we chose. It was one a semver range conflict smuggled in.**

## Already switched off, still installed

`bundlesize` - plus the `@open-wc/building-rollup` v2 pin it needed, justified in a comment as "for the rocket setup" - existed for a script commented out in CI. It took a vulnerable `axios@0.19.2` with it.

`npm-run-all` was there for `run-p`, used only by `lint` and `test`; `wireit` is already a root devDependency the packages orchestrate with. Two dependency-only scripts now run the same children in parallel with the same failure behaviour - a failing child propagates its exit code and output, verified on a probe project and by the six-script lint run in CI (54.7s). The trade-off: `run-p lint:*` expanded a glob, so a new `lint:*` script must be listed explicitly.

The stale screenshot harness had one caller, used a dev server unmaintained since 2021, and was in no workflow. Gone with it: 32 baselines, three test files, and the `sharp` override. `sharp` was in the root install only through that harness, so a native dependency and its platform binaries are gone entirely.

## One still in review: 106MB of unused compiler

`providence-analytics` declared `@swc/core` optionally so a service could lazily import it for `astType: 'swc'`. **Nothing ever selected that path:** no config or parser assignment in the sources sets `'swc'`, six analyzers require `'oxc'`, the base class requires `'babel'`, and the only runtime consumer sits inside `if (astType === 'swc')`.

| installed, fresh `npm ci`  | before  | after |
| -------------------------- | ------: | ----: |
| `@swc` directory           |  106 MB |     0 |
| packages added by `npm ci` |   1,385 | 1,380 |

Of that 106MB, 48MB is a gnu binary and 59MB a musl one - **the musl build cannot load on a glibc host at all.** An interrupted download had also left 107MB of extract debris in every install: `.node` files with no `package.json`, a broken install nobody noticed.

This one is **in review at the time of writing**. It is not a runtime break for anyone who never asks for that parser, but it narrows an exported type union, so minor versus major is genuinely open. Test counts are identical either way: 269 passing / 20 pending plus 8 end-to-end, against the same command on a clean checkout.

## What this does not fix

- `patch-package` and `gh-pages` stay: the four patches are load-bearing, and `gh-pages` is the deploy mechanism.
- Two chunks remain inside tooling we do not control: `@web/test-runner` ships its own Chrome launcher and `puppeteer-core` (roughly 290 names) though every config of ours uses Playwright, and the dev-server core underneath is 226 packages, 34MB and 452ms of import time.
- Lint and test-framework migrations are not cleanup; the eslint 8 stack and mocha/chai/sinon to `node:test` both change behaviour.

## What we would tell another repository

- **Sort your install surface by "does this build what we publish", not by size.** The two largest trees here were the website's.
- **Measure with the lockfile and keep a control.** That is what let us claim a delta instead of a vibe - and what exposed the gap between our 76-entry prune and npm's 204.
- **Look for duplicates before you look for vulnerabilities.** The one advisory here arrived through a range conflict between two packages we wanted.

A root install that cannot run the website's toolchain is a smaller blast radius, a faster CI, and - the part that matters - far fewer strangers executing code on our machines.
