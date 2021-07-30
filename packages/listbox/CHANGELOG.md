# @lion/listbox

## 0.10.4

### Patch Changes

- Updated dependencies [04874352]
  - @lion/form-core@0.15.1

## 0.10.3

### Patch Changes

- Updated dependencies [8c06302e]
- Updated dependencies [8a766644]
- Updated dependencies [e87b6293]
  - @lion/core@0.18.2
  - @lion/form-core@0.15.0

## 0.10.2

### Patch Changes

- dd1655e0: Always scrollIntoView and let the scrollIntoView method handle redundancy instead of implementing a "naive" isInView method.
- 84131205: use mdjs-preview in docs for lit compatibility
- Updated dependencies [84131205]
  - @lion/form-core@0.14.2
  - @lion/core@0.18.1

## 0.10.1

### Patch Changes

- f320b8b4: use customElementRegistry from component registry for slots used via SlotMixin
- Updated dependencies [f320b8b4]
  - @lion/form-core@0.14.1

## 0.10.0

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
  - @lion/form-core@0.14.0

## 0.9.0

### Minor Changes

- 0ddd38c0: member descriptions for editors and api tables

### Patch Changes

- Updated dependencies [0ddd38c0]
- Updated dependencies [0ddd38c0]
  - @lion/form-core@0.13.0

## 0.8.0

### Minor Changes

- 02e4f2cb: add simulator to demos

### Patch Changes

- d94d6bd8: teleported options compatible with map/repeat for listbox/combobox/select-rich
- edb43c4e: syncs last selected choice value for [autocomplet="none|list"] on close
- Updated dependencies [11ec31c6]
- Updated dependencies [15146bf9]
- Updated dependencies [02e4f2cb]
- Updated dependencies [c6fbe920]
  - @lion/form-core@0.12.0
  - @lion/core@0.17.0

## 0.7.0

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
  - @lion/core@0.16.0

## 0.6.3

### Patch Changes

- 6ea02988: Always use ...styles and [css``] everywhere consistently, meaning an array of CSSResult. Makes it easier on TSC.
- Updated dependencies [6ea02988]
  - @lion/form-core@0.10.2

## 0.6.2

### Patch Changes

- ca15374a: listbox (descendants) add `isTriggeredByUser` meta data to `model-value-changed` event on keyboard interaction
- Updated dependencies [72a6ccc8]
  - @lion/form-core@0.10.1

## 0.6.1

### Patch Changes

- Updated dependencies [13f808af]
- Updated dependencies [aa478174]
- Updated dependencies [a809d7b5]
  - @lion/form-core@0.10.0

## 0.6.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- Updated dependencies [f3e54c56]
- Updated dependencies [af90b20e]
- Updated dependencies [5db622e9]
  - @lion/core@0.15.0
  - @lion/form-core@0.9.0

## 0.5.5

### Patch Changes

- Updated dependencies [dbacafa5]
  - @lion/form-core@0.8.5

## 0.5.4

### Patch Changes

- 6b91c92d: Remove .prototype accessor when accessing super.constructor from a constructor. This causes maximum call stack exceeded in latest chrome.
- 701aadce: Fix types of mixins to include LitElement static props and methods, and use Pick generic type instead of fake constructors.
- Updated dependencies [6b91c92d]
- Updated dependencies [701aadce]
  - @lion/form-core@0.8.4
  - @lion/core@0.14.1

## 0.5.3

### Patch Changes

- Updated dependencies [b2a1c1ef]
  - @lion/form-core@0.8.3

## 0.5.2

### Patch Changes

- Updated dependencies [d0b37e62]
  - @lion/form-core@0.8.2

## 0.5.1

### Patch Changes

- deb95d13: Add data-tag-name manually to scoped child slottables as the ScopedElementsMixin only does this transform for elements inside render templates.
- Updated dependencies [deb95d13]
  - @lion/form-core@0.8.1

## 0.5.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0
  - @lion/form-core@0.8.0

## 0.4.3

### Patch Changes

- Updated dependencies [a7b27502]
  - @lion/form-core@0.7.3

## 0.4.2

### Patch Changes

- f98aab23: Make \_\_parentFormGroup --> \_parentFormGroup so it is protected and not private
- Updated dependencies [77114753]
- Updated dependencies [f98aab23]
- Updated dependencies [f98aab23]
  - @lion/form-core@0.7.2

## 0.4.1

### Patch Changes

- 8fb7e7a1: Fix type issues where base constructors would not have the same return type. This allows us to remove a LOT of @ts-expect-errors/@ts-ignores across lion.
- 9112d243: Fix missing types and update to latest scoped elements to fix constructor type.
- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8
  - @lion/form-core@0.7.1

## 0.4.0

### Minor Changes

- a8cf4215: Added `isTriggeredByUser` meta data in `model-value-changed` event

  Sometimes it can be helpful to detect whether a value change was caused by a user or via a programmatical change.
  This feature acts as a normalization layer: since we use `model-value-changed` as a single source of truth event for all FormControls, there should be no use cases for (inconsistently implemented (cross browser)) events like `input`/`change`/`user-input-changed` etc.

### Patch Changes

- 5302ec89: Minimise dependencies by removing integration demos to form-integrations and form-core packages.
- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [5302ec89]
- Updated dependencies [98f1bb7e]
- Updated dependencies [a8cf4215]
  - @lion/form-core@0.7.0
  - @lion/core@0.13.7

