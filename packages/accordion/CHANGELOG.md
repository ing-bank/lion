# Change Log

## 0.7.0

### Minor Changes

- a0adde62: Make methods for handling invoker/content protected parts of the Accordion base class, so that they can be overridden easily. Refactor for readability.

### Patch Changes

- Updated dependencies [ec03d209]
  - @lion/core@0.18.3

## 0.6.3

### Patch Changes

- Updated dependencies [8c06302e]
  - @lion/core@0.18.2

## 0.6.2

### Patch Changes

- ae14f998: Improve documentation and examples

## 0.6.1

### Patch Changes

- 84131205: use mdjs-preview in docs for lit compatibility
- Updated dependencies [84131205]
  - @lion/core@0.18.1

## 0.6.0

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

## 0.5.0

### Minor Changes

- 02e4f2cb: add simulator to demos

### Patch Changes

- Updated dependencies [02e4f2cb]
  - @lion/core@0.17.0

## 0.4.2

### Patch Changes

- 77a04245: add protected and private type info
- Updated dependencies [77a04245]
- Updated dependencies [43e4bb81]
  - @lion/core@0.16.0

## 0.4.1

### Patch Changes

- 59dad284: Removed lion-specific component namings from overview.md files

## 0.4.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- Updated dependencies [f3e54c56]
- Updated dependencies [5db622e9]
  - @lion/core@0.15.0

## 0.3.1

### Patch Changes

- Updated dependencies [701aadce]
  - @lion/core@0.14.1

## 0.3.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0

## 0.2.8

### Patch Changes

- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8

## 0.2.7

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [98f1bb7e]
  - @lion/core@0.13.7

## 0.2.6

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6

## 0.2.5

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5

## 0.2.4

### Patch Changes

- cfbcccb5: Fix type imports to reuse lion where possible, in case Lit updates with new types that may break us.
- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4

## 0.2.3

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3

## 0.2.2

### Patch Changes

- Updated dependencies [20ba0ca8]
  - @lion/core@0.13.2

## 0.2.1

### Patch Changes

- Updated dependencies [e92b98a4]
  - @lion/core@0.13.1

## 0.2.0

### Minor Changes

- 175e6bea: Added types for the accordion package.

### Patch Changes

- Updated dependencies [01a798e5]
  - @lion/core@0.13.0

## 0.1.8

### Patch Changes

- Updated dependencies [75107a4b]
  - @lion/core@0.12.0

## 0.1.7

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0

## 0.1.6

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0

## 0.1.5

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1

## 0.1.4

### Patch Changes

- Updated dependencies [3c61fd29]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/accordion@0.1.2...@lion/accordion@0.1.3) (2020-07-13)

**Note:** Version bump only for package @lion/accordion

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/accordion@0.1.1...@lion/accordion@0.1.2) (2020-06-24)

### Bug Fixes

- **accordion:** fix keyboard interaction ([b4d8222](https://github.com/ing-bank/lion/commit/b4d8222975b3c357cb3d0eff83d008e3adfd90a0))

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/accordion@0.1.0...@lion/accordion@0.1.1) (2020-06-18)

**Note:** Version bump only for package @lion/accordion

# 0.1.0 (2020-06-18)

### Features

- **accordion:** add basic structure ([07ff76b](https://github.com/ing-bank/lion/commit/07ff76b864d76cddc9bc8def2ba9dcd1d0f9a5e8))
