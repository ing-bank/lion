# rocket-preset-extend-lion-docs

## 0.3.1

### Patch Changes

- f46d9087: feat: allow globalReplaceFunction in rocket-preset-extend-lion-docs
- Updated dependencies [63f8f6fd]
  - remark-extend@0.5.1

## 0.3.0

### Minor Changes

- 672c8e99: New documentation structure

### Patch Changes

- Updated dependencies [672c8e99]
  - remark-extend@0.5.0

## 0.2.2

### Patch Changes

- 30805edf: Replace deprecated node folder exports with wildcard exports for docs
- 2bd3c521: Rename customElementsManifest to customElements in package.json
- Updated dependencies [30805edf]
  - babel-plugin-extend-docs@0.5.3
  - remark-extend@0.4.4

## 0.2.1

### Patch Changes

- f303ed68: windows compatibility

## 0.2.0

### Minor Changes

- 1dfe915e: Updated to use plugins-manager 0.3.0 which gets used in latest rocket/mdjs.

## 0.1.5

### Patch Changes

- Updated dependencies [dd3fd331]
- Updated dependencies [bffd6db9]
  - babel-plugin-extend-docs@0.5.2
  - remark-extend@0.4.3

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
