# Components >> Inputs >> Textarea >> Features ||20

```js script
import { html } from '@lion/core';
import '@lion/textarea/lion-textarea.js';
```

## Prefilled

You can prefill the textarea. If you want to prefill on multiline, you will have to add newline characters `'\n'`.

```js preview-story
export const prefilled = () => html`
  <lion-textarea
    label="Prefilled"
    .modelValue=${['batman', 'and', 'robin'].join('\n')}
  ></lion-textarea>
`;
```

## Disabled

The textarea can be disabled with the `disabled` attribute.

```js preview-story
export const disabled = () => html` <lion-textarea label="Disabled" disabled></lion-textarea> `;
```

## Readonly

`readonly` attribute indicate that you can't change the content. Compared with `disabled` attribute, the `readonly` attribute doesn't prevent clicking or selecting the element.

```js preview-story
export const readonly = () => html`
  <lion-textarea
    label="Readonly"
    readonly
    .modelValue=${['batman', 'and', 'robin'].join('\n')}
  ></lion-textarea>
`;
```

## Stop growing

Use the `max-rows` attribute to make it stop growing after a certain amount of lines.

```js preview-story
export const stopGrowing = () => html`
  <lion-textarea
    label="Stop growing"
    max-rows="4"
    .modelValue=${['batman', 'and', 'robin'].join('\n')}
  ></lion-textarea>
`;
```

## Non-growing

To have a fixed size provide `rows` and `max-rows` with the same value.

```js preview-story
export const nonGrowing = () => html`
  <lion-textarea label="Non Growing" rows="3" max-rows="3"></lion-textarea>
`;
```

## Intersection Observer

It could be that your textarea is inside a hidden container, for example for a dialog or accordion or tabs.
When it is hidden, the resizing is calculated based on the visible space of the text.
Therefore, an Intersection Observer observes visibility changes of the textarea relative to the viewport, and resizes the textarea when a visibility change happens.

> For old browsers like old Edge or IE11, a [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) is required to be added on the application level for this to work.
> For most cases, the optimized default will suffice.

In the demo below you can see that the textarea is correctly calculated to 4 maximum rows, whereas without the observer, it would be on 2 rows and only resize on user input.

```js preview-story
export const hidden = () => html`
  <div style="display: none">
    <lion-textarea
      .modelValue="${'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}"
      label="Stops growing after 4 rows"
      max-rows="4"
    ></lion-textarea>
  </div>
  <button
    @click=${e =>
      (e.target.previousElementSibling.style.display =
        e.target.previousElementSibling.style.display === 'block' ? 'none' : 'block')}
  >
    Toggle display
  </button>
`;
```
