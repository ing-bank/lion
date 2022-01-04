# Change Log

## 0.13.7

### Patch Changes

- 30805edf: Replace deprecated node folder exports with wildcard exports for docs
- 2bd3c521: Rename customElementsManifest to customElements in package.json
- Updated dependencies [30805edf]
- Updated dependencies [495cb0c5]
- Updated dependencies [6e67b4a3]
- Updated dependencies [2b583ee7]
- Updated dependencies [83011918]
  - @lion/core@0.20.0
  - @lion/overlays@0.30.0

## 0.13.6

### Patch Changes

- c4562f7e: use html & unsafeStatic from @open-wc/testing instead of directly from lit
- Updated dependencies [9b81b69e]
- Updated dependencies [a2c66cd9]
- Updated dependencies [c4562f7e]
- Updated dependencies [c55d4566]
- Updated dependencies [fdc5e73f]
- Updated dependencies [b6be7ba4]
  - @lion/core@0.19.0
  - @lion/overlays@0.29.1

## 0.13.5

### Patch Changes

- Updated dependencies [6e86fb4e]
- Updated dependencies [bcf68ceb]
- Updated dependencies [d963e74e]
  - @lion/overlays@0.29.0
  - @lion/core@0.18.4

## 0.13.4

### Patch Changes

- Updated dependencies [ec03d209]
  - @lion/core@0.18.3
  - @lion/overlays@0.28.4

## 0.13.3

### Patch Changes

- Updated dependencies [8c06302e]
  - @lion/core@0.18.2
  - @lion/overlays@0.28.3

## 0.13.2

### Patch Changes

- 84131205: use mdjs-preview in docs for lit compatibility
- Updated dependencies [84131205]
  - @lion/core@0.18.1
  - @lion/overlays@0.28.2

## 0.13.1

### Patch Changes

- Updated dependencies [c57f42a3]
  - @lion/overlays@0.28.1

## 0.13.0

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
  - @lion/overlays@0.28.0

## 0.12.0

### Minor Changes

- 02e4f2cb: add simulator to demos

### Patch Changes

- Updated dependencies [239cce3b]
- Updated dependencies [02e4f2cb]
  - @lion/overlays@0.27.0
  - @lion/core@0.17.0

## 0.11.4

### Patch Changes

- Updated dependencies [f2d9b8e2]
  - @lion/overlays@0.26.1

## 0.11.3

### Patch Changes

- 77a04245: add protected and private type info
- Updated dependencies [77a04245]
- Updated dependencies [43e4bb81]
  - @lion/core@0.16.0
  - @lion/overlays@0.26.0

## 0.11.2

### Patch Changes

- Updated dependencies [6ea02988]
  - @lion/overlays@0.25.2

## 0.11.1

### Patch Changes

- Updated dependencies [412270fa]
  - @lion/overlays@0.25.1

## 0.11.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- Updated dependencies [f3e54c56]
- Updated dependencies [5db622e9]
  - @lion/core@0.15.0
  - @lion/overlays@0.25.0

## 0.10.2

### Patch Changes

- Updated dependencies [2e8e547c]
  - @lion/overlays@0.24.2

## 0.10.1

### Patch Changes

- 701aadce: Fix types of mixins to include LitElement static props and methods, and use Pick generic type instead of fake constructors.
- Updated dependencies [6b91c92d]
- Updated dependencies [701aadce]
  - @lion/overlays@0.24.1
  - @lion/core@0.14.1

## 0.10.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0
  - @lion/overlays@0.24.0

## 0.9.18

### Patch Changes

- Updated dependencies [a77452b0]
  - @lion/overlays@0.23.4

## 0.9.17

### Patch Changes

- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
- Updated dependencies [9352b577]
  - @lion/core@0.13.8
  - @lion/overlays@0.23.3

## 0.9.16

### Patch Changes

- Updated dependencies [a7760b64]
  - @lion/overlays@0.23.2

## 0.9.15

### Patch Changes

- Updated dependencies [a04ea59c]
  - @lion/overlays@0.23.1

## 0.9.14

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [1f62ed8b]
- Updated dependencies [98f1bb7e]
- Updated dependencies [53d22a85]
  - @lion/overlays@0.23.0
  - @lion/core@0.13.7

## 0.9.13

### Patch Changes

- Updated dependencies [9fba9007]
- Updated dependencies [80031f66]
  - @lion/core@0.13.6
  - @lion/overlays@0.22.8

