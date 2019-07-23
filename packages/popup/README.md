# Popup

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-popup` is a component used for basic popups on click.
Its purpose is to show content appearing when the user clicks an invoker element with the cursor or with the keyboard.

## Features

- Show content when clicking the invoker
- Use the position property to position the content popup relative to the invoker

## How to use

### Installation

```sh
npm i --save @lion/popup
```

```js
import '@lion/popup/lion-popup.js';
```

### Example

```html
<lion-popup>
  <div slot="content" class="tooltip">This is a popup<div>
  <a slot="invoker" href="https://www.google.com/">
    Popup on link
  </a>
</lion-popup>
```
