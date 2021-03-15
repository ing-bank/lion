---
title: Controlling exports
published: true
description: Maintainer can now define their public api of a package itself.
date: 2021-03-09
tags: [javascript, exports]
cover_image: /blog/images/controlling-exports-cover-image.jpg
---

When publishing npm packages it can often be hard to understand what users are actually using.

Basically, JavaScript allows you to write imports like this

```js
import { addLeadingZero } '@lion/localize/src/date/utils/addLeadingZero.js';
```

We as the maintainers of that package however consider this internal code, so any changes to it will not result in a new breaking change update.
So if you depend on this directly then your code may break with any minor or patch update.

So why would we even "allow" such imports? Because so far there was no way to actually define and enforce what a maintainer considers to be the public API of the package. Now, with the introduction of node's [Package Entry Points](https://nodejs.org/api/packages.html#packages_package_entry_points) and the adoption of it in [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve#package-entrypoints) it can now be used in node, [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) and [rollup](https://rollupjs.org/).

How can you use those `Package Entry Points`?

Let's assume you have these two files in your `src` directory.

```js
// src/index.js
export { foo } from './public.js';

// src/public.js
export const foo = 'public foo';

// src/internal.js
export const bar = 'internal bar';
```

If you publish the package "normally" then users will be able to write imports like this

```js
import { foo } from 'my-pkg';
import { foo } from 'my-pkg/src/public.js';
import { bar } from 'my-pkg/src/internal.js';
```

This has multiple issues, described in use cases:

1. Case 1: For maintenance purposes, we want to split `public.js` in `featureA.js` and `helpers.js`. Now all imports that use `import { foo } from 'my-pkg/src/public.js';` will break.
2. Case 2: We found a package that solved what we did in `internal.js` in a more generic way. We don't treat it as public API, so we actually go ahead and get rid of this file. Now all imports for `import { bar } from 'my-pkg/src/internal.js';` will break.

Instead, what we actually want is all our consumers using the intended public API, which is

```js
import { foo } from 'my-pkg';
```

This way, above cases 1 and 2 just don't have any effect and we can freely refactor our codebase without introducing breaking changes. This means we can keep improving our code without disturbing our users. It's a win-win situation 🎉

Now, if someone tries to use a not defined export, like

```js
import { bar } from 'my-pkg/src/internal.js';
```

Then an error will be thrown

```
Could not resolve import "my-pkg/src/internal.js"
```

If a users needs access to `bar` then a GitHub Issue/Discussion should be opened to request it.
Maintainers can then have a discussion if they want to make this part of the public API or not.

## Using consumer import in your own code

An additional benefit of using Package Entry Points is that you can write imports in the same way as your consumers.

So instead of writing demos or tests like

```js
import { LionInput } from '../src/LionInput.js';
```

we can now write

```js
import { LionInput } from '@lion/input';
```

This has the following benefits:

- We can make sure everything we are demoing/testing is actually part of the public API
- Users can read / copy our demo code and it just works
- We can move files around without needing to adjust our demos/docs/tests

## Exports for a single web component

Usage:

```js
// only the classes
import { MyElement } from 'my-element';

// OR

// execute customElements.define
import 'my-element/define';
```

Package Entry Points:

```json
"exports": {
  ".": "./src/index.js",
  "define": "./src/my-element.js",
}
```

## Exports for multiple web components

Usage:

```js
// only the classes
import { MyElement, SubElement } from 'my-element';

// OR

// execute customElements.define for all elements
import 'my-element/define';

// execute customElements.define for a single element
import 'my-element/define-my-element';
import 'my-element/define-sub-element';
```

Package Entry Points:

```json
"exports": {
  ".": "./src/index.js",
  "define": "./src/define.js",
  "define-my-element": "./src/my-element.js",
  "define-sub-element": "./src/sub-element.js",
}
```

in this case, the `src/define.js` should not contain any `customElements.define`, but instead it just imports the other define files

```js
import 'my-element/define-my-element';
import 'my-element/define-sub-element';
```

## What does it mean for Lion?

Imports that worked before will need be be adjusted as they will no longer work.
This is a breaking change.

```js
// no longer works
import '@lion/input/lion-input';
import '@lion/input/lion-input.js';
import { LionInput } from '@lion/input/src/LionInput.js';

// works
import '@lion/input/define';
import { LionInput } from '@lion/input';
```

---

Photo by <a href="https://unsplash.com/@curology?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Curology</a> on <a href="https://unsplash.com/">Unsplash</a>
