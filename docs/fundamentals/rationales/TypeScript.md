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

**No Compilation Step**: JSDoc allows us to maintain a pure JavaScript codebase while still providing comprehensive type information. This eliminates the need for a TypeScript compilation step in our build process, keeping our development workflow simple and fast.

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

## Type Correction for JSDoc

Since we use JSDoc for typing instead of native TypeScript files, we encounter some challenges during the type definition generation process. The TypeScript compiler sometimes produces inconsistent import statements when processing JSDoc annotations, particularly for Lit imports.

We have a post-build script (`types-correct-after-build.js`) that addresses these issues:

### Import Normalization

The script ensures consistency in Lit imports by converting:

- JSDoc-generated imports: `import { LitElement } from "lit-element/lit-element.js"`
- To standardized imports: `import { LitElement } from "lit"`

This prevents type incompatibility issues where the same class imported through different paths isn't recognized as the same type by TypeScript (see [TypeScript issue #51622](https://github.com/microsoft/TypeScript/issues/51622)).

### External Dependency Path Correction

The script also "unresolves" paths that reference external node_modules, particularly for scoped elements:

- From: `"../../../node_modules/@open-wc/scoped-elements/types.js"`
- To: `"@open-wc/scoped-elements/lit-element.js"`

These corrections ensure that generated type definitions work correctly in consuming projects, where the resolved local paths would break since they reference locations outside the bundled package.
