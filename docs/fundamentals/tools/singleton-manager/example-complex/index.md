---
parts:
  - Example Complex
  - Singleton Manager
  - Tools
title: 'Singleton Manager: Example Complex'
eleventyNavigation:
  key: Tools >> Singleton Manager >> Example Complex
  title: Example Complex
  order: 40
  parent: Tools >> Singleton Manager
---

# Tools >> Singleton Manager >> Example Complex ||40

In this SPA (Single Page Application) demo you will be able to reproduce the solution.

The outcome is the same but this time internally there are two instances of Overlay Managers.
And both are kept in sync buy an mediator with which the user actually interacts.

1. Click on Page A
2. Click on `block`
3. Click on Page B
4. Click on `unblock` => state is unblocked globally as there is only a single instance

With this solutions users can not break the app anymore.

<demo-app>Loading App...</demo-app>

<div id="overlay-target" style="margin-top: 50px;"></div>

```js script
import './demo-app.js';
```
