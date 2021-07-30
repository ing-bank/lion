# Change Log

## 0.8.3

### Patch Changes

- Updated dependencies [04874352]
  - @lion/form-core@0.15.1
  - @lion/listbox@0.10.4

## 0.8.2

### Patch Changes

- Updated dependencies [8c06302e]
- Updated dependencies [8a766644]
- Updated dependencies [e87b6293]
  - @lion/core@0.18.2
  - @lion/form-core@0.15.0
  - @lion/listbox@0.10.3
  - @lion/overlays@0.28.3

## 0.8.1

### Patch Changes

- 84131205: use mdjs-preview in docs for lit compatibility
- Updated dependencies [dd1655e0]
- Updated dependencies [84131205]
  - @lion/listbox@0.10.2
  - @lion/form-core@0.14.2
  - @lion/core@0.18.1
  - @lion/overlays@0.28.2

## 0.8.0

### Minor Changes

- 159d6839: Better support when options change dynamically

### Patch Changes

- Updated dependencies [f320b8b4]
- Updated dependencies [c57f42a3]
  - @lion/form-core@0.14.1
  - @lion/listbox@0.10.1
  - @lion/overlays@0.28.1

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

- 6cdefd88: Add a new \_getTextboxValueFromOption method on LionCombobox, to be able to override how the modelValue is displayed in the textbox

### Patch Changes

- Updated dependencies [72067c0d]
  - @lion/core@0.18.0
  - @lion/form-core@0.14.0
  - @lion/listbox@0.10.0
  - @lion/overlays@0.28.0

## 0.6.1

### Patch Changes

- Updated dependencies [0ddd38c0]
- Updated dependencies [0ddd38c0]
  - @lion/form-core@0.13.0
  - @lion/listbox@0.9.0

## 0.6.0

### Minor Changes

- 6aa7fc29: automatically recompute autocompletion features when options change (needed for server side completion support)
- 02e4f2cb: add simulator to demos

### Patch Changes

- 351e9598: do not reopen listbox on focusin edge cases
- edb43c4e: syncs last selected choice value for [autocomplet="none|list"] on close
- Updated dependencies [239cce3b]
- Updated dependencies [d94d6bd8]
- Updated dependencies [11ec31c6]
- Updated dependencies [15146bf9]
- Updated dependencies [02e4f2cb]
- Updated dependencies [edb43c4e]
- Updated dependencies [c6fbe920]
  - @lion/overlays@0.27.0
  - @lion/listbox@0.8.0
  - @lion/form-core@0.12.0
  - @lion/core@0.17.0

## 0.5.1

### Patch Changes

- Updated dependencies [f2d9b8e2]
  - @lion/overlays@0.26.1

## 0.5.0

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
- 0dc706b6: Add clear() function combobox
- 991f1f54: **combobox**: enabled and fixed types
- e301ef96: ### Bug Fixes

  **combobox**: aria-expanded always applied on element with role=combobox

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
  - @lion/listbox@0.7.0
  - @lion/overlays@0.26.0

## 0.4.2

### Patch Changes

- 0e61e764: Fix combobox google demo

## 0.4.1

### Patch Changes

- 6ea02988: Always use ...styles and [css``] everywhere consistently, meaning an array of CSSResult. Makes it easier on TSC.
- Updated dependencies [6ea02988]
  - @lion/form-core@0.10.2
  - @lion/listbox@0.6.3
  - @lion/overlays@0.25.2

## 0.4.0

### Minor Changes

- 72a6ccc8: Allow Subclassers of LionCombobox to set '\_syncToTextboxCondition' in closing phase of overlay

  ## Fixes

  - form-core: allow an extra microtask in registration phase to make forms inside dialogs compatible.
  - combobox: open on focused when showAllOnEmpty

### Patch Changes

- 63e05c36: Combobox evaluates show condition after keyup(instead of keydown), so textbox value is updated
- Updated dependencies [72a6ccc8]
- Updated dependencies [ca15374a]
  - @lion/form-core@0.10.1
  - @lion/listbox@0.6.2

## 0.3.1

### Patch Changes

- Updated dependencies [13f808af]
- Updated dependencies [412270fa]
- Updated dependencies [aa478174]
- Updated dependencies [a809d7b5]
  - @lion/form-core@0.10.0
  - @lion/overlays@0.25.1
  - @lion/listbox@0.6.1

