# Change Log

## 0.7.4

### Patch Changes

- Updated dependencies [04874352]
  - @lion/form-core@0.15.1

## 0.7.3

### Patch Changes

- Updated dependencies [9648d418]
- Updated dependencies [9b9d82fc]
- Updated dependencies [8a766644]
- Updated dependencies [e87b6293]
- Updated dependencies [c544af4e]
  - @lion/localize@0.21.0
  - @lion/form-core@0.15.0

## 0.7.2

### Patch Changes

- 84131205: use mdjs-preview in docs for lit compatibility
- Updated dependencies [84131205]
  - @lion/form-core@0.14.2
  - @lion/localize@0.20.2

## 0.7.1

### Patch Changes

- Updated dependencies [f320b8b4]
- Updated dependencies [5ca3d275]
  - @lion/form-core@0.14.1
  - @lion/localize@0.20.1

## 0.7.0

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
  - @lion/form-core@0.14.0
  - @lion/localize@0.20.0

## 0.6.1

### Patch Changes

- Updated dependencies [0ddd38c0]
- Updated dependencies [0ddd38c0]
  - @lion/form-core@0.13.0

## 0.6.0

### Minor Changes

- 02e4f2cb: add simulator to demos

### Patch Changes

- Updated dependencies [11ec31c6]
- Updated dependencies [15146bf9]
- Updated dependencies [02e4f2cb]
- Updated dependencies [c6fbe920]
  - @lion/form-core@0.12.0
  - @lion/localize@0.19.0

## 0.5.4

### Patch Changes

- 77a04245: add protected and private type info
- Updated dependencies [38297d07]
- Updated dependencies [3b5ed322]
- Updated dependencies [77a04245]
- Updated dependencies [53167fd2]
- Updated dependencies [181a1d45]
- Updated dependencies [fb1522dd]
- Updated dependencies [75af80be]
- Updated dependencies [0e910e3f]
- Updated dependencies [991f1f54]
- Updated dependencies [cc02ae24]
- Updated dependencies [43e4bb81]
- Updated dependencies [6ae7a5e3]
  - @lion/form-core@0.11.0
  - @lion/localize@0.18.0

## 0.5.3

### Patch Changes

- Updated dependencies [6ea02988]
  - @lion/form-core@0.10.2

## 0.5.2

### Patch Changes

- Updated dependencies [72a6ccc8]
  - @lion/form-core@0.10.1

## 0.5.1

### Patch Changes

- Updated dependencies [13f808af]
- Updated dependencies [aa478174]
- Updated dependencies [a809d7b5]
  - @lion/form-core@0.10.0

## 0.5.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- Updated dependencies [f3e54c56]
- Updated dependencies [af90b20e]
- Updated dependencies [5db622e9]
  - @lion/form-core@0.9.0
  - @lion/localize@0.17.0

## 0.4.5

### Patch Changes

- Updated dependencies [dbacafa5]
  - @lion/form-core@0.8.5

## 0.4.4

### Patch Changes

- Updated dependencies [6b91c92d]
- Updated dependencies [701aadce]
  - @lion/form-core@0.8.4
  - @lion/localize@0.16.1

## 0.4.3

### Patch Changes

- Updated dependencies [b2a1c1ef]
  - @lion/form-core@0.8.3

## 0.4.2

### Patch Changes

- Updated dependencies [d0b37e62]
  - @lion/form-core@0.8.2

## 0.4.1

### Patch Changes

- Updated dependencies [deb95d13]
  - @lion/form-core@0.8.1

## 0.4.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/form-core@0.8.0
  - @lion/localize@0.16.0

## 0.3.16

### Patch Changes

- Updated dependencies [a7b27502]
  - @lion/form-core@0.7.3

## 0.3.15

### Patch Changes

- Updated dependencies [77114753]
- Updated dependencies [f98aab23]
- Updated dependencies [f98aab23]
  - @lion/form-core@0.7.2

## 0.3.14

### Patch Changes

- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/form-core@0.7.1
  - @lion/localize@0.15.5

## 0.3.13

### Patch Changes

- 5302ec89: Minimise dependencies by removing integration demos to form-integrations and form-core packages.
- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [a8cf4215]
- Updated dependencies [5302ec89]
- Updated dependencies [98f1bb7e]
- Updated dependencies [a8cf4215]
  - @lion/localize@0.15.4
  - @lion/form-core@0.7.0

## 0.3.12

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6
  - @lion/form-core@0.6.14
  - @lion/localize@0.15.3

## 0.3.11

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5
  - @lion/form-core@0.6.13
  - @lion/localize@0.15.2

## 0.3.10

### Patch Changes

- Updated dependencies [5553e43e]
  - @lion/form-core@0.6.12

## 0.3.9

### Patch Changes

- Updated dependencies [aa8ad0e6]
- Updated dependencies [4bacc17b]
  - @lion/form-core@0.6.11
  - @lion/localize@0.15.1

## 0.3.8

### Patch Changes

- Updated dependencies [c5c4d4ba]
- Updated dependencies [3ada1aef]
  - @lion/form-core@0.6.10
  - @lion/localize@0.15.0

## 0.3.7

### Patch Changes

- Updated dependencies [cf0967fe]
  - @lion/form-core@0.6.9

## 0.3.6

### Patch Changes

- Updated dependencies [b222fd78]
  - @lion/form-core@0.6.8

## 0.3.5

### Patch Changes

- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4
  - @lion/form-core@0.6.7
  - @lion/localize@0.14.9

