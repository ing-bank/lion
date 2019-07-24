# Textarea

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-textarea` component is a webcomponent that enhances the functionality of the native `<input type="textarea">` element.
Its purpose is to provide a way for users to write text that is multiple lines long.

## Features

- Set the amount of rows it should resize to, before it will scroll - `max-rows` attribute

## How to use

### Installation

```sh
npm i --save @lion/textarea
```

```js
import '@lion/textarea/lion-textarea.js';
```

### Example

```html
<lion-textarea label="Stops growing after 4 rows" max-rows="4"></lion-textarea>
```
