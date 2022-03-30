# Button >> Overview ||10

A button web component that is easily stylable and accessible.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/button/define';
```

```js preview-story
export const main = () => html` <lion-button>Default</lion-button> `;
```

## Features

- Clickable area that is bigger than visual size
- A special `button-reset` and `button-submit` works with native form / inputs
- `button-submit` has integration for implicit form submission similar to how native `<form>`, `<input>` and `<button>` work together.

## Installation

```bash
npm i --save @lion/button
```

```js
import { LionButton, LionButtonReset, LionButtonSubmit } from '@lion/button';
// or
import '@lion/button/define';
```