## 0.3.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- Updated dependencies [f3e54c56]
- Updated dependencies [af90b20e]
- Updated dependencies [5db622e9]
  - @lion/core@0.15.0
  - @lion/form-core@0.9.0
  - @lion/listbox@0.6.0
  - @lion/overlays@0.25.0

## 0.2.5

### Patch Changes

- dbacafa5: Type static get properties as {any} since the real class fields are typed separately and lit properties are just "configuring". Remove expect error.
- Updated dependencies [2e8e547c]
- Updated dependencies [dbacafa5]
  - @lion/overlays@0.24.2
  - @lion/form-core@0.8.5
  - @lion/listbox@0.5.5

## 0.2.4

### Patch Changes

- 6b91c92d: Remove .prototype accessor when accessing super.constructor from a constructor. This causes maximum call stack exceeded in latest chrome.
- 701aadce: Fix types of mixins to include LitElement static props and methods, and use Pick generic type instead of fake constructors.
- Updated dependencies [6b91c92d]
- Updated dependencies [701aadce]
  - @lion/form-core@0.8.4
  - @lion/listbox@0.5.4
  - @lion/overlays@0.24.1
  - @lion/core@0.14.1

## 0.2.3

### Patch Changes

- Updated dependencies [b2a1c1ef]
  - @lion/form-core@0.8.3
  - @lion/listbox@0.5.3

## 0.2.2

### Patch Changes

- Updated dependencies [d0b37e62]
  - @lion/form-core@0.8.2
  - @lion/listbox@0.5.2

## 0.2.1

### Patch Changes

- Updated dependencies [deb95d13]
  - @lion/form-core@0.8.1
  - @lion/listbox@0.5.1

## 0.2.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0
  - @lion/form-core@0.8.0
  - @lion/listbox@0.5.0
  - @lion/overlays@0.24.0

## 0.1.24

### Patch Changes

- Updated dependencies [a77452b0]
  - @lion/overlays@0.23.4

## 0.1.23

### Patch Changes

- Updated dependencies [a7b27502]
  - @lion/form-core@0.7.3
  - @lion/listbox@0.4.3

## 0.1.22

### Patch Changes

- Updated dependencies [77114753]
- Updated dependencies [f98aab23]
- Updated dependencies [f98aab23]
  - @lion/form-core@0.7.2
  - @lion/listbox@0.4.2

## 0.1.21

### Patch Changes

- 9112d243: Fix missing types and update to latest scoped elements to fix constructor type.
- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
- Updated dependencies [9352b577]
  - @lion/core@0.13.8
  - @lion/form-core@0.7.1
  - @lion/listbox@0.4.1
  - @lion/overlays@0.23.3

## 0.1.20

### Patch Changes

- Updated dependencies [a7760b64]
  - @lion/overlays@0.23.2

## 0.1.19

### Patch Changes

- Updated dependencies [a04ea59c]
  - @lion/overlays@0.23.1

## 0.1.18

### Patch Changes

- ef7ccbb9: Fix some type issues with static get styles, CSSResultArray combines CSSResult and CSSResult[].

## 0.1.17

### Patch Changes

- 5302ec89: Minimise dependencies by removing integration demos to form-integrations and form-core packages.
- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [5302ec89]
- Updated dependencies [1f62ed8b]
- Updated dependencies [98f1bb7e]
- Updated dependencies [53d22a85]
- Updated dependencies [a8cf4215]
  - @lion/form-core@0.7.0
  - @lion/listbox@0.4.0
  - @lion/overlays@0.23.0
  - @lion/core@0.13.7

## 0.1.16

### Patch Changes

- Updated dependencies [9fba9007]
- Updated dependencies [80031f66]
  - @lion/core@0.13.6
  - @lion/overlays@0.22.8
  - @lion/form-core@0.6.14
  - @lion/listbox@0.3.12

## 0.1.15

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5
  - @lion/form-core@0.6.13
  - @lion/listbox@0.3.11
  - @lion/overlays@0.22.7

## 0.1.14

### Patch Changes

- Updated dependencies [de536282]
- Updated dependencies [11e8dbcb]
  - @lion/overlays@0.22.6

## 0.1.13

### Patch Changes

- Updated dependencies [83359ac2]
- Updated dependencies [7709d7c2]
- Updated dependencies [3c2a33a7]
- Updated dependencies [2eeace23]
  - @lion/overlays@0.22.5
  - @lion/listbox@0.3.10

## 0.1.12

### Patch Changes

