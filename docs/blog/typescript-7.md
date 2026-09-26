---
title: Migrating Lion to TypeScript 7
published: false
description: TypeScript 7 type-checks Lion's ~1,000 emitted declaration files about six times faster. Here is what the migration actually took - and why consumers of @lion/ui, and of libraries built on top of it, are unaffected.
date: 2026-09-26
tags: [javascript, typescript, performance]
eleventyNavigation:
  key: Migrating Lion to TypeScript 7
  title: Migrating Lion to TypeScript 7
---

TypeScript 7 is the native (Go) compiler. For a library like Lion, whose build emits just under a thousand declaration files from JavaScript sources via `checkJs`, the difference is not marginal:

| compiler             | cold `tsc --build --force` | declarations emitted |
| -------------------- | -------------------------- | -------------------- |
| TypeScript 4.9.5     | 29,060 ms / 30,192 ms      | 972                  |
| **TypeScript 7.0.2** | **4,813 ms / 4,249 ms**    | 972                  |

Same output, roughly **six times faster**. Two runs each, cold, no incremental cache.

That speed is why we want TS 7. The interesting part is everything we had to do before we could have it - and the fact that none of it changes what your app compiles against.

## First surprise: we were not on TypeScript 5

The migration plan we started with was "5 to 7". It turned out `packages/ui` declares its types with the `typescript` in the **root** `devDependencies`, pinned at **`^4.9.5`**. There is no TS dependency in the package itself.

So the real jump is **4.9.5 to 7.0.2** - which means roughly a hundred of the errors we hit were not "TS 7 is stricter", they were **the 4.9 to 5.x migration that had simply never been done**. If you are planning a similar jump, separate those two buckets before you estimate anything: they have different causes and different fixes.

## Second surprise: do not park on TypeScript 6

TS 6 is the mandatory bridge, but it is not a place to stay. Building Lion with 5.9.3 or 6.0.3 emits **967** declaration files instead of 972. Five components silently lose their declarations:

```
components/input-datepicker/src/LionInputDatepicker.d.ts
components/input-file/src/LionInputFile.d.ts
components/input-file/src/LionSelectedFileList.d.ts
components/select-rich/src/LionSelectRich.d.ts
components/switch/src/LionSwitch.d.ts
```

