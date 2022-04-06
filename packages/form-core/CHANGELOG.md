# Change Log

## 0.17.0

### Minor Changes

- 672c8e99: New documentation structure
- 7016a150: Validation: allow enums as outcome of a Validator
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

- f408f6f8: Updated the ValidateMixin \_\_setupValidators method to sync the calendar date with validator params with reference to this issue : https://github.com/ing-bank/lion/pull/1641/files#diff-bed9319548b16e509dd4a5c3d9c7c31175b577f91e433ee55a945e05339d2796R632

### Patch Changes

- 9c1dfdcd: FormControl: allow a label-sr-only flag to provide visually hidden labels
- 3772c943: form-core: expose 'mimicUserInput' test-helper
- Updated dependencies [66531e3c]
- Updated dependencies [672c8e99]
- Updated dependencies [aa8b8916]
  - @lion/core@0.22.0
  - @lion/localize@0.24.0

## 0.16.0

### Minor Changes

- 683d5c1c: Upgrade to latest Typescript. Keep in mind, some @ts-ignores were necessary, also per TS maintainer's advice. Use skipLibCheck in your TSConfig to ignore issues coming from Lion, the types are valid.

  **We also unfixed lion's dependencies (now using caret ^) on its own packages**, because it caused a lot of problems with duplicate installations for end users as well as subclassers and its end users. Both of these changes may affect subclassers in a breaking manner, hence the minor bump.

  Be sure to [read our Rationale on this change](https://lion-web.netlify.app/docs/rationales/versioning/) and what this means for you as a user.

### Patch Changes

- Updated dependencies [683d5c1c]
  - @lion/core@0.21.0
  - @lion/localize@0.23.0

## 0.15.5

### Patch Changes

- 30805edf: Replace deprecated node folder exports with wildcard exports for docs
- 2bd3c521: Rename customElementsManifest to customElements in package.json
- Updated dependencies [30805edf]
- Updated dependencies [495cb0c5]
- Updated dependencies [fad9d8e5]
- Updated dependencies [2b583ee7]
- Updated dependencies [83011918]
  - @lion/core@0.20.0
  - @lion/localize@0.22.0

## 0.15.4

### Patch Changes

- c4562f7e: use html & unsafeStatic from @open-wc/testing instead of directly from lit
- Updated dependencies [9b81b69e]
- Updated dependencies [a2c66cd9]
- Updated dependencies [c4562f7e]
- Updated dependencies [c55d4566]
  - @lion/core@0.19.0
  - @lion/localize@0.21.3

## 0.15.3

### Patch Changes

- d963e74e: Fix type error, EventHandlerNonNull got removed it seems. (event: Event) => unknown; instead is fine.
- Updated dependencies [bcf68ceb]
- Updated dependencies [d963e74e]
  - @lion/core@0.18.4
  - @lion/localize@0.21.2

## 0.15.2

### Patch Changes

- Updated dependencies [ec03d209]
  - @lion/core@0.18.3
  - @lion/localize@0.21.1

## 0.15.1

### Patch Changes

- 04874352: Add a separate protected method for the filter function when filtering out fields for serialized|model|formattedValue in form groups. This makes it easier to specify when you to filter out fields, e.g. disabled fields for serializedValue of a parent form group.

## 0.15.0

### Minor Changes

- 8a766644: Make ValidateMixin feedback message wait for localize loadingComplete, to ensure getting the right fieldName if this refers to a localized label.

### Patch Changes

- e87b6293: only preserve caret if value changed, which fixes a safari bug
- Updated dependencies [9648d418]
- Updated dependencies [8c06302e]
- Updated dependencies [9b9d82fc]
- Updated dependencies [8a766644]
- Updated dependencies [c544af4e]
  - @lion/localize@0.21.0
  - @lion/core@0.18.2

## 0.14.2

### Patch Changes

- 84131205: use mdjs-preview in docs for lit compatibility
- Updated dependencies [84131205]
  - @lion/core@0.18.1
  - @lion/localize@0.20.2

## 0.14.1

### Patch Changes

- f320b8b4: use customElementRegistry from component registry for slots used via SlotMixin
- Updated dependencies [5ca3d275]
  - @lion/localize@0.20.1

## 0.14.0

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

## 0.13.0

### Minor Changes

- 0ddd38c0: member descriptions for editors and api tables

### Patch Changes

- 0ddd38c0: support [focused-visible] when focusable node within matches :focus-visible

## 0.12.0

### Minor Changes

- 02e4f2cb: add simulator to demos
- c6fbe920: support paste functionality in FormatMixin

### Patch Changes

- 11ec31c6: fixed css selector syntax for disabled [slot=input]'
- 15146bf9: form groups support lazily rendered children
- Updated dependencies [02e4f2cb]
  - @lion/core@0.17.0
  - @lion/localize@0.19.0

## 0.11.0

### Minor Changes

- 0e910e3f: allow fine grained feedback visibility control via `.showFeedConditionFor(type, meta, currentCondition)` for Application Developers
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

- 38297d07: ## Bug fixes

  **form-core**: registrationComplete callback executed before initial interaction states are computed

- 3b5ed322: ### Bug fixes

  fix(form-core): do not preprocess during composition

- 77a04245: add protected and private type info
- 53167fd2: - validation of form groups when child fires 'model-value-changed'
  - fire {feedbackType}StateChanged event when feedback type (like 'error'/'warning') changed
- 181a1d45: - form-core: pending initialization values in order of execution
  - form-core: choiceGroup null and undefined values support
- fb1522dd: **form-core**: fieldset label as child label suffix. Mimics native fieldset a11y
- 75af80be: **form-core**:

  - cleanup group > child descriptions on disconnectedCallback
  - reenable tests

- 991f1f54: **combobox**: enabled and fixed types
- cc02ae24: aria-live is set to assertive on blur, so next focused input message will be read first by screen reader
- 6ae7a5e3: Add `clear()` interface to choiceGroups
- Updated dependencies [77a04245]
- Updated dependencies [43e4bb81]
  - @lion/core@0.16.0
  - @lion/localize@0.18.0

## 0.10.2

### Patch Changes

- 6ea02988: Always use ...styles and [css``] everywhere consistently, meaning an array of CSSResult. Makes it easier on TSC.

## 0.10.1

### Patch Changes

- 72a6ccc8: Allow Subclassers of LionCombobox to set '\_syncToTextboxCondition' in closing phase of overlay

  ## Fixes

  - form-core: allow an extra microtask in registration phase to make forms inside dialogs compatible.
  - combobox: open on focused when showAllOnEmpty

## 0.10.0

### Minor Changes

- 13f808af: Add preprocessor hook for completely preventing invalid input or doing other preprocessing steps before the parsing process of the FormatMixin.

### Patch Changes

- aa478174: fix: prevent a11y violations when applying aria-required
- a809d7b5: Make sync updatable mixin work for elements that get re-connected to DOM e.g. through appendChild. Needed for integration with global overlays.

## 0.9.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- af90b20e: Only show success feedback if the user is recovering from a shown error/warning.
- Updated dependencies [f3e54c56]
- Updated dependencies [5db622e9]
  - @lion/core@0.15.0
  - @lion/localize@0.17.0

## 0.8.5

### Patch Changes

- dbacafa5: Type static get properties as {any} since the real class fields are typed separately and lit properties are just "configuring". Remove expect error.

## 0.8.4

### Patch Changes

- 6b91c92d: Remove .prototype accessor when accessing super.constructor from a constructor. This causes maximum call stack exceeded in latest chrome.
- 701aadce: Fix types of mixins to include LitElement static props and methods, and use Pick generic type instead of fake constructors.
- Updated dependencies [701aadce]
  - @lion/core@0.14.1
  - @lion/localize@0.16.1

## 0.8.3

### Patch Changes

- b2a1c1ef: Make sure prev validation result is always an array (of validators) and not undefined.

## 0.8.2

### Patch Changes

- d0b37e62: Do a deep equals check for choice group children that have complex modelValues, enabling modelValue setter to work on the group level.

## 0.8.1

### Patch Changes

- deb95d13: Add data-tag-name manually to scoped child slottables as the ScopedElementsMixin only does this transform for elements inside render templates.

## 0.8.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0
  - @lion/localize@0.16.0

## 0.7.3

### Patch Changes

- a7b27502: Sync name to parent form group conditionally and allow overriding. Also fix sync properly to prevent infinite loop.

## 0.7.2

### Patch Changes

- 77114753: Stop propagation of label click event in choice inputs to deduplicate the click event on the choice input.
- f98aab23: Make \_\_parentFormGroup --> \_parentFormGroup so it is protected and not private
- f98aab23: Make \_\_toggleChecked protected property (\_toggleChecked)

## 0.7.1

### Patch Changes

- 8fb7e7a1: Fix type issues where base constructors would not have the same return type. This allows us to remove a LOT of @ts-expect-errors/@ts-ignores across lion.
- 9112d243: Fix missing types and update to latest scoped elements to fix constructor type.
- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8
  - @lion/localize@0.15.5

## 0.7.0

### Minor Changes

- a8cf4215: Added `isTriggeredByUser` meta data in `model-value-changed` event

  Sometimes it can be helpful to detect whether a value change was caused by a user or via a programmatical change.
  This feature acts as a normalization layer: since we use `model-value-changed` as a single source of truth event for all FormControls, there should be no use cases for (inconsistently implemented (cross browser)) events like `input`/`change`/`user-input-changed` etc.

### Patch Changes

- 5302ec89: Minimise dependencies by removing integration demos to form-integrations and form-core packages.
- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [a8cf4215]
- Updated dependencies [98f1bb7e]
  - @lion/localize@0.15.4
  - @lion/core@0.13.7

## 0.6.14

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6
  - @lion/localize@0.15.3

## 0.6.13

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5
  - @lion/localize@0.15.2

## 0.6.12

### Patch Changes

- 5553e43e: fix: point to parent constructor in styles getter

## 0.6.11

### Patch Changes

- aa8ad0e6: - (RadioGroup) fix reset bug when selected value was behind inital value
  - Add ChoiceInputMixin test suite
  - Make use of ChoiceGroupMixin test suite
- 4bacc17b: Adding form elements at the top of a form now adds them to the beginning of the `.formElements` to keep it in sync with the dom order.
  - @lion/localize@0.15.1

## 0.6.10

### Patch Changes

- c5c4d4ba: Normalize input values in date comparison validators
- Updated dependencies [3ada1aef]
  - @lion/localize@0.15.0

## 0.6.9

### Patch Changes

- cf0967fe: Fix type definition file for CSSResultArray

## 0.6.8

### Patch Changes

- b222fd78: Always use CSSResultArray for styles getters and be consistent. This makes typing for subclassers significantly easier. Also added some fixes for missing types in mixins where the superclass was not typed properly. This highlighted some issues with incomplete mixin contracts

## 0.6.7

### Patch Changes

- cfbcccb5: Fix type imports to reuse lion where possible, in case Lit updates with new types that may break us.
- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4
  - @lion/localize@0.14.9

## 0.6.6

### Patch Changes

- Updated dependencies [e2e4deec]
- Updated dependencies [8ca71b8f]
  - @lion/core@0.13.3
  - @lion/localize@0.14.8

## 0.6.5

### Patch Changes

- 618f2698: Run tests also on webkit
- Updated dependencies [20ba0ca8]
- Updated dependencies [618f2698]
  - @lion/core@0.13.2
  - @lion/localize@0.14.7

## 0.6.4

### Patch Changes

- 2907649b: filter feedback messages according feedback conditions
- 68e3e749: Add missing interaction states that could act as feedback conditions. Fix the interactive demo that showcases dynamic feedback conditions.
- fd297a28: Properly update formElements when the name attribute changes, in order to get an updated serializedValue.
- 9fcb67f0: Allow flexibility for extending the repropagation prevention conditions, which is needed for combobox, so that a model-value-changed event is propagated when no option matches after an input change. This allows validation to work properly e.g. for Required.
- 247e64a3: Ensure that the name of a child choice field is always synced with the parent choice field(set) when it changes. No longer error when a child is added with a different name than the parent, simply sync it.
- Updated dependencies [7682e520]
- Updated dependencies [e92b98a4]
  - @lion/localize@0.14.6
  - @lion/core@0.13.1

## 0.6.3

### Patch Changes

- d5faa459: ChoiceGroupMixin: On value change uncheck all formElements that do not meet the requested condition
- 0aa4480e: Refactor of some fields to ensure that \_inputNode has the right type. It starts as HTMLElement for LionField, and all HTMLInputElement, HTMLSelectElement and HTMLTextAreaElement logic, are moved to the right places.

## 0.6.2

### Patch Changes

- 4b7bea96: Added some type fixes/adjustments.
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

- a31b7217: Added submitGroup to types definition file for FormGroupMixin.
- 85720654: - prevent toggle of checked state when disabled
  - dispatch checked-changed on label click
- 32202a88: Added index definition file to git, to allow for importing LionField module definition. Adjust some types now that LionInput will be typed
- b9327627: These packages were using out of sync type definitions for FormatOptions, and the types were missing a bunch of options that Intl would normally accept. We now extend Intl's NumberFormatOptions and DateTimeFormatOptions properly, so we always have the right types and are more consistent on it.
- 02145a06: for ChoiceInputs override clear() so modelValue doesn't get erased
- Updated dependencies [01a798e5]
- Updated dependencies [b9327627]
  - @lion/core@0.13.0
  - @lion/localize@0.14.5

## 0.6.1

### Patch Changes

- 60d5d1d3: Remove usage of Public Class Fields to not break builds
- Updated dependencies [75107a4b]
  - @lion/core@0.12.0
  - @lion/localize@0.14.4

## 0.6.0

### Minor Changes

- 874ff483: Form-core typings

  #### Features

  Provided typings for the form-core package and core package.
  This also means that mixins that previously had implicit dependencies, now have explicit ones.

  #### Patches

  - lion-select-rich: invoker selectedElement now also clones text nodes (fix)
  - fieldset: runs a FormGroup suite

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0
  - @lion/localize@0.14.3

## 0.5.0

### Minor Changes

- 65ecd432: Update to lit-element 2.4.0, changed all uses of \_requestUpdate into requestUpdateInterval

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0
  - @lion/localize@0.14.2

## 0.4.4

### Patch Changes

- c347fce4: Field population fix

  #### Bugfixes

  - allow population conditionally rendered fields in formGroup/fieldset/form

## 0.4.3

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1
  - @lion/localize@0.14.1

## 0.4.2

### Patch Changes

- dd021e43: Groups need a valid formattedValue representing the value of it's form elements
- 07c598fd: Form should be able to access formattedValue of children

## 0.4.1

### Patch Changes

- fb236975: Add index.d.ts file so that its types can be used across lion. Add package root index.js to TSC build config exclude filter to prevent TSC from erroring on already existing type definition files.

## 0.4.0

### Minor Changes

- 3c61fd29: Add types to form-core, for everything except form-group, choice-group and validate. Also added index.d.ts (re-)export files to git so that interdependent packages can use their types locally.

### Patch Changes

- Updated dependencies [3c61fd29]
- Updated dependencies [09d96759]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0
  - @lion/localize@0.14.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.3.1](https://github.com/ing-bank/lion/compare/@lion/form-core@0.3.0...@lion/form-core@0.3.1) (2020-07-28)

### Bug Fixes

- resolve registrationComplete via microtask to be sync ([6b8daef](https://github.com/ing-bank/lion/commit/6b8daef5099ab7bab40f9bdd8aaa1a0795b56214))

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/form-core@0.2.6...@lion/form-core@0.3.0) (2020-07-27)

### Features

- synchronous form registration system ([8698f73](https://github.com/ing-bank/lion/commit/8698f734186eb88c4669bbadf8d5ae461f1c27f5))

## [0.2.6](https://github.com/ing-bank/lion/compare/@lion/form-core@0.2.5...@lion/form-core@0.2.6) (2020-07-16)

### Bug Fixes

- **form-core:** remove possible untrusted input value callback ([e06196d](https://github.com/ing-bank/lion/commit/e06196dec86f6d99fda0ed1c5dac3f62e3e34f6d))

## [0.2.5](https://github.com/ing-bank/lion/compare/@lion/form-core@0.2.4...@lion/form-core@0.2.5) (2020-07-13)

**Note:** Version bump only for package @lion/form-core

## [0.2.4](https://github.com/ing-bank/lion/compare/@lion/form-core@0.2.3...@lion/form-core@0.2.4) (2020-07-09)

**Note:** Version bump only for package @lion/form-core

## [0.2.3](https://github.com/ing-bank/lion/compare/@lion/form-core@0.2.2...@lion/form-core@0.2.3) (2020-07-09)

### Bug Fixes

- **formgroup:** wait for formElements to register ([780383d](https://github.com/ing-bank/lion/commit/780383d081607c0099004c2824a1493ced3d78a9))

## [0.2.2](https://github.com/ing-bank/lion/compare/@lion/form-core@0.2.1...@lion/form-core@0.2.2) (2020-07-09)

### Bug Fixes

- **select-rich:** instantiation after first update ([184898c](https://github.com/ing-bank/lion/commit/184898c111dcb81f269fffc6b82688cc6f25aac2))

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/form-core@0.2.0...@lion/form-core@0.2.1) (2020-07-07)

**Note:** Version bump only for package @lion/form-core

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/form-core@0.1.6...@lion/form-core@0.2.0) (2020-07-06)

### Features

- **choice-input:** add rendering of help-text ([5cd36ca](https://github.com/ing-bank/lion/commit/5cd36cac20c763d47ee495daede421bb66c4d0ba))

## [0.1.6](https://github.com/ing-bank/lion/compare/@lion/form-core@0.1.5...@lion/form-core@0.1.6) (2020-06-18)

**Note:** Version bump only for package @lion/form-core

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/form-core@0.1.4...@lion/form-core@0.1.5) (2020-06-10)

**Note:** Version bump only for package @lion/form-core

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/form-core@0.1.3...@lion/form-core@0.1.4) (2020-06-09)

### Bug Fixes

- **form-core:** on reset the submitted values becomes false ([#753](https://github.com/ing-bank/lion/issues/753)) ([d86cfc5](https://github.com/ing-bank/lion/commit/d86cfc59018a2e5dcff0b2f5728683fc4e4861e6))

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/form-core@0.1.2...@lion/form-core@0.1.3) (2020-06-08)

**Note:** Version bump only for package @lion/form-core

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/form-core@0.1.1...@lion/form-core@0.1.2) (2020-06-08)

**Note:** Version bump only for package @lion/form-core

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/form-core@0.1.0...@lion/form-core@0.1.1) (2020-06-03)

### Bug Fixes

- **field:** remove validation toggled disable ([e24f2ef](https://github.com/ing-bank/lion/commit/e24f2efcff7ffba6076faa4f3ce17ca4c8062b72))
- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))

# 0.1.0 (2020-05-29)

### Features

- merge field/validate/choice-input/form-group into @lion/form-core ([6170374](https://github.com/ing-bank/lion/commit/6170374ee8c058cb95fff79b4953b0535219e9b4))
