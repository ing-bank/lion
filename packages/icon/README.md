# Icon

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

A web component for displaying icons.

## How to use

### Installation

```sh
npm i --save @lion/icon
```

```js
import '@lion/icon/lion-icon.js';
```

### Basic usage

Include the import for both the custom element the icons you want:

```html
<script type="module">
  import 'lion-icon/lion-icon.js';
  import bugSvg from '../icons/bug.svg.js';
</script>
```

Use it in your lit-html template:
```html
<lion-icon .svg=${bugSvg}></lion-icon>
```

### Icon format

Icon file is an ES module with an extension `.svg.js` which exports a function like this:

```js
// bug.svg.js
export default tag => tag`
  <svg focusable="false" ...>...</svg>
`;
```

Make sure you have `focusable="false"` in the icon file to prevent bugs in IE/Edge when the icon appears in tab-order.

### Accessibiltiy

You may add an `aria-label` to provide information to visually impaired users:

```html
<lion-icon .svg=${arrowLeftSvg} aria-label="Pointing left"></lion-icon>
```

A `lion-icon` without an `aria-label` attribute will be automatically be given an `aria-hidden` attribute.

### Styling

#### Dimensions

By default, a `lion-icon` will be `1em` × `1em` (the current line-height).

A `lion-icon` may be styled like a regular HTML element:

```html
<style>
  lion-icon.big {
    width: 3rem;
    height: 3rem;
  }
</style>
```

#### SVG Styling

`lion-icon` uses SVGs and may be styled with CSS, using CSS properties such as `fill` and `stroke`:

```html
<style>
  lion-icon.strong {
    fill: azure;
    stroke: lightsteelblue;
  }
</style>
<lion-icon .icon=${arrowSvg} class="strong"></lion-icon>
```

See [SVG and CSS](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS) on MDN web docs for more information.
