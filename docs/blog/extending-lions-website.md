---
title: Extending lions website
published: false
description: A static website with docs and demos for lion
date: 2021-03-10
tags: [javascript, rocket, documentation]
cover_image: /blog/images/introducing-lions-website-cover-image.jpg
---

After a month of preparations we can finally present to you our new website. With it we are enabled to give more context to each of our components.
Right now it's more or less a port for our existing demos from storybook. But we can organize it in a nicer way by splitting it into components, docs, guides and blog sections.

## Importing Content into Markdown files

We now use a system to import content from one markdown file into another.
So let's say you find the documentation of `input-amount` useful and you want to present it on your page as well.
Anywhere in your documentation you can now write.

👉 `docs/input-amount.md`

````md
# Input Amount

```js ::import('@lion/input-amount/docs/overview.md', 'heading[depth=1] ~ *')

```
````

So when you now go to `https://domain.com/input-amount/` you will actually see the content from `@lion/input-amount/docs/overview.md`.

Why is it a `js code block`?

- You can define a start and end for what should be imported (using [unist-util-select](https://github.com/syntax-tree/unist-util-select#support))
- You can add adjustments to the content as a function
- As links like `[go there](@lion/input-amount/docs/overview.md)` would not work anyways, having one syntax that allows for additional features is enough

### Importing Partial Content

Quite often you probably don't want to get the full file, so there is a special helper for that.

Let's assume you have the following source file

```md
# First Headline

Content of first headline

## Second Headline

Content of second headline

## Third Headline

Content of Third headline
```

and you only want to get the 2nd "block" e.g. 2nd headline + text.

With `importBlock` you can get exactly that.

A block starts with a headline and ends when the next headline of an equal level starts.

Note: importBlock is a faster way of writing imports for headlines

```md
::importBlock('./path/to/file.md', '## red')
// is the same as
::import('./path/to/file.md', 'heading[depth=2]:has([value=red])', 'heading[depth=2]:has([value=red]) ~heading[depth=2]')
```

If you want to know more please look at the documentation for [remark-extend](../docs/node-tools/remark-extend/overview.md).

## Upgrading Documentation

Unfortunately this is quite a different concept then what we used with storybook before. Luckily the content is very much the same.

Let's convert an example page

### FROM

````md
# Calendar

`lion-calendar` is a reusable and accessible calendar view. It depends on [calendar](?path=/docs/calendar--default-story).

```js script
import { html, css } from '@lion/core';
import './lion-calendar.js';

export default {
  title: 'Others/Calendar',
};
```

...
````

### TO

````md
# Component >> Calendar ||20

`lion-calendar` is a reusable and accessible calendar view. It depends on [calendar](../../path/to/calendar.md).

```js script
import { html, css } from '@lion/core';
import '@lion/calendar/define';
```

...
````

So what you need to do:

1. Remove the js default export and put the title / navigation into the headline
2. Replace all imports with the Package Entry Points
3. Adjust all link to be relative links to actual files (instead of storybook specific urls)

## Upgrading Extending Documentation

If you are currently extending our storybook documentation then this will no longer work.
For now we will need to ask you to stay on the current version and NOT upgrade.

We will release the necessary tools to extend our Lion Website in the upcoming weeks 🤗
