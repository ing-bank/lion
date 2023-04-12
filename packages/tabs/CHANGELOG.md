# Change Log

## 0.8.4

### Patch Changes

- Updated dependencies [776feaa0]
  - @lion/core@0.17.4

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

## 0.7.2

### Patch Changes

- 77a04245: add protected and private type info
- Updated dependencies [77a04245]
- Updated dependencies [43e4bb81]
  - @lion/core@0.16.0

## 0.7.1

### Patch Changes

- 59dad284: Removed lion-specific component namings from overview.md files

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

- Updated dependencies [701aadce]
  - @lion/core@0.14.1

## 0.6.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0

## 0.5.14

### Patch Changes

- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8

## 0.5.13

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [98f1bb7e]
  - @lion/core@0.13.7

## 0.5.12

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6

## 0.5.11

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5

## 0.5.10

### Patch Changes

- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4

## 0.5.9

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3

## 0.5.8

### Patch Changes

- Updated dependencies [20ba0ca8]
  - @lion/core@0.13.2

## 0.5.7

### Patch Changes

- Updated dependencies [e92b98a4]
  - @lion/core@0.13.1

## 0.5.6

### Patch Changes

- bef7d961: Only look for tabs and panels as direct children, this allows to have nested tabs.
- 56cc174c: The store of invoker and content slottables was not properly cleared before repopulating, on slotchange event. This would cause duplicate entries.
- Updated dependencies [01a798e5]
  - @lion/core@0.13.0

## 0.5.5

### Patch Changes

- Updated dependencies [75107a4b]
  - @lion/core@0.12.0

## 0.5.4

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0

## 0.5.3

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0

## 0.5.2

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1

## 0.5.1

### Patch Changes

- 3c61fd29: Add types to form-core, for everything except form-group, choice-group and validate. Also added index.d.ts (re-)export files to git so that interdependent packages can use their types locally.
- Updated dependencies [3c61fd29]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.5.0](https://github.com/ing-bank/lion/compare/@lion/tabs@0.4.4...@lion/tabs@0.5.0) (2020-07-13)

### Features

- **tabs:** fix types and export type definition files for tabs ([0cf8a0c](https://github.com/ing-bank/lion/commit/0cf8a0c9212faae42b95a84c5a49b3e94035bcef))

## [0.4.4](https://github.com/ing-bank/lion/compare/@lion/tabs@0.4.3...@lion/tabs@0.4.4) (2020-06-18)

**Note:** Version bump only for package @lion/tabs

## [0.4.3](https://github.com/ing-bank/lion/compare/@lion/tabs@0.4.2...@lion/tabs@0.4.3) (2020-06-10)

**Note:** Version bump only for package @lion/tabs

## [0.4.2](https://github.com/ing-bank/lion/compare/@lion/tabs@0.4.1...@lion/tabs@0.4.2) (2020-06-08)

**Note:** Version bump only for package @lion/tabs

## [0.4.1](https://github.com/ing-bank/lion/compare/@lion/tabs@0.4.0...@lion/tabs@0.4.1) (2020-06-03)

### Bug Fixes

- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/tabs@0.3.1...@lion/tabs@0.4.0) (2020-05-29)

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

## [0.3.1](https://github.com/ing-bank/lion/compare/@lion/tabs@0.3.0...@lion/tabs@0.3.1) (2020-05-27)

### Bug Fixes

- **tabs:** do not focus tabs when selectedIndex is set ([#729](https://github.com/ing-bank/lion/issues/729)) ([e4ec227](https://github.com/ing-bank/lion/commit/e4ec2275669b7ec9648f6c0986bd9fe3d321b488))

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/tabs@0.2.10...@lion/tabs@0.3.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

## [0.2.10](https://github.com/ing-bank/lion/compare/@lion/tabs@0.2.9...@lion/tabs@0.2.10) (2020-05-18)

### Bug Fixes

- **tabs:** tab keyboard navigation trap ([fbbea36](https://github.com/ing-bank/lion/commit/fbbea367205941de652da8224871923d120c2ede)), closes [#712](https://github.com/ing-bank/lion/issues/712)

## [0.2.9](https://github.com/ing-bank/lion/compare/@lion/tabs@0.2.8...@lion/tabs@0.2.9) (2020-04-29)

**Note:** Version bump only for package @lion/tabs

## [0.2.8](https://github.com/ing-bank/lion/compare/@lion/tabs@0.2.7...@lion/tabs@0.2.8) (2020-04-02)

**Note:** Version bump only for package @lion/tabs

## [0.2.7](https://github.com/ing-bank/lion/compare/@lion/tabs@0.2.6...@lion/tabs@0.2.7) (2020-03-25)

**Note:** Version bump only for package @lion/tabs

## [0.2.6](https://github.com/ing-bank/lion/compare/@lion/tabs@0.2.5...@lion/tabs@0.2.6) (2020-03-05)

**Note:** Version bump only for package @lion/tabs

## [0.2.5](https://github.com/ing-bank/lion/compare/@lion/tabs@0.2.4...@lion/tabs@0.2.5) (2020-03-04)

### Bug Fixes

- **tabs:** prevent scrolling when initially focussing a tab ([e3bbc3e](https://github.com/ing-bank/lion/commit/e3bbc3ecf1d159c54edf85d85a00652f20ab2a68))

## [0.2.4](https://github.com/ing-bank/lion/compare/@lion/tabs@0.2.3...@lion/tabs@0.2.4) (2020-02-19)

### Bug Fixes

- **tab:** remove scroll while navigating the tabs using up/down arrows ([#592](https://github.com/ing-bank/lion/issues/592)) ([9c6eaf8](https://github.com/ing-bank/lion/commit/9c6eaf83f131de64f32b667cf0e823ec26ff6da0))
- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.2.3](https://github.com/ing-bank/lion/compare/@lion/tabs@0.2.2...@lion/tabs@0.2.3) (2020-02-06)

**Note:** Version bump only for package @lion/tabs

## [0.2.2](https://github.com/ing-bank/lion/compare/@lion/tabs@0.2.1...@lion/tabs@0.2.2) (2020-01-20)

**Note:** Version bump only for package @lion/tabs

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/tabs@0.2.0...@lion/tabs@0.2.1) (2020-01-17)

### Bug Fixes

- update storybook and use main.js ([e61e0b9](https://github.com/ing-bank/lion/commit/e61e0b938ff72cc18cc0b3aa1560f2cece0c9fe6))

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/tabs@0.1.3...@lion/tabs@0.2.0) (2020-01-13)

### Features

- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/tabs@0.1.2...@lion/tabs@0.1.3) (2019-12-02)

### Bug Fixes

- use strict versions to get correct deps on older versions ([8645c13](https://github.com/ing-bank/lion/commit/8645c13b1d77e488713f2e5e0e4e00c4d30ea1ee))

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/tabs@0.1.1...@lion/tabs@0.1.2) (2019-11-15)

### Bug Fixes

- refactor slot selection ([5999ea9](https://github.com/ing-bank/lion/commit/5999ea956967b449f3f04935c7facb19e2889dc9))

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/tabs@0.1.0...@lion/tabs@0.1.1) (2019-11-13)

**Note:** Version bump only for package @lion/tabs

# 0.1.0 (2019-10-31)

### Features

- **tabs:** create tabs component ([7a562a6](https://github.com/ing-bank/lion/commit/7a562a6))