## 0.9.12

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5
  - @lion/overlays@0.22.7

## 0.9.11

### Patch Changes

- Updated dependencies [de536282]
- Updated dependencies [11e8dbcb]
  - @lion/overlays@0.22.6

## 0.9.10

### Patch Changes

- Updated dependencies [83359ac2]
- Updated dependencies [7709d7c2]
- Updated dependencies [2eeace23]
  - @lion/overlays@0.22.5

## 0.9.9

### Patch Changes

- Updated dependencies [5553e43e]
  - @lion/overlays@0.22.4

## 0.9.8

### Patch Changes

- Updated dependencies [9142a53d]
- Updated dependencies [3944c5e8]
  - @lion/overlays@0.22.3

## 0.9.7

### Patch Changes

- Updated dependencies [b222fd78]
  - @lion/overlays@0.22.2

## 0.9.6

### Patch Changes

- cfbcccb5: Fix type imports to reuse lion where possible, in case Lit updates with new types that may break us.
- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4
  - @lion/overlays@0.22.1

## 0.9.5

### Patch Changes

- Updated dependencies [9c3224b4]
- Updated dependencies [fff79915]
  - @lion/overlays@0.22.0

## 0.9.4

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3
  - @lion/overlays@0.21.3

## 0.9.3

### Patch Changes

- Updated dependencies [20ba0ca8]
  - @lion/core@0.13.2
  - @lion/overlays@0.21.2

## 0.9.2

### Patch Changes

- Updated dependencies [bdf1cfb2]
- Updated dependencies [e92b98a4]
  - @lion/overlays@0.21.1
  - @lion/core@0.13.1

## 0.9.1

### Patch Changes

- Updated dependencies [d83f7fc5]
- Updated dependencies [a4c4f1ee]
  - @lion/overlays@0.21.0

## 0.9.0

### Minor Changes

- b06c85bb: Added types for dialog package.

### Patch Changes

- 6394c080: Cleanup and remove shadow outlet slot. This should not be used anymore
- Updated dependencies [27879863]
- Updated dependencies [01a798e5]
- Updated dependencies [a9d6971c]
  - @lion/overlays@0.20.0
  - @lion/core@0.13.0

## 0.8.1

### Patch Changes

- Updated dependencies [e42071d8]
- Updated dependencies [75107a4b]
  - @lion/overlays@0.19.0
  - @lion/core@0.12.0

## 0.8.0

### Minor Changes

- 26f683d0: - Make the OverlayController constructor phase synchronous.
  - Trigger a setup of the OverlayController on every connectedCallback
  - Execute a new OverlayController after (shadowDom) rendering of the element is done
  - Teardown the OverlayController on every disconnectedCallback
  - This means moving a dialog triggers teardown in the old location and setup in the new location
  - Restore the original light dom (if needed) in the teardown phase of the OverlayController

### Patch Changes

- Updated dependencies [874ff483]
- Updated dependencies [26f683d0]
  - @lion/core@0.11.0
  - @lion/overlays@0.18.0

## 0.7.14

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0
  - @lion/overlays@0.17.0

## 0.7.13

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1
  - @lion/overlays@0.16.13

## 0.7.12

### Patch Changes