The cause is [microsoft/TypeScript#51622](https://github.com/microsoft/TypeScript/issues/51622): `TS2742`, _"the inferred type cannot be named without a reference to `@open-wc/scoped-elements/types.js`"_. TS 7 resolves and emits them again, matching 4.9.5 exactly. A 6-era release would have shipped without those entrypoints.

## What actually broke

The full build went **292 errors on TS 7**. Grouping them by cause is what made it tractable:

- **The option TS 5.5 removed.** `suppressImplicitAnyIndexErrors` had to go (`TS7053` x29 plus `TS7015`), which exposes dynamic key access that needs real types.
- **Genuine 4.9 -> 5.x language changes.** `TS2345` x82 (our localize option factories needed typed return values - TS 5.1 turned those option types into a discriminated union, so a bare `style: string` no longer fits) and `TS2855` x17, where a static getter composing `super.<field>` on a parent _field_ is no longer allowed. We suppressed that one in place rather than switching to element access (`super['styles']`): bracket-string accesses are exempt from property mangling while dot accesses are not, so mixing the two forms could split one property into two names in a consumer bundle.
- **Twenty mixin signatures.** `TS2322` on patterns like

  ```js
  /** @type {DisabledMixin} */
  const DisabledMixinImplementation = superclass =>
    class extends superclass {
      /* ... */
    };
  ```

  TS 7 no longer accepts a non-generic initialiser against the generic signature declared in our `types/*.ts`. We probed four variants: keeping the annotation fails, dropping it makes the emitted declarations leak the anonymous class (`TS4094` x27), adding generics to the JSDoc still fails - a cast on the arrow is the one that works and keeps the emitted types identical.

- **Two genuinely broken declarations.** A post-class static assignment emitted `export { undefined as popperModule }` - not a missing export, a re-export aliasing the `undefined` keyword. Invalid `.d.ts`, and a hard `TS2661` in _any_ consumer. It is fixed at the source by hoisting the static into the class body.
- **Smaller things worth knowing.** Two `@example` fences were never closed in our JSDoc, silently swallowing the `@param` tags below them (that was four `TS7006`s); an `@override` sitting _in prose_ was parsed as a tag (`TS4122`); `@readonly` is no longer accepted on getters (`TS1024`); and `import('some-module')` where the module has no type export needs `typeof import('some-module')` (`TS1340`, `TS2694`).

After the fixes: **TS 7 at 0 errors**, and 4.9.5 still at 0 with the same 972 files.

## What consumers actually see

Lion's published types are **not** the whole `dist-types/` tree. `package.json` maps

```json
"./*": { "types": "./dist-types/exports/*" }
```

so the surface is the 127 barrel files in `dist-types/exports/`. That is what we measure, on every change:

> every exported **name** and re-export target in `dist-types/exports/` must be unchanged.

It is. Across all 67 barrel files there are **zero** name or target differences; 66 of them
differ textually at all, and only in quote style (`"..."` before, `'...'` after). The same
measurement on the pre-migration compiler, where the emitted paths also had to be rewritten
by the post-build script, is what made that script look load-bearing. No import changes shape, no export disappears.

Everything else in `dist-types/` does churn - `.d.ts.map` files, comment text, and the intended fixes above - which is worth knowing if you keep an API snapshot or run `api-extractor`: the diff is large, and almost all of it is noise. Two of the changes are real but invisible to consumers:

- `export namespace currencyUtil { ... }` becomes `export declare const currencyUtil: { ... }` - fine for property access, but a namespace can also be used as a _type_ namespace, so code doing `currencyUtil.SomeType` would notice. None of ours does.
- Mixin signature members moved from enumerated key unions to `keyof typeof X`, and members are re-sorted (`stableTypeOrdering` is mandatory now).

## Downstream: the layer that matters

To answer "does this break my app?" we built a fixture rather than reason about it: **`my-ui`**, a fictional library that extends Lion (`LionButton`, `LionInput`), adds validators, uses `localize`, and exposes Lion types in its own public API. Then an app on top of `my-ui`. Three layers, and we swapped only the `@lion/ui` underneath.

| scenario                                      | `@lion/ui` 4.9.5 | `@lion/ui` TS 7    |
| --------------------------------------------- | ---------------- | ------------------ |
| `my-ui` on TS **4.7.4**, `skipLibCheck: true` | 0 errors         | **0 errors**       |
| `my-ui`'s own published `dist/index.d.ts`     | -                | **byte-identical** |
| `my-ui` on TS 4.7.4, `skipLibCheck: false`    | 3 errors         | 25 errors          |
| same, consumer on TS 5.9.3                    | -                | 22 errors          |
| app on top of `my-ui`, `skipLibCheck: true`   | 0                | **0**              |
| app on top of `my-ui`, `skipLibCheck: false`  | 3                | **4**              |

Three things to take from that table:

1. **With `skipLibCheck: true` the migration is invisible.** That is the common default, and it is sufficient on its own. And because `my-ui`'s _own_ emitted declarations are byte-identical, `my-ui`'s consumers do not see a thing even if they never set that flag on Lion.
2. **With `skipLibCheck: false` it was breaking - and not only for old compilers.** TS 5.9 saw 22 of the same errors. Those were real defects in the emitted declarations (the invalid `undefined` re-export, and `private` modifiers being dropped), which we fixed at the source. Whoever consumes your types with that flag on is the audience to check first.
3. **The library is the most exposed party, not its consumers.** `my-ui`'s build loads 97 Lion declaration files; the app on top of `my-ui` loads 50, and sees 4 errors instead of 25. The reason is instructive: `my-ui` imports `@lion/ui/localize.js`, but only uses it as a _value_, so TypeScript **elides that import from the emitted `.d.ts`** - and takes the whole `localize` subtree with it. A consumer only loads the subgraph their dependencies' declarations actually reference.

## If you _emit_ declarations, check your `rootDir`

One more finding that has nothing to do with Lion but will bite you on TS 7. If your project **produces output** from an `include` in a subdirectory and `rootDir` is not set, TS 7 raises `TS5011`. We proved it is your own config, not your dependencies: a control project with an identical tsconfig and _no_ Lion dependency raises it too, and a `noEmit` project never does.

It is not cosmetic. Where 4.7/5.9 wrote `dist/index.d.ts`, TS 7 writes `dist/src/index.d.ts` - and mangles the layout for your own consumers:

```
include:["src"], outDir:"dist", no rootDir   ->  TS5011, emits dist/src/index.d.ts
+ rootDir:"src"                              ->  clean, emits dist/index.d.ts
```

So: set `rootDir` if you build or publish your own declarations on TS 7. If you only type-check, you will never see it.

## One less build step

`packages/ui`'s `types` target currently ends with a post-build script, `scripts/types-correct-after-build.js`, which rewrites emitted declarations to work around upstream issues - most notably the `@open-wc/scoped-elements` path problem above. On 4.9.5 it is load-bearing: 30 files need the `lit-element/lit-element.js` rewrite and 6 need the `node_modules/@open-wc/...` unwind.

On TS 7 it rewrites **nothing**. TS 7 emits `lit` and the correct scoped-elements path itself. So the script becomes deletable exactly when we bump the compiler - one less build step, and one less workaround to maintain.

## Where this stands

This lands as one change: **TS 7 builds Lion with 0 errors**, the root `typescript` is raised to 7, and the post-build correction script is gone - so the `types` target is a plain `tsc --build` again. The published entry points keep the same exported names (`stableTypeOrdering` reorders 8 of 127 barrel files textually, no name changes), which is what we check on every batch.

What is left, deliberately, is a to-do list rather than a task: 33 `@ts-ignore [ts7-*]` suppressions, each naming the idiom that resolves it - 16 `TS2565` (TS 7 newly checks definite assignment on inferred fields: Lit reactive properties, event handlers created inside a branch) and 17 `TS2855` (field access via `super`). Flip them to `@ts-expect-error` as they get fixed; the directive then tells you when it is no longer needed.

If you maintain a library that ships declarations, the transferable lessons are: measure your _published_ surface (the barrels your `exports` map points at), not the whole output tree; separate "our mistake" from "new compiler behaviour" before estimating; and test with `skipLibCheck: false` at least once, because that is where declaration defects hide.
