---
title: One Rust toolchain for lint and format
published: true
description: Lint time in Lion drops from 39,062ms to 6,966ms (~5.6x) and format checking from 26,849ms to 3,928ms (~6.9x). eslint, prettier and markdownlint are replaced by Rust binaries, and eslint leaves the tree entirely.
date: 2026-10-24
tags: [tooling, performance, javascript]
cover_image: /blog/images/rust-toolchain.png
cover_credits: "plate, scene and mark - Lion"
eleventyNavigation:
  key: One Rust toolchain for lint and format
  title: One Rust toolchain for lint and format
---

Linting JavaScript in Lion took 39 seconds. Formatting it took 27. Markdown took another two and a half. None of those numbers is catastrophic on its own, but `lint` is the most-run command in the repository - on every commit through the staged-file hook, on every save in the editor, in every CI job - so the total was paid dozens of times a day by everyone.

Three JavaScript tools and a markdown linter were doing two jobs. This replaces all four with Rust binaries from the oxc project plus `rumdl` for markdown:

| job                        | before                | after                      |
| -------------------------- | --------------------- | -------------------------- |
| js lint                    | eslint 8.57           | **oxlint 1.88**            |
| js + markdown format check | prettier 3.6          | **oxfmt 0.73**             |
| markdown lint              | markdownlint-cli 0.49 | **rumdl 0.3**              |

## What we measured

Same file sets, same ignore scopes, repeated runs on the current base:

| step                                                       | before                  | after                      |        |
| ---------------------------------------------------------- | ----------------------- | -------------------------- | ------ |
| js lint (1,408 js files)                                   | `eslint` **39,062 ms**  | `oxlint` **6,966 / 7,115 ms** | ~5.6x |
| format check (1,549 js + md, identical ignore scope)       | `prettier --check` **26,849 / 27,079 ms** | `oxfmt --check` **3,928 / 3,995 ms** | ~6.9x |
| markdown lint (254 files)                                  | `markdownlint` **2,384 / 2,496 ms** | `rumdl` **239 / 261 ms**   | ~9.5x |
| whole `lint` gate                                          | ~39 s                   | ~7 s                       | ~5.6x |

The lint numbers include the JavaScript plugins we kept, which is the honest comparison - a bare `oxlint` run with only its native rules over the same files takes **250-400 ms**. That is the ceiling of what removing the plugin layer bought - 17 to 28 times faster than what we actually ship.

The lint figures also carry a caveat worth stating: the 39-second eslint run reports 81 problems, 75 of them in the new files this work adds, which the old config did not ignore. The new config scopes that package out deliberately and the gate is green on the same tree.

## Why the formatter win is the smallest

Formatting got ~6.9x, not the ~5.6x of linting and nowhere near the 9.5x of markdown. That gap is structural rather than a tuning problem. oxfmt's own report ends with `Finished in 3,727 ms on 1,549 files using 8 threads`, and the interesting comparison is inside it: the same Rust parser lints the whole JavaScript set in 0.25-0.40 s and formats it in ~3.7 s. Linting can stop as soon as the rules are matched; formatting has to build the intermediate representation and emit every token of every file.

Per file that is roughly **2.4 ms** for oxfmt against **19 ms** for prettier on JavaScript. A JavaScript parser and printer is not a hundred times slower per byte than a Rust one, so there was never a hundredfold to win here. Most of the headline speedups in the table above come from *removing an architecture* - eslint's plugin layer, with its per-rule AST traversal - not from printing faster.

Thread scaling is the other limit: a single-threaded run needs about **4.4x** longer than eight threads, so more cores will not compress the wall much further. Process start, globbing and ignore matching are ~0.25 s, about 6% of oxfmt's wall clock.

The practical conclusion is that ~4 s for the whole js and markdown tree is already "runs on save" territory. Going lower means scoping, not a faster formatter: the staged-file hook formats only what changed, and formatting a single package is 0.1-0.3 s. In CI the lint step drops from ~17 s to ~1 s. The markdown pass - the one that runs while you are writing documentation - goes from 2.4 s to 0.25 s, which is the change people actually feel.

## It is not a drop-in

