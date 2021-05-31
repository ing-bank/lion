# Change Log

## 0.5.0

### Minor Changes

- 0ca86031: Work with package entry points (exports) and internal imports.

  This simplified the internal logic a lot. For more details please see [package entry points](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#packages_exports) in the node documentation.

  BREAKING CHANGES:

  - we no longer support relative import paths in demos
  - no need to pass on a `rootPath` or `__filePath` anymore
  - option `throwOnNonExistingPathToFiles` and `throwOnNonExistingRootPath` got removed

## 0.4.1

### Patch Changes

- 02e4f2cb: add simulator to demos

## 0.4.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket

### Patch Changes

- 5db622e9: Still replace tags if templates uses `.foo=${{ key: 'value' }}`

## 0.3.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

## 0.2.5

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.

## 0.2.4

### Patch Changes

- 82c6cce6: Take into account that paths can be windows-based with backslashes, when analyzing folder depth

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.3](https://github.com/ing-bank/lion/compare/babel-plugin-extend-docs@0.2.2...babel-plugin-extend-docs@0.2.3) (2020-06-18)

### Bug Fixes

- **babel-plugin-extend-docs:** use posix path join for posix type path ([4441945](https://github.com/ing-bank/lion/commit/4441945d051fa558db2270926583fd0443043c25))

## [0.2.2](https://github.com/ing-bank/lion/compare/babel-plugin-extend-docs@0.2.1...babel-plugin-extend-docs@0.2.2) (2020-06-18)

**Note:** Version bump only for package babel-plugin-extend-docs

## [0.2.1](https://github.com/ing-bank/lion/compare/babel-plugin-extend-docs@0.2.0...babel-plugin-extend-docs@0.2.1) (2020-06-10)

### Bug Fixes

- **babel-plugin-extend-docs:** check more strictly on tagnames ([dc143b7](https://github.com/ing-bank/lion/commit/dc143b7323590ebb46054d22abfb16aa2090c110))

# [0.2.0](https://github.com/ing-bank/lion/compare/babel-plugin-extend-docs@0.1.0...babel-plugin-extend-docs@0.2.0) (2020-05-29)

### Bug Fixes

- **babel-plugin-extend-docs:** use @babel/core instead of babel-core ([f008ee4](https://github.com/ing-bank/lion/commit/f008ee42a722482c5619dc9d29fd1e050820bf6c))

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

# 0.1.0 (2020-04-29)

### Features

- **babel-plugin-extends-docs:** extend docs by rewriting imports/code ([2cdb7ca](https://github.com/ing-bank/lion/commit/2cdb7cac50c21bf2af5314797375c68c60523252))
