# Tools >> Helpers >> Action Logger ||20

A visual element to show action logs in demos `sb-action-logger`

```js script
import { html } from '@lion/core';
import '@lion/helpers/define';
```

```js preview-story
export const main = () => {
  const uid = Math.random().toString(36).substr(2, 10);
  return html`
    <p>To log: <code>Hello, World!</code></p>
    <button
      @click=${e => {
        e.target.parentElement.querySelector(`#logger-${uid}`).log('Hello, World!');
      }}
    >
      Click this button
    </button>
    <p>Or to log: <code>What's up, Planet!</code></p>
    <button
      @click=${e => {
        e.target.parentElement.querySelector(`#logger-${uid}`).log(`What's up, Planet!`);
      }}
    >
      Click this button
    </button>
    <sb-action-logger id="logger-${uid}"></sb-action-logger>
  `;
};
```

You need some reference to your logger. Above example shows this by using a unique ID.

```js
const uid = Math.random().toString(36).substr(2, 10);
```

This connects the logger element to the trigger.

```html
<div>To log: <code>Hello, World!</code></div>
<button
  @click=${e => {
    e.target.parentElement.querySelector('#logger-${uid}').log('Hello, World!')
  }}
>Click this button</button>
<sb-action-logger id="logger-${uid}"></sb-action-logger>
```

**This is a demonstrative tool**, not a debugging tool (although it may help initially).
If you try logging complex values such as arrays, objects or promises,
you should expect to get only the string interpretation as the output in this logger.

## Features:

- A public method `log` to log things to the action logger.
- Overridable `title` property.
- Clear button to clear logs
- A counter to count the total amount of logs
- Stacks consecutive duplicate logs and shows a counter
- `simple` property/attribute to only show a single log

## Installation

```bash
npm i @lion/helpers

```

## Variations

### Simple mode

Simple mode essentially means there is only ever 1 log.
Duplicates are not counted or stacked, but you will still see the visual cue.

```js preview-story
export const simpleMode = () => {
  const uid = Math.random().toString(36).substr(2, 10);
  return html`
    <div>To log: <code>Hello, World!</code></div>
    <button
      @click=${e => {
        e.target.parentElement.querySelector(`#logger-${uid}`).log('Hello, World!');
      }}
    >
      Click this button
    </button>
    <div>Or to log: <code>What's up, Planet!</code></div>
    <button
      @click=${e => {
        e.target.parentElement.querySelector(`#logger-${uid}`).log(`What's up, Planet!`);
      }}
    >
      Click this button
    </button>
    <sb-action-logger simple id="logger-${uid}"></sb-action-logger>
  `;
};
```

```html
<sb-action-logger simple></sb-action-logger>
```

### Custom Title

You can customize the action logger title with the `.title` property.

```js preview-story
export const customTitle = () => {
  const uid = Math.random().toString(36).substr(2, 10);
  return html`
    <button
      @click=${e => e.target.parentElement.querySelector(`#logger-${uid}`).log('Hello, World!')}
    >
      Log
    </button>
    <sb-action-logger id="logger-${uid}" .title=${'Hello World'}></sb-action-logger>
  `;
};
```

```html
<sb-action-logger .title=${'Hello World'}></sb-action-logger>
```

## Rationale

This component was created due to a need for a nice visual action logger in Storybook Docs mode.

In docs mode, you do not have access to the action logger addon component, and it is nice to be able to show actions inline in your demos and documentation.

### Opinionated

I added quite a bit of styling on this component to make it look decent.
There are a bunch of styles that you can easily override to make it fit your design system which I believe should be enough in most cases.
If you need more control you can always:

- Override the host styles, there's a few custom CSS props that you can override as well.
- Extend the component and apply your overrides
- Open an issue if you believe it would be good to make something more flexible / configurable

Maybe in the future I will abstract this component to a more generic (ugly) one with no styles, so it's more friendly as a shared component.

### Plugin

If you use an action logger inside your Story in Storybook, you will also see it in your canvas, and this may not be your intention.

One idea is to simplify the usage further by making this a Storybook (docs-)plugin or decorator or whatever.
It would be cool if someone can simply enable an action logger option on a particular Story inside their .mdx,
and then actions are automatically logged to the visual logger below it.
Would need to figure out how to catch the action and pass it to the visual logger element.

Isn't investigated yet on the how, but that is the rough idea.

## Future

New planned features can be found in the test folder where they are specified as skipped tests.
If the feature you'd like is not in the tests, feel free to make an issue so we can add it.

See our [CONTRIBUTING.md](https://github.com/ing-bank/lion/blob/master/CONTRIBUTING.md) for more guidelines on how to contribute.
