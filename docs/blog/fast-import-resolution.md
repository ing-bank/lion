---
title: 45x faster import resolution
published: true
description: Resolving an import path through our analysis tooling went from 1.739 ms to 0.033 ms per call, and a native glob, our own dev server and a typed CLI removed three more dependencies.
date: 2026-10-22
tags: [javascript, performance, tooling]
cover_image: /blog/images/fast-import-resolution.png
cover_credits: "plate, scene and mark - Lion"
eleventyNavigation:
  key: 45x faster import resolution
  title: 45x faster import resolution
---

`providence-analytics` is the tooling behind our own docs and analysis reports: it walks a repository, follows imports, and builds a picture of what depends on what. It is also where our dependencies accumulated, one convenient package at a time.

We went through it. Resolving a single import path went from **1.739 ms to 0.033 ms**, we replaced the glob library with the one Node now ships, we serve the dashboard from our own small dev server, and every entrypoint has declarations. Three dependencies left the install surface on the way.

## The measurement that started it

We time the resolver through its public entrypoint, `resolveImportPath`, over **2400 resolutions with memoization off** — otherwise the second call would be free and the table would measure a cache. Before:

| through `resolveImportPath` (2400 resolutions, memoization off) | before                      | after                   |
| --------------------------------------------------------------- | --------------------------- | ----------------------- |
| per call                                                        | **1.739 ms/call**           | **0.033 ms/call**       |
| total                                                           | **4174 ms**                 | **79 ms**               |

Dividing those wall-clock totals gives about 53x; the title rounds down. The per-call number is the one that decides whether an analysis run feels interactive or whether we go make coffee.

## What the old resolver was doing

`resolveImportPath` went through `@rollup/plugin-node-resolve`, driven through a fake rollup plugin context, with **a fresh plugin instance per call**.

`oxc-resolver` does the same job with one reused, native resolver and the same rules: `exports` maps with the ESM conditions, `module` preferred over `main`, `.mjs`/`.js`/`.json` extension guessing, `modulePaths` mapped to `modules`, and `customResolveOptions.preserveSymlinks` mapped to `symlinks`. `@rollup/plugin-node-resolve` moved to `devDependencies`; it is no longer referenced from production code at all.

Parity is asserted rather than assumed. One test builds a real temporary tree and resolves twelve specifier shapes with both the production resolver and the JS one, asserting both return the same path: relative paths with guessed extensions, `.mjs`, folder indexes, package mains, subdirectories, `exports` subpaths, a `{import, require}` package, an import-only `exports` map, a dual `main` + `module` package, an extensionless main, a Node builtin (`[node-builtin]`) and a path that does not exist (`null`). Plus a `modulePaths` case for both.

## The catch: native code cannot see a mocked file system

This would have bitten us later, so it is in the same change. `oxc-resolver` is native and reads the real file system, so the suites that run under `mock-fs` cannot use it — the mocks patch `fs`, and native code does not go through `fs`.

Rather than keep two code paths in the analysis, the resolver is swappable: `test-helpers` installs the JS resolver through `resolver.setResolver`, the same shape as the existing `fsAdapter.setFs`. Production stays native; the mocked suites exercise the JS implementation; the twelve-shape parity block above is what keeps the two honest. That split is deliberate, and the code says so.

We also considered the obvious cheaper answer, `require.resolve`, and rejected it on measurement: under it the mock-fs suites **lose 50 tests**, **4 of 10 real packages** (`lit-html`, `parse5`, `chai`, `@rollup/plugin-node-resolve`) resolve to a CJS build instead of the ESM one, and packages with an import-only `exports` map — **8 of 1386** in this repo's tree — throw `ERR_PACKAGE_PATH_NOT_EXPORTED`.

## Goodbye globby, hello `fs.promises.glob`

`globby` is gone, replaced by a small `fsGlob` util on top of `fs.promises.glob` covering the subset we use: literal paths, negations, `onlyFiles`, `onlyDirectories`.

That has a price, and it is the only caveat in this post that reaches consumers: **Node.js >= 22** is now required, because `fs.promises.glob` is not in older releases. For a developer tool that runs on our own machines and in our own CI, that was easy to accept. If providence-analytics were a library you install into an application, we would have thought harder.

The same change introduced package subpath imports — `#core/*`, `#utils/*`, `#types/*` — replacing the `../../../` chains in sources, tests, helpers and types. That is not a speed change; it is what made the rest of the refactor readable. 247 unit tests and 8 e2e tests passed at that point.

