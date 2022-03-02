# Change Log

## 0.22.0

### Minor Changes

- 683d5c1c: Upgrade to latest Typescript. Keep in mind, some @ts-ignores were necessary, also per TS maintainer's advice. Use skipLibCheck in your TSConfig to ignore issues coming from Lion, the types are valid.

  **We also unfixed lion's dependencies (now using caret ^) on its own packages**, because it caused a lot of problems with duplicate installations for end users as well as subclassers and its end users. Both of these changes may affect subclassers in a breaking manner, hence the minor bump.

  Be sure to [read our Rationale on this change](https://lion-web.netlify.app/docs/rationales/versioning/) and what this means for you as a user.

### Patch Changes

- Updated dependencies [683d5c1c]
- Updated dependencies [b96dc40e]
  - @lion/core@0.21.0
  - @lion/overlays@0.31.0

## 0.21.7

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

## 0.21.6

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

## 0.21.5

### Patch Changes

- Updated dependencies [6e86fb4e]
- Updated dependencies [bcf68ceb]
- Updated dependencies [d963e74e]
  - @lion/overlays@0.29.0
  - @lion/core@0.18.4

## 0.21.4

### Patch Changes

- Updated dependencies [ec03d209]
  - @lion/core@0.18.3
  - @lion/overlays@0.28.4

## 0.21.3

### Patch Changes

- Updated dependencies [8c06302e]
  - @lion/core@0.18.2
  - @lion/overlays@0.28.3

## 0.21.2

### Patch Changes

- Updated dependencies [84131205]
  - @lion/core@0.18.1
  - @lion/overlays@0.28.2

## 0.21.1

### Patch Changes

- Updated dependencies [c57f42a3]
  - @lion/overlays@0.28.1

## 0.21.0

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

## 0.20.0

### Minor Changes

- 02e4f2cb: add simulator to demos

### Patch Changes

- Updated dependencies [239cce3b]
- Updated dependencies [02e4f2cb]
  - @lion/overlays@0.27.0
  - @lion/core@0.17.0

## 0.19.1

### Patch Changes

- Updated dependencies [f2d9b8e2]
  - @lion/overlays@0.26.1

## 0.19.0

### Minor Changes

- 43e4bb81: Type fixes and enhancements:

  - all protected/private entries added to form-core type definitions, and their dependents were fixed
  - a lot @ts-expect-error and @ts-ignore (all `get slots()` and `get modelValue()` issues are fixed)
  - categorized @ts-expect-error / @ts-ignore into:
    - [external]: when a 3rd party didn't ship types (could also be browser specs)
    - [allow-protected]: when we are allowed to know about protected methods. For instance when code
      resides in the same package
    - [allow-private]: when we need to check a private value inside a test
    - [allow]: miscellaneous allows
    - [editor]: when the editor complains, but the cli/ci doesn't

### Patch Changes

- 77a04245: add protected and private type info
- Updated dependencies [77a04245]
- Updated dependencies [43e4bb81]
  - @lion/core@0.16.0
  - @lion/overlays@0.26.0

## 0.18.2

### Patch Changes

- 6ea02988: Always use ...styles and [css``] everywhere consistently, meaning an array of CSSResult. Makes it easier on TSC.
- Updated dependencies [6ea02988]
  - @lion/overlays@0.25.2

## 0.18.1

### Patch Changes

- Updated dependencies [412270fa]
  - @lion/overlays@0.25.1

## 0.18.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- Updated dependencies [f3e54c56]
- Updated dependencies [5db622e9]
  - @lion/core@0.15.0
  - @lion/overlays@0.25.0

## 0.17.2

### Patch Changes

- Updated dependencies [2e8e547c]
  - @lion/overlays@0.24.2

## 0.17.1

### Patch Changes

- 701aadce: Fix types of mixins to include LitElement static props and methods, and use Pick generic type instead of fake constructors.
- Updated dependencies [6b91c92d]
- Updated dependencies [701aadce]
  - @lion/overlays@0.24.1
  - @lion/core@0.14.1

## 0.17.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0
  - @lion/overlays@0.24.0

## 0.16.5

### Patch Changes

- Updated dependencies [a77452b0]
  - @lion/overlays@0.23.4

## 0.16.4

### Patch Changes

- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
- Updated dependencies [9352b577]
  - @lion/core@0.13.8
  - @lion/overlays@0.23.3

## 0.16.3

### Patch Changes

- Updated dependencies [a7760b64]
  - @lion/overlays@0.23.2

## 0.16.2

### Patch Changes

- Updated dependencies [a04ea59c]
  - @lion/overlays@0.23.1

## 0.16.1

### Patch Changes

- ef7ccbb9: Fix some type issues with static get styles, CSSResultArray combines CSSResult and CSSResult[].

## 0.16.0

### Minor Changes

- 1f62ed8b: **BREAKING:** Upgrade to popper v2. Has breaking changes for overlays config.popperConfig which is now aligned with v2 of Popper. See their [migration guidelines](https://popper.js.org/docs/v2/migration-guide/).

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [1f62ed8b]
- Updated dependencies [98f1bb7e]
- Updated dependencies [53d22a85]
  - @lion/overlays@0.23.0
  - @lion/core@0.13.7

## 0.15.13

### Patch Changes

- Updated dependencies [9fba9007]
- Updated dependencies [80031f66]
  - @lion/core@0.13.6
  - @lion/overlays@0.22.8

## 0.15.12

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5
  - @lion/overlays@0.22.7

## 0.15.11

### Patch Changes

- Updated dependencies [de536282]
- Updated dependencies [11e8dbcb]
  - @lion/overlays@0.22.6

## 0.15.10

### Patch Changes

- Updated dependencies [83359ac2]
- Updated dependencies [7709d7c2]
- Updated dependencies [2eeace23]
  - @lion/overlays@0.22.5

## 0.15.9

### Patch Changes

- Updated dependencies [5553e43e]
  - @lion/overlays@0.22.4

## 0.15.8

### Patch Changes

- Updated dependencies [9142a53d]
- Updated dependencies [3944c5e8]
  - @lion/overlays@0.22.3

## 0.15.7

### Patch Changes

- Updated dependencies [b222fd78]
  - @lion/overlays@0.22.2

## 0.15.6

### Patch Changes

- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4
  - @lion/overlays@0.22.1

## 0.15.5

### Patch Changes

- Updated dependencies [9c3224b4]
- Updated dependencies [fff79915]
  - @lion/overlays@0.22.0

## 0.15.4

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3
  - @lion/overlays@0.21.3

## 0.15.3

### Patch Changes

- 618f2698: Run tests also on webkit
- Updated dependencies [20ba0ca8]
  - @lion/core@0.13.2
  - @lion/overlays@0.21.2

## 0.15.2

### Patch Changes

- baeedeee: Keep tooltip closed when invoker is disabled
- Updated dependencies [bdf1cfb2]
- Updated dependencies [e92b98a4]
  - @lion/overlays@0.21.1
  - @lion/core@0.13.1

## 0.15.1

### Patch Changes

- Updated dependencies [d83f7fc5]
- Updated dependencies [a4c4f1ee]
  - @lion/overlays@0.21.0

## 0.15.0

### Minor Changes

- a9d6971c: Abstracted the tooltip arrow related logic to a mixin, so it can be used in other overlays. Also created some demos to show this.

### Patch Changes

- Updated dependencies [27879863]
- Updated dependencies [01a798e5]
- Updated dependencies [a9d6971c]
  - @lion/overlays@0.20.0
  - @lion/core@0.13.0

## 0.14.0

### Minor Changes

- e42071d8: Types for overlays, tooltip and button

### Patch Changes

- Updated dependencies [e42071d8]
- Updated dependencies [75107a4b]
  - @lion/overlays@0.19.0
  - @lion/core@0.12.0

## 0.13.0

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

## 0.12.9

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0
  - @lion/overlays@0.17.0

## 0.12.8

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1
  - @lion/overlays@0.16.13

## 0.12.7

### Patch Changes

- Updated dependencies [3c61fd29]
- Updated dependencies [5a48e69b]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0
  - @lion/overlays@0.16.12

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.12.6](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.12.5...@lion/tooltip@0.12.6) (2020-07-13)

**Note:** Version bump only for package @lion/tooltip

## [0.12.5](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.12.4...@lion/tooltip@0.12.5) (2020-07-13)

**Note:** Version bump only for package @lion/tooltip

## [0.12.4](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.12.3...@lion/tooltip@0.12.4) (2020-07-09)

**Note:** Version bump only for package @lion/tooltip

## [0.12.3](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.12.2...@lion/tooltip@0.12.3) (2020-07-07)

**Note:** Version bump only for package @lion/tooltip

## [0.12.2](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.12.1...@lion/tooltip@0.12.2) (2020-07-06)

**Note:** Version bump only for package @lion/tooltip

## [0.12.1](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.12.0...@lion/tooltip@0.12.1) (2020-06-24)

**Note:** Version bump only for package @lion/tooltip

# [0.12.0](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.11.4...@lion/tooltip@0.12.0) (2020-06-23)

### Bug Fixes

- **overlays:** accessibility attrs setup/teardown ([dfe1905](https://github.com/ing-bank/lion/commit/dfe1905e7c61007decb27da4dc30ea17fb1de1b1))

### Features

- **tooltip:** add invoker relation for accessibility ([3f84a3b](https://github.com/ing-bank/lion/commit/3f84a3bab88cd470007f5a327cfd999d65076992))

## [0.11.4](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.11.3...@lion/tooltip@0.11.4) (2020-06-18)

**Note:** Version bump only for package @lion/tooltip

## [0.11.3](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.11.2...@lion/tooltip@0.11.3) (2020-06-10)

**Note:** Version bump only for package @lion/tooltip

## [0.11.2](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.11.1...@lion/tooltip@0.11.2) (2020-06-08)

**Note:** Version bump only for package @lion/tooltip

## [0.11.1](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.11.0...@lion/tooltip@0.11.1) (2020-06-03)

### Bug Fixes

- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))

# [0.11.0](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.10.4...@lion/tooltip@0.11.0) (2020-05-29)

### Features

- merge field/validate/choice-input/form-group into @lion/form-core ([6170374](https://github.com/ing-bank/lion/commit/6170374ee8c058cb95fff79b4953b0535219e9b4))
- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

## [0.10.4](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.10.3...@lion/tooltip@0.10.4) (2020-05-25)

**Note:** Version bump only for package @lion/tooltip

## [0.10.3](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.10.2...@lion/tooltip@0.10.3) (2020-05-20)

**Note:** Version bump only for package @lion/tooltip

## [0.10.2](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.10.1...@lion/tooltip@0.10.2) (2020-05-19)

**Note:** Version bump only for package @lion/tooltip

## [0.10.1](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.10.0...@lion/tooltip@0.10.1) (2020-05-18)

### Bug Fixes

- tooltip storybook demo fix ([e84dac2](https://github.com/ing-bank/lion/commit/e84dac2a48c0a4dadf87b08f3ec5d252598b8868))

# [0.10.0](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.9.0...@lion/tooltip@0.10.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

# [0.9.0](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.13...@lion/tooltip@0.9.0) (2020-05-18)

### Bug Fixes

- **overlays:** local backdrop outlet ([e19a0f4](https://github.com/ing-bank/lion/commit/e19a0f483c65a8a758da78b86e3723e9270e5bd3))
- **tooltip:** tooltip display inline-block ([810bdad](https://github.com/ing-bank/lion/commit/810bdad523695d67217514586c5e509319322795))

### Features

- **overlays:** enhance content projection for styling purposes ([f33ea6b](https://github.com/ing-bank/lion/commit/f33ea6b0b0dca88d006762ec5110e5845a73d219))
- **tooltip:** simplified tooltip component by making arrow a template ([73eb90a](https://github.com/ing-bank/lion/commit/73eb90ab96622fb1c268e03c31707679eaab0bb2))

## [0.8.13](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.12...@lion/tooltip@0.8.13) (2020-05-06)

**Note:** Version bump only for package @lion/tooltip

## [0.8.12](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.11...@lion/tooltip@0.8.12) (2020-04-29)

### Bug Fixes

- add display:none for hidden ([#692](https://github.com/ing-bank/lion/issues/692)) ([9731771](https://github.com/ing-bank/lion/commit/9731771c23a5ed8661558e62cb5e34b62cc2b8b7))

## [0.8.11](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.10...@lion/tooltip@0.8.11) (2020-04-15)

**Note:** Version bump only for package @lion/tooltip

## [0.8.10](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.9...@lion/tooltip@0.8.10) (2020-04-07)

**Note:** Version bump only for package @lion/tooltip

## [0.8.9](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.8...@lion/tooltip@0.8.9) (2020-04-02)

### Bug Fixes

- **tooltip:** support reconnecting tooltip arrow inside other overlays ([78a8554](https://github.com/ing-bank/lion/commit/78a8554019de6c91cae7c0d8e3fd2caa3c2209d1))

## [0.8.8](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.7...@lion/tooltip@0.8.8) (2020-03-26)

**Note:** Version bump only for package @lion/tooltip

## [0.8.7](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.6...@lion/tooltip@0.8.7) (2020-03-25)

**Note:** Version bump only for package @lion/tooltip

## [0.8.6](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.5...@lion/tooltip@0.8.6) (2020-03-20)

**Note:** Version bump only for package @lion/tooltip

## [0.8.5](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.4...@lion/tooltip@0.8.5) (2020-03-19)

**Note:** Version bump only for package @lion/tooltip

## [0.8.4](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.3...@lion/tooltip@0.8.4) (2020-03-05)

**Note:** Version bump only for package @lion/tooltip

## [0.8.3](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.2...@lion/tooltip@0.8.3) (2020-02-26)

**Note:** Version bump only for package @lion/tooltip

## [0.8.2](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.1...@lion/tooltip@0.8.2) (2020-02-19)

### Bug Fixes

- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.8.1](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.8.0...@lion/tooltip@0.8.1) (2020-02-13)

**Note:** Version bump only for package @lion/tooltip

# [0.8.0](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.7.3...@lion/tooltip@0.8.0) (2020-02-06)

### Bug Fixes

- **tooltip:** remove dependency on lion-button ([8889413](https://github.com/ing-bank/lion/commit/8889413ca43a3eb224964bd44dc82b7eab53039e))

### Features

- **overlay:** add hide on outside esc handler ([c0ed437](https://github.com/ing-bank/lion/commit/c0ed437e8fed618c47fe90feca7969fde934b9eb))

## [0.7.3](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.7.2...@lion/tooltip@0.7.3) (2020-01-23)

**Note:** Version bump only for package @lion/tooltip

## [0.7.2](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.7.1...@lion/tooltip@0.7.2) (2020-01-20)

**Note:** Version bump only for package @lion/tooltip

## [0.7.1](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.7.0...@lion/tooltip@0.7.1) (2020-01-17)

### Bug Fixes

- update storybook and use main.js ([e61e0b9](https://github.com/ing-bank/lion/commit/e61e0b938ff72cc18cc0b3aa1560f2cece0c9fe6))

# [0.7.0](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.6.2...@lion/tooltip@0.7.0) (2020-01-13)

### Features

- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))

## [0.6.2](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.6.1...@lion/tooltip@0.6.2) (2019-12-17)

**Note:** Version bump only for package @lion/tooltip

## [0.6.1](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.6.0...@lion/tooltip@0.6.1) (2019-12-16)

### Bug Fixes

- **tooltip:** export LionTooltipArrow ([#439](https://github.com/ing-bank/lion/issues/439)) ([b67ae45](https://github.com/ing-bank/lion/commit/b67ae45caeb6aa68ee913c0a79217d36da02aed9))

# [0.6.0](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.5.1...@lion/tooltip@0.6.0) (2019-12-13)

### Features

- **tooltip:** arrow ([d4f99f1](https://github.com/ing-bank/lion/commit/d4f99f1b9222e26908139d0269ab95b563af19eb))

## [0.5.1](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.5.0...@lion/tooltip@0.5.1) (2019-12-11)

### Bug Fixes

- deleted obsolete overlay event names ([1290d9b](https://github.com/ing-bank/lion/commit/1290d9be9556311dd91c539e57d1b0652e5a419c))

# [0.5.0](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.4.2...@lion/tooltip@0.5.0) (2019-12-04)

### Features

- integrate and pass automated a11y testing ([e1a417b](https://github.com/ing-bank/lion/commit/e1a417b041431e4e25a5b6a63e23ba0a3974f5a5))

## [0.4.2](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.4.1...@lion/tooltip@0.4.2) (2019-12-03)

### Bug Fixes

- let lerna publish fixed versions ([bc7448c](https://github.com/ing-bank/lion/commit/bc7448c694deb3c05fd3d083a9acb5365b26b7ab))

## [0.4.1](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.4.0...@lion/tooltip@0.4.1) (2019-12-02)

### Bug Fixes

- use strict versions to get correct deps on older versions ([8645c13](https://github.com/ing-bank/lion/commit/8645c13b1d77e488713f2e5e0e4e00c4d30ea1ee))

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.20...@lion/tooltip@0.4.0) (2019-12-01)

### Bug Fixes

- **overlays:** hideOnEsc should also work while being on the invoker ([c899cf2](https://github.com/ing-bank/lion/commit/c899cf26d278d8512f521ba37522f7472805c9ed))
- no longer use overlay templates ([49974bd](https://github.com/ing-bank/lion/commit/49974bd2b86d7f02e8c19aa51a0a79779b897384))

### Features

- refactor the overlay system implementations, docs and demos ([a5a9f97](https://github.com/ing-bank/lion/commit/a5a9f975a61649cd1f861a80923c678c5f4d51be))
- **overlays:** improve API for overriding controller config in mixin ([45f5571](https://github.com/ing-bank/lion/commit/45f557183d7bef95ea9685d751e90ba12a4eb2d8))

## [0.3.20](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.19...@lion/tooltip@0.3.20) (2019-11-28)

**Note:** Version bump only for package @lion/tooltip

## [0.3.19](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.18...@lion/tooltip@0.3.19) (2019-11-27)

**Note:** Version bump only for package @lion/tooltip

## [0.3.18](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.17...@lion/tooltip@0.3.18) (2019-11-27)

**Note:** Version bump only for package @lion/tooltip

## [0.3.17](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.16...@lion/tooltip@0.3.17) (2019-11-26)

**Note:** Version bump only for package @lion/tooltip

## [0.3.16](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.15...@lion/tooltip@0.3.16) (2019-11-22)

**Note:** Version bump only for package @lion/tooltip

## [0.3.15](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.14...@lion/tooltip@0.3.15) (2019-11-19)

**Note:** Version bump only for package @lion/tooltip

## [0.3.14](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.13...@lion/tooltip@0.3.14) (2019-11-18)

**Note:** Version bump only for package @lion/tooltip

## [0.3.13](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.12...@lion/tooltip@0.3.13) (2019-11-15)

### Bug Fixes

- refactor slot selection ([5999ea9](https://github.com/ing-bank/lion/commit/5999ea956967b449f3f04935c7facb19e2889dc9))

## [0.3.12](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.11...@lion/tooltip@0.3.12) (2019-11-13)

**Note:** Version bump only for package @lion/tooltip

## [0.3.11](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.10...@lion/tooltip@0.3.11) (2019-11-12)

**Note:** Version bump only for package @lion/tooltip

## [0.3.10](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.9...@lion/tooltip@0.3.10) (2019-11-06)

**Note:** Version bump only for package @lion/tooltip

## [0.3.9](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.8...@lion/tooltip@0.3.9) (2019-11-01)

**Note:** Version bump only for package @lion/tooltip

## [0.3.8](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.7...@lion/tooltip@0.3.8) (2019-10-25)

**Note:** Version bump only for package @lion/tooltip

## [0.3.7](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.6...@lion/tooltip@0.3.7) (2019-10-23)

**Note:** Version bump only for package @lion/tooltip

## [0.3.6](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.5...@lion/tooltip@0.3.6) (2019-10-23)

**Note:** Version bump only for package @lion/tooltip

## [0.3.5](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.4...@lion/tooltip@0.3.5) (2019-10-21)

**Note:** Version bump only for package @lion/tooltip

## [0.3.4](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.3...@lion/tooltip@0.3.4) (2019-10-21)

**Note:** Version bump only for package @lion/tooltip

## [0.3.3](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.2...@lion/tooltip@0.3.3) (2019-10-14)

**Note:** Version bump only for package @lion/tooltip

## [0.3.2](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.1...@lion/tooltip@0.3.2) (2019-10-11)

**Note:** Version bump only for package @lion/tooltip

## [0.3.1](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.3.0...@lion/tooltip@0.3.1) (2019-10-11)

**Note:** Version bump only for package @lion/tooltip

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.52...@lion/tooltip@0.3.0) (2019-10-10)

### Features

- update to latest overlay system ([4c26bef](https://github.com/ing-bank/lion/commit/4c26bef))

## [0.2.52](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.51...@lion/tooltip@0.2.52) (2019-10-09)

**Note:** Version bump only for package @lion/tooltip

## [0.2.51](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.50...@lion/tooltip@0.2.51) (2019-10-07)

**Note:** Version bump only for package @lion/tooltip

## [0.2.50](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.49...@lion/tooltip@0.2.50) (2019-09-30)

**Note:** Version bump only for package @lion/tooltip

## [0.2.49](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.48...@lion/tooltip@0.2.49) (2019-09-27)

**Note:** Version bump only for package @lion/tooltip

## [0.2.48](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.47...@lion/tooltip@0.2.48) (2019-09-27)

**Note:** Version bump only for package @lion/tooltip

## [0.2.47](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.46...@lion/tooltip@0.2.47) (2019-09-26)

**Note:** Version bump only for package @lion/tooltip

## [0.2.46](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.45...@lion/tooltip@0.2.46) (2019-09-26)

**Note:** Version bump only for package @lion/tooltip

## [0.2.45](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.44...@lion/tooltip@0.2.45) (2019-09-25)

### Bug Fixes

- **tooltip:** do not recreate overlay controller from extends Popup ([e666180](https://github.com/ing-bank/lion/commit/e666180))

## [0.2.44](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.43...@lion/tooltip@0.2.44) (2019-09-20)

**Note:** Version bump only for package @lion/tooltip

## [0.2.43](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.42...@lion/tooltip@0.2.43) (2019-09-19)

**Note:** Version bump only for package @lion/tooltip

## [0.2.42](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.41...@lion/tooltip@0.2.42) (2019-09-17)

**Note:** Version bump only for package @lion/tooltip

## [0.2.41](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.40...@lion/tooltip@0.2.41) (2019-09-13)

**Note:** Version bump only for package @lion/tooltip

## [0.2.40](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.39...@lion/tooltip@0.2.40) (2019-09-09)

### Bug Fixes

- **tooltip:** add aria role ([b8e9926](https://github.com/ing-bank/lion/commit/b8e9926))
- **tooltip:** make tooltip hide with what triggered it ([48a41c9](https://github.com/ing-bank/lion/commit/48a41c9))
- **tooltip:** make tooltip hoverable ([73e2305](https://github.com/ing-bank/lion/commit/73e2305))

## [0.2.39](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.38...@lion/tooltip@0.2.39) (2019-08-29)

**Note:** Version bump only for package @lion/tooltip

## [0.2.38](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.37...@lion/tooltip@0.2.38) (2019-08-23)

**Note:** Version bump only for package @lion/tooltip

## [0.2.37](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.36...@lion/tooltip@0.2.37) (2019-08-21)

**Note:** Version bump only for package @lion/tooltip

## [0.2.36](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.35...@lion/tooltip@0.2.36) (2019-08-17)

**Note:** Version bump only for package @lion/tooltip

## [0.2.35](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.34...@lion/tooltip@0.2.35) (2019-08-15)

**Note:** Version bump only for package @lion/tooltip

## [0.2.34](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.33...@lion/tooltip@0.2.34) (2019-08-15)

**Note:** Version bump only for package @lion/tooltip

## [0.2.33](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.32...@lion/tooltip@0.2.33) (2019-08-14)

**Note:** Version bump only for package @lion/tooltip

## [0.2.32](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.31...@lion/tooltip@0.2.32) (2019-08-07)

**Note:** Version bump only for package @lion/tooltip

## [0.2.31](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.30...@lion/tooltip@0.2.31) (2019-08-07)

**Note:** Version bump only for package @lion/tooltip

## [0.2.30](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.29...@lion/tooltip@0.2.30) (2019-08-01)

**Note:** Version bump only for package @lion/tooltip

## [0.2.29](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.28...@lion/tooltip@0.2.29) (2019-07-30)

**Note:** Version bump only for package @lion/tooltip

## [0.2.28](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.27...@lion/tooltip@0.2.28) (2019-07-30)

**Note:** Version bump only for package @lion/tooltip

## [0.2.27](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.26...@lion/tooltip@0.2.27) (2019-07-29)

**Note:** Version bump only for package @lion/tooltip

## [0.2.26](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.25...@lion/tooltip@0.2.26) (2019-07-26)

**Note:** Version bump only for package @lion/tooltip

## [0.2.25](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.24...@lion/tooltip@0.2.25) (2019-07-25)

**Note:** Version bump only for package @lion/tooltip

## [0.2.24](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.23...@lion/tooltip@0.2.24) (2019-07-24)

**Note:** Version bump only for package @lion/tooltip

## [0.2.23](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.22...@lion/tooltip@0.2.23) (2019-07-24)

**Note:** Version bump only for package @lion/tooltip

## [0.2.22](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.21...@lion/tooltip@0.2.22) (2019-07-23)

**Note:** Version bump only for package @lion/tooltip

## [0.2.21](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.20...@lion/tooltip@0.2.21) (2019-07-23)

**Note:** Version bump only for package @lion/tooltip

## [0.2.20](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.19...@lion/tooltip@0.2.20) (2019-07-23)

**Note:** Version bump only for package @lion/tooltip

## [0.2.19](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.18...@lion/tooltip@0.2.19) (2019-07-23)

**Note:** Version bump only for package @lion/tooltip

## [0.2.18](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.17...@lion/tooltip@0.2.18) (2019-07-22)

**Note:** Version bump only for package @lion/tooltip

## [0.2.17](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.16...@lion/tooltip@0.2.17) (2019-07-19)

**Note:** Version bump only for package @lion/tooltip

## [0.2.16](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.15...@lion/tooltip@0.2.16) (2019-07-19)

**Note:** Version bump only for package @lion/tooltip

## [0.2.15](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.14...@lion/tooltip@0.2.15) (2019-07-18)

**Note:** Version bump only for package @lion/tooltip

## [0.2.14](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.13...@lion/tooltip@0.2.14) (2019-07-17)

**Note:** Version bump only for package @lion/tooltip

## [0.2.13](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.12...@lion/tooltip@0.2.13) (2019-07-16)

**Note:** Version bump only for package @lion/tooltip

## [0.2.12](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.11...@lion/tooltip@0.2.12) (2019-07-16)

**Note:** Version bump only for package @lion/tooltip

## [0.2.11](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.10...@lion/tooltip@0.2.11) (2019-07-15)

**Note:** Version bump only for package @lion/tooltip

## [0.2.10](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.9...@lion/tooltip@0.2.10) (2019-07-15)

**Note:** Version bump only for package @lion/tooltip

## [0.2.9](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.8...@lion/tooltip@0.2.9) (2019-07-12)

**Note:** Version bump only for package @lion/tooltip

## [0.2.8](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.7...@lion/tooltip@0.2.8) (2019-07-12)

**Note:** Version bump only for package @lion/tooltip

## [0.2.7](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.6...@lion/tooltip@0.2.7) (2019-07-09)

**Note:** Version bump only for package @lion/tooltip

## [0.2.6](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.5...@lion/tooltip@0.2.6) (2019-07-04)

**Note:** Version bump only for package @lion/tooltip

## [0.2.5](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.4...@lion/tooltip@0.2.5) (2019-07-02)

**Note:** Version bump only for package @lion/tooltip

## [0.2.4](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.3...@lion/tooltip@0.2.4) (2019-07-02)

**Note:** Version bump only for package @lion/tooltip

## [0.2.3](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.2...@lion/tooltip@0.2.3) (2019-07-02)

**Note:** Version bump only for package @lion/tooltip

## [0.2.2](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.1...@lion/tooltip@0.2.2) (2019-07-01)

**Note:** Version bump only for package @lion/tooltip

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.2.0...@lion/tooltip@0.2.1) (2019-07-01)

**Note:** Version bump only for package @lion/tooltip

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.29...@lion/tooltip@0.2.0) (2019-06-28)

### Features

- **tooltip:** change API to popper based ([c01cfe9](https://github.com/ing-bank/lion/commit/c01cfe9))

## [0.1.29](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.28...@lion/tooltip@0.1.29) (2019-06-27)

**Note:** Version bump only for package @lion/tooltip

## [0.1.28](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.27...@lion/tooltip@0.1.28) (2019-06-27)

**Note:** Version bump only for package @lion/tooltip

## [0.1.27](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.26...@lion/tooltip@0.1.27) (2019-06-24)

**Note:** Version bump only for package @lion/tooltip

## [0.1.26](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.25...@lion/tooltip@0.1.26) (2019-06-24)

**Note:** Version bump only for package @lion/tooltip

## [0.1.25](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.24...@lion/tooltip@0.1.25) (2019-06-20)

**Note:** Version bump only for package @lion/tooltip

## [0.1.24](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.23...@lion/tooltip@0.1.24) (2019-06-18)

**Note:** Version bump only for package @lion/tooltip

## [0.1.23](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.22...@lion/tooltip@0.1.23) (2019-06-13)

**Note:** Version bump only for package @lion/tooltip

## [0.1.22](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.21...@lion/tooltip@0.1.22) (2019-06-06)

**Note:** Version bump only for package @lion/tooltip

## [0.1.21](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.20...@lion/tooltip@0.1.21) (2019-06-04)

**Note:** Version bump only for package @lion/tooltip

## [0.1.20](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.19...@lion/tooltip@0.1.20) (2019-05-31)

**Note:** Version bump only for package @lion/tooltip

## [0.1.19](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.18...@lion/tooltip@0.1.19) (2019-05-31)

**Note:** Version bump only for package @lion/tooltip

## [0.1.18](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.17...@lion/tooltip@0.1.18) (2019-05-29)

**Note:** Version bump only for package @lion/tooltip

## [0.1.17](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.16...@lion/tooltip@0.1.17) (2019-05-29)

**Note:** Version bump only for package @lion/tooltip

## [0.1.16](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.15...@lion/tooltip@0.1.16) (2019-05-24)

**Note:** Version bump only for package @lion/tooltip

## [0.1.15](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.14...@lion/tooltip@0.1.15) (2019-05-22)

**Note:** Version bump only for package @lion/tooltip

## [0.1.14](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.13...@lion/tooltip@0.1.14) (2019-05-21)

**Note:** Version bump only for package @lion/tooltip

## [0.1.13](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.12...@lion/tooltip@0.1.13) (2019-05-17)

**Note:** Version bump only for package @lion/tooltip

## [0.1.12](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.11...@lion/tooltip@0.1.12) (2019-05-16)

**Note:** Version bump only for package @lion/tooltip

## [0.1.11](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.10...@lion/tooltip@0.1.11) (2019-05-16)

**Note:** Version bump only for package @lion/tooltip

## [0.1.10](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.9...@lion/tooltip@0.1.10) (2019-05-16)

**Note:** Version bump only for package @lion/tooltip

## [0.1.9](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.8...@lion/tooltip@0.1.9) (2019-05-15)

**Note:** Version bump only for package @lion/tooltip

## [0.1.8](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.7...@lion/tooltip@0.1.8) (2019-05-13)

**Note:** Version bump only for package @lion/tooltip

## [0.1.7](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.6...@lion/tooltip@0.1.7) (2019-05-13)

### Bug Fixes

- add prepublish step to make links absolute for npm docs ([9f2c4f6](https://github.com/ing-bank/lion/commit/9f2c4f6))

## [0.1.6](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.5...@lion/tooltip@0.1.6) (2019-05-08)

**Note:** Version bump only for package @lion/tooltip

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.4...@lion/tooltip@0.1.5) (2019-05-07)

**Note:** Version bump only for package @lion/tooltip

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.3...@lion/tooltip@0.1.4) (2019-04-29)

**Note:** Version bump only for package @lion/tooltip

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.2...@lion/tooltip@0.1.3) (2019-04-28)

### Bug Fixes

- update storybook/linting; adjust story labels, eslint ignores ([8d96f84](https://github.com/ing-bank/lion/commit/8d96f84))

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.1...@lion/tooltip@0.1.2) (2019-04-27)

**Note:** Version bump only for package @lion/tooltip

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/tooltip@0.1.0...@lion/tooltip@0.1.1) (2019-04-26)

### Bug Fixes

- add missing files to npm packages ([0e3ca17](https://github.com/ing-bank/lion/commit/0e3ca17))

# 0.1.0 (2019-04-26)

### Features

- release inital public lion version ([ec8da8f](https://github.com/ing-bank/lion/commit/ec8da8f))
