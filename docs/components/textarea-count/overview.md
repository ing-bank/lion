# Textarea Count >> Overview ||10

A webcomponent that enhances the functionality of the native `<input type="textarea">` element.
Its purpose is to limit characters number input providing characters counter at the same time.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-textarea-count.js';
```

```js preview-story
export const main = () => html`
  <lion-textarea-count
    label="Count characters"
    minLength="5"
    maxLength="30"
    .showCharCounter=${true}
    max-rows="4"
  ></lion-textarea-count>
`;
```

## Features

- Provide characters counter
- Does not allow to input more characters than allowed by limit

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionTextareaCount } from '@lion/ui/textarea-count.js';
// or
import '@lion/ui/define/lion-textarea-count.js';
```
