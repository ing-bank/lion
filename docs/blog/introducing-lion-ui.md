---
title: Introducing Lion UI
published: false
description: Lion introduces the new package @lion/ui which is a collection of all lion UI components.
date: 2023-03-20
tags: [javascript]
cover_image: /blog/images/no-image-yet.jpg
---

### A new package

Lion introduces a new package `@lion/ui` which is a collection of UI components that can be used in your application.
It contains all the components/systems that used to be distributed via separate @lion/\* packages.
This brings back around 40 packages to just 1.

### Better dependency management

Since `@lion/ui` is now a single package, the dependencies of the individual components are now managed in a single
`package.json` file. This results in a single folder of dependencies for all components instead of a folder
for each component separately.

This means you will now have less dependencies that are easier to manage.

### New entrypoints

All components are now imported from @lion/ui instead of @lion/\* packages and therefore this is a breaking change.
Where before you would import from `@lion/<package>`, you will now import from `@lion/ui/<package>.js`.

For example:

```diff
- import { LionAccordion } from '@lion/accordion';
+ import { LionAccordion } from '@lion/ui/accordion.js';
```

Element registrations have changed as well. For example:

```diff
- import '@lion/accordion/define';
+ import '@lion/ui/define/lion-accordion.js';
```

All available entrypoints for the packages in Lion can now easily be found in the `/packages/ui/exports` folder which
makes the public API much more clear. This is now possible because Node.js supports the `exports` field in `package.json`
where these entrypoints are defined.

For example, `@lion/ui/accordion.js` maps to `/packages/exports/accordion.js` and `@lion/ui/define/lion-accordion.js`
maps to `/packages/exports/define/lion-accordion.js`.

Support for this `exports` field was added to TypeScript 4.7 so for that reason, `@lion/ui` only supports TypeScript
4.7+ with `"moduleResolution": "Node16"` or `"moduleResolution": "NodeNext"`.

### A new changelog

`@lion/ui` has [a new single CHANGELOG.md]( https://github.com/ing-bank/lion/blob/master/packages/ui/CHANGELOG.md) in `/packages/ui` for the whole package. The older individual changelogs can be
found in the `/packages/ui/_legacy-changelogs` folder.
