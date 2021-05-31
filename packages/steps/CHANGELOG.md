# Change Log

## 0.9.0

### Minor Changes

- 72067c0d: **BREAKING** Upgrade to [lit](https://lit.dev/) version 2

  This does not change any of the public APIs of lion.
  It however effects you when you have your own extension layer or your own components especially when using directives.
  See the [official lit upgrade guide](https://lit.dev/docs/releases/upgrade/).

  **BREAKING** Upgrade to [ScopedElements](https://open-wc.org/docs/development/scoped-elements/) version 2

  This version of `@open-wc/scoped-elements` is now following the [Scoped Custom Element Registries](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md) and automatically loads a polyfill [@webcomponents/scoped-custom-element-registry](https://github.com/webcomponents/polyfills/tree/master/packages/scoped-custom-element-registry).

  This means tag names are no longer being rewritten with a hash.

  ```js
  import { css, LitElement } from 'lit';
  import { ScopedElementsMixin } from '@open-wc/scoped-elements';
  import { MyButton } from './MyButton.js';

  export class MyElement extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
      return {
        'my-button': MyButton,
      };
    }

    render() {
      return html`
        <my-button>click me</my-button>
      `;
    }
  }
  ```

  ```html
  <!-- before (ScopedElements 1.x) -->
  <my-element>
    #shadow-root
    <my-button-23243424>click me</my-button-23243424>
  </my-element>

  <!-- after (ScopedElements 2.x) -->
  <my-element>
    #shadow-root
    <my-button>click me</my-button>
  </my-element>
  ```

### Patch Changes

- Updated dependencies [72067c0d]
  - @lion/core@0.18.0

## 0.8.3

### Patch Changes

- 02e4f2cb: add simulator to demos
- Updated dependencies [02e4f2cb]
  - @lion/core@0.17.0

## 0.8.2

### Patch Changes

- Updated dependencies [77a04245]
- Updated dependencies [43e4bb81]
  - @lion/core@0.16.0

## 0.8.1

### Patch Changes

- 59dad284: Removed lion-specific component namings from overview.md files

## 0.8.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- Updated dependencies [f3e54c56]
- Updated dependencies [5db622e9]
  - @lion/core@0.15.0

## 0.7.1

### Patch Changes

- Updated dependencies [701aadce]
  - @lion/core@0.14.1

## 0.7.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0

## 0.6.8

### Patch Changes

- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8

## 0.6.7

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [98f1bb7e]
  - @lion/core@0.13.7

## 0.6.6

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6

## 0.6.5

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5

## 0.6.4

### Patch Changes

- cfbcccb5: Fix type imports to reuse lion where possible, in case Lit updates with new types that may break us.
- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4

## 0.6.3

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3

## 0.6.2

### Patch Changes

- Updated dependencies [20ba0ca8]
  - @lion/core@0.13.2

## 0.6.1

### Patch Changes

- Updated dependencies [e92b98a4]
  - @lion/core@0.13.1

## 0.6.0

### Minor Changes

- 7d4b6d32: Add types for steps package.
- 7d4b6d32: Add types for steps package.

### Patch Changes

- Updated dependencies [01a798e5]
  - @lion/core@0.13.0

## 0.5.9

### Patch Changes

- Updated dependencies [75107a4b]
  - @lion/core@0.12.0

## 0.5.8

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0

## 0.5.7

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0

## 0.5.6

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1

## 0.5.5

### Patch Changes

- Updated dependencies [3c61fd29]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.5.4](https://github.com/ing-bank/lion/compare/@lion/steps@0.5.3...@lion/steps@0.5.4) (2020-07-13)

**Note:** Version bump only for package @lion/steps

## [0.5.3](https://github.com/ing-bank/lion/compare/@lion/steps@0.5.2...@lion/steps@0.5.3) (2020-06-18)

**Note:** Version bump only for package @lion/steps

## [0.5.2](https://github.com/ing-bank/lion/compare/@lion/steps@0.5.1...@lion/steps@0.5.2) (2020-06-08)

**Note:** Version bump only for package @lion/steps

## [0.5.1](https://github.com/ing-bank/lion/compare/@lion/steps@0.5.0...@lion/steps@0.5.1) (2020-06-03)

### Bug Fixes

- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))

# [0.5.0](https://github.com/ing-bank/lion/compare/@lion/steps@0.4.0...@lion/steps@0.5.0) (2020-05-29)

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/steps@0.3.9...@lion/steps@0.4.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

## [0.3.9](https://github.com/ing-bank/lion/compare/@lion/steps@0.3.8...@lion/steps@0.3.9) (2020-04-29)

### Bug Fixes

- add display:none for hidden ([#692](https://github.com/ing-bank/lion/issues/692)) ([9731771](https://github.com/ing-bank/lion/commit/9731771c23a5ed8661558e62cb5e34b62cc2b8b7))

## [0.3.8](https://github.com/ing-bank/lion/compare/@lion/steps@0.3.7...@lion/steps@0.3.8) (2020-04-02)

**Note:** Version bump only for package @lion/steps

## [0.3.7](https://github.com/ing-bank/lion/compare/@lion/steps@0.3.6...@lion/steps@0.3.7) (2020-03-25)

**Note:** Version bump only for package @lion/steps

## [0.3.6](https://github.com/ing-bank/lion/compare/@lion/steps@0.3.5...@lion/steps@0.3.6) (2020-03-05)

**Note:** Version bump only for package @lion/steps

## [0.3.5](https://github.com/ing-bank/lion/compare/@lion/steps@0.3.4...@lion/steps@0.3.5) (2020-03-04)

**Note:** Version bump only for package @lion/steps

## [0.3.4](https://github.com/ing-bank/lion/compare/@lion/steps@0.3.3...@lion/steps@0.3.4) (2020-02-19)

### Bug Fixes

- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.3.3](https://github.com/ing-bank/lion/compare/@lion/steps@0.3.2...@lion/steps@0.3.3) (2020-02-06)

**Note:** Version bump only for package @lion/steps

## [0.3.2](https://github.com/ing-bank/lion/compare/@lion/steps@0.3.1...@lion/steps@0.3.2) (2020-01-20)

**Note:** Version bump only for package @lion/steps

## [0.3.1](https://github.com/ing-bank/lion/compare/@lion/steps@0.3.0...@lion/steps@0.3.1) (2020-01-17)

### Bug Fixes

- update storybook and use main.js ([e61e0b9](https://github.com/ing-bank/lion/commit/e61e0b938ff72cc18cc0b3aa1560f2cece0c9fe6))

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/steps@0.2.1...@lion/steps@0.3.0) (2020-01-13)

### Features

- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/steps@0.2.0...@lion/steps@0.2.1) (2019-12-02)

### Bug Fixes

- use strict versions to get correct deps on older versions ([8645c13](https://github.com/ing-bank/lion/commit/8645c13b1d77e488713f2e5e0e4e00c4d30ea1ee))

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.20...@lion/steps@0.2.0) (2019-11-13)

### Features

- remove all deprecations from lion ([66d3d39](https://github.com/ing-bank/lion/commit/66d3d390aebeaa61b6effdea7d5f7eea0e89c894))

## [0.1.20](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.19...@lion/steps@0.1.20) (2019-11-01)

### Bug Fixes

- **steps:** do not throw if there is no step ([332c167](https://github.com/ing-bank/lion/commit/332c167))

## [0.1.19](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.18...@lion/steps@0.1.19) (2019-11-01)

### Bug Fixes

- **steps:** fire enter event for initial step ([a05b52e](https://github.com/ing-bank/lion/commit/a05b52e))

## [0.1.18](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.17...@lion/steps@0.1.18) (2019-10-24)

### Bug Fixes

- **steps:** always fire [@enter](https://github.com/enter) only once ([8c724fa](https://github.com/ing-bank/lion/commit/8c724fa))
- **steps:** steps.current should be update before [@enter](https://github.com/enter) ([ebe2bc1](https://github.com/ing-bank/lion/commit/ebe2bc1))

## [0.1.17](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.16...@lion/steps@0.1.17) (2019-10-23)

**Note:** Version bump only for package @lion/steps

## [0.1.16](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.15...@lion/steps@0.1.16) (2019-09-25)

**Note:** Version bump only for package @lion/steps

## [0.1.15](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.14...@lion/steps@0.1.15) (2019-08-23)

### Bug Fixes

- **steps:** fix the steps demo to work in all contexts ([70e4577](https://github.com/ing-bank/lion/commit/70e4577))

## [0.1.14](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.13...@lion/steps@0.1.14) (2019-07-25)

**Note:** Version bump only for package @lion/steps

## [0.1.13](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.12...@lion/steps@0.1.13) (2019-07-24)

**Note:** Version bump only for package @lion/steps

## [0.1.12](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.11...@lion/steps@0.1.12) (2019-07-23)

**Note:** Version bump only for package @lion/steps

## [0.1.11](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.10...@lion/steps@0.1.11) (2019-07-23)

**Note:** Version bump only for package @lion/steps

## [0.1.10](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.9...@lion/steps@0.1.10) (2019-06-03)

### Bug Fixes

- **steps:** allow extensions to introduce new non-default slots ([37d0db5](https://github.com/ing-bank/lion/commit/37d0db5))

## [0.1.9](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.8...@lion/steps@0.1.9) (2019-05-29)

**Note:** Version bump only for package @lion/steps

## [0.1.8](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.7...@lion/steps@0.1.8) (2019-05-24)

**Note:** Version bump only for package @lion/steps

## [0.1.7](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.6...@lion/steps@0.1.7) (2019-05-22)

**Note:** Version bump only for package @lion/steps

## [0.1.6](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.5...@lion/steps@0.1.6) (2019-05-17)

**Note:** Version bump only for package @lion/steps

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.4...@lion/steps@0.1.5) (2019-05-16)

**Note:** Version bump only for package @lion/steps

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.3...@lion/steps@0.1.4) (2019-05-13)

### Bug Fixes

- add prepublish step to make links absolute for npm docs ([9f2c4f6](https://github.com/ing-bank/lion/commit/9f2c4f6))

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.2...@lion/steps@0.1.3) (2019-04-28)

### Bug Fixes

- update storybook/linting; adjust story labels, eslint ignores ([8d96f84](https://github.com/ing-bank/lion/commit/8d96f84))

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.1...@lion/steps@0.1.2) (2019-04-27)

**Note:** Version bump only for package @lion/steps

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/steps@0.1.0...@lion/steps@0.1.1) (2019-04-26)

### Bug Fixes

- add missing files to npm packages ([0e3ca17](https://github.com/ing-bank/lion/commit/0e3ca17))

# 0.1.0 (2019-04-26)

### Features

- release inital public lion version ([ec8da8f](https://github.com/ing-bank/lion/commit/ec8da8f))
