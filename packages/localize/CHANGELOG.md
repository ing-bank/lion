# Change Log

## 0.21.3

### Patch Changes

- c4562f7e: use html & unsafeStatic from @open-wc/testing instead of directly from lit
- Updated dependencies [9b81b69e]
- Updated dependencies [a2c66cd9]
- Updated dependencies [c4562f7e]
- Updated dependencies [c55d4566]
  - @lion/core@0.19.0

## 0.21.2

### Patch Changes

- Updated dependencies [bcf68ceb]
- Updated dependencies [d963e74e]
  - @lion/core@0.18.4

## 0.21.1

### Patch Changes

- Updated dependencies [ec03d209]
  - @lion/core@0.18.3

## 0.21.0

### Minor Changes

- 9648d418: added a parseNumber function
- 8a766644: Make ValidateMixin feedback message wait for localize loadingComplete, to ensure getting the right fieldName if this refers to a localized label.
- c544af4e: BREAKING: Fires localeChanged event (and as a result, invokes onLocaleChanged / onLocaleUpdated) after localize loading has completed. This means if the user switches the locale to a locale which has not loaded yet, it will load it first before sending the event. This will allow users to immediately call localize.msg and get the right output, without having to await localize.loadingComplete themselves. This is slightly breaking with regards to timing and might break tests in extensions. In that case, you probably need a `await localize.loadingComplete` statement in front of the failing assertion.

### Patch Changes

- 9b9d82fc: Fix onLocaleChanged method missing param types
- Updated dependencies [8c06302e]
  - @lion/core@0.18.2

## 0.20.2

### Patch Changes

- 84131205: use mdjs-preview in docs for lit compatibility
- Updated dependencies [84131205]
  - @lion/core@0.18.1

## 0.20.1

### Patch Changes

- 5ca3d275: Fix localize race condition where data was being added while namespace loader promise was no longer in cache.

## 0.20.0

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

## 0.19.0

### Minor Changes

- 02e4f2cb: add simulator to demos

### Patch Changes

- Updated dependencies [02e4f2cb]
  - @lion/core@0.17.0
  - singleton-manager@1.4.2

## 0.18.0

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
  - singleton-manager@1.4.1

## 0.17.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- Updated dependencies [f3e54c56]
- Updated dependencies [5db622e9]
  - @lion/core@0.15.0
  - singleton-manager@1.4.0

## 0.16.1

### Patch Changes

- 701aadce: Fix types of mixins to include LitElement static props and methods, and use Pick generic type instead of fake constructors.
- Updated dependencies [701aadce]
  - @lion/core@0.14.1

## 0.16.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0
  - singleton-manager@1.3.0

## 0.15.5

### Patch Changes

- 8fb7e7a1: Fix type issues where base constructors would not have the same return type. This allows us to remove a LOT of @ts-expect-errors/@ts-ignores across lion.
- 9112d243: Fix missing types and update to latest scoped elements to fix constructor type.
- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8

## 0.15.4

### Patch Changes

- a8cf4215: Improved localize DX by making it clear from source code structure what are main (exported) functions and what are util/helper functions consumed by those main functions.
  Added Chrome Intl corrections for Philippine currency names and en-GB short month names.
- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [98f1bb7e]
  - @lion/core@0.13.7
  - singleton-manager@1.2.1

## 0.15.3

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6

## 0.15.2

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5

## 0.15.1

### Patch Changes

- Updated dependencies [39d5e767]
  - singleton-manager@1.2.0

## 0.15.0

### Minor Changes

- 3ada1aef: Localize set date and number postProcessors for locale

## 0.14.9

### Patch Changes

- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4

## 0.14.8

### Patch Changes

- 8ca71b8f: `parseDate('31.02.2020')` returned `'Mon Mar 02 2020 00:00:00 GMT+0100....'`. But not anymore, now it returns `undefined`.
- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3

## 0.14.7

### Patch Changes

- 20ba0ca8: Type enhancements

  - LocalizeMixinTypes.d.ts extend from LitElement
  - Make `slots` a getter in SlotMixin types
  - selectedElement of type 'LionOption' in SelectRichInvoker

- 618f2698: Run tests also on webkit
- Updated dependencies [20ba0ca8]
  - @lion/core@0.13.2

## 0.14.6

### Patch Changes

