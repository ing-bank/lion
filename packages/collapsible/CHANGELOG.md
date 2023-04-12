# Change Log

## 0.5.4

### Patch Changes

- Updated dependencies [776feaa0]
  - @lion/core@0.17.4

## 0.5.3

### Patch Changes

- Updated dependencies [a35ec45d]
  - @lion/core@0.17.3

## 0.5.2

### Patch Changes

- Updated dependencies [92361c19]
  - @lion/core@0.17.2

## 0.5.1

### Patch Changes

- Updated dependencies [d1d977c1]
  - @lion/core@0.17.1

## 0.5.0

### Minor Changes

- 02e4f2cb: add simulator to demos

### Patch Changes

- Updated dependencies [02e4f2cb]
  - @lion/core@0.17.0

## 0.4.2

### Patch Changes

- 97b8592c: Remove lion references in docs for easier extending
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

## 0.3.2

### Patch Changes

- dbacafa5: Type static get properties as {any} since the real class fields are typed separately and lit properties are just "configuring". Remove expect error.

## 0.3.1

### Patch Changes

- 701aadce: Fix types of mixins to include LitElement static props and methods, and use Pick generic type instead of fake constructors.
- Updated dependencies [701aadce]
  - @lion/core@0.14.1

## 0.3.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0

## 0.2.9

### Patch Changes

- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8

## 0.2.8

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [98f1bb7e]
  - @lion/core@0.13.7

## 0.2.7

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6

## 0.2.6

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5

## 0.2.5

### Patch Changes

- b222fd78: Always use CSSResultArray for styles getters and be consistent. This makes typing for subclassers significantly easier. Also added some fixes for missing types in mixins where the superclass was not typed properly. This highlighted some issues with incomplete mixin contracts

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

- 6be72935: Added types for collapsible package.

### Patch Changes

- Updated dependencies [01a798e5]
  - @lion/core@0.13.0

## 0.1.6

### Patch Changes

- Updated dependencies [75107a4b]
  - @lion/core@0.12.0

## 0.1.5

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0

## 0.1.4

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0

## 0.1.3

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1

## 0.1.2

### Patch Changes

- Updated dependencies [3c61fd29]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/collapsible@0.1.0...@lion/collapsible@0.1.1) (2020-07-27)

**Note:** Version bump only for package @lion/collapsible

# 0.1.0 (2020-07-27)

### Features

- **collapsible:** add collapsible component ([01692ab](https://github.com/ing-bank/lion/commit/01692abd3c7f179a48cbebbcb54efab7d1fa6857))