## 0.3.4

### Patch Changes

- Updated dependencies [e2e4deec]
- Updated dependencies [8ca71b8f]
  - @lion/core@0.13.3
  - @lion/localize@0.14.8
  - @lion/form-core@0.6.6

## 0.3.3

### Patch Changes

- Updated dependencies [20ba0ca8]
- Updated dependencies [618f2698]
  - @lion/core@0.13.2
  - @lion/localize@0.14.7
  - @lion/form-core@0.6.5

## 0.3.2

### Patch Changes

- Updated dependencies [7682e520]
- Updated dependencies [2907649b]
- Updated dependencies [68e3e749]
- Updated dependencies [fd297a28]
- Updated dependencies [9fcb67f0]
- Updated dependencies [247e64a3]
- Updated dependencies [e92b98a4]
  - @lion/localize@0.14.6
  - @lion/form-core@0.6.4
  - @lion/core@0.13.1

## 0.3.1

### Patch Changes

- Updated dependencies [d5faa459]
- Updated dependencies [0aa4480e]
  - @lion/form-core@0.6.3

## 0.3.0

### Minor Changes

- 30223d4c: Add types for validate-messages package.

### Patch Changes

- Updated dependencies [4b7bea96]
- Updated dependencies [01a798e5]
- Updated dependencies [a31b7217]
- Updated dependencies [85720654]
- Updated dependencies [32202a88]
- Updated dependencies [b9327627]
- Updated dependencies [02145a06]
  - @lion/form-core@0.6.2
  - @lion/core@0.13.0
  - @lion/localize@0.14.5

## 0.2.15

### Patch Changes

- Updated dependencies [75107a4b]
- Updated dependencies [60d5d1d3]
  - @lion/core@0.12.0
  - @lion/form-core@0.6.1
  - @lion/localize@0.14.4

## 0.2.14

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/form-core@0.6.0
  - @lion/core@0.11.0
  - @lion/localize@0.14.3

## 0.2.13

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0
  - @lion/form-core@0.5.0
  - @lion/localize@0.14.2

## 0.2.12

### Patch Changes

- Updated dependencies [c347fce4]
  - @lion/form-core@0.4.4

## 0.2.11

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1
  - @lion/form-core@0.4.3
  - @lion/localize@0.14.1

## 0.2.10

### Patch Changes

- Updated dependencies [dd021e43]
- Updated dependencies [07c598fd]
  - @lion/form-core@0.4.2

## 0.2.9

### Patch Changes

- Updated dependencies [fb236975]
  - @lion/form-core@0.4.1

## 0.2.8

### Patch Changes

- Updated dependencies [3c61fd29]
- Updated dependencies [09d96759]
- Updated dependencies [9ecab4d5]
  - @lion/form-core@0.4.0
  - @lion/core@0.9.0
  - @lion/localize@0.14.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.7](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.2.6...@lion/validate-messages@0.2.7) (2020-07-28)

**Note:** Version bump only for package @lion/validate-messages

## [0.2.6](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.2.5...@lion/validate-messages@0.2.6) (2020-07-27)

**Note:** Version bump only for package @lion/validate-messages

## [0.2.5](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.2.4...@lion/validate-messages@0.2.5) (2020-07-16)

**Note:** Version bump only for package @lion/validate-messages

## [0.2.4](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.2.3...@lion/validate-messages@0.2.4) (2020-07-13)

**Note:** Version bump only for package @lion/validate-messages

## [0.2.3](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.2.2...@lion/validate-messages@0.2.3) (2020-07-09)

**Note:** Version bump only for package @lion/validate-messages

## [0.2.2](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.2.1...@lion/validate-messages@0.2.2) (2020-07-09)

**Note:** Version bump only for package @lion/validate-messages

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.2.0...@lion/validate-messages@0.2.1) (2020-07-09)

**Note:** Version bump only for package @lion/validate-messages

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.1.7...@lion/validate-messages@0.2.0) (2020-07-07)

### Bug Fixes

- **localize:** format hungarian & bulgarian dates ([cddd51a](https://github.com/ing-bank/lion/commit/cddd51adcb1b64da3f6850c8bd7f38830abb8aa8)), closes [#540](https://github.com/ing-bank/lion/issues/540)

### BREAKING CHANGES

- **localize:** N

## [0.1.7](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.1.6...@lion/validate-messages@0.1.7) (2020-07-06)

**Note:** Version bump only for package @lion/validate-messages

## [0.1.6](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.1.5...@lion/validate-messages@0.1.6) (2020-06-18)

**Note:** Version bump only for package @lion/validate-messages

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.1.4...@lion/validate-messages@0.1.5) (2020-06-10)

**Note:** Version bump only for package @lion/validate-messages

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.1.3...@lion/validate-messages@0.1.4) (2020-06-09)

**Note:** Version bump only for package @lion/validate-messages

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.1.2...@lion/validate-messages@0.1.3) (2020-06-08)

**Note:** Version bump only for package @lion/validate-messages

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.1.1...@lion/validate-messages@0.1.2) (2020-06-08)

**Note:** Version bump only for package @lion/validate-messages

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/validate-messages@0.1.0...@lion/validate-messages@0.1.1) (2020-06-03)

### Bug Fixes

- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))

# 0.1.0 (2020-05-29)

### Features

- merge field/validate/choice-input/form-group into @lion/form-core ([6170374](https://github.com/ing-bank/lion/commit/6170374ee8c058cb95fff79b4953b0535219e9b4))