- 7682e520: Fix formatting negative values for Turkish locale.
- Updated dependencies [e92b98a4]
  - @lion/core@0.13.1

## 0.14.5

### Patch Changes

- b9327627: These packages were using out of sync type definitions for FormatOptions, and the types were missing a bunch of options that Intl would normally accept. We now extend Intl's NumberFormatOptions and DateTimeFormatOptions properly, so we always have the right types and are more consistent on it.
- Updated dependencies [01a798e5]
  - @lion/core@0.13.0

## 0.14.4

### Patch Changes

- Updated dependencies [75107a4b]
  - @lion/core@0.12.0

## 0.14.3

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0

## 0.14.2

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0

## 0.14.1

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1

## 0.14.0

### Minor Changes

- 09d96759: Add types for localize package. JSDocs types in the .js files, TSC generates type definition files. Mixins type definition files are hand-typed.
- 9ecab4d5: Removing LionSingleton as es modules are already guaranteed to be singletons.
  This reduces complexity and means less code to ship to our users.

### Patch Changes

- 3c61fd29: Add types to form-core, for everything except form-group, choice-group and validate. Also added index.d.ts (re-)export files to git so that interdependent packages can use their types locally.
- Updated dependencies [3c61fd29]
- Updated dependencies [09d96759]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0
  - singleton-manager@1.1.2

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.13.1](https://github.com/ing-bank/lion/compare/@lion/localize@0.13.0...@lion/localize@0.13.1) (2020-07-13)

**Note:** Version bump only for package @lion/localize

# [0.13.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.12.1...@lion/localize@0.13.0) (2020-07-07)

### Bug Fixes

- **localize:** format hungarian & bulgarian dates ([cddd51a](https://github.com/ing-bank/lion/commit/cddd51adcb1b64da3f6850c8bd7f38830abb8aa8)), closes [#540](https://github.com/ing-bank/lion/issues/540)

### BREAKING CHANGES

- **localize:** N

## [0.12.1](https://github.com/ing-bank/lion/compare/@lion/localize@0.12.0...@lion/localize@0.12.1) (2020-06-18)

### Bug Fixes

- **localize:** loading of new translations ([5b8a991](https://github.com/ing-bank/lion/commit/5b8a9915a3200c1ff9f4d7e0dab44695ace085c7))

# [0.12.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.11.2...@lion/localize@0.12.0) (2020-06-08)

### Features

- **localize:** support google translate ([271520d](https://github.com/ing-bank/lion/commit/271520d55cff3c182357f792cad6675e54c36be3))

## [0.11.2](https://github.com/ing-bank/lion/compare/@lion/localize@0.11.1...@lion/localize@0.11.2) (2020-06-08)

**Note:** Version bump only for package @lion/localize

## [0.11.1](https://github.com/ing-bank/lion/compare/@lion/localize@0.11.0...@lion/localize@0.11.1) (2020-06-03)

### Bug Fixes

- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))

# [0.11.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.10.0...@lion/localize@0.11.0) (2020-05-29)

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

# [0.10.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.9.2...@lion/localize@0.10.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

## [0.9.2](https://github.com/ing-bank/lion/compare/@lion/localize@0.9.1...@lion/localize@0.9.2) (2020-04-29)

### Bug Fixes

- **localization:** force TR currency code at the end ([#641](https://github.com/ing-bank/lion/issues/641)) ([89a84a8](https://github.com/ing-bank/lion/commit/89a84a8b29969a018d28af4dadc509709caaa7c3))

## [0.9.1](https://github.com/ing-bank/lion/compare/@lion/localize@0.9.0...@lion/localize@0.9.1) (2020-04-02)

**Note:** Version bump only for package @lion/localize

# [0.9.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.8.10...@lion/localize@0.9.0) (2020-03-25)

### Features

- refrain from using dynamic vars inside dynamic import ([42c840f](https://github.com/ing-bank/lion/commit/42c840f9498810a81296c9beb8a4f6bbdbc4fa0b))

## [0.8.10](https://github.com/ing-bank/lion/compare/@lion/localize@0.8.9...@lion/localize@0.8.10) (2020-03-05)

**Note:** Version bump only for package @lion/localize

## [0.8.9](https://github.com/ing-bank/lion/compare/@lion/localize@0.8.8...@lion/localize@0.8.9) (2020-03-04)

### Bug Fixes

- **input-amount:** normalize added for currency label ([#618](https://github.com/ing-bank/lion/issues/618)) ([1bec11a](https://github.com/ing-bank/lion/commit/1bec11a2672671fd981f63eb00ba169e4df9451b))
- **localize:** force symbols for locale 'en-AU' ([#619](https://github.com/ing-bank/lion/issues/619)) ([a9ea72b](https://github.com/ing-bank/lion/commit/a9ea72b7dff1d87c5a0dde85edead5135d1efcaf))

## [0.8.8](https://github.com/ing-bank/lion/compare/@lion/localize@0.8.7...@lion/localize@0.8.8) (2020-02-26)

**Note:** Version bump only for package @lion/localize

## [0.8.7](https://github.com/ing-bank/lion/compare/@lion/localize@0.8.6...@lion/localize@0.8.7) (2020-02-19)

### Bug Fixes

- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.8.6](https://github.com/ing-bank/lion/compare/@lion/localize@0.8.5...@lion/localize@0.8.6) (2020-02-06)

**Note:** Version bump only for package @lion/localize

## [0.8.5](https://github.com/ing-bank/lion/compare/@lion/localize@0.8.4...@lion/localize@0.8.5) (2020-02-03)

### Bug Fixes

- **localize:** if locale is set to tr, currency TRY should display TL ([8fb3b23](https://github.com/ing-bank/lion/commit/8fb3b237553bda38cb66b0b75b683f4a69d4a2a5))

## [0.8.4](https://github.com/ing-bank/lion/compare/@lion/localize@0.8.3...@lion/localize@0.8.4) (2020-01-23)

### Bug Fixes

- update links in stories ([0c53b1d](https://github.com/ing-bank/lion/commit/0c53b1d4bb4fa51820656bacfc2aece653d03182))

## [0.8.3](https://github.com/ing-bank/lion/compare/@lion/localize@0.8.2...@lion/localize@0.8.3) (2020-01-23)

**Note:** Version bump only for package @lion/localize

## [0.8.2](https://github.com/ing-bank/lion/compare/@lion/localize@0.8.1...@lion/localize@0.8.2) (2020-01-20)

**Note:** Version bump only for package @lion/localize

## [0.8.1](https://github.com/ing-bank/lion/compare/@lion/localize@0.8.0...@lion/localize@0.8.1) (2020-01-17)

### Bug Fixes

- update storybook and use main.js ([e61e0b9](https://github.com/ing-bank/lion/commit/e61e0b938ff72cc18cc0b3aa1560f2cece0c9fe6))

# [0.8.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.7.2...@lion/localize@0.8.0) (2020-01-13)

### Bug Fixes

- **localize:** fire localeChanged after loading missing locales ([bf7603e](https://github.com/ing-bank/lion/commit/bf7603e7e28c10e5f1500d229c35c4710f80125f))

### Features

- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))

## [0.7.2](https://github.com/ing-bank/lion/compare/@lion/localize@0.7.1...@lion/localize@0.7.2) (2020-01-08)

### Bug Fixes

- **localize:** allow negative bulgarian numbers ([367e2f4](https://github.com/ing-bank/lion/commit/367e2f4f96be9ef7b3a1018f07a1dcd8311ba07b))

## [0.7.1](https://github.com/ing-bank/lion/compare/@lion/localize@0.7.0...@lion/localize@0.7.1) (2019-12-02)

### Bug Fixes

- use strict versions to get correct deps on older versions ([8645c13](https://github.com/ing-bank/lion/commit/8645c13b1d77e488713f2e5e0e4e00c4d30ea1ee))

# [0.7.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.6.0...@lion/localize@0.7.0) (2019-12-01)

### Features

- refactor the overlay system implementations, docs and demos ([a5a9f97](https://github.com/ing-bank/lion/commit/a5a9f975a61649cd1f861a80923c678c5f4d51be))

# [0.6.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.5.0...@lion/localize@0.6.0) (2019-11-27)

### Features

- **localize:** add getCurrencyName ([708b6f9](https://github.com/ing-bank/lion/commit/708b6f991d1f37013a69f5e880f44ac267131661))

# [0.5.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.21...@lion/localize@0.5.0) (2019-11-13)

### Features

- remove all deprecations from lion ([66d3d39](https://github.com/ing-bank/lion/commit/66d3d390aebeaa61b6effdea7d5f7eea0e89c894))

## [0.4.21](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.20...@lion/localize@0.4.21) (2019-10-23)

### Bug Fixes

- **localize:** unforce defaults when options are given ([08a9129](https://github.com/ing-bank/lion/commit/08a9129))

## [0.4.20](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.19...@lion/localize@0.4.20) (2019-10-23)

**Note:** Version bump only for package @lion/localize

## [0.4.19](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.18...@lion/localize@0.4.19) (2019-10-09)

### Bug Fixes

- **localize:** add tests for percent in formatNumberToParts ([1f40250](https://github.com/ing-bank/lion/commit/1f40250))
- **localize:** use option.locale to get separator in formatNumberToParts ([093cfa0](https://github.com/ing-bank/lion/commit/093cfa0))

## [0.4.18](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.17...@lion/localize@0.4.18) (2019-10-07)

**Note:** Version bump only for package @lion/localize

## [0.4.17](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.16...@lion/localize@0.4.17) (2019-09-30)

### Bug Fixes

- **localize:** allow multiple characters for currency symbols ([20b77a4](https://github.com/ing-bank/lion/commit/20b77a4))

## [0.4.16](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.15...@lion/localize@0.4.16) (2019-09-25)

**Note:** Version bump only for package @lion/localize

## [0.4.15](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.14...@lion/localize@0.4.15) (2019-09-20)

### Bug Fixes

- **input-amount:** use minus sign unicode instead of hypen-minus ([edd7396](https://github.com/ing-bank/lion/commit/edd7396))
- **localize:** use minus sign unicode instead of hypen-minus ([85beb18](https://github.com/ing-bank/lion/commit/85beb18))

## [0.4.14](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.13...@lion/localize@0.4.14) (2019-08-23)

**Note:** Version bump only for package @lion/localize

## [0.4.13](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.12...@lion/localize@0.4.13) (2019-08-15)

### Bug Fixes

- **localize:** update the way to obtain the group separator for a number ([b0d6f49](https://github.com/ing-bank/lion/commit/b0d6f49))

## [0.4.12](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.11...@lion/localize@0.4.12) (2019-08-07)

### Bug Fixes

- **localize:** for bg-BG locale, correct Intl output for group separator ([c151f01](https://github.com/ing-bank/lion/commit/c151f01))

## [0.4.11](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.10...@lion/localize@0.4.11) (2019-07-30)

### Bug Fixes

- include test-helpers dir in the released package ([6489069](https://github.com/ing-bank/lion/commit/6489069))

## [0.4.10](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.9...@lion/localize@0.4.10) (2019-07-30)

### Bug Fixes

- public test-helpers ([3b889e3](https://github.com/ing-bank/lion/commit/3b889e3))

## [0.4.9](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.8...@lion/localize@0.4.9) (2019-07-25)

**Note:** Version bump only for package @lion/localize

## [0.4.8](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.7...@lion/localize@0.4.8) (2019-07-24)

**Note:** Version bump only for package @lion/localize

## [0.4.7](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.6...@lion/localize@0.4.7) (2019-07-23)

**Note:** Version bump only for package @lion/localize

## [0.4.6](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.5...@lion/localize@0.4.6) (2019-07-23)

**Note:** Version bump only for package @lion/localize

## [0.4.5](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.4...@lion/localize@0.4.5) (2019-07-23)

**Note:** Version bump only for package @lion/localize

## [0.4.4](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.3...@lion/localize@0.4.4) (2019-07-18)

**Note:** Version bump only for package @lion/localize

## [0.4.3](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.2...@lion/localize@0.4.3) (2019-07-15)

### Bug Fixes

- **localize:** set default fallback locale "en-GB" (fix [#152](https://github.com/ing-bank/lion/issues/152)) ([270de8a](https://github.com/ing-bank/lion/commit/270de8a))
- **localize:** support fallback locale ([e7ea9cb](https://github.com/ing-bank/lion/commit/e7ea9cb))

## [0.4.2](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.1...@lion/localize@0.4.2) (2019-07-09)

### Bug Fixes

- **localize:** don't fire localeChanged event if set to the same locale ([3115c50](https://github.com/ing-bank/lion/commit/3115c50))
- **localize:** observe <html lang> attribute ([18589f4](https://github.com/ing-bank/lion/commit/18589f4))

## [0.4.1](https://github.com/ing-bank/lion/compare/@lion/localize@0.4.0...@lion/localize@0.4.1) (2019-06-27)

### Bug Fixes

- **localize:** remove unnecessary normalization for Belgium ([0afb0e1](https://github.com/ing-bank/lion/commit/0afb0e1))
- **localize:** return sign to the front of the currency formatted value in Dutch ([8fb70c2](https://github.com/ing-bank/lion/commit/8fb70c2))

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.3.6...@lion/localize@0.4.0) (2019-06-06)

### Features

- **localize:** allow custom locale when loading namespaces ([2e76ca0](https://github.com/ing-bank/lion/commit/2e76ca0))

## [0.3.6](https://github.com/ing-bank/lion/compare/@lion/localize@0.3.5...@lion/localize@0.3.6) (2019-05-31)

**Note:** Version bump only for package @lion/localize

## [0.3.5](https://github.com/ing-bank/lion/compare/@lion/localize@0.3.4...@lion/localize@0.3.5) (2019-05-29)

**Note:** Version bump only for package @lion/localize

## [0.3.4](https://github.com/ing-bank/lion/compare/@lion/localize@0.3.3...@lion/localize@0.3.4) (2019-05-24)

**Note:** Version bump only for package @lion/localize

## [0.3.3](https://github.com/ing-bank/lion/compare/@lion/localize@0.3.2...@lion/localize@0.3.3) (2019-05-22)

**Note:** Version bump only for package @lion/localize

## [0.3.2](https://github.com/ing-bank/lion/compare/@lion/localize@0.3.1...@lion/localize@0.3.2) (2019-05-17)

**Note:** Version bump only for package @lion/localize

## [0.3.1](https://github.com/ing-bank/lion/compare/@lion/localize@0.3.0...@lion/localize@0.3.1) (2019-05-16)

**Note:** Version bump only for package @lion/localize

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.2.0...@lion/localize@0.3.0) (2019-05-16)

### Bug Fixes

- **localize:** empty dates should be formatted as empty string ([6cfa301](https://github.com/ing-bank/lion/commit/6cfa301))

### Features

- **localize:** allow long/short/narrow param getMonthNames ([144ebce](https://github.com/ing-bank/lion/commit/144ebce))

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/localize@0.1.7...@lion/localize@0.2.0) (2019-05-13)

### Features

- **localize:** add reusable generators for month and weekday names ([043106c](https://github.com/ing-bank/lion/commit/043106c))

## [0.1.7](https://github.com/ing-bank/lion/compare/@lion/localize@0.1.6...@lion/localize@0.1.7) (2019-05-13)

### Bug Fixes

- add prepublish step to make links absolute for npm docs ([9f2c4f6](https://github.com/ing-bank/lion/commit/9f2c4f6))

## [0.1.6](https://github.com/ing-bank/lion/compare/@lion/localize@0.1.5...@lion/localize@0.1.6) (2019-05-08)

**Note:** Version bump only for package @lion/localize

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/localize@0.1.4...@lion/localize@0.1.5) (2019-05-07)

### Bug Fixes

- import from entry points so stories can be extended ([49f18a4](https://github.com/ing-bank/lion/commit/49f18a4))

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/localize@0.1.3...@lion/localize@0.1.4) (2019-04-29)

**Note:** Version bump only for package @lion/localize

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/localize@0.1.2...@lion/localize@0.1.3) (2019-04-28)

### Bug Fixes

- update storybook/linting; adjust story labels, eslint ignores ([8d96f84](https://github.com/ing-bank/lion/commit/8d96f84))

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/localize@0.1.1...@lion/localize@0.1.2) (2019-04-27)

### Bug Fixes

- add missing exports to core, input-iban, localize ([f5fd18c](https://github.com/ing-bank/lion/commit/f5fd18c))

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/localize@0.1.0...@lion/localize@0.1.1) (2019-04-26)

### Bug Fixes

- add missing files to npm packages ([0e3ca17](https://github.com/ing-bank/lion/commit/0e3ca17))

# 0.1.0 (2019-04-26)

### Bug Fixes

- **localize:** work with dates of different timezones ([cbbf0d4](https://github.com/ing-bank/lion/commit/cbbf0d4))

### Features

- release inital public lion version ([ec8da8f](https://github.com/ing-bank/lion/commit/ec8da8f))
