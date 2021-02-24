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

| Package                                                               | Description             |
| --------------------------------------------------------------------- | ----------------------- |
| [sb-action-logger](?path=/docs/helpers-storybook-action-logger--main) | Storybook action logger |

## Installation

```bash
npm i @lion/helpers
```

## Usage

Example using the sb-action-logger helper component.

```html
<script type="module">
  import '@lion/helpers/define';
</script>

<sb-action-logger></sb-action-logger>
```
