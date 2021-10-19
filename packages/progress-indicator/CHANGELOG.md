# @lion/progress-indicator

## 0.6.5

### Patch Changes

- Updated dependencies [bcf68ceb]
- Updated dependencies [d963e74e]
  - @lion/core@0.18.4
  - @lion/localize@0.21.2

## 0.6.4

### Patch Changes

- Updated dependencies [ec03d209]
  - @lion/core@0.18.3
  - @lion/localize@0.21.1

## 0.6.3

### Patch Changes

- Updated dependencies [9648d418]
- Updated dependencies [8c06302e]
- Updated dependencies [9b9d82fc]
- Updated dependencies [8a766644]
- Updated dependencies [c544af4e]
  - @lion/localize@0.21.0
  - @lion/core@0.18.2

## 0.6.2

### Patch Changes

- 84131205: use mdjs-preview in docs for lit compatibility
- Updated dependencies [84131205]
  - @lion/core@0.18.1
  - @lion/localize@0.20.2

## 0.6.1

### Patch Changes

- Updated dependencies [5ca3d275]
  - @lion/localize@0.20.1

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
  - @lion/localize@0.20.0

## 0.5.0

### Minor Changes

- 02e4f2cb: add simulator to demos

### Patch Changes

- Updated dependencies [02e4f2cb]
  - @lion/core@0.17.0
  - @lion/localize@0.19.0

## 0.4.2

### Patch Changes

- 77a04245: add protected and private type info
- Updated dependencies [77a04245]
- Updated dependencies [43e4bb81]
  - @lion/core@0.16.0
  - @lion/localize@0.18.0

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
  - @lion/localize@0.17.0

## 0.3.1

### Patch Changes

- Updated dependencies [701aadce]
  - @lion/core@0.14.1
  - @lion/localize@0.16.1

## 0.3.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0
  - @lion/localize@0.16.0

## 0.2.10

### Patch Changes

- 8fb7e7a1: Fix type issues where base constructors would not have the same return type. This allows us to remove a LOT of @ts-expect-errors/@ts-ignores across lion.
- 9112d243: Fix missing types and update to latest scoped elements to fix constructor type.
- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8
  - @lion/localize@0.15.5

## 0.2.9

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [a8cf4215]
- Updated dependencies [98f1bb7e]
  - @lion/localize@0.15.4
  - @lion/core@0.13.7

## 0.2.8

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6
  - @lion/localize@0.15.3

## 0.2.7

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5
  - @lion/localize@0.15.2

## 0.2.6

### Patch Changes

- @lion/localize@0.15.1

## 0.2.5

### Patch Changes

- Updated dependencies [3ada1aef]
  - @lion/localize@0.15.0

## 0.2.4

### Patch Changes

- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4
  - @lion/localize@0.14.9

## 0.2.3

### Patch Changes

- Updated dependencies [e2e4deec]
- Updated dependencies [8ca71b8f]
  - @lion/core@0.13.3
  - @lion/localize@0.14.8

## 0.2.2

### Patch Changes

- Updated dependencies [20ba0ca8]
- Updated dependencies [618f2698]
  - @lion/core@0.13.2
  - @lion/localize@0.14.7

## 0.2.1

### Patch Changes

- Updated dependencies [7682e520]
- Updated dependencies [e92b98a4]
  - @lion/localize@0.14.6
  - @lion/core@0.13.1

## 0.2.0

### Minor Changes

- 10666897: Add types for progress-indicator package.

### Patch Changes

- Updated dependencies [01a798e5]
- Updated dependencies [b9327627]
  - @lion/core@0.13.0
  - @lion/localize@0.14.5

## 0.1.4

### Patch Changes

- Updated dependencies [75107a4b]
  - @lion/core@0.12.0
  - @lion/localize@0.14.4

## 0.1.3

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0
  - @lion/localize@0.14.3

## 0.1.2

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0
  - @lion/localize@0.14.2

## 0.1.1

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1
  - @lion/localize@0.14.1

## 0.1.0

### Minor Changes

- c224baa8: Initial release

### Patch Changes

- a768d62a: Fix path to sk translations
- Updated dependencies [3c61fd29]
- Updated dependencies [09d96759]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0
  - @lion/localize@0.14.0
