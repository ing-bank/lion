---
title: Migrating Lion to TypeScript 7
published: false
description: TypeScript 7 type-checks Lion's ~1,000 declaration files about six times faster. Consumers of @lion/ui notice almost nothing, and libraries built on top of it notice nothing at all.
date: 2026-09-26
tags: [javascript, typescript, performance]
eleventyNavigation:
  key: Migrating Lion to TypeScript 7
  title: Migrating Lion to TypeScript 7
---

TypeScript 7 is the native (Go) compiler. For a library that types its JavaScript with JSDoc and emits just under a thousand declaration files, that is not a marginal difference:

| compiler             | cold `tsc --build --force` | declarations emitted |
| -------------------- | -------------------------- | -------------------- |
| TypeScript 4.9.5     | 29,060 ms / 30,192 ms      | 972                  |
| **TypeScript 7.0.2** | **4,813 ms / 4,249 ms**    | 972                  |

Same output, roughly **six times faster**. Two runs each, cold, no incremental cache.

## What improved

- **A ~6x faster type build**, locally and in CI.
- **One less build step.** The `types` target used to end in a post-build correction script that rewrote emitted declarations to work around upstream issues: on 4.9.5, 30 files needed a `lit-element/lit-element.js` specifier corrected and 6 needed an unresolvable `node_modules/@open-wc/...` path unwound. TS 7 emits the portable specifiers itself and rewrites nothing, so the script is gone, along with its npm script and its `wireit` chain.
- **No lost entrypoints.** Staying on 5.9 or 6.0 is a trap: they emit **967** declaration files instead of 972, silently dropping five components over [microsoft/TypeScript#51622](https://github.com/microsoft/TypeScript/issues/51622). TS 7 emits all 972, matching 4.9.5 exactly.
- **Nothing breaks downstream** - measured below, not assumed.

## If you consume `@lion/ui` directly: almost nothing

With `skipLibCheck: true` - the default in most setups - and on compilers from 4.7 to 5.9, we measure **0 errors before and after**. The published surface is unchanged: across the 67 barrel files in `dist-types/exports/` (what `"./*": { "types": "./dist-types/exports/*" }` maps), every exported **name** and re-export target is identical. 66 of those files differ at all, and only in the quote style of their re-export specifiers, plus a few declarations change _form_ (`export declare const f: (..) => T`, where 4.9.5 wrote `export function f(..): T`) - same name, same signature.

Two things worth configuring:

- **Keep `skipLibCheck: true`** unless you have a reason not to. This is the flag that decides whether the migration is invisible or not, and we measured both sides of it:
  - With the flag **on**: 0 errors, before and after, at every layer (below).
  - With the flag **off**, the library that compiles our declarations directly sees more than before: **3 -> 21** errors at TS 4.7.4 and **1 -> 18** at TS 5.9.3. 18 of those are new and are dominated by private class members whose `private` modifier is dropped in the new output (`TS7008` x17, plus one `TS2416` and one `TS2611`); one old defect, `TS1024` `readonly`-on-getter, is fixed. It was never clean before either - but it is measurably noisier now, and it is the first thing we would fix next.
- **If you _emit_ declarations on TS 7, set `rootDir`.** Without it, TS 7 raises `TS5011` and writes `dist/src/index.d.ts` where 4.7/5.9 wrote `dist/index.d.ts`, silently moving your layout for your own consumers. It is your own config, not your dependencies: an identical tsconfig with no Lion dependency raises it too, and a `noEmit` project never does.

```
include:["src"], outDir:"dist", no rootDir  ->  TS5011, emits dist/src/index.d.ts
+ rootDir:"src"                             ->  clean, emits dist/index.d.ts
```

## One layer further down: nothing at all

To answer "does this break apps that depend on libraries built on Lion?", we built the fixture rather than reasoning about it: **`my-ui`**, a small fictional library that extends Lion components, adds validators, uses `localize` and exposes Lion types in its own public API - plus an app on top of `my-ui`. Then we swapped only the `@lion/ui` underneath.

| scenario                                      | `@lion/ui` 4.9.5 | `@lion/ui` TS 7 |
| --------------------------------------------- | ---------------- | --------------- |
| `my-ui` build, TS 4.7.4, `skipLibCheck: true` | 0 errors         | **0 errors**    |
| `my-ui`'s own emitted `dist/index.d.ts`       | -                | **unchanged**   |
| app on `my-ui`, `skipLibCheck: true`          | 0 errors         | **0 errors**    |
| app on `my-ui`, `skipLibCheck: false`         | 3 errors         | 3 errors        |

The second row is the one that matters: `my-ui`'s own published declarations are byte-identical (`sha256`-equal) across the two arms, so anything consuming `my-ui`'s types sees no change from `my-ui` at all. With `skipLibCheck: true` every layer is at 0 errors either way. Turn that flag off and the compiler reads our declarations directly at each layer: the counts hold (3 errors at TS 4.7.4, 1 at 5.9.3), and only the individual diagnostics shift - a `readonly`-on-getter defect in the old output is gone, and a member that loses its `private` modifier takes its place.

## Where this stands

It ships as one change: TS 7 builds Lion with **0 errors**, the root `typescript` is raised to `^7.0.2`, and the correction script is gone. What remains is a to-do list rather than a task - 33 `@ts-ignore [ts7-*]` directives, each naming the idiom that resolves it.

If you maintain a library that ships declarations, two transferable lessons: measure the surface your `exports` map points at rather than the whole output tree, and test once with `skipLibCheck: false` - that flag is where declaration defects hide.