One honest gap: the declaration build could not be verified locally when we made that change, because the installed TypeScript was 4.9.5 while the root expects 7.x. We flagged it before merging.

## The dashboard serves itself

The dashboard used a small slice of `@web/dev-server`: serve static files, rewrite bare module specifiers for the browser, run the dashboard middleware. So we wrote that slice ourselves — `miniDevServer`, on Node's `http` — and exported it from `providence-analytics/utils.js` because it turned out to be generally useful.

Measured over `package-lock.json` as a name-level closure seeded at this package: **249 → 102 unique package names**, of which **147 were only reachable through `@web/dev-server`**.

It stays drop-in: `createDashboardServerConfig()` still returns a `@web/dev-server`-shaped config, and nothing else in the dashboard changed:

| `@web/dev-server` config | `miniDevServer`                                       |
| ------------------------ | ----------------------------------------------------- |
| `rootDir`                | served root, and the guard against path traversal     |
| `appIndex`               | served for `/`                                        |
| `nodeResolve`            | rewrites bare specifiers through the AST              |
| `moduleDirs`             | resolver search directory                             |
| `middleware`             | connect-style `(ctx, next)`, with `ctx.body`/`ctx.type` |
| `port` / `hostname` / `host` / `open` | as before                               |
| `watch`                  | accepted and **ignored** — this server does not watch |

Two details that were not obvious until they failed. Bare specifiers are resolved with `oxc-resolver` and rewritten through the AST parsed with `oxc-parser`, so specifier-like text inside comments and strings stays untouched and side-effect imports (`import "x"`) still work. And `/node_modules/<name>/<file>` is resolved per request — package first, then the file path appended — because resolving the whole URL as one specifier runs into the package's `exports` map, which normally does not expose `./index.js`. Also: `stop()` calls `closeAllConnections()`, or kept-alive sockets keep the process and the test run alive.

## Declarations on every entrypoint

The last piece is the least glamorous and the most useful: every entrypoint now carries types, and the dependency that made that impossible is gone.

| gate                                                        | before                       | after       |
| ----------------------------------------------------------- | ---------------------------- | ----------- |
| `tsc --noEmit`, this package                                | **564 errors** (611 once `@swc/core` resolves) | **0** |
| `tsc --build`, the declaration emit (surfaces what `--noEmit` cannot) | never ran; 60 × `TS4094` on top of the above | **0** |
| a consumer compiling the emitted declarations, `skipLibCheck: false` | 30+ × `TS2694`, one `TS2552` | **0**  |
| new `@ts-ignore` / `@ts-expect-error` / `as any`            | —                            | **0** (19 pre-existing suppressions removed) |

Two root causes. First, the emitted specifiers dangled: sources referenced hand-written types through `import('../../../types/index.js')`, and `tsc` does not copy `.d.ts` inputs into `outDir`, so from the emitted tree that path pointed at a directory that only ever contained `index.d.ts` — every name became `TS2694` for a consumer. The hand-written declarations are `.ts` now, so they are emitted and resolve.

Second, `commander@2.20.3`'s typings do not compile without `skipLibCheck`: `class Command extends NodeJS.EventEmitter` raises `TS2689`. That was invisible until we dropped the flag, and nothing else in the repository imports commander. Putting the flag back was not an option, so the CLI moved to `parseArgs` from `node:util` — which our own dependency notes had been asking for anyway. Every flag, alias, optional value, coercion and default is identical, and the 19 CLI tests pass unchanged, including one runtime quirk we kept on purpose: a string flag passed without a value is `true`, exactly as commander did it, because callers rely on it.

## Where this stands

The unit suite went from 240 to **263 passing / 0 failing**, plus 8 e2e, with `eslint`, `prettier`, `tsc`, `lock-scan` and `lint:versions` clean. `oxc-resolver` is pinned to `^1.12.0` — the version the repo already resolved transitively — so no second copy of its platform bindings enters the tree. It is declared as a `dependency` (a native package entering the install surface), and because `miniDevServer` is public through `utils.js`, `lit-element` and the dashboard's own imports are declared too.

Two caveats. Adding `@web/dev-server`'s replacement removed 147 package names, but declaring the dashboard's runtime imports as `dependencies` has its own cost — a leaner option, publishing the dashboard outside `files`, is a follow-up, not something we smuggled in. And one full-suite run right after the mock-fs fix reported 246 passing / 4 failing at a two-minute wall time; six runs after it and every run since are 253/0 at about 20 seconds. We could not reproduce it, so we say so.
