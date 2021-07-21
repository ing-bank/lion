# rocket-preset-extend-lion-docs

## 0.1.4

### Patch Changes

- 26b2f4e0: Support usage of import assertions like `import style from 'my-pkg/style' assert { type: 'css' };`
- Updated dependencies [26b2f4e0]
  - babel-plugin-extend-docs@0.5.1

## 0.1.3

### Patch Changes

- ea768c93: Replace tags in html stories when extending

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
