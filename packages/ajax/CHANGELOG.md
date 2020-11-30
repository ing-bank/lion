# Change Log

## 0.5.11

### Patch Changes

- Updated dependencies [39d5e767]
  - singleton-manager@1.2.0

## 0.5.10

### Patch Changes

- 6cc8b95c: Added types for ajax package, although they are mostly quite butchered. This is due to the complexity of interceptor factories and bundled-es-modules/axios not exporting types, which makes it really difficult to type it properly.
- 1cb604c6: enable types for ajax

## 0.5.9

### Patch Changes

- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4

## 0.5.8

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3

## 0.5.7

### Patch Changes

- Updated dependencies [20ba0ca8]
  - @lion/core@0.13.2

## 0.5.6

### Patch Changes

- Updated dependencies [e92b98a4]
  - @lion/core@0.13.1

## 0.5.5

### Patch Changes

- Updated dependencies [01a798e5]
  - @lion/core@0.13.0

## 0.5.4

### Patch Changes

- Updated dependencies [75107a4b]
  - @lion/core@0.12.0

## 0.5.3

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0

## 0.5.2

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0

## 0.5.1

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1

## 0.5.0

### Minor Changes

- 9ecab4d5: Removing LionSingleton as es modules are already guaranteed to be singletons.
  This reduces complexity and means less code to ship to our users.

### Patch Changes

- Updated dependencies [3c61fd29]
- Updated dependencies [09d96759]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0
  - singleton-manager@1.1.2

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.4](https://github.com/ing-bank/lion/compare/@lion/ajax@0.4.3...@lion/ajax@0.4.4) (2020-07-13)

**Note:** Version bump only for package @lion/ajax

## [0.4.3](https://github.com/ing-bank/lion/compare/@lion/ajax@0.4.2...@lion/ajax@0.4.3) (2020-06-18)

**Note:** Version bump only for package @lion/ajax

## [0.4.2](https://github.com/ing-bank/lion/compare/@lion/ajax@0.4.1...@lion/ajax@0.4.2) (2020-06-08)

**Note:** Version bump only for package @lion/ajax

## [0.4.1](https://github.com/ing-bank/lion/compare/@lion/ajax@0.4.0...@lion/ajax@0.4.1) (2020-06-03)

### Bug Fixes

- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/ajax@0.3.0...@lion/ajax@0.4.0) (2020-05-29)

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.10...@lion/ajax@0.3.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

## [0.2.10](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.9...@lion/ajax@0.2.10) (2020-04-29)

**Note:** Version bump only for package @lion/ajax

## [0.2.9](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.8...@lion/ajax@0.2.9) (2020-04-02)

**Note:** Version bump only for package @lion/ajax

## [0.2.8](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.7...@lion/ajax@0.2.8) (2020-03-25)

**Note:** Version bump only for package @lion/ajax

## [0.2.7](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.6...@lion/ajax@0.2.7) (2020-03-05)

**Note:** Version bump only for package @lion/ajax

## [0.2.6](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.5...@lion/ajax@0.2.6) (2020-02-26)

**Note:** Version bump only for package @lion/ajax

## [0.2.5](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.4...@lion/ajax@0.2.5) (2020-02-19)

### Bug Fixes

- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.2.4](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.3...@lion/ajax@0.2.4) (2020-02-06)

**Note:** Version bump only for package @lion/ajax

## [0.2.3](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.2...@lion/ajax@0.2.3) (2020-01-29)

### Bug Fixes

- update broken ajax storybook link ([f731ade](https://github.com/ing-bank/lion/commit/f731ade8f02f68cc140228bfd1d58934c403a57d))

## [0.2.2](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.1...@lion/ajax@0.2.2) (2020-01-20)

**Note:** Version bump only for package @lion/ajax

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.0...@lion/ajax@0.2.1) (2020-01-17)

### Bug Fixes

- update storybook and use main.js ([e61e0b9](https://github.com/ing-bank/lion/commit/e61e0b938ff72cc18cc0b3aa1560f2cece0c9fe6))

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.20...@lion/ajax@0.2.0) (2020-01-13)

### Features

- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))

## [0.1.20](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.19...@lion/ajax@0.1.20) (2019-12-02)

### Bug Fixes

- use strict versions to get correct deps on older versions ([8645c13](https://github.com/ing-bank/lion/commit/8645c13b1d77e488713f2e5e0e4e00c4d30ea1ee))

## [0.1.19](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.18...@lion/ajax@0.1.19) (2019-11-13)

**Note:** Version bump only for package @lion/ajax

## [0.1.18](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.17...@lion/ajax@0.1.18) (2019-10-23)

**Note:** Version bump only for package @lion/ajax

## [0.1.17](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.16...@lion/ajax@0.1.17) (2019-09-25)

**Note:** Version bump only for package @lion/ajax

## [0.1.16](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.15...@lion/ajax@0.1.16) (2019-07-25)

**Note:** Version bump only for package @lion/ajax

## [0.1.15](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.14...@lion/ajax@0.1.15) (2019-07-24)

**Note:** Version bump only for package @lion/ajax

## [0.1.14](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.13...@lion/ajax@0.1.14) (2019-07-23)

**Note:** Version bump only for package @lion/ajax

## [0.1.13](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.12...@lion/ajax@0.1.13) (2019-07-23)

**Note:** Version bump only for package @lion/ajax

## [0.1.12](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.11...@lion/ajax@0.1.12) (2019-06-03)

### Bug Fixes

- **ajax:** update to axios with security vularability fix ([d227a04](https://github.com/ing-bank/lion/commit/d227a04))

## [0.1.11](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.10...@lion/ajax@0.1.11) (2019-05-29)

**Note:** Version bump only for package @lion/ajax

## [0.1.10](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.9...@lion/ajax@0.1.10) (2019-05-24)

**Note:** Version bump only for package @lion/ajax

## [0.1.9](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.8...@lion/ajax@0.1.9) (2019-05-22)

**Note:** Version bump only for package @lion/ajax

## [0.1.8](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.7...@lion/ajax@0.1.8) (2019-05-17)

**Note:** Version bump only for package @lion/ajax

## [0.1.7](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.6...@lion/ajax@0.1.7) (2019-05-16)

**Note:** Version bump only for package @lion/ajax

## [0.1.6](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.5...@lion/ajax@0.1.6) (2019-05-13)

### Bug Fixes

- add prepublish step to make links absolute for npm docs ([9f2c4f6](https://github.com/ing-bank/lion/commit/9f2c4f6))

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.4...@lion/ajax@0.1.5) (2019-05-07)

### Bug Fixes

- import from entry points so stories can be extended ([49f18a4](https://github.com/ing-bank/lion/commit/49f18a4))

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.3...@lion/ajax@0.1.4) (2019-04-28)

### Bug Fixes

- update storybook/linting; adjust story labels, eslint ignores ([8d96f84](https://github.com/ing-bank/lion/commit/8d96f84))

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.2...@lion/ajax@0.1.3) (2019-04-27)

**Note:** Version bump only for package @lion/ajax

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.1...@lion/ajax@0.1.2) (2019-04-27)

### Bug Fixes

- **ajax:** add setAjax to public api ([9a69b1a](https://github.com/ing-bank/lion/commit/9a69b1a))

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.0...@lion/ajax@0.1.1) (2019-04-26)

### Bug Fixes

- add missing files to npm packages ([0e3ca17](https://github.com/ing-bank/lion/commit/0e3ca17))

# 0.1.0 (2019-04-26)

### Features

- release inital public lion version ([ec8da8f](https://github.com/ing-bank/lion/commit/ec8da8f))
