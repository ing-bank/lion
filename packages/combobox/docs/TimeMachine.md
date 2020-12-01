# Decorate

```js script
import { html } from 'lit-html';
import './google-search-tm/google-tm-demo.js';

export default {
  title: 'Forms/Combobox/Timemachine',
};
```

## Styling as a function of time

Design is susceptible to trends and change.
Whenever you open the [Wayback Machine](https://web.archive.org/web/)
and look for a random website (be it [Google.com](https://www.google.com),
[Yahoo.com](https://www.yahoo.com) or [Apple.com](https://www.apple.com/)), you will find that over
time, its designs hugely differ and that every few years a design upgrade took place.

## Leverage your existing app

In most cases, the functionality (or business logic) didn't change.
However, most of the time that a design or Design System changes, a new component set is built
and the same application is built from scratch.
Often this goes hand in hand with changing technology stacks that don't enable for a good
separation of concerns (design/UX vs business logic).

What if it would be possible to decouple this functionality from the Design System?
What if we could decorate a layer of styles and markup on top of an existing component or app?

The example below did exactly that. Based on data from Wayback machine, it illustrates how the
Google design changed over time.
It upgrades design, without changing the app.

### Enter the time machine

```js preview-story
export const GoogleSearchTimeMachine = () => {
  return html` <google-tm-demo></google-tm-demo> `;
};
```

## Decorate, don't fork

Imagine you built a web application. Now you want to reuse this in an Android and iOS webview,
but you want to do some design tweaks, so that your application better aligns with the native
experienced provided by the platform.
For instance, an Android button might need a ripple effect on Android. Or, the options of a select
should be opened in a bottomsheet on iOS.
This approach can do that. Not by forking and maintaining three codebases, but by maintaining one
codebase and two small decoration layers.

## Haven't I seen this before?

Being able to restyle an app completely purely with CSS is not new.
This is basically the philosophy of Zen Garden: http://dv.csszengarden.com/

But... the approach as described above adds two very powerful features on top:

- Although this is a very powerful start, some designs cannot be created without **changing the HTML**
  as well (especially this is important for accessibility, with regard to DOM order).
- Most important, this approach allows to add **functionality via JS**, which is also an essential
  part of creating the exact user interactions you aim for.
