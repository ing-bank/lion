# Textarea Count>> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-textarea-count.js';
```

## Prefilled

You can prefill the textarea. If you want to prefill on multiline, you will have to add newline characters `'\n'`.

```js preview-story
export const prefilled = () => html`
  <lion-textarea-count
    label="Prefilled"
    .modelValue=${['batman', 'and', 'robin'].join('\n')}
  ></lion-textarea-count>
`;
```

## Disabled

The textarea can be disabled with the `disabled` attribute.

```js preview-story
export const disabled = () =>
  html` <lion-textarea-count label="Disabled" disabled></lion-textarea-count> `;
```

## Readonly

`readonly` attribute indicate that you can't change the content. Compared with `disabled` attribute, the `readonly` attribute doesn't prevent clicking or selecting the element.

```js preview-story
export const readonly = () => html`
  <lion-textarea-count
    label="Readonly"
    readonly
    .modelValue=${['batman', 'and', 'robin'].join('\n')}
  ></lion-textarea-count>
`;
```
