# @lion/nodejs-helpers

## 0.1.0

### Minor Changes

- c7c83d1: Update underlying code-formatter prettier to major version 3 and updated the prettify API accordingly.

  Consumers of this package need to make sure to await any calls to `prettify` as the function now returns a promise.
