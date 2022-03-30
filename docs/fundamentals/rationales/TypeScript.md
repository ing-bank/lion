# Rationales >> TypeScript ||30

[TypeScript](https://www.typescriptlang.org) is superset of JavaScript and a popular tool for getting strongly typed syntax and better autocompletion in JavaScript.

We've ensured that the entire Lion library is typed so that you can use it in TypeScript, but there are some caveats.

In Lion, we rely heavily on [Mixins](https://lit.dev/docs/composition/mixins/#mixin-basics) as a pattern for abstracting certain behaviors and properties into implementable interfaces.
Since JavaScript has a one-dimensional inheritance chain, inheriting from multiple ancestors has always been tricky, the Mixin pattern is used to get around that.

Here's the thing, Mixins have been notoriously difficult to type properly in TypeScript and in addition, we did not feel happy about adding an adhoc compilation step in our developer workflow. Therefore, we opted for typing our code with [JSDoc](https://jsdoc.app/) and using TypeScript to lint our types and generate type definition files.

Consuming Lion as `.js` typed by JSDoc is not much different from consuming it as when they were `.ts` files, but due to Mixins being very tricky to type, we've had to use `@ts-ignore` in a couple of places, most importantly, in many of our mixins.

For context, here's a [thread on the issue](https://github.com/microsoft/TypeScript/issues/36821) of inheritance type constraints in mixins, where a user suggested allowing to ignore the rule that causes problems.
This suggestion was declined and in [this comment](https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051), Ryan Cavanaugh explained that using `@ts-ignore` is the right way to get around the limitation here.
As a user of Lion this means that because we've got `@ts-ignore`s in our source code, you may get type errors that originate from Lion, and there's nothing we can do about that, TypeScript's stance is that sometimes rules are too conservative, and ignoring them is the correct answer.

In order to ignore type issues coming from Lion, please use the [skipLibCheck](https://www.typescriptlang.org/tsconfig#skipLibCheck) option in your `ts.config.json`, this will ignore issues that aren't coming from your code.
