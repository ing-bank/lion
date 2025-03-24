# Input File >> Overview ||10

A web component based on the file input field.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-file.js';
```

```js preview-story
export const main = () => {
  return html` <lion-input-file label="Upload" name="upload"></lion-input-file> `;
};
```

## Features

- Based on our [input](../input/overview.md)
- Default labels and validation messages in different languages
- Options for multi file upload and drop-zone.

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionInputFile } from '@lion/ui/input-file.js';
// or
import '@lion/ui/define/lion-input-file.js';
```
