# rocket-preset-extend-lion-docs

## 0.1.2

### Patch Changes

- 835c2804: Handle exports that do not have a Lion prefix
- 835c2804: Add option `exportsMapJsonFileName` to configure the json filename containing the export map (default to `package.json`)
- c5992d63: Support multi line exports and comments in exports

  ```js
  export {
    // html,
    calculateSum,
    offsetValue,
  } from './src/helpers.js';
  ```

- 835c2804: Support usage without a subfolder for the npm scope (via setting `npmScope: ''`)

## 0.1.1

### Patch Changes

- 59f10bc5: Add missing dependency

## 0.1.0

### Minor Changes

- 0ca86031: Initial release