- Updated dependencies [5553e43e]
  - @lion/form-core@0.6.12
  - @lion/listbox@0.3.9
  - @lion/overlays@0.22.4

## 0.1.11

### Patch Changes

- Updated dependencies [aa8ad0e6]
- Updated dependencies [9142a53d]
- Updated dependencies [4bacc17b]
- Updated dependencies [3944c5e8]
  - @lion/form-core@0.6.11
  - @lion/overlays@0.22.3
  - @lion/listbox@0.3.8

## 0.1.10

### Patch Changes

- Updated dependencies [c5c4d4ba]
  - @lion/form-core@0.6.10
  - @lion/listbox@0.3.7

## 0.1.9

### Patch Changes

- Updated dependencies [cf0967fe]
  - @lion/form-core@0.6.9
  - @lion/listbox@0.3.6

## 0.1.8

### Patch Changes

- Updated dependencies [b222fd78]
  - @lion/form-core@0.6.8
  - @lion/listbox@0.3.5
  - @lion/overlays@0.22.2

## 0.1.7

### Patch Changes

- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4
  - @lion/form-core@0.6.7
  - @lion/listbox@0.3.4
  - @lion/overlays@0.22.1

## 0.1.6

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

- Updated dependencies [9c3224b4]
- Updated dependencies [fff79915]
- Updated dependencies [4f1e6d0d]
  - @lion/overlays@0.22.0
  - @lion/listbox@0.3.3

## 0.1.5

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3
  - @lion/form-core@0.6.6
  - @lion/listbox@0.3.2
  - @lion/overlays@0.21.3

## 0.1.4

### Patch Changes

- 618f2698: Run tests also on webkit
- Updated dependencies [20ba0ca8]
- Updated dependencies [618f2698]
- Updated dependencies [16dd0cec]
  - @lion/core@0.13.2
  - @lion/form-core@0.6.5
  - @lion/listbox@0.3.1
  - @lion/overlays@0.21.2

## 0.1.3

### Patch Changes

- 9fcb67f0: Allow flexibility for extending the repropagation prevention conditions, which is needed for combobox, so that a model-value-changed event is propagated when no option matches after an input change. This allows validation to work properly e.g. for Required.
- 7e915f94: Allow background customization of native input
- Updated dependencies [2907649b]
- Updated dependencies [c844c017]
- Updated dependencies [bdf1cfb2]
- Updated dependencies [68e3e749]
- Updated dependencies [fd297a28]
- Updated dependencies [9fcb67f0]
- Updated dependencies [247e64a3]
- Updated dependencies [e92b98a4]
  - @lion/form-core@0.6.4
  - @lion/listbox@0.3.0
  - @lion/overlays@0.21.1
  - @lion/core@0.13.1

## 0.1.2

### Patch Changes

- 533417f2: form-control class to correct node
- 928a673a: Add a new option showAllOnEmpty which shows the full list if the input has an empty value
- 6679fe77: Types button and combobox
- c76c0786: add inherited styles in combobox (aria 1.1) \_inputNode to allow styling
- Updated dependencies [d83f7fc5]
- Updated dependencies [d1c6b18c]
- Updated dependencies [d5faa459]
- Updated dependencies [17a0d6bf]
- Updated dependencies [a4c4f1ee]
- Updated dependencies [d5faa459]
- Updated dependencies [0aa4480e]
  - @lion/overlays@0.21.0
  - @lion/listbox@0.2.0
  - @lion/form-core@0.6.3

## 0.1.1

### Patch Changes

- 0ebca5b4: Combobox api, demo and ux improvements

  - renamed `filterOptionCondition` (similarity to `match-mode`, since this is basically an override)
  - demos for `matchCondition`
  - inline autocompletion edge cases solved (that would be inconsistent ux otherwise)
  - demos took a long time render: introduced a lazyRender directive that only adds (expensive) lionOptions after first meaningful paint has happened
  - made clearer from the code that selectionDisplay component is for demo purposes only at this moment

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

### Patch Changes

- Updated dependencies [27879863]
- Updated dependencies [4b7bea96]
- Updated dependencies [01a798e5]
- Updated dependencies [a9d6971c]
- Updated dependencies [a31b7217]
- Updated dependencies [85720654]
- Updated dependencies [32202a88]
- Updated dependencies [b9327627]
- Updated dependencies [02145a06]
  - @lion/overlays@0.20.0
  - @lion/form-core@0.6.2
  - @lion/core@0.13.0
  - @lion/listbox@0.1.2
