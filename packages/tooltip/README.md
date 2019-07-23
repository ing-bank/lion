# Tooltip

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-tooltip` is a component used for basic popups on hover.
Its purpose is to show content appearing when the user hovers over an invoker element with the cursor or with the keyboard, or if th
e invoker element is focused.

## Features

- Show content when hovering the invoker
- Show content when the invoker is focused
- Use the position property to position the content popup relative to the invoker

## How to use

### Installation

```sh
npm i --save @lion/popup
```

```js
import '@lion/tooltip/lion-tooltip.js';
```

### Example

```html
<lion-tooltip>
  <div slot="content" class="tooltip">This is a popup<div>
  <a slot="invoker" href="https://www.google.com/">
    Popup on link
  </a>
</lion-tooltip>
```
