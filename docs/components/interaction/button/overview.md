# Interaction >> Button >> Overview ||10

`lion-button` provides a button component that is easily stylable and accessible.

```js script
import { html } from '@lion/core';
import '@lion/button/define';
```

```js preview-story
export const main = () => html`<lion-button>Default</lion-button>`;
```

## Features

- Clickable area that is bigger than visual size
- Works with native form / inputs
- Has integration for implicit form submission similar to how native `<form>`, `<input>` and `<button>` work together.

## Installation

```bash
npm i --save @lion/button
```

```js
import { LionButton } from '@lion/button';
// or
import '@lion/button/define';
```
