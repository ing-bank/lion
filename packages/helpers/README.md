[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Helpers

```js script
export default {
  title: 'Helpers/Intro',
};
```

A helpers package that contains several helpers that are used inside lion but can be used outside as well.

These helpers are considered developer tools, not actual things to use in production.
Therefore, they may not have the same quality standards as our other packages.

## Packages

| Package                                                                        | Version                                                                                                                  | Description      |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| [sb-action-logger](?path=/docs/helpers-storybook-action-logger--default-story) | [![sb-action-logger](https://img.shields.io/npm/v/sb-action-logger.svg)](https://www.npmjs.com/package/sb-action-logger) | sb-action-logger |

## Installation

```bash
npm i @lion/helpers
```

## Usage

Example using the sb-action-logger helper component.

```html
<script type="module">
  import '@lion/helpers/sb-action-logger.js';
</script>

<sb-action-logger></sb-action-logger>
```
