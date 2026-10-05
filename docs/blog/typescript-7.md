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
- **A much smaller build step.** The `types` target used to end in a post-build correction script that rewrote emitted declarations to work around upstream issues: on 4.9.5, 30 files needed a `lit-element/lit-element.js` specifier corrected and 6 needed an unresolvable `node_modules/@open-wc/...` path unwound. TS 7 emits the portable specifiers itself, so _that_ job is gone. One narrow post-build step did come back - for a different, smaller upstream defect in the new emit (see [the update](#update-2026-10-04-member-visibility-in-the-emitted-declarations)).
- **No lost entrypoints.** Staying on 5.9 or 6.0 is a trap: they emit **967** declaration files instead of 972, silently dropping five components over [microsoft/TypeScript#51622](https://github.com/microsoft/TypeScript/issues/51622). TS 7 emits all 972, matching 4.9.5 exactly.
- **Nothing breaks downstream** - measured below, not assumed.

## If you consume `@lion/ui` directly: almost nothing

With `skipLibCheck: true` - the default in most setups - and on compilers from 4.7 to 5.9, we measure **0 errors before and after**. The published surface is unchanged: across the 67 barrel files in `dist-types/exports/` (what `"./*": { "types": "./dist-types/exports/*" }` maps), every exported **name** and re-export target is identical. 66 of those files differ at all, and only in the quote style of their re-export specifiers, plus a few declarations change _form_ (`export declare const f: (..) => T`, where 4.9.5 wrote `export function f(..): T`) - same name, same signature.

Three things worth configuring:

- **`skipLibCheck` is optional now.** We measured both sides of it, and after the follow-up below a consumer that compiles our declarations directly gets **0 errors** either way:
  - With the flag **on**: 0 errors, before and after, at every layer (below).
  - With the flag **off**, the first cut of the switch was worse than 4.9.5 - dominated by `@private`/`@protected` members whose modifier the new emit dropped (`TS7008`). That family is gone, and the count is now 0 against the 15 the 4.9.5 emit left; the details are in [the update](#update-2026-10-04-member-visibility-in-the-emitted-declarations).
- **Lion's own build no longer sets the flag either.** It is dropped from the root tsconfig; the one third-party declaration that needed it (`@open-wc/semantic-dom-diff@0.20.1`) is handled by an override to 0.21.0.
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
| app on `my-ui`, `skipLibCheck: false`         | 3 errors         | **0 errors**    |

The second row is the one that matters: `my-ui`'s own published declarations are byte-identical (`sha256`-equal) across the two arms, so anything consuming `my-ui`'s types sees no change from `my-ui` at all. With `skipLibCheck: true` every layer is at 0 errors either way. Turn that flag off and the compiler reads our declarations directly at each layer; the counts hold, and the individual diagnostics shift - the `readonly`-on-getter defect that the old output carried is gone, and the members that lost their `private` modifier now get it back from the build step described below. The flag-off rows are where this shows. With the flag off, a TS 4.7.4 consumer used to read three errors through two layers; now every row is 0, and so is the TS 7 check. Getting there meant fixing a declaration bug of our own (`Required`'s methods named the protected `_inputNode` in their signature), making two member kinds agree with the inherited declarations (`modelValue` as an accessor pair, `_focusableNode` as a cast), and letting the choice-group hosts inherit their members instead of declaring the same accessor pair twice - a duplication that TS 4.x collapses into a property and TS 7 does not.

## Where this stands

It ships as one change: TS 7 builds Lion with **0 errors**, the root `typescript` is raised to `^7.0.2`, and the 21 `@ts-ignore` mixin workarounds that the old compiler needed are gone. What remains is a to-do list rather than a task - 38 `[ts7-*]`-tagged directives (38 of them: 21 x `ts7-2855`, 16 x `ts7-2565`, 1 x `ts7-2611`), each naming the idiom that resolves it.

If you maintain a library that ships declarations, three transferable lessons: measure the surface your `exports` map points at rather than the whole output tree; test once with `skipLibCheck: false`, because that flag is where declaration defects hide; and make sure your consumer fixture copies the package instead of symlinking it, or you will spend a day fixing module identities rather than types.

## Update (2026-10-04): member visibility in the emitted declarations

The new emit had one defect that was worth chasing down rather than documenting as a caveat. TS 7 drops the JSDoc `@private` / `@protected` modifier on a class member that is declared only by an assignment inside the constructor:

```js
class Calendar {
  constructor() {
    /** @private */
    this.__today = normalizeDateTime(new Date());
  }
}
```

TS 4.7.4, 4.9.5, 5.9.3 and 6.0.3 all emit `private __today;` for that member. TS 7.0.2 emits `__today;`: the member becomes public, and since the type is dropped along with the modifier, a consumer without `skipLibCheck` gets `TS7008: Member '__today' implicitly has an 'any' type`. Measured over the whole package that is **64 members in 18 files**, and **42** such errors in a consumer that compiles the declarations directly - against **0** with the 4.9.5 emit of the same sources. (An earlier count of 74 came from a harness flaw, not from Lion; see the note at the end of this update.)

`scripts/types-restore-visibility.js`, wired into `wireit.types` directly after `tsc`, re-attaches the modifier from the emitted JSDoc, so those members come out byte-for-byte as 4.9.5 produced them. It runs on the build output rather than in the sources on purpose: six of the 64 members are Lit reactive properties, and giving those a class-body field would shadow the accessor Lit installs on the prototype - we tried, and it failed 190 browser tests - while `declare`, the only form that means "declared, never defined", is not available in a `.js` file (`TS8009`). Running it in the build also means zero runtime change.

Where does that leave `skipLibCheck`?

| `skipLibCheck: false`, compiling the declarations of `@lion/ui` | errors                     |
| --------------------------------------------------------------- | -------------------------- |
| TS 4.9.5 emit (what we published before)                        | 15, of which 0 x `TS7008`  |
| TS 7 emit, before any fix                                       | 49, of which 42 x `TS7008` |
| TS 7 emit + the restore script + the member work                | **0**                      |

So the direct question the flag used to answer is now clean: **0 errors against 15** with what we published on 4.9.5, and the family that actually pushes people towards the flag is gone. Two of the last four were member shapes that disagreed with the kind the inherited declarations use (`modelValue` had to be an accessor pair rather than a class field, `_focusableNode` a cast to what the base assumes it is); the other two were a real declaration bug of ours - `Required`'s methods named the protected `_inputNode` in their signature, so a consumer's compiler read a protected member it had no business seeing.

Thirteen of the errors an earlier draft of this post counted were an artifact of the measuring harness, not of the declarations: pointing `node_modules/@lion/ui` at the library with a symlink makes the `include`-matched files keep the symlink path while import resolution goes to the realpath, so the same declaration gets two module identities. That invents type mismatches - a phantom `TS2417` and three of five `TS2416`s here. Copy the package into a real directory before counting. Lion's own build is a single third-party declaration away from dropping the flag as well, and it does now: `@open-wc/semantic-dom-diff` is pinned to 0.21.0 through an override (its `chai-dom-diff-plugin.d.ts` is the one that arrives extensionless in 0.20.1), so Lion's own build no longer sets `skipLibCheck` either.
