# Change Log

## 0.23.1

### Patch Changes

- 5ad98a26: fix: use partial renderOptions in SlotMixin (for Safari)

## 0.23.0

### Minor Changes

- e7a4ca1d: Add "type":"module" to ESM packages so loaders like Vite will interpret the package as ESM properly.

### Patch Changes

- 96a24c4a: add common uuid helper and remove separate implementations

## 0.22.0

### Minor Changes

- 672c8e99: New documentation structure
- aa8b8916: BREAKING CHANGE: Work without polyfill if possible

  When using [component composition](https://lit.dev/docs/composition/component-composition/) in a Lion Component we always made it very explicit which sub-components are used.
  On top of that we scoped these [sub components](https://open-wc.org/docs/development/scoped-elements/) to the [current shadow root](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md) allowing multiple version to be used simultaneously.

  To enable this features we relied on the fact that the `ScopedElementsMixin` did loaded the needed polyfill for us.

  We however over time got feedback from multiple consumers that lion components "break the app as soon as you load them".
  The reasons is/was that not everyone is always using `ScopedElementsMixin` or in full control of the app (or its load order).

  To quote the release notes of `ScopedElementsMixin` v2.1.0:

  > ScopedElementsMixin 2.x tried to be as convenient as possible by automatically loading the scoped custom elements registry polyfill.
  > This however led to a fatal error whenever you registered any component before ScopedElementsMixin was used.

  And this was the case.

  With the upgrade to `@open-wc/scoped-elements` v2.1.1 Lion now no longer automatically loads the polyfill through `ScopedElementsMixin`.

  This essentially means the polyfill became optional which results in the following behavior

  1. If polyfill is not loaded it will use the global registry as a fallback
  2. Log error if actually scoping is needed and polyfill is not loaded
  3. If you manually create elements you will need to handle polyfilled and not polyfilled cases now

  ```diff
  -  const myButton = this.shadowRoot.createElement('my-button');
  +  const myButton = this.createScopedElement('my-button');
  ```

  This also removes `@webcomponents/scoped-custom-element-registry` as a production dependency.

  If you need scoping be sure to load the polyfill before any other web component gets registered.

  It may look something like this in your HTML

  ```html
  <script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
  ```

  or if you have an SPA you can load it at the top of your app shell code

  ```js
  import '@webcomponents/scoped-custom-element-registry';
  ```

  You need scoping if you want to

  use 2 major versions of a web component (e.g. in an SPA pageA uses 1.x and pageB uses 2.x of color-picker)
  or you want to use the same tag name with different implementations (use tag color-picker from foo here and from bar here)

  See more details at

  - [Lion release blog post](https://lion-web.netlify.app/blog/lion-without-polyfills/)
  - [@open-wc/scoped-elements release blog post](https://open-wc.org/blog/scoped-elements-without-polyfill/)
  - [Change log of ScopedElementsMixin](https://github.com/open-wc/open-wc/blob/master/packages/scoped-elements/CHANGELOG.md#210)

### Patch Changes

- 66531e3c: SlotMixin: support scoped elements

## 0.21.1

### Patch Changes

- 57d2c62b: Abstract input-range's scoped styles feature to a reactive controller for reuse. With this controller, you can scope styles on a LightDOM component.

## 0.21.0

### Minor Changes

- 683d5c1c: Upgrade to latest Typescript. Keep in mind, some @ts-ignores were necessary, also per TS maintainer's advice. Use skipLibCheck in your TSConfig to ignore issues coming from Lion, the types are valid.

  **We also unfixed lion's dependencies (now using caret ^) on its own packages**, because it caused a lot of problems with duplicate installations for end users as well as subclassers and its end users. Both of these changes may affect subclassers in a breaking manner, hence the minor bump.

  Be sure to [read our Rationale on this change](https://lion-web.netlify.app/docs/rationales/versioning/) and what this means for you as a user.

## 0.20.0

### Minor Changes

- 495cb0c5: Remove keyboardEventShimIE test helper
- 2b583ee7: Remove differentKeyEventNamesShimIE, since IE11 isn't supported any more
- 83011918: Remove closestPolyfill

### Patch Changes

- 30805edf: Replace deprecated node folder exports with wildcard exports for docs

## 0.19.0

### Minor Changes

- a2c66cd9: Update Lit to v2

### Patch Changes

- 9b81b69e: Re-export latest added lit directives.
- c4562f7e: use html & unsafeStatic from @open-wc/testing instead of directly from lit
- c55d4566: Re-export html from lit/static-html.js as staticHtml.

## 0.18.4

### Patch Changes

- bcf68ceb: Allow SlotMixin to work with default slots using empty string as key (''). Ensure that we do not add slot attribute to the slottable in this case.
- d963e74e: Fix type error, EventHandlerNonNull got removed it seems. (event: Event) => unknown; instead is fine.

## 0.18.3

### Patch Changes

- ec03d209: Support scoped templates in SlotMixin

## 0.18.2

### Patch Changes

- 8c06302e: fix documentation of how to import core elements

## 0.18.1

### Patch Changes

- 84131205: use mdjs-preview in docs for lit compatibility

## 0.18.0

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

## 0.17.0

### Minor Changes

- 02e4f2cb: add simulator to demos

## 0.16.0

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

## 0.15.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

## 0.14.1

### Patch Changes

- 701aadce: Fix types of mixins to include LitElement static props and methods, and use Pick generic type instead of fake constructors.

## 0.14.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

## 0.13.8

### Patch Changes

- 8fb7e7a1: Fix type issues where base constructors would not have the same return type. This allows us to remove a LOT of @ts-expect-errors/@ts-ignores across lion.
- 9112d243: Fix missing types and update to latest scoped elements to fix constructor type.

## 0.13.7

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.

## 0.13.6

### Patch Changes

- 9fba9007: Yarn lock was bad, caused types to be built wrongly with the dependency type imports, so we re-release core so that all types get rebuilt and published.

## 0.13.5

### Patch Changes

- 41edf033: Upgrade @open-wc/scoped-elements version

## 0.13.4

### Patch Changes

- cfbcccb5: Fix type imports to reuse lion where possible, in case Lit updates with new types that may break us.

## 0.13.3

### Patch Changes

- e2e4deec: Export reparentNodes and removeNodes

## 0.13.2

### Patch Changes

- 20ba0ca8: Type enhancements

  - LocalizeMixinTypes.d.ts extend from LitElement
  - Make `slots` a getter in SlotMixin types
  - selectedElement of type 'LionOption' in SelectRichInvoker

## 0.13.1

### Patch Changes

- e92b98a4: Ordering aria elements according to dom structure in all browsers

## 0.13.0

### Minor Changes

- 01a798e5: Combobox package

  ## Features

  - combobox: new combobox package
  - core: expanded browsers detection utils
  - core: closest() polyfill for IE
  - overlays: allow OverlayMixin to specify reference node (when invokerNode should not be positioned against)
  - form-core: add `_onLabelClick` to FormControlMixin. Subclassers should override this

  ## Patches

  - form-core: make ChoiceGroupMixin a suite
  - listbox: move generic tests from combobox to listbox
  - select-rich: enhance tests

## 0.12.0

### Minor Changes

- 75107a4b: EventTargetShim

  #### Features

  EventTargetShim is a base class that shims EventTarget for full browser support.

## 0.11.0

### Minor Changes

- 874ff483: Form-core typings

  #### Features

  Provided typings for the form-core package and core package.
  This also means that mixins that previously had implicit dependencies, now have explicit ones.

  #### Patches

  - lion-select-rich: invoker selectedElement now also clones text nodes (fix)
  - fieldset: runs a FormGroup suite

## 0.10.0

### Minor Changes

- 65ecd432: Update to lit-element 2.4.0, changed all uses of \_requestUpdate into requestUpdateInterval

### Patch Changes

- 4dc621a0: Added @param JSDocs type annotation to make sure that the superclass types are properly inherited inside the mixins

## 0.9.1

### Patch Changes

- 4b3ac525: Fixed version of "lit-element" for now to "~2.3.0", since breaking

## 0.9.0

### Minor Changes

- 9ecab4d5: Removing LionSingleton as es modules are already guaranteed to be singletons.
  This reduces complexity and means less code to ship to our users.

### Patch Changes

- 3c61fd29: Add types to form-core, for everything except form-group, choice-group and validate. Also added index.d.ts (re-)export files to git so that interdependent packages can use their types locally.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.8.0](https://github.com/ing-bank/lion/compare/@lion/core@0.7.2...@lion/core@0.8.0) (2020-07-13)

### Features

- **core:** fix types and export type definition files for core ([ec65da5](https://github.com/ing-bank/lion/commit/ec65da5da6ae9096c546fc46583ad3a99458d8e6))

## [0.7.2](https://github.com/ing-bank/lion/compare/@lion/core@0.7.1...@lion/core@0.7.2) (2020-06-18)

**Note:** Version bump only for package @lion/core

## [0.7.1](https://github.com/ing-bank/lion/compare/@lion/core@0.7.0...@lion/core@0.7.1) (2020-06-08)

**Note:** Version bump only for package @lion/core

# [0.7.0](https://github.com/ing-bank/lion/compare/@lion/core@0.6.0...@lion/core@0.7.0) (2020-06-03)

### Bug Fixes

- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

# [0.6.0](https://github.com/ing-bank/lion/compare/@lion/core@0.5.2...@lion/core@0.6.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

## [0.5.2](https://github.com/ing-bank/lion/compare/@lion/core@0.5.1...@lion/core@0.5.2) (2020-04-29)

**Note:** Version bump only for package @lion/core

## [0.5.1](https://github.com/ing-bank/lion/compare/@lion/core@0.5.0...@lion/core@0.5.1) (2020-04-02)

**Note:** Version bump only for package @lion/core

# [0.5.0](https://github.com/ing-bank/lion/compare/@lion/core@0.4.5...@lion/core@0.5.0) (2020-03-25)

### Features

- update to stable @open-wc/scoped-elements ([10bac56](https://github.com/ing-bank/lion/commit/10bac5672b406d3f08a89a795ee295f5028ca6d0))

## [0.4.5](https://github.com/ing-bank/lion/compare/@lion/core@0.4.4...@lion/core@0.4.5) (2020-03-05)

### Bug Fixes

- **core:** use dedupeMixin [@open-wc](https://github.com/open-wc) ([d1beffb](https://github.com/ing-bank/lion/commit/d1beffbff58a4bb0e2029e8dfc3cba7158b97eed))

## [0.4.4](https://github.com/ing-bank/lion/compare/@lion/core@0.4.3...@lion/core@0.4.4) (2020-02-19)

### Bug Fixes

- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.4.3](https://github.com/ing-bank/lion/compare/@lion/core@0.4.2...@lion/core@0.4.3) (2020-02-06)

### Bug Fixes

- **button:** run regexp once instead of every render cycle ([954adc5](https://github.com/ing-bank/lion/commit/954adc56596f2d9244baf48889d6b338b2a12ac4))
- **core:** change the version of lit-element to latest ^2.2.1 ([2e5d8c7](https://github.com/ing-bank/lion/commit/2e5d8c740b6b289492317508fbbe5c684ba508d8))

## [0.4.2](https://github.com/ing-bank/lion/compare/@lion/core@0.4.1...@lion/core@0.4.2) (2020-01-20)

**Note:** Version bump only for package @lion/core

## [0.4.1](https://github.com/ing-bank/lion/compare/@lion/core@0.4.0...@lion/core@0.4.1) (2020-01-17)

### Bug Fixes

- update storybook and use main.js ([e61e0b9](https://github.com/ing-bank/lion/commit/e61e0b938ff72cc18cc0b3aa1560f2cece0c9fe6))

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/core@0.3.0...@lion/core@0.4.0) (2020-01-13)

### Bug Fixes

- refactor slot selection ([5999ea9](https://github.com/ing-bank/lion/commit/5999ea956967b449f3f04935c7facb19e2889dc9))

### Features

- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/core@0.2.1...@lion/core@0.3.0) (2019-11-13)

### Features

- remove all deprecations from lion ([66d3d39](https://github.com/ing-bank/lion/commit/66d3d390aebeaa61b6effdea7d5f7eea0e89c894))

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/core@0.2.0...@lion/core@0.2.1) (2019-10-23)

### Bug Fixes

- **core:** export Part classes from lit-html ([#340](https://github.com/ing-bank/lion/issues/340)) ([9a8f45b](https://github.com/ing-bank/lion/commit/9a8f45b))

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/core@0.1.13...@lion/core@0.2.0) (2019-09-25)

### Features

- **overlays:** align Overlays API + add DynamicOverlay ([224f794](https://github.com/ing-bank/lion/commit/224f794))

## [0.1.13](https://github.com/ing-bank/lion/compare/@lion/core@0.1.12...@lion/core@0.1.13) (2019-07-25)

### Bug Fixes

- **core:** add DisabledMixin to manage disabled ([0d64792](https://github.com/ing-bank/lion/commit/0d64792))
- **core:** add DisabledWithTabIndexMixin to manage disabled and tabindex ([e5b174e](https://github.com/ing-bank/lion/commit/e5b174e))

## [0.1.12](https://github.com/ing-bank/lion/compare/@lion/core@0.1.11...@lion/core@0.1.12) (2019-07-24)

**Note:** Version bump only for package @lion/core

## [0.1.11](https://github.com/ing-bank/lion/compare/@lion/core@0.1.10...@lion/core@0.1.11) (2019-07-23)

**Note:** Version bump only for package @lion/core

## [0.1.10](https://github.com/ing-bank/lion/compare/@lion/core@0.1.9...@lion/core@0.1.10) (2019-07-23)

**Note:** Version bump only for package @lion/core

## [0.1.9](https://github.com/ing-bank/lion/compare/@lion/core@0.1.8...@lion/core@0.1.9) (2019-05-29)

**Note:** Version bump only for package @lion/core

## [0.1.8](https://github.com/ing-bank/lion/compare/@lion/core@0.1.7...@lion/core@0.1.8) (2019-05-24)

### Bug Fixes

- **core:** do not pin lit-html version and allow lit-element patches ([28fa203](https://github.com/ing-bank/lion/commit/28fa203))

## [0.1.7](https://github.com/ing-bank/lion/compare/@lion/core@0.1.6...@lion/core@0.1.7) (2019-05-22)

**Note:** Version bump only for package @lion/core

## [0.1.6](https://github.com/ing-bank/lion/compare/@lion/core@0.1.5...@lion/core@0.1.6) (2019-05-17)

### Bug Fixes

- **core:** remove type exports; use lit-element/html directly for types ([b2e7b70](https://github.com/ing-bank/lion/commit/b2e7b70))

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/core@0.1.4...@lion/core@0.1.5) (2019-05-16)

### Bug Fixes

- **core:** exposed property and PropertyDeclarations from lit-element ([ef3ce64](https://github.com/ing-bank/lion/commit/ef3ce64))

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/core@0.1.3...@lion/core@0.1.4) (2019-05-13)

### Bug Fixes

- add prepublish step to make links absolute for npm docs ([9f2c4f6](https://github.com/ing-bank/lion/commit/9f2c4f6))

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/core@0.1.2...@lion/core@0.1.3) (2019-04-28)

### Bug Fixes

- update storybook/linting; adjust story labels, eslint ignores ([8d96f84](https://github.com/ing-bank/lion/commit/8d96f84))

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/core@0.1.1...@lion/core@0.1.2) (2019-04-27)

### Bug Fixes

- add missing exports to core, input-iban, localize ([f5fd18c](https://github.com/ing-bank/lion/commit/f5fd18c))

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/core@0.1.0...@lion/core@0.1.1) (2019-04-26)

### Bug Fixes

- add missing files to npm packages ([0e3ca17](https://github.com/ing-bank/lion/commit/0e3ca17))

# 0.1.0 (2019-04-26)

### Features

- release inital public lion version ([ec8da8f](https://github.com/ing-bank/lion/commit/ec8da8f))
