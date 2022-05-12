# Change Log

## 0.8.3

### Patch Changes

- Updated dependencies [a35ec45d]
  - @lion/core@0.17.3

## 0.8.2

### Patch Changes

- Updated dependencies [92361c19]
  - @lion/core@0.17.2

## 0.8.1

### Patch Changes

- Updated dependencies [d1d977c1]
  - @lion/core@0.17.1

## 0.8.0

### Minor Changes

- 02e4f2cb: add simulator to demos

### Patch Changes

- Updated dependencies [02e4f2cb]
  - @lion/core@0.17.0

## 0.7.1

### Patch Changes

- Updated dependencies [77a04245]
- Updated dependencies [43e4bb81]
  - @lion/core@0.16.0

## 0.7.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- Updated dependencies [f3e54c56]
- Updated dependencies [5db622e9]
  - @lion/core@0.15.0

## 0.6.1

### Patch Changes

- 15e2d135: Add some styling improvements to action logger component.
- Updated dependencies [701aadce]
  - @lion/core@0.14.1

## 0.6.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0

## 0.5.20

### Patch Changes

- e557bda4: Republish helpers so that index.d.ts gets published with the latest ts config.

## 0.5.19

### Patch Changes

- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8

## 0.5.18

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [98f1bb7e]
  - @lion/core@0.13.7

## 0.5.17

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6

## 0.5.16

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5

## 0.5.15

### Patch Changes

- b222fd78: Always use CSSResultArray for styles getters and be consistent. This makes typing for subclassers significantly easier. Also added some fixes for missing types in mixins where the superclass was not typed properly. This highlighted some issues with incomplete mixin contracts

## 0.5.14

### Patch Changes

- cfbcccb5: Fix type imports to reuse lion where possible, in case Lit updates with new types that may break us.
- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4

## 0.5.13

### Patch Changes

- 9da2aa20: Fix types for helpers

## 0.5.12

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3

## 0.5.11

### Patch Changes

- Updated dependencies [20ba0ca8]
  - @lion/core@0.13.2

## 0.5.10

### Patch Changes

- Updated dependencies [e92b98a4]
  - @lion/core@0.13.1

## 0.5.9

### Patch Changes

- Updated dependencies [01a798e5]
  - @lion/core@0.13.0

## 0.5.8

### Patch Changes

- Updated dependencies [75107a4b]
  - @lion/core@0.12.0

## 0.5.7

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0

## 0.5.6

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0

## 0.5.5

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1

## 0.5.4

### Patch Changes

- Updated dependencies [3c61fd29]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.5.3](https://github.com/ing-bank/lion/compare/@lion/helpers@0.5.2...@lion/helpers@0.5.3) (2020-07-13)

**Note:** Version bump only for package @lion/helpers

## [0.5.2](https://github.com/ing-bank/lion/compare/@lion/helpers@0.5.1...@lion/helpers@0.5.2) (2020-06-18)

**Note:** Version bump only for package @lion/helpers

## [0.5.1](https://github.com/ing-bank/lion/compare/@lion/helpers@0.5.0...@lion/helpers@0.5.1) (2020-06-08)

**Note:** Version bump only for package @lion/helpers

# [0.5.0](https://github.com/ing-bank/lion/compare/@lion/helpers@0.4.0...@lion/helpers@0.5.0) (2020-06-03)

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/helpers@0.3.6...@lion/helpers@0.4.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

## [0.3.6](https://github.com/ing-bank/lion/compare/@lion/helpers@0.3.5...@lion/helpers@0.3.6) (2020-04-29)

**Note:** Version bump only for package @lion/helpers

## [0.3.5](https://github.com/ing-bank/lion/compare/@lion/helpers@0.3.4...@lion/helpers@0.3.5) (2020-04-02)

**Note:** Version bump only for package @lion/helpers

## [0.3.4](https://github.com/ing-bank/lion/compare/@lion/helpers@0.3.3...@lion/helpers@0.3.4) (2020-03-25)

**Note:** Version bump only for package @lion/helpers

## [0.3.3](https://github.com/ing-bank/lion/compare/@lion/helpers@0.3.2...@lion/helpers@0.3.3) (2020-03-05)

**Note:** Version bump only for package @lion/helpers

## [0.3.2](https://github.com/ing-bank/lion/compare/@lion/helpers@0.3.1...@lion/helpers@0.3.2) (2020-02-19)

### Bug Fixes

- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.3.1](https://github.com/ing-bank/lion/compare/@lion/helpers@0.3.0...@lion/helpers@0.3.1) (2020-02-06)

**Note:** Version bump only for package @lion/helpers

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/helpers@0.2.2...@lion/helpers@0.3.0) (2020-01-21)

### Features

- **helpers:** add handling duplicate consecutive logs to action logger ([288c253](https://github.com/ing-bank/lion/commit/288c2531e66a10a5fbe085d8ed69e2c676f818c8))
- **helpers:** add simple mode to action logger ([d257937](https://github.com/ing-bank/lion/commit/d25793758f57af075e13801d6fefcd239b43fa2b))

## [0.2.2](https://github.com/ing-bank/lion/compare/@lion/helpers@0.2.1...@lion/helpers@0.2.2) (2020-01-20)

**Note:** Version bump only for package @lion/helpers

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/helpers@0.2.0...@lion/helpers@0.2.1) (2020-01-17)

### Bug Fixes

- **helpers:** publish folders to npm ([bc6958b](https://github.com/ing-bank/lion/commit/bc6958b98432bf629a8b6a90122cbb8a38416ee7))

# 0.2.0 (2020-01-13)

### Features

- **helpers:** new package with several helpers ([d13672a](https://github.com/ing-bank/lion/commit/d13672a22648883030cb0170431fad82eb81a96d))
- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))