`oxfmt` is not byte-compatible with prettier. Applied to a tree prettier had just approved, it changes **38 files and 890 lines**, and no option closes the gap: `jsdoc: false`, `objectWrap: "collapse"` and `experimentalOperatorPosition: "start"` all leave it at 38 files. This is formatter behaviour, and prettier exposes no option for those constructs either, so the two cannot be made to agree from either side.

We therefore treated the churn as its own one-time style commit, separate from every functional change, so the diffs that matter stay reviewable. The content is whitespace, markdown table padding, and two mechanical reflows - JSDoc `@type` cast parenthesisation and tagged-template call arguments - that we proved type-neutral by comparing emitted declarations under TypeScript 7.0.2: identical output.

`// prettier-ignore` comments keep working. Both oxfmt and rumdl honour them, verified by probe, so the 24 files carrying one needed no edit.

## Keeping the rules, not the architecture

Deleting a linter is easy; keeping the rule coverage that made it useful is the actual work. Of **226 enabled eslint rules, 206 are enforceable by oxlint** and 20 were dropped, each with a written reason.

For the rest we did not want to own a rule library. The existing eslint plugins still run - through a small compatibility adapter rather than a rewrite. Stock oxlint gives plugin rules neither an implementation of `sourceCode.getJSDocComment` (it throws, and `eslint-plugin-wc` calls it for every class, which aborts the whole plugin run for that file) nor a writable `sourceCode.parserServices` (it is a frozen `{}`, and `eslint-plugin-lit-a11y` stores its tag names there, so all 26 enabled `lit-a11y/*` rules silently report nothing). The adapter supplies both from JavaScript, per file, so the rule ids stay `wc/<rule>` and `lit-a11y/<rule>` and findings are identical to what we had before - same rules, same `file:line:col`.

Only **13 rules** have no plugin behind them and needed code of our own, loaded through oxlint's `jsPlugins` bridge. Fifteen files trigger `class-methods-use-this` false positives and carry a file-level disable comment that states its reason, so the intent survives the migration.

We are treating the adapter as a bridge and not a destination. Each of its two behaviours is a small change in the package that owns it - read `node.jsDoc` instead of `getJSDocComment`, key per-file state off a `WeakMap` instead of `parserServices` - and both work under eslint and oxlint alike, so nothing has to be conditional. We would rather send those upstream than carry them.

## Smaller surface, fewer findings

Replacing four tools with three prebuilt Rust binaries removes a dependency graph as a side effect:

|                                          | before         | after                       |
| ---------------------------------------- | -------------- | --------------------------- |
| packages in the lock                     | 1,579          | **1,459** (-120, -7.6%)     |
| `node_modules/eslint`                    | present        | **absent**                  |
| `node_modules/markdownlint*`             | present        | **0 entries**               |
| `npm audit` findings, same advisory DB   | **37**         | **30**                      |

The removed entries are the whole eslint 8.57 graph - the config packages, the parser chain, `@eslint-community/*`, `@humanwhocodes/*`, `eslint-scope`, `doctrine` - plus the markdownlint and prettier chains. That is four third-party lint configs and a pluggable parser that no longer run in our tooling context and no longer land in Dependabot's queue. `npm audit` drops seven findings with **no new high or critical entry**: 18 high on both sides, 0 critical on both.

One honest wrinkle: prettier remains in the lock transitively, because tooling we depend on uses it. It is no longer a direct dependency, no longer the formatting gate and no longer wired into the editor - but it is not gone from `node_modules`, and saying otherwise would be wrong.

## Where this stands

This is in review, not merged. The editor config and the staged-file hook are migrated in the same change, otherwise the hooks break the moment the dependencies disappear, and the ignore lists moved with the tools - a deliberately unformatted file in a vendored upstream directory is still left alone, which we checked.

If you are considering the same move, three things carried the most weight for us. Measure the job you actually run, plugins included, because the native-rule number is a ceiling you will not reach. Expect a one-time reformat and give it its own commit, since a formatter swap cannot be made invisible. And budget your effort for rule parity rather than for speed: the binaries were fast on the first try, while matching the old findings took the compatibility work that makes up most of this change.
