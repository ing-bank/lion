---
parts:
  - Example Success
  - Singleton Manager
  - Tools
title: 'Singleton Manager: Example Success'
eleventyNavigation:
  key: Tools >> Singleton Manager >> Example Success
  title: Example Success
  order: 30
  parent: Tools >> Singleton Manager
---

# Singleton Manager: Example Success

In this SPA (Single Page Application) demo you will be able to reproduce the solution.

1. Click on Page A
2. Click on `block`
3. Click on Page B
4. Click on `unblock` => state is unblocked globally as there is only a single instance

With this solutions users can not break the app anymore.

<demo-app-success>Loading App...</demo-app-success>

<div id="overlay-target" style="margin-top: 50px;"></div>

```js script
import './demo-app.js';
```