## 0.3.12

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6
  - @lion/form-core@0.6.14

## 0.3.11

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5
  - @lion/form-core@0.6.13

## 0.3.10

### Patch Changes

- 3c2a33a7:
  - Fix keyboard navigation when `selection-follows-focus` and `orientation="horizontal"` are set on a `<lion-listbox>`
  - Fix keyboard navigation with `selection-follows-focus` and disabled options
  - On click of an option, it become active

## 0.3.9

### Patch Changes

- 5553e43e: fix: point to parent constructor in styles getter
- Updated dependencies [5553e43e]
  - @lion/form-core@0.6.12

## 0.3.8

### Patch Changes

- Updated dependencies [aa8ad0e6]
- Updated dependencies [4bacc17b]
  - @lion/form-core@0.6.11

## 0.3.7

### Patch Changes

- Updated dependencies [c5c4d4ba]
  - @lion/form-core@0.6.10

## 0.3.6

### Patch Changes

- Updated dependencies [cf0967fe]
  - @lion/form-core@0.6.9

## 0.3.5

### Patch Changes

- b222fd78: Always use CSSResultArray for styles getters and be consistent. This makes typing for subclassers significantly easier. Also added some fixes for missing types in mixins where the superclass was not typed properly. This highlighted some issues with incomplete mixin contracts
- Updated dependencies [b222fd78]
  - @lion/form-core@0.6.8

## 0.3.4

### Patch Changes

- cfbcccb5: Fix type imports to reuse lion where possible, in case Lit updates with new types that may break us.
- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4
  - @lion/form-core@0.6.7

## 0.3.3

### Patch Changes

- 4f1e6d0d: Combobox: demos, Subclasser features and fixes

  ### Features

  - Subclassers can configure `_syncToTextboxCondition()`. By default only for `autocomplete="inline|both"`
  - Subclassers can configure `_showOverlayCondition(options)`. For instance, already show once textbox gets focus or add your own custom
  - Subclassers can configure `_syncToTextboxMultiple(modelValue, oldModelValue)`. See https://github.com/ing-bank/lion/issues/1038
  - Subclassers can configure `_autoSelectCondition`, for instance to have autcomplete="list" with auto select instead of manual selection. Both are possible according to w3c specs

  ### Fixes

  - listbox multiselect can deselect again on 'Enter' and 'Space'. Closes https://github.com/ing-bank/lion/issues/1059
  - combobox multiselect display only shows last selected option in textbox (instead of all). See https://github.com/ing-bank/lion/issues/1038
  - default sync to textbox behavior for `autocomplete="none|list"` is no sync with textbox

  ### Demos

  - created a google combobox demo (with anchors as options)
    - advanced styling example
    - uses autocomplete 'list' as a fundament and enhances `_showOverlayCondition` and `_syncToTextboxCondition`
  - enhanced whatsapp combobox demo
    - how to match/highlight text on multiple rows of the option (not just choiceValue)

  ### Potentially breaking for subclassers:

  - `_computeUserIntendsAutoFill` -> `__computeUserIntendsAutoFill` (not overridable)
  - `_syncCheckedWithTextboxOnInteraction` is removed. Use `_syncToTextboxCondition` and/or `_syncToTextboxMultiple`

## 0.3.2

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3
  - @lion/form-core@0.6.6

## 0.3.1

### Patch Changes

- 16dd0cec: Only send model-value-changed if the event is caused by one of its children
- Updated dependencies [20ba0ca8]
- Updated dependencies [618f2698]
  - @lion/core@0.13.2
  - @lion/form-core@0.6.5

## 0.3.0

### Minor Changes

- c844c017: Add click on enter for options with href, to ensure that anchors are navigated towards, for example when applying LinkMixin to LionOption as part of a listbox.

### Patch Changes

- 9fcb67f0: Allow flexibility for extending the repropagation prevention conditions, which is needed for combobox, so that a model-value-changed event is propagated when no option matches after an input change. This allows validation to work properly e.g. for Required.
- Updated dependencies [2907649b]
- Updated dependencies [68e3e749]
- Updated dependencies [fd297a28]
- Updated dependencies [9fcb67f0]
- Updated dependencies [247e64a3]
- Updated dependencies [e92b98a4]
  - @lion/form-core@0.6.4
  - @lion/core@0.13.1

## 0.2.0

### Minor Changes

- d5faa459: Add reset function to listbox and all extentions

### Patch Changes

- d1c6b18c: no cancellation multi mouse click
- 17a0d6bf: add types
- Updated dependencies [d5faa459]
- Updated dependencies [0aa4480e]
  - @lion/form-core@0.6.3

## 0.1.2

### Patch Changes

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

- Updated dependencies [4b7bea96]
- Updated dependencies [01a798e5]
- Updated dependencies [a31b7217]
- Updated dependencies [85720654]
- Updated dependencies [32202a88]
- Updated dependencies [b9327627]
- Updated dependencies [02145a06]
  - @lion/form-core@0.6.2
  - @lion/core@0.13.0

## 0.1.1

### Patch Changes

- 27bc8058: Remove usage of public class fields

## 0.1.0

### Minor Changes

- 0ec72ac3: Adds a new listbox package. A listbox widget presents a list of options and allows a user to select one or more of them.

### Patch Changes

- Updated dependencies [75107a4b]
- Updated dependencies [60d5d1d3]
  - @lion/core@0.12.0
  - @lion/form-core@0.6.1