- Updated dependencies [3c61fd29]
- Updated dependencies [5a48e69b]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0
  - @lion/overlays@0.16.12

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.7.11](https://github.com/ing-bank/lion/compare/@lion/dialog@0.7.10...@lion/dialog@0.7.11) (2020-07-13)

**Note:** Version bump only for package @lion/dialog

## [0.7.10](https://github.com/ing-bank/lion/compare/@lion/dialog@0.7.9...@lion/dialog@0.7.10) (2020-07-13)

**Note:** Version bump only for package @lion/dialog

## [0.7.9](https://github.com/ing-bank/lion/compare/@lion/dialog@0.7.8...@lion/dialog@0.7.9) (2020-07-09)

**Note:** Version bump only for package @lion/dialog

## [0.7.8](https://github.com/ing-bank/lion/compare/@lion/dialog@0.7.7...@lion/dialog@0.7.8) (2020-07-07)

**Note:** Version bump only for package @lion/dialog

## [0.7.7](https://github.com/ing-bank/lion/compare/@lion/dialog@0.7.6...@lion/dialog@0.7.7) (2020-07-06)

**Note:** Version bump only for package @lion/dialog

## [0.7.6](https://github.com/ing-bank/lion/compare/@lion/dialog@0.7.5...@lion/dialog@0.7.6) (2020-06-24)

### Bug Fixes

- **overlays:** make focusable slotted buttons ([5e151bb](https://github.com/ing-bank/lion/commit/5e151bb8a41b4fcb37a00c0dcf568f4cb0378259))

## [0.7.5](https://github.com/ing-bank/lion/compare/@lion/dialog@0.7.4...@lion/dialog@0.7.5) (2020-06-23)

**Note:** Version bump only for package @lion/dialog

## [0.7.4](https://github.com/ing-bank/lion/compare/@lion/dialog@0.7.3...@lion/dialog@0.7.4) (2020-06-18)

**Note:** Version bump only for package @lion/dialog

## [0.7.3](https://github.com/ing-bank/lion/compare/@lion/dialog@0.7.2...@lion/dialog@0.7.3) (2020-06-10)

**Note:** Version bump only for package @lion/dialog

## [0.7.2](https://github.com/ing-bank/lion/compare/@lion/dialog@0.7.1...@lion/dialog@0.7.2) (2020-06-08)

**Note:** Version bump only for package @lion/dialog

## [0.7.1](https://github.com/ing-bank/lion/compare/@lion/dialog@0.7.0...@lion/dialog@0.7.1) (2020-06-03)

### Bug Fixes

- define side effects for demo files ([1d40567](https://github.com/ing-bank/lion/commit/1d405671875c1c9c5518a3b7f57814337b3a67d6))

# [0.7.0](https://github.com/ing-bank/lion/compare/@lion/dialog@0.6.3...@lion/dialog@0.7.0) (2020-05-29)

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

## [0.6.3](https://github.com/ing-bank/lion/compare/@lion/dialog@0.6.2...@lion/dialog@0.6.3) (2020-05-25)

### Bug Fixes

- add side effects to package.json to fix storybook build ([a7f7b4c](https://github.com/ing-bank/lion/commit/a7f7b4c70d48a78c0a1d5511e54004c157f1dba3))

## [0.6.2](https://github.com/ing-bank/lion/compare/@lion/dialog@0.6.1...@lion/dialog@0.6.2) (2020-05-20)

**Note:** Version bump only for package @lion/dialog

## [0.6.1](https://github.com/ing-bank/lion/compare/@lion/dialog@0.6.0...@lion/dialog@0.6.1) (2020-05-19)

**Note:** Version bump only for package @lion/dialog

# [0.6.0](https://github.com/ing-bank/lion/compare/@lion/dialog@0.5.0...@lion/dialog@0.6.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

# [0.5.0](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.18...@lion/dialog@0.5.0) (2020-05-18)

### Bug Fixes

- **overlays:** local backdrop outlet ([e19a0f4](https://github.com/ing-bank/lion/commit/e19a0f483c65a8a758da78b86e3723e9270e5bd3))
- **overlays:** setup/teardown fixes + perf improvements OverlayMixin ([8a6bef8](https://github.com/ing-bank/lion/commit/8a6bef8142d252cde7dd66067ca87acfffb2b9f6))

### Features

- **overlays:** enhance content projection for styling purposes ([f33ea6b](https://github.com/ing-bank/lion/commit/f33ea6b0b0dca88d006762ec5110e5845a73d219))

## [0.4.18](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.17...@lion/dialog@0.4.18) (2020-05-06)

### Bug Fixes

- **dialog:** teardown open close listeners after initial update complete ([da87445](https://github.com/ing-bank/lion/commit/da87445f33f4a168449ef6e37fc4244f16a0dc00))

## [0.4.17](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.16...@lion/dialog@0.4.17) (2020-04-29)

**Note:** Version bump only for package @lion/dialog

## [0.4.16](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.15...@lion/dialog@0.4.16) (2020-04-15)

**Note:** Version bump only for package @lion/dialog

## [0.4.15](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.14...@lion/dialog@0.4.15) (2020-04-07)

**Note:** Version bump only for package @lion/dialog

## [0.4.14](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.13...@lion/dialog@0.4.14) (2020-04-02)

**Note:** Version bump only for package @lion/dialog

## [0.4.13](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.12...@lion/dialog@0.4.13) (2020-03-26)

**Note:** Version bump only for package @lion/dialog

## [0.4.12](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.11...@lion/dialog@0.4.12) (2020-03-25)

**Note:** Version bump only for package @lion/dialog

## [0.4.11](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.10...@lion/dialog@0.4.11) (2020-03-20)

**Note:** Version bump only for package @lion/dialog

## [0.4.10](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.9...@lion/dialog@0.4.10) (2020-03-19)

**Note:** Version bump only for package @lion/dialog

## [0.4.9](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.8...@lion/dialog@0.4.9) (2020-03-11)

**Note:** Version bump only for package @lion/dialog

## [0.4.8](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.7...@lion/dialog@0.4.8) (2020-03-05)

**Note:** Version bump only for package @lion/dialog

## [0.4.7](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.6...@lion/dialog@0.4.7) (2020-02-26)

**Note:** Version bump only for package @lion/dialog

## [0.4.6](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.5...@lion/dialog@0.4.6) (2020-02-19)

### Bug Fixes

- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.4.5](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.4...@lion/dialog@0.4.5) (2020-02-13)

**Note:** Version bump only for package @lion/dialog

## [0.4.4](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.3...@lion/dialog@0.4.4) (2020-02-06)

**Note:** Version bump only for package @lion/dialog

## [0.4.3](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.2...@lion/dialog@0.4.3) (2020-01-23)

**Note:** Version bump only for package @lion/dialog

## [0.4.2](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.1...@lion/dialog@0.4.2) (2020-01-20)

**Note:** Version bump only for package @lion/dialog

## [0.4.1](https://github.com/ing-bank/lion/compare/@lion/dialog@0.4.0...@lion/dialog@0.4.1) (2020-01-17)

### Bug Fixes

- update storybook and use main.js ([e61e0b9](https://github.com/ing-bank/lion/commit/e61e0b938ff72cc18cc0b3aa1560f2cece0c9fe6))

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/dialog@0.3.2...@lion/dialog@0.4.0) (2020-01-13)

### Features

- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))

## [0.3.2](https://github.com/ing-bank/lion/compare/@lion/dialog@0.3.1...@lion/dialog@0.3.2) (2019-12-17)

**Note:** Version bump only for package @lion/dialog

## [0.3.1](https://github.com/ing-bank/lion/compare/@lion/dialog@0.3.0...@lion/dialog@0.3.1) (2019-12-13)

**Note:** Version bump only for package @lion/dialog

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/dialog@0.2.3...@lion/dialog@0.3.0) (2019-12-11)

### Bug Fixes

- deleted obsolete overlay event names ([1290d9b](https://github.com/ing-bank/lion/commit/1290d9be9556311dd91c539e57d1b0652e5a419c))

### Features

- **overlays:** close/hide events on dom (OverlayMixin) level ([b2c5f92](https://github.com/ing-bank/lion/commit/b2c5f92e085c28eebeedd948a1386be9b4c1cdea))

## [0.2.3](https://github.com/ing-bank/lion/compare/@lion/dialog@0.2.2...@lion/dialog@0.2.3) (2019-12-04)

**Note:** Version bump only for package @lion/dialog

## [0.2.2](https://github.com/ing-bank/lion/compare/@lion/dialog@0.2.1...@lion/dialog@0.2.2) (2019-12-03)

### Bug Fixes

- let lerna publish fixed versions ([bc7448c](https://github.com/ing-bank/lion/commit/bc7448c694deb3c05fd3d083a9acb5365b26b7ab))

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/dialog@0.2.0...@lion/dialog@0.2.1) (2019-12-02)

### Bug Fixes

- use strict versions to get correct deps on older versions ([8645c13](https://github.com/ing-bank/lion/commit/8645c13b1d77e488713f2e5e0e4e00c4d30ea1ee))

# 0.2.0 (2019-12-01)

### Bug Fixes

- no longer use overlay templates ([49974bd](https://github.com/ing-bank/lion/commit/49974bd2b86d7f02e8c19aa51a0a79779b897384))

### Features

- refactor the overlay system implementations, docs and demos ([a5a9f97](https://github.com/ing-bank/lion/commit/a5a9f975a61649cd1f861a80923c678c5f4d51be))
- **overlays:** improve API for overriding controller config in mixin ([45f5571](https://github.com/ing-bank/lion/commit/45f557183d7bef95ea9685d751e90ba12a4eb2d8))
