# @lion/nodejs-helpers

## 0.1.1

### Patch Changes

- 78392ea: Support conditional ESM import targets when bypassing package import maps, fixing release preparation for packages with separate type and runtime targets.
  Normalize Windows path separators so source files are found and rewritten with valid ESM specifiers.

## 0.1.0

### Minor Changes

- c7c83d1: Update underlying code-formatter prettier to major version 3 and updated the prettify API accordingly.

  Consumers of this package need to make sure to await any calls to `prettify` as the function now returns a promise.
