# Change Log

## 0.4.1

### Patch Changes

- 57ad1569: Do not touch image urls

## 0.4.0

### Minor Changes

- 5db622e9: BREAKING CHANGE: Changing approach from overwriting extending files to using an import-based approach.

  Removed features:

  - `::replaceFrom`
  - `::replaceBetween`
  - `::addMdAfter`
  - `::removeFrom`
  - `::removeBetween`

  Added Features:

  - `::import`
  - `::importBlock`
  - `::importBlockContent`
  - `::importSmallBlock`
  - `::importSmallBlockContent`

  See the updated documentation for how to use this new approach.

## 0.3.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

## 0.2.2

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.1](https://github.com/ing-bank/lion/compare/remark-extend@0.2.0...remark-extend@0.2.1) (2020-06-18)

**Note:** Version bump only for package remark-extend

# [0.2.0](https://github.com/ing-bank/lion/compare/remark-extend@0.1.4...remark-extend@0.2.0) (2020-06-03)

### Bug Fixes

- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

## [0.1.4](https://github.com/ing-bank/lion/compare/remark-extend@0.1.3...remark-extend@0.1.4) (2020-05-27)

### Bug Fixes

- **remark-extend:** when throwing show path to used files ([7df6879](https://github.com/ing-bank/lion/commit/7df6879af2f455ba0dd938a9e6375b0751d714fc))

## [0.1.3](https://github.com/ing-bank/lion/compare/remark-extend@0.1.2...remark-extend@0.1.3) (2020-05-26)

### Bug Fixes

- **remark-extend:** task order is the same as in provided extend md ([00176c6](https://github.com/ing-bank/lion/commit/00176c6c5e83651f095f7fe22da28b4b21d8f8d1))

## [0.1.2](https://github.com/ing-bank/lion/compare/remark-extend@0.1.1...remark-extend@0.1.2) (2020-04-29)

**Note:** Version bump only for package remark-extend

## [0.1.1](https://github.com/ing-bank/lion/compare/remark-extend@0.1.0...remark-extend@0.1.1) (2020-04-20)

### Bug Fixes

- **remark-extend:** add missing main entry point ([b54e019](https://github.com/ing-bank/lion/commit/b54e0199884b48428d8e738eb888f5031134270b))

# 0.1.0 (2020-04-15)

### Features

- add remark-extend package ([017eaba](https://github.com/ing-bank/lion/commit/017eabaec44cd3551265e138d7004bb687027661))
