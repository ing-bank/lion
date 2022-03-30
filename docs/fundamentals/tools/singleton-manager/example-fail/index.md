# Tools >> Singleton Manager >> Example Fail ||20

In this SPA (Single Page Application) demo you will be able to reproduce the issue.

1. Click on Page A
2. Click on `block`
3. Click on Page B
4. Click on `unblock` => nothing happens
5. Click on `block` => both overlays are now blocked

In an real application this would now mean that your users can no longer interact with your application.

<demo-app>Loading App...</demo-app>

<div id="overlay-target" style="margin-top: 50px;"></div>

```js script
import './demo-app.js';
```
