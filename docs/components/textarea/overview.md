# Textarea >> Overview ||10

A webcomponent that enhances the functionality of the native `<input type="textarea">` element.
Its purpose is to provide a way for users to write text that is multiple lines long.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-textarea.js';
```

```js preview-story
export const main = () => html`
  <lion-textarea label="Stops growing after 4 rows" max-rows="4"></lion-textarea>
`;
```

## Features

- Default rows is 2 and it will grow to max-rows of 6.
- `max-rows` attribute to set the amount of rows it should resize to, before it will scroll
- `rows` attribute to set the minimum amount of rows
- `readonly` attribute to prevent changing the content
- Uses Intersection Observer for detecting visibility change, making sure it resizes

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionTextarea } from '@lion/ui/textarea.js';
// or
import '@lion/ui/define/lion-textarea.js';
```
