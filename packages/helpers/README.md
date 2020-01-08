# Helpers

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

A helpers package that contains several helpers that are used inside lion but can be used outside as well.

These helpers are considered developer tools, not actual things to use in production.
Therefore, they may not have the same quality standards as our other packages.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/helpers) for a live demo and API documentation

## Installation

```bash
npm i @lion/helpers
```

## Usage

Example using the sb-action-logger helper component.

```html
<script type="module">
  import '@lion/helpers/sb-action-logger/sb-action-logger.js';
</script>

<sb-action-logger></sb-action-logger>
```
