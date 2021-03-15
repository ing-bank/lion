---
title: Introducing lions website
published: true
description: A static website with docs and demos for lion
date: 2021-03-10
tags: [javascript, rocket, documentation]
cover_image: /blog/images/introducing-lions-website-cover-image.jpg
---

After a month of preparations, we can finally present to you our new website. With it, we are enabled to give more context to each of our components.
Right now it's more or less a port for our existing demos from storybook. But we can organize it in a nicer way by splitting it into components, docs, guides and blog sections.

## Meet the new sections

1. [Guides](../guides/index.md) <br>
   A dedicated section where we will teach you about how to get started with lion. This section is completely new and will grow over time.
2. [Components](../components/index.md) <br>
   Here you will find our documentation for each of our components. Each is split into two pages namely Overview and Features. We also plan to add an API page soonish.
3. [Docs](../docs/index.md) <br>
   This is the home for general documentation which includes the fundamental systems all our components are build upon and various tools we use in the frontend or backend.
4. [Blog](./index.md) <br>
   We now have a dedicated section about all our blog posts. Take a peek and follow our story.

## Upgrading Our Documentation

As this page is now a static website and no longer storybook we needed to convert all our documentation.
Luckily the format is very similar.

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

So what we needed to do:

1. Remove the js default export and put the title / navigation into the headline
2. Replace all imports with the Package Entry Points
3. Adjust all link to be relative links to actual files (instead of storybook specific urls)

## Handling Mono Repo Documentation

All of our documentation now resides in the root `docs` folder. To publish them with our components we added a tool that can copy content and files into our published package.

Let's say you have this file in your documentation.

👉 `docs/components/accordion/overview.md`

```
# Accordion

Is a very useful...
```

Now you want to make sure it gets published with your accordion package so you replace you Readme file with this

👉 `packages/accordion/README.md`

```
# Accordion

[=> See Source <=](../../docs/components/content/accordion/overview.md)
```

Now by calling `publish-docs` within the `prepublishOnly` step your Readme file will contain the content of its source.

The benefits of this approach are

- Readme still makes sense on GitHub (e.g. you can navigate to the package and with one click you are at the docs)
- The published readme contains all the documentation you need
- All links are version safe (e.g. if you look at v0.5 it will link to the GitHub Pages at this time)

If you want to know more please look at the documentation for [publish-docs](../docs/node-tools/publish-docs/overview.md).

## Upgrading Extending Documentation

If you are currently extending our storybook documentation then this will no longer work.
For now, we will need to ask you to stay on the current version and NOT upgrade.

We will release the necessary tools to extend our Lion Website in the upcoming weeks 🤗
