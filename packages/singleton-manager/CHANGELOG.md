# Change Log

## 1.4.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket

## 1.3.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

## 1.2.1

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.

## 1.2.0

### Minor Changes

- 39d5e767: Changed on how to handle multiple instances of the singleton manager

  - save the map instance on the window object so multiple singleton manager versions can share the data.
  - ignore subsequential set calls if the key is already set (did throw before)

## 1.1.2

### Patch Changes

- 3c61fd29: Add types to form-core, for everything except form-group, choice-group and validate. Also added index.d.ts (re-)export files to git so that interdependent packages can use their types locally.
- 09d96759: Added basic JSDocs types to SingletonManager, in order for localize to be able to be typed correctly.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.1](https://github.com/ing-bank/lion/compare/singleton-manager@1.1.0...singleton-manager@1.1.1) (2020-07-13)

**Note:** Version bump only for package singleton-manager

# [1.1.0](https://github.com/ing-bank/lion/compare/singleton-manager@1.0.0...singleton-manager@1.1.0) (2020-06-18)

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

# 1.0.0 (2020-05-18)

### Features

- manager to support single instances with nested npm installations ([7f49f2c](https://github.com/ing-bank/lion/commit/7f49f2c6a60a68d609243f77c5c01ba1047deef2))

### BREAKING CHANGES

- add singleton-manager
