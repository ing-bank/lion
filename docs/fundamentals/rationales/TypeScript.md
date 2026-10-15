---
parts:
  - TypeScript
  - Rationales
title: 'Rationales: TypeScript'
eleventyNavigation:
  key: Rationales >> TypeScript
  title: TypeScript
  order: 30
  parent: Rationales
---

# Rationales: TypeScript

[TypeScript](https://www.typescriptlang.org) is superset of JavaScript and a popular tool for getting strongly typed syntax and better autocompletion in JavaScript.

We've ensured that the entire Lion library is typed so that you can use it in TypeScript, but there are some caveats.

## Why JSDoc?

Lion uses [JSDoc](https://jsdoc.app/) for type annotations instead of native TypeScript files. This approach offers several advantages:

**No Compilation Step**: JSDoc allows us to maintain a pure JavaScript codebase while still providing comprehensive type information. This eliminates the need for a TypeScript compilation step in our build process, keeping our development workflow simple, fast and robust.

**Runtime JavaScript**: Since our source files remain `.js`, they can be executed directly by JavaScript engines without any transformation. This is particularly valuable for debugging, as you're working with the actual code that runs in production.

**Universal Compatibility**: JSDoc annotations are just comments, so they don't affect runtime behavior and are compatible with any JavaScript environment. Libraries and tools that don't understand TypeScript can still consume Lion packages without issues.

**Gradual Adoption**: Teams can benefit from Lion's type information regardless of whether they use TypeScript, plain JavaScript with JSDoc, or other type checking tools. The types are there when you need them, invisible when you don't.

**TypeScript Integration**: Despite using JSDoc, we still get full TypeScript integration. The TypeScript compiler can read JSDoc annotations and generate proper `.d.ts` files, giving consumers the same autocomplete and type checking experience as native TypeScript packages.

## Mixins

In Lion, we rely heavily on [Mixins](https://lit.dev/docs/composition/mixins/#mixin-basics) as a pattern for abstracting certain behaviors and properties into implementable interfaces.
Since JavaScript has a one-dimensional inheritance chain, inheriting from multiple ancestors has always been tricky, the Mixin pattern is used to get around that.

Here's the thing, Mixins have been notoriously difficult to type properly in TypeScript and in addition, we did not feel happy about adding an adhoc compilation step in our developer workflow. Therefore, we opted for typing our code with [JSDoc](https://jsdoc.app/) and using TypeScript to lint our types and generate type definition files.

Consuming Lion as `.js` typed by JSDoc is not much different from consuming it as when they were `.ts` files, but due to Mixins being very tricky to type, we've had to use `@ts-ignore` in a couple of places, most importantly, in many of our mixins.

For context, here's a [thread on the issue](https://github.com/microsoft/TypeScript/issues/36821) of inheritance type constraints in mixins, where a user suggested allowing to ignore the rule that causes problems.
This suggestion was declined and in [this comment](https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051), Ryan Cavanaugh explained that using `@ts-ignore` is the right way to get around the limitation here.
As a user of Lion this means that because we've got `@ts-ignore`s in our source code, you may get type errors that originate from Lion, and there's nothing we can do about that, TypeScript's stance is that sometimes rules are too conservative, and ignoring them is the correct answer.

In order to ignore type issues coming from Lion, please use the [skipLibCheck](https://www.typescriptlang.org/tsconfig#skipLibCheck) option in your `ts.config.json`, this will ignore issues that aren't coming from your code.

## Export Maps and Type Resolution

Lion uses [package.json export maps](https://nodejs.org/api/packages.html#exports) to provide proper module resolution and type definitions. The export map ensures that when you import from Lion packages, TypeScript can correctly resolve both the JavaScript modules and their corresponding type definitions.

The export map works by defining explicit entry points for each package, mapping import paths to their actual file locations. For types, this means that when you import `@lion/ui/button.js`, TypeScript knows to look for the corresponding type definitions in the `dist-types` directory.

## Subclass extension points and Lion 0.22

`_focusableNode` is a protected getter in `FocusMixin`: subclasses can override it or
access it through `this` and `super`. It is not a public DOM-query API. Lion 0.22 made
the `LionField` and `LionListbox` overrides protected too; their earlier emitted
declarations exposed them publicly, despite the protected mixin contract.

For focusing a control, the supported public API is `control.focus()`, which delegates
to its focusable node; `control.blur()` delegates similarly. This is not a replacement
for every direct node access: event listeners, DOM inspection, focus options, and
access to another component's internals need a separate downstream review. Subclass
configuration remains supported without making the getter public.

`slots` is a getter, both at runtime and in `SlotHost`. On TypeScript 4.7, intersecting
a subclass constructor with another `Constructor<SlotHost>` can collapse the inherited
getter into a property and reject a further getter override with `TS2611`. `SlotMixin`
preserves the superclass type when its host is already present, matching its runtime
deduplication; this allows extending `SlotMixin(LionSelectRich)` without that duplicate.

Its overloads preserve an already-slotted base and describe a newly applied host
separately. Unlike an unresolved conditional return type, this keeps a generic
constructor recognizable when composing `ValidateMixin(SlotMixin(base))`. The
newly applied host has one combined `LitElement & SlotHost` prototype rather than
two intersected prototype declarations; base constructors and their static members
remain part of the return type.

`LionOption.styles` returns Lit's `CSSResultArray`, including nested style arrays.
Subclasses may therefore return `[super.styles, additionalStyles]`, as supported
by Lit at runtime, without flattening the inherited array solely for type checking.

Downstream mixin signatures must also avoid reintroducing an already inherited
`SlotHost`. For a mixin that **requires** a slotted base and only adds `FieldHost`
members, the signature can retain those members without redeclaring the slot host:

```ts
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { LitElement } from 'lit';
import type { SlotHost } from '@lion/ui/types/core.js';

declare class FieldHost {
  extraFieldOption: boolean;
}

declare function FieldMixin<T extends Constructor<LitElement & SlotHost>>(
  base: T,
): T & Constructor<FieldHost>;
```

Do not simply remove `SlotHost` from a mixin that must add slot support to an unslotted
base, or drop other host members from its return type. Its signature must describe the
actual composition. Neither `skipLibCheck` nor suppressing a downstream getter error
corrects that signature.

The consumer declaration gate (`npm run types-check-consumer --workspace @lion/ui`)
checks the copied package's entry points, subclass extensions and JSDoc-typed generic
mixin composition on the current compiler, plus the extension fixtures on pinned
TypeScript 4.7.4. The older compiler is
isolated in the private `test/typescript-legacy` workspace so it cannot replace the
compiler used to build Lion.

## Type correction for JSDoc (no longer needed)

Because Lion types its JavaScript with JSDoc rather than `.ts` files, older TypeScript
versions emitted declaration paths that were not portable: `lit-element/lit-element.js`
where the declaration really came from `lit`, and internal `node_modules/@open-wc/...`
references that no consumer could resolve.

A post-build script (`scripts/types-correct-after-build.js`) rewrote those paths after
every build. **TypeScript 7 emits the correct specifiers itself**, so that script has been
deleted: the `types` target in `packages/ui` is now a plain `tsc --build`.
