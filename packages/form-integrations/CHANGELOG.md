# Change Log

## 0.9.1

### Patch Changes

- f320b8b4: use customElementRegistry from component registry for slots used via SlotMixin
- Updated dependencies [159d6839]
- Updated dependencies [f320b8b4]
- Updated dependencies [077113ba]
- Updated dependencies [5ca3d275]
  - @lion/combobox@0.8.0
  - @lion/form-core@0.14.1
  - @lion/listbox@0.10.1
  - @lion/select-rich@0.27.1
  - @lion/switch@0.17.1
  - @lion/localize@0.20.1
  - @lion/checkbox-group@0.18.1
  - @lion/fieldset@0.19.3
  - @lion/input@0.15.1
  - @lion/input-amount@0.14.1
  - @lion/input-date@0.12.3
  - @lion/input-datepicker@0.23.1
  - @lion/input-email@0.13.3
  - @lion/input-iban@0.16.1
  - @lion/input-stepper@0.6.1
  - @lion/radio-group@0.18.1
  - @lion/select@0.14.1
  - @lion/textarea@0.13.1
  - @lion/validate-messages@0.7.1
  - @lion/input-range@0.10.2
  - @lion/form@0.12.1

## 0.9.0

### Minor Changes

- 57b2fb9f: - BREAKING: In `lion-button` package split of separate buttons for reset & submit:

  - LionButton (a clean fundament, **use outside forms**)
  - LionButtonReset (logic for. submit and reset events, but without implicit form submission logic: **use for reset buttons**)
  - LionButtonSubmit (full featured button: **use for submit buttons and buttons with dynamic types**)

  - fixed axe criterium for LionButton (which contained a native button to support form submission)
  - removed `_beforeTemplate()` & `_afterTemplate()` from LionButton

### Patch Changes

- Updated dependencies [57b2fb9f]
  - @lion/button@0.14.0
  - @lion/select-rich@0.27.0

## 0.8.0

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
- Updated dependencies [6cdefd88]
  - @lion/button@0.13.0
  - @lion/checkbox-group@0.18.0
  - @lion/combobox@0.7.0
  - @lion/core@0.18.0
  - @lion/form@0.12.0
  - @lion/form-core@0.14.0
  - @lion/input@0.15.0
  - @lion/input-amount@0.14.0
  - @lion/input-datepicker@0.23.0
  - @lion/input-iban@0.16.0
  - @lion/input-stepper@0.6.0
  - @lion/listbox@0.10.0
  - @lion/localize@0.20.0
  - @lion/radio-group@0.18.0
  - @lion/select@0.14.0
  - @lion/select-rich@0.26.0
  - @lion/switch@0.17.0
  - @lion/textarea@0.13.0
  - @lion/validate-messages@0.7.0
  - @lion/fieldset@0.19.2
  - @lion/input-date@0.12.2
  - @lion/input-email@0.13.2
  - @lion/input-range@0.10.1

## 0.7.1

### Patch Changes

- Updated dependencies [e297c2e1]
- Updated dependencies [0ddd38c0]
- Updated dependencies [0ddd38c0]
- Updated dependencies [0ddd38c0]
  - @lion/switch@0.16.1
  - @lion/form-core@0.13.0
  - @lion/input-range@0.10.0
  - @lion/listbox@0.9.0
  - @lion/radio-group@0.17.0
  - @lion/select@0.13.0
  - @lion/input-date@0.12.1
  - @lion/checkbox-group@0.17.1
  - @lion/combobox@0.6.1
  - @lion/fieldset@0.19.1
  - @lion/input@0.14.1
  - @lion/input-amount@0.13.1
  - @lion/input-datepicker@0.22.1
  - @lion/input-email@0.13.1
  - @lion/input-iban@0.15.1
  - @lion/input-stepper@0.5.1
  - @lion/select-rich@0.25.1
  - @lion/textarea@0.12.1
  - @lion/validate-messages@0.6.1
  - @lion/form@0.11.1

## 0.7.0

### Minor Changes

- 02e4f2cb: add simulator to demos

### Patch Changes

- Updated dependencies [d94d6bd8]
- Updated dependencies [351e9598]
- Updated dependencies [0fc206bf]
- Updated dependencies [756a1384]
- Updated dependencies [6aa7fc29]
- Updated dependencies [11ec31c6]
- Updated dependencies [15146bf9]
- Updated dependencies [eae38926]
- Updated dependencies [02e4f2cb]
- Updated dependencies [edb43c4e]
- Updated dependencies [c6fbe920]
  - @lion/listbox@0.8.0
  - @lion/combobox@0.6.0
  - @lion/input-iban@0.15.0
  - @lion/input-amount@0.13.0
  - @lion/form-core@0.12.0
  - @lion/input-datepicker@0.22.0
  - @lion/button@0.12.0
  - @lion/checkbox-group@0.17.0
  - @lion/core@0.17.0
  - @lion/fieldset@0.19.0
  - @lion/form@0.11.0
  - @lion/input@0.14.0
  - @lion/input-date@0.12.0
  - @lion/input-email@0.13.0
  - @lion/input-range@0.9.0
  - @lion/input-stepper@0.5.0
  - @lion/localize@0.19.0
  - @lion/radio-group@0.16.0
  - @lion/select@0.12.0
  - @lion/select-rich@0.25.0
  - @lion/switch@0.16.0
  - @lion/textarea@0.12.0
  - @lion/validate-messages@0.6.0

## 0.6.2

### Patch Changes

- Updated dependencies [f0527583]
  - @lion/button@0.11.1
  - @lion/input-date@0.11.1
  - @lion/input-datepicker@0.21.2
  - @lion/input@0.13.1
  - @lion/select-rich@0.24.2
  - @lion/select@0.11.1
  - @lion/checkbox-group@0.16.2
  - @lion/input-amount@0.12.1
  - @lion/input-email@0.12.1
  - @lion/input-iban@0.14.1
  - @lion/input-range@0.8.1
  - @lion/input-stepper@0.4.1
  - @lion/radio-group@0.15.1

## 0.6.1

### Patch Changes

- Updated dependencies [b77a038d]
  - @lion/checkbox-group@0.16.1
  - @lion/combobox@0.5.1
  - @lion/input-datepicker@0.21.1
  - @lion/select-rich@0.24.1

## 0.6.0

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

- 38297d07: ## Bug fixes

  **form-core**: registrationComplete callback executed before initial interaction states are computed

- 77a04245: add protected and private type info
- 6ae7a5e3: Add `clear()` interface to choiceGroups
- Updated dependencies [38297d07]
- Updated dependencies [3b5ed322]
- Updated dependencies [97b8592c]
- Updated dependencies [77a04245]
- Updated dependencies [53167fd2]
- Updated dependencies [d4dcb7c1]
- Updated dependencies [0dc706b6]
- Updated dependencies [181a1d45]
- Updated dependencies [fb1522dd]
- Updated dependencies [75af80be]
- Updated dependencies [652f267b]
- Updated dependencies [0e910e3f]
- Updated dependencies [991f1f54]
- Updated dependencies [cc02ae24]
- Updated dependencies [e301ef96]
- Updated dependencies [43e4bb81]
- Updated dependencies [6ae7a5e3]
  - @lion/form-core@0.11.0
  - @lion/checkbox-group@0.16.0
  - @lion/fieldset@0.18.0
  - @lion/form@0.10.0
  - @lion/input-amount@0.12.0
  - @lion/input-date@0.11.0
  - @lion/input-datepicker@0.21.0
  - @lion/input-email@0.12.0
  - @lion/input-iban@0.14.0
  - @lion/input-range@0.8.0
  - @lion/input-stepper@0.4.0
  - @lion/radio-group@0.15.0
  - @lion/button@0.11.0
  - @lion/combobox@0.5.0
  - @lion/core@0.16.0
  - @lion/input@0.13.0
  - @lion/listbox@0.7.0
  - @lion/localize@0.18.0
  - @lion/select@0.11.0
  - @lion/select-rich@0.24.0
  - @lion/switch@0.15.0
  - @lion/textarea@0.11.0
  - @lion/validate-messages@0.5.4

## 0.5.4

### Patch Changes

- Updated dependencies [0e61e764]
  - @lion/combobox@0.4.2

## 0.5.3

### Patch Changes

- Updated dependencies [6ea02988]
  - @lion/checkbox-group@0.15.3
  - @lion/combobox@0.4.1
  - @lion/form-core@0.10.2
  - @lion/input-amount@0.11.2
  - @lion/input-stepper@0.3.3
  - @lion/listbox@0.6.3
  - @lion/switch@0.14.3
  - @lion/textarea@0.10.3
  - @lion/fieldset@0.17.3
  - @lion/input@0.12.3
  - @lion/input-date@0.10.3
  - @lion/input-datepicker@0.20.3
  - @lion/input-email@0.11.3
  - @lion/input-iban@0.13.3
  - @lion/radio-group@0.14.3
  - @lion/select@0.10.3
  - @lion/select-rich@0.23.3
  - @lion/validate-messages@0.5.3
  - @lion/form@0.9.3
  - @lion/input-range@0.7.3

## 0.5.2

### Patch Changes

- 72a6ccc8: Allow Subclassers of LionCombobox to set '\_syncToTextboxCondition' in closing phase of overlay

  ## Fixes

  - form-core: allow an extra microtask in registration phase to make forms inside dialogs compatible.
  - combobox: open on focused when showAllOnEmpty

- Updated dependencies [72a6ccc8]
- Updated dependencies [63e05c36]
- Updated dependencies [ca15374a]
  - @lion/combobox@0.4.0
  - @lion/form-core@0.10.1
  - @lion/listbox@0.6.2
  - @lion/checkbox-group@0.15.2
  - @lion/fieldset@0.17.2
  - @lion/input@0.12.2
  - @lion/input-amount@0.11.1
  - @lion/input-date@0.10.2
  - @lion/input-datepicker@0.20.2
  - @lion/input-email@0.11.2
  - @lion/input-iban@0.13.2
  - @lion/input-stepper@0.3.2
  - @lion/radio-group@0.14.2
  - @lion/select@0.10.2
  - @lion/select-rich@0.23.2
  - @lion/switch@0.14.2
  - @lion/textarea@0.10.2
  - @lion/validate-messages@0.5.2
  - @lion/form@0.9.2
  - @lion/input-range@0.7.2

## 0.5.1

### Patch Changes

- Updated dependencies [59dad284]
- Updated dependencies [13f808af]
- Updated dependencies [3aa47833]
- Updated dependencies [aa478174]
- Updated dependencies [13f808af]
- Updated dependencies [a809d7b5]
  - @lion/button@0.10.1
  - @lion/switch@0.14.1
  - @lion/form-core@0.10.0
  - @lion/checkbox-group@0.15.1
  - @lion/input-amount@0.11.0
  - @lion/select-rich@0.23.1
  - @lion/input-datepicker@0.20.1
  - @lion/combobox@0.3.1
  - @lion/fieldset@0.17.1
  - @lion/input@0.12.1
  - @lion/input-date@0.10.1
  - @lion/input-email@0.11.1
  - @lion/input-iban@0.13.1
  - @lion/input-stepper@0.3.1
  - @lion/listbox@0.6.1
  - @lion/radio-group@0.14.1
  - @lion/select@0.10.1
  - @lion/textarea@0.10.1
  - @lion/validate-messages@0.5.1
  - @lion/form@0.9.1
  - @lion/input-range@0.7.1

## 0.5.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- Updated dependencies [f3e54c56]
- Updated dependencies [af90b20e]
- Updated dependencies [5db622e9]
  - @lion/button@0.10.0
  - @lion/checkbox-group@0.15.0
  - @lion/combobox@0.3.0
  - @lion/core@0.15.0
  - @lion/fieldset@0.17.0
  - @lion/form@0.9.0
  - @lion/form-core@0.9.0
  - @lion/input@0.12.0
  - @lion/input-amount@0.10.0
  - @lion/input-date@0.10.0
  - @lion/input-datepicker@0.20.0
  - @lion/input-email@0.11.0
  - @lion/input-iban@0.13.0
  - @lion/input-range@0.7.0
  - @lion/input-stepper@0.3.0
  - @lion/listbox@0.6.0
  - @lion/localize@0.17.0
  - @lion/radio-group@0.14.0
  - @lion/select@0.10.0
  - @lion/select-rich@0.23.0
  - @lion/switch@0.14.0
  - @lion/textarea@0.10.0
  - @lion/validate-messages@0.5.0

## 0.4.5

### Patch Changes

- Updated dependencies [dbacafa5]
  - @lion/combobox@0.2.5
  - @lion/form-core@0.8.5
  - @lion/input@0.11.5
  - @lion/input-amount@0.9.5
  - @lion/input-date@0.9.5
  - @lion/input-datepicker@0.19.5
  - @lion/input-range@0.6.5
  - @lion/input-stepper@0.2.5
  - @lion/select-rich@0.22.5
  - @lion/textarea@0.9.5
  - @lion/checkbox-group@0.14.5
  - @lion/fieldset@0.16.5
  - @lion/input-email@0.10.5
  - @lion/input-iban@0.12.5
  - @lion/listbox@0.5.5
  - @lion/radio-group@0.13.5
  - @lion/select@0.9.5
  - @lion/switch@0.13.5
  - @lion/validate-messages@0.4.5
  - @lion/form@0.8.5

## 0.4.4

### Patch Changes

- Updated dependencies [6b91c92d]
- Updated dependencies [701aadce]
  - @lion/checkbox-group@0.14.4
  - @lion/combobox@0.2.4
  - @lion/form-core@0.8.4
  - @lion/listbox@0.5.4
  - @lion/select-rich@0.22.4
  - @lion/core@0.14.1
  - @lion/input-datepicker@0.19.4
  - @lion/localize@0.16.1
  - @lion/fieldset@0.16.4
  - @lion/input@0.11.4
  - @lion/input-amount@0.9.4
  - @lion/input-date@0.9.4
  - @lion/input-email@0.10.4
  - @lion/input-iban@0.12.4
  - @lion/input-stepper@0.2.4
  - @lion/radio-group@0.13.4
  - @lion/select@0.9.4
  - @lion/switch@0.13.4
  - @lion/textarea@0.9.4
  - @lion/validate-messages@0.4.4
  - @lion/button@0.9.1
  - @lion/input-range@0.6.4
  - @lion/form@0.8.4

## 0.4.3

### Patch Changes

- Updated dependencies [b2a1c1ef]
  - @lion/form-core@0.8.3
  - @lion/checkbox-group@0.14.3
  - @lion/combobox@0.2.3
  - @lion/fieldset@0.16.3
  - @lion/input@0.11.3
  - @lion/input-amount@0.9.3
  - @lion/input-date@0.9.3
  - @lion/input-datepicker@0.19.3
  - @lion/input-email@0.10.3
  - @lion/input-iban@0.12.3
  - @lion/input-stepper@0.2.3
  - @lion/listbox@0.5.3
  - @lion/radio-group@0.13.3
  - @lion/select@0.9.3
  - @lion/select-rich@0.22.3
  - @lion/switch@0.13.3
  - @lion/textarea@0.9.3
  - @lion/validate-messages@0.4.3
  - @lion/form@0.8.3
  - @lion/input-range@0.6.3

## 0.4.2

### Patch Changes

- Updated dependencies [d0b37e62]
  - @lion/form-core@0.8.2
  - @lion/checkbox-group@0.14.2
  - @lion/combobox@0.2.2
  - @lion/fieldset@0.16.2
  - @lion/input@0.11.2
  - @lion/input-amount@0.9.2
  - @lion/input-date@0.9.2
  - @lion/input-datepicker@0.19.2
  - @lion/input-email@0.10.2
  - @lion/input-iban@0.12.2
  - @lion/input-stepper@0.2.2
  - @lion/listbox@0.5.2
  - @lion/radio-group@0.13.2
  - @lion/select@0.9.2
  - @lion/select-rich@0.22.2
  - @lion/switch@0.13.2
  - @lion/textarea@0.9.2
  - @lion/validate-messages@0.4.2
  - @lion/form@0.8.2
  - @lion/input-range@0.6.2

## 0.4.1

### Patch Changes

- Updated dependencies [deb95d13]
  - @lion/form-core@0.8.1
  - @lion/listbox@0.5.1
  - @lion/select-rich@0.22.1
  - @lion/switch@0.13.1
  - @lion/checkbox-group@0.14.1
  - @lion/combobox@0.2.1
  - @lion/fieldset@0.16.1
  - @lion/input@0.11.1
  - @lion/input-amount@0.9.1
  - @lion/input-date@0.9.1
  - @lion/input-datepicker@0.19.1
  - @lion/input-email@0.10.1
  - @lion/input-iban@0.12.1
  - @lion/input-stepper@0.2.1
  - @lion/radio-group@0.13.1
  - @lion/select@0.9.1
  - @lion/textarea@0.9.1
  - @lion/validate-messages@0.4.1
  - @lion/form@0.8.1
  - @lion/input-range@0.6.1

## 0.4.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/button@0.9.0
  - @lion/checkbox-group@0.14.0
  - @lion/combobox@0.2.0
  - @lion/core@0.14.0
  - @lion/fieldset@0.16.0
  - @lion/form@0.8.0
  - @lion/form-core@0.8.0
  - @lion/input@0.11.0
  - @lion/input-amount@0.9.0
  - @lion/input-date@0.9.0
  - @lion/input-datepicker@0.19.0
  - @lion/input-email@0.10.0
  - @lion/input-iban@0.12.0
  - @lion/input-range@0.6.0
  - @lion/input-stepper@0.2.0
  - @lion/listbox@0.5.0
  - @lion/localize@0.16.0
  - @lion/radio-group@0.13.0
  - @lion/select@0.9.0
  - @lion/select-rich@0.22.0
  - @lion/switch@0.13.0
  - @lion/textarea@0.9.0
  - @lion/validate-messages@0.4.0

## 0.3.30

### Patch Changes

- Updated dependencies [33f639e8]
- Updated dependencies [1a5e353f]
  - @lion/button@0.8.11
  - @lion/form@0.7.18
  - @lion/select-rich@0.21.28
  - @lion/combobox@0.1.24
  - @lion/input-datepicker@0.18.18

## 0.3.29

### Patch Changes

- Updated dependencies [a7b27502]
  - @lion/form-core@0.7.3
  - @lion/checkbox-group@0.13.1
  - @lion/combobox@0.1.23
  - @lion/fieldset@0.15.16
  - @lion/input@0.10.16
  - @lion/input-amount@0.8.16
  - @lion/input-date@0.8.16
  - @lion/input-datepicker@0.18.17
  - @lion/input-email@0.9.16
  - @lion/input-iban@0.11.6
  - @lion/input-stepper@0.1.17
  - @lion/listbox@0.4.3
  - @lion/radio-group@0.12.16
  - @lion/select@0.8.16
  - @lion/select-rich@0.21.27
  - @lion/switch@0.12.17
  - @lion/textarea@0.8.16
  - @lion/validate-messages@0.3.16
  - @lion/form@0.7.17
  - @lion/input-range@0.5.16

## 0.3.28

### Patch Changes

- Updated dependencies [77114753]
- Updated dependencies [8d2b2513]
- Updated dependencies [f98aab23]
- Updated dependencies [f98aab23]
  - @lion/form-core@0.7.2
  - @lion/checkbox-group@0.13.0
  - @lion/listbox@0.4.2
  - @lion/switch@0.12.16
  - @lion/combobox@0.1.22
  - @lion/fieldset@0.15.15
  - @lion/input@0.10.15
  - @lion/input-amount@0.8.15
  - @lion/input-date@0.8.15
  - @lion/input-datepicker@0.18.16
  - @lion/input-email@0.9.15
  - @lion/input-iban@0.11.5
  - @lion/input-stepper@0.1.16
  - @lion/radio-group@0.12.15
  - @lion/select@0.8.15
  - @lion/select-rich@0.21.26
  - @lion/textarea@0.8.15
  - @lion/validate-messages@0.3.15
  - @lion/form@0.7.16
  - @lion/input-range@0.5.15

## 0.3.27

### Patch Changes

- @lion/switch@0.12.15

## 0.3.26

### Patch Changes

- 9112d243: Fix missing types and update to latest scoped elements to fix constructor type.
- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/checkbox-group@0.12.14
  - @lion/core@0.13.8
  - @lion/fieldset@0.15.14
  - @lion/form-core@0.7.1
  - @lion/input-date@0.8.14
  - @lion/input-datepicker@0.18.15
  - @lion/input-email@0.9.14
  - @lion/input-iban@0.11.4
  - @lion/listbox@0.4.1
  - @lion/localize@0.15.5
  - @lion/radio-group@0.12.14
  - @lion/select-rich@0.21.25
  - @lion/switch@0.12.14
  - @lion/combobox@0.1.21
  - @lion/button@0.8.10
  - @lion/input-amount@0.8.14
  - @lion/input-range@0.5.14
  - @lion/input-stepper@0.1.15
  - @lion/select@0.8.14
  - @lion/textarea@0.8.14
  - @lion/form@0.7.15
  - @lion/input@0.10.14
  - @lion/validate-messages@0.3.14

## 0.3.25

### Patch Changes

- @lion/combobox@0.1.20
- @lion/input-datepicker@0.18.14
- @lion/select-rich@0.21.24

## 0.3.24

### Patch Changes

- Updated dependencies [fcc60cbf]
  - @lion/form@0.7.14
  - @lion/combobox@0.1.19
  - @lion/input-datepicker@0.18.13
  - @lion/select-rich@0.21.23

## 0.3.23

### Patch Changes

- Updated dependencies [3fefc359]
- Updated dependencies [3fefc359]
- Updated dependencies [ef7ccbb9]
  - @lion/button@0.8.9
  - @lion/select-rich@0.21.22
  - @lion/combobox@0.1.18

## 0.3.22

### Patch Changes

- a8cf4215: Improved localize DX by making it clear from source code structure what are main (exported) functions and what are util/helper functions consumed by those main functions.
  Added Chrome Intl corrections for Philippine currency names and en-GB short month names.
- 5302ec89: Minimise dependencies by removing integration demos to form-integrations and form-core packages.
- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [9b9db3dd]
- Updated dependencies [a8cf4215]
- Updated dependencies [5302ec89]
- Updated dependencies [98f1bb7e]
- Updated dependencies [a8cf4215]
- Updated dependencies [718843e5]
  - @lion/select-rich@0.21.21
  - @lion/localize@0.15.4
  - @lion/checkbox-group@0.12.13
  - @lion/combobox@0.1.17
  - @lion/fieldset@0.15.13
  - @lion/form@0.7.13
  - @lion/form-core@0.7.0
  - @lion/input@0.10.13
  - @lion/input-amount@0.8.13
  - @lion/input-range@0.5.13
  - @lion/input-stepper@0.1.14
  - @lion/listbox@0.4.0
  - @lion/radio-group@0.12.13
  - @lion/select@0.8.13
  - @lion/textarea@0.8.13
  - @lion/validate-messages@0.3.13
  - @lion/button@0.8.8
  - @lion/core@0.13.7
  - @lion/input-date@0.8.13
  - @lion/input-datepicker@0.18.12
  - @lion/input-email@0.9.13
  - @lion/input-iban@0.11.3
  - @lion/switch@0.12.13

## 0.3.21

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6
  - @lion/button@0.8.7
  - @lion/checkbox-group@0.12.12
  - @lion/fieldset@0.15.12
  - @lion/form@0.7.12
  - @lion/form-core@0.6.14
  - @lion/input@0.10.12
  - @lion/input-date@0.8.12
  - @lion/input-datepicker@0.18.11
  - @lion/input-email@0.9.12
  - @lion/input-iban@0.11.2
  - @lion/input-range@0.5.12
  - @lion/localize@0.15.3
  - @lion/radio-group@0.12.12
  - @lion/select@0.8.12
  - @lion/select-rich@0.21.20
  - @lion/textarea@0.8.12
  - @lion/validate-messages@0.3.12

## 0.3.20

### Patch Changes

- Updated dependencies [ad2f90f4]
- Updated dependencies [41edf033]
  - @lion/select-rich@0.21.19
  - @lion/core@0.13.5
  - @lion/input-datepicker@0.18.10
  - @lion/button@0.8.6
  - @lion/checkbox-group@0.12.11
  - @lion/fieldset@0.15.11
  - @lion/form@0.7.11
  - @lion/form-core@0.6.13
  - @lion/input@0.10.11
  - @lion/input-date@0.8.11
  - @lion/input-email@0.9.11
  - @lion/input-iban@0.11.1
  - @lion/input-range@0.5.11
  - @lion/localize@0.15.2
  - @lion/radio-group@0.12.11
  - @lion/select@0.8.11
  - @lion/textarea@0.8.11
  - @lion/validate-messages@0.3.11

## 0.3.19

### Patch Changes

- Updated dependencies [c8e73457]
  - @lion/input-iban@0.11.0
  - @lion/input-datepicker@0.18.9
  - @lion/select-rich@0.21.18

## 0.3.18

### Patch Changes

- @lion/input-datepicker@0.18.8
- @lion/select-rich@0.21.17

## 0.3.17

### Patch Changes

- Updated dependencies [5553e43e]
  - @lion/form-core@0.6.12
  - @lion/checkbox-group@0.12.10
  - @lion/fieldset@0.15.10
  - @lion/input@0.10.10
  - @lion/input-date@0.8.10
  - @lion/input-datepicker@0.18.7
  - @lion/input-email@0.9.10
  - @lion/input-iban@0.10.10
  - @lion/input-range@0.5.10
  - @lion/radio-group@0.12.10
  - @lion/select@0.8.10
  - @lion/select-rich@0.21.16
  - @lion/textarea@0.8.10
  - @lion/validate-messages@0.3.10
  - @lion/form@0.7.10

## 0.3.16

### Patch Changes

- @lion/input-datepicker@0.18.6

## 0.3.15

### Patch Changes

- Updated dependencies [aa8ad0e6]
- Updated dependencies [1981eb0d]
- Updated dependencies [4bacc17b]
  - @lion/checkbox-group@0.12.9
  - @lion/form-core@0.6.11
  - @lion/radio-group@0.12.9
  - @lion/input-datepicker@0.18.5
  - @lion/fieldset@0.15.9
  - @lion/input@0.10.9
  - @lion/input-date@0.8.9
  - @lion/input-email@0.9.9
  - @lion/input-iban@0.10.9
  - @lion/input-range@0.5.9
  - @lion/select@0.8.9
  - @lion/select-rich@0.21.15
  - @lion/textarea@0.8.9
  - @lion/validate-messages@0.3.9
  - @lion/localize@0.15.1
  - @lion/form@0.7.9

## 0.3.14

### Patch Changes

- Updated dependencies [27020f12]
- Updated dependencies [c5c4d4ba]
- Updated dependencies [3ada1aef]
  - @lion/button@0.8.5
  - @lion/form-core@0.6.10
  - @lion/localize@0.15.0
  - @lion/select-rich@0.21.14
  - @lion/checkbox-group@0.12.8
  - @lion/fieldset@0.15.8
  - @lion/input@0.10.8
  - @lion/input-date@0.8.8
  - @lion/input-datepicker@0.18.4
  - @lion/input-email@0.9.8
  - @lion/input-iban@0.10.8
  - @lion/input-range@0.5.8
  - @lion/radio-group@0.12.8
  - @lion/select@0.8.8
  - @lion/textarea@0.8.8
  - @lion/validate-messages@0.3.8
  - @lion/form@0.7.8

## 0.3.13

### Patch Changes

- Updated dependencies [cf0967fe]
  - @lion/form-core@0.6.9
  - @lion/checkbox-group@0.12.7
  - @lion/fieldset@0.15.7
  - @lion/input@0.10.7
  - @lion/input-date@0.8.7
  - @lion/input-datepicker@0.18.3
  - @lion/input-email@0.9.7
  - @lion/input-iban@0.10.7
  - @lion/input-range@0.5.7
  - @lion/radio-group@0.12.7
  - @lion/select@0.8.7
  - @lion/select-rich@0.21.13
  - @lion/textarea@0.8.7
  - @lion/validate-messages@0.3.7
  - @lion/form@0.7.7

## 0.3.12

### Patch Changes

- Updated dependencies [b222fd78]
  - @lion/form-core@0.6.8
  - @lion/checkbox-group@0.12.6
  - @lion/fieldset@0.15.6
  - @lion/input@0.10.6
  - @lion/input-date@0.8.6
  - @lion/input-datepicker@0.18.2
  - @lion/input-email@0.9.6
  - @lion/input-iban@0.10.6
  - @lion/input-range@0.5.6
  - @lion/radio-group@0.12.6
  - @lion/select@0.8.6
  - @lion/select-rich@0.21.12
  - @lion/textarea@0.8.6
  - @lion/validate-messages@0.3.6
  - @lion/form@0.7.6

## 0.3.11

### Patch Changes

- Updated dependencies [cfbcccb5]
  - @lion/checkbox-group@0.12.5
  - @lion/core@0.13.4
  - @lion/form@0.7.5
  - @lion/form-core@0.6.7
  - @lion/input-date@0.8.5
  - @lion/input-datepicker@0.18.1
  - @lion/input-email@0.9.5
  - @lion/input-iban@0.10.5
  - @lion/input-range@0.5.5
  - @lion/radio-group@0.12.5
  - @lion/textarea@0.8.5
  - @lion/button@0.8.4
  - @lion/fieldset@0.15.5
  - @lion/input@0.10.5
  - @lion/localize@0.14.9
  - @lion/select@0.8.5
  - @lion/select-rich@0.21.11
  - @lion/validate-messages@0.3.5

## 0.3.10

### Patch Changes

- Updated dependencies [9c3224b4]
  - @lion/input-datepicker@0.18.0
  - @lion/select-rich@0.21.10

## 0.3.9

### Patch Changes

- Updated dependencies [e2e4deec]
- Updated dependencies [8ca71b8f]
  - @lion/core@0.13.3
  - @lion/localize@0.14.8
  - @lion/button@0.8.3
  - @lion/checkbox-group@0.12.4
  - @lion/fieldset@0.15.4
  - @lion/form@0.7.4
  - @lion/form-core@0.6.6
  - @lion/input@0.10.4
  - @lion/input-date@0.8.4
  - @lion/input-datepicker@0.17.3
  - @lion/input-email@0.9.4
  - @lion/input-iban@0.10.4
  - @lion/input-range@0.5.4
  - @lion/radio-group@0.12.4
  - @lion/select@0.8.4
  - @lion/select-rich@0.21.9
  - @lion/textarea@0.8.4
  - @lion/validate-messages@0.3.4

## 0.3.8

### Patch Changes

- 618f2698: Run tests also on webkit
- Updated dependencies [20ba0ca8]
- Updated dependencies [618f2698]
  - @lion/core@0.13.2
  - @lion/localize@0.14.7
  - @lion/select-rich@0.21.8
  - @lion/form-core@0.6.5
  - @lion/form@0.7.3
  - @lion/input-date@0.8.3
  - @lion/input-datepicker@0.17.2
  - @lion/input@0.10.3
  - @lion/select@0.8.3
  - @lion/button@0.8.2
  - @lion/checkbox-group@0.12.3
  - @lion/fieldset@0.15.3
  - @lion/input-email@0.9.3
  - @lion/input-iban@0.10.3
  - @lion/input-range@0.5.3
  - @lion/radio-group@0.12.3
  - @lion/textarea@0.8.3
  - @lion/validate-messages@0.3.3

## 0.3.7

### Patch Changes

- Updated dependencies [b910d6f7]
  - @lion/button@0.8.1
  - @lion/select-rich@0.21.7

## 0.3.6

### Patch Changes

- 68e3e749: Add missing interaction states that could act as feedback conditions. Fix the interactive demo that showcases dynamic feedback conditions.
- 9fcb67f0: Allow flexibility for extending the repropagation prevention conditions, which is needed for combobox, so that a model-value-changed event is propagated when no option matches after an input change. This allows validation to work properly e.g. for Required.
- Updated dependencies [7682e520]
- Updated dependencies [2907649b]
- Updated dependencies [68e3e749]
- Updated dependencies [fd297a28]
- Updated dependencies [c3a581e2]
- Updated dependencies [9fcb67f0]
- Updated dependencies [247e64a3]
- Updated dependencies [e92b98a4]
- Updated dependencies [f7ab5391]
- Updated dependencies [1671c705]
- Updated dependencies [26b60593]
  - @lion/localize@0.14.6
  - @lion/form-core@0.6.4
  - @lion/textarea@0.8.2
  - @lion/core@0.13.1
  - @lion/button@0.8.0
  - @lion/select-rich@0.21.6
  - @lion/input-date@0.8.2
  - @lion/input-datepicker@0.17.1
  - @lion/input-email@0.9.2
  - @lion/input-iban@0.10.2
  - @lion/input-range@0.5.2
  - @lion/validate-messages@0.3.2
  - @lion/checkbox-group@0.12.2
  - @lion/fieldset@0.15.2
  - @lion/input@0.10.2
  - @lion/radio-group@0.12.2
  - @lion/select@0.8.2
  - @lion/form@0.7.2

## 0.3.5

### Patch Changes

- Updated dependencies [e9cee039]
- Updated dependencies [d5faa459]
- Updated dependencies [17a0d6bf]
- Updated dependencies [0aa4480e]
- Updated dependencies [6679fe77]
- Updated dependencies [20469ce7]
  - @lion/input-datepicker@0.17.0
  - @lion/form-core@0.6.3
  - @lion/select-rich@0.21.5
  - @lion/fieldset@0.15.1
  - @lion/input@0.10.1
  - @lion/select@0.8.1
  - @lion/textarea@0.8.1
  - @lion/button@0.7.15
  - @lion/checkbox-group@0.12.1
  - @lion/input-date@0.8.1
  - @lion/input-email@0.9.1
  - @lion/input-iban@0.10.1
  - @lion/input-range@0.5.1
  - @lion/radio-group@0.12.1
  - @lion/validate-messages@0.3.1
  - @lion/form@0.7.1

## 0.3.4

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

- Updated dependencies [50287fba]
- Updated dependencies [e2d772f5]
- Updated dependencies [cfa2daf6]
- Updated dependencies [4b7bea96]
- Updated dependencies [01a798e5]
- Updated dependencies [30223d4c]
- Updated dependencies [a31b7217]
- Updated dependencies [6394c080]
- Updated dependencies [85720654]
- Updated dependencies [32202a88]
- Updated dependencies [9263f397]
- Updated dependencies [6f08e929]
- Updated dependencies [66c5f2cd]
- Updated dependencies [b9327627]
- Updated dependencies [02145a06]
- Updated dependencies [32202a88]
- Updated dependencies [98fa7ad6]
  - @lion/radio-group@0.12.0
  - @lion/select-rich@0.21.4
  - @lion/input-date@0.8.0
  - @lion/input-email@0.9.0
  - @lion/input-iban@0.10.0
  - @lion/input-range@0.5.0
  - @lion/form-core@0.6.2
  - @lion/core@0.13.0
  - @lion/validate-messages@0.3.0
  - @lion/input-datepicker@0.16.2
  - @lion/checkbox-group@0.12.0
  - @lion/fieldset@0.15.0
  - @lion/form@0.7.0
  - @lion/select@0.8.0
  - @lion/localize@0.14.5
  - @lion/input@0.10.0
  - @lion/textarea@0.8.0
  - @lion/button@0.7.14

## 0.3.3

### Patch Changes

- Updated dependencies [7e02c39a]
  - @lion/select-rich@0.21.3

## 0.3.2

### Patch Changes

- @lion/select-rich@0.21.2

## 0.3.1

### Patch Changes

- Updated dependencies [0ec72ac3]
- Updated dependencies [e42071d8]
- Updated dependencies [75107a4b]
- Updated dependencies [60d5d1d3]
  - @lion/select-rich@0.21.1
  - @lion/button@0.7.13
  - @lion/core@0.12.0
  - @lion/form-core@0.6.1
  - @lion/input-datepicker@0.16.1
  - @lion/checkbox-group@0.11.16
  - @lion/fieldset@0.14.9
  - @lion/form@0.6.23
  - @lion/input@0.9.2
  - @lion/input-date@0.7.23
  - @lion/input-email@0.8.23
  - @lion/input-iban@0.9.23
  - @lion/input-range@0.4.23
  - @lion/localize@0.14.4
  - @lion/radio-group@0.11.16
  - @lion/select@0.7.23
  - @lion/textarea@0.7.23
  - @lion/validate-messages@0.2.15

## 0.3.0

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
  - @lion/form-core@0.6.0
  - @lion/core@0.11.0
  - @lion/fieldset@0.14.8
  - @lion/select-rich@0.21.0
  - @lion/input-datepicker@0.16.0
  - @lion/checkbox-group@0.11.15
  - @lion/input@0.9.1
  - @lion/input-date@0.7.22
  - @lion/input-email@0.8.22
  - @lion/input-iban@0.9.22
  - @lion/input-range@0.4.22
  - @lion/radio-group@0.11.15
  - @lion/select@0.7.22
  - @lion/textarea@0.7.22
  - @lion/validate-messages@0.2.14
  - @lion/button@0.7.12
  - @lion/form@0.6.22
  - @lion/localize@0.14.3

## 0.2.7

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0
  - @lion/form-core@0.5.0
  - @lion/input@0.9.0
  - @lion/input-datepicker@0.15.0
  - @lion/select-rich@0.20.0
  - @lion/button@0.7.11
  - @lion/checkbox-group@0.11.14
  - @lion/fieldset@0.14.7
  - @lion/form@0.6.21
  - @lion/input-date@0.7.21
  - @lion/input-email@0.8.21
  - @lion/input-iban@0.9.21
  - @lion/input-range@0.4.21
  - @lion/localize@0.14.2
  - @lion/radio-group@0.11.14
  - @lion/select@0.7.21
  - @lion/textarea@0.7.21
  - @lion/validate-messages@0.2.13

## 0.2.6

### Patch Changes

- Updated dependencies [c347fce4]
  - @lion/fieldset@0.14.6
  - @lion/form-core@0.4.4
  - @lion/checkbox-group@0.11.13
  - @lion/form@0.6.20
  - @lion/radio-group@0.11.13
  - @lion/input@0.8.6
  - @lion/input-date@0.7.20
  - @lion/input-datepicker@0.14.24
  - @lion/input-email@0.8.20
  - @lion/input-iban@0.9.20
  - @lion/input-range@0.4.20
  - @lion/select@0.7.20
  - @lion/select-rich@0.19.6
  - @lion/textarea@0.7.20
  - @lion/validate-messages@0.2.12

## 0.2.5

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1
  - @lion/button@0.7.10
  - @lion/checkbox-group@0.11.12
  - @lion/fieldset@0.14.5
  - @lion/form@0.6.19
  - @lion/form-core@0.4.3
  - @lion/input@0.8.5
  - @lion/input-date@0.7.19
  - @lion/input-datepicker@0.14.23
  - @lion/input-email@0.8.19
  - @lion/input-iban@0.9.19
  - @lion/input-range@0.4.19
  - @lion/localize@0.14.1
  - @lion/radio-group@0.11.12
  - @lion/select@0.7.19
  - @lion/select-rich@0.19.5
  - @lion/textarea@0.7.19
  - @lion/validate-messages@0.2.11

## 0.2.4

### Patch Changes

- 07c598fd: Form should be able to access formattedValue of children
- Updated dependencies [dd021e43]
- Updated dependencies [07c598fd]
  - @lion/checkbox-group@0.11.11
  - @lion/fieldset@0.14.4
  - @lion/form@0.6.18
  - @lion/form-core@0.4.2
  - @lion/radio-group@0.11.11
  - @lion/select-rich@0.19.4
  - @lion/input@0.8.4
  - @lion/input-date@0.7.18
  - @lion/input-datepicker@0.14.22
  - @lion/input-email@0.8.18
  - @lion/input-iban@0.9.18
  - @lion/input-range@0.4.18
  - @lion/select@0.7.18
  - @lion/textarea@0.7.18
  - @lion/validate-messages@0.2.10

## 0.2.3

### Patch Changes

- Updated dependencies [fb236975]
  - @lion/form-core@0.4.1
  - @lion/checkbox-group@0.11.10
  - @lion/fieldset@0.14.3
  - @lion/input@0.8.3
  - @lion/input-date@0.7.17
  - @lion/input-datepicker@0.14.21
  - @lion/input-email@0.8.17
  - @lion/input-iban@0.9.17
  - @lion/input-range@0.4.17
  - @lion/radio-group@0.11.10
  - @lion/select@0.7.17
  - @lion/select-rich@0.19.3
  - @lion/textarea@0.7.17
  - @lion/validate-messages@0.2.9
  - @lion/form@0.6.17

## 0.2.2

### Patch Changes

- Updated dependencies [3c61fd29]
- Updated dependencies [09d96759]
- Updated dependencies [7742e2ea]
- Updated dependencies [9ecab4d5]
  - @lion/form-core@0.4.0
  - @lion/core@0.9.0
  - @lion/fieldset@0.14.2
  - @lion/localize@0.14.0
  - @lion/select-rich@0.19.2
  - @lion/checkbox-group@0.11.9
  - @lion/input@0.8.2
  - @lion/input-date@0.7.16
  - @lion/input-datepicker@0.14.20
  - @lion/input-email@0.8.16
  - @lion/input-iban@0.9.16
  - @lion/input-range@0.4.16
  - @lion/radio-group@0.11.9
  - @lion/select@0.7.16
  - @lion/textarea@0.7.16
  - @lion/validate-messages@0.2.8
  - @lion/button@0.7.9
  - @lion/form@0.6.16

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.2.0...@lion/form-integrations@0.2.1) (2020-07-28)

**Note:** Version bump only for package @lion/form-integrations

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.22...@lion/form-integrations@0.2.0) (2020-07-27)

### Features

- synchronous form registration system ([8698f73](https://github.com/ing-bank/lion/commit/8698f734186eb88c4669bbadf8d5ae461f1c27f5))

## [0.1.22](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.21...@lion/form-integrations@0.1.22) (2020-07-27)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.21](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.20...@lion/form-integrations@0.1.21) (2020-07-16)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.20](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.19...@lion/form-integrations@0.1.20) (2020-07-13)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.19](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.18...@lion/form-integrations@0.1.19) (2020-07-13)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.18](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.17...@lion/form-integrations@0.1.18) (2020-07-13)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.17](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.16...@lion/form-integrations@0.1.17) (2020-07-09)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.16](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.15...@lion/form-integrations@0.1.16) (2020-07-09)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.15](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.14...@lion/form-integrations@0.1.15) (2020-07-09)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.14](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.13...@lion/form-integrations@0.1.14) (2020-07-09)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.13](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.12...@lion/form-integrations@0.1.13) (2020-07-07)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.12](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.11...@lion/form-integrations@0.1.12) (2020-07-06)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.11](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.10...@lion/form-integrations@0.1.11) (2020-06-24)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.10](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.9...@lion/form-integrations@0.1.10) (2020-06-24)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.9](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.8...@lion/form-integrations@0.1.9) (2020-06-23)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.8](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.7...@lion/form-integrations@0.1.8) (2020-06-18)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.7](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.6...@lion/form-integrations@0.1.7) (2020-06-10)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.6](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.5...@lion/form-integrations@0.1.6) (2020-06-09)

### Bug Fixes

- **form-core:** on reset the submitted values becomes false ([#753](https://github.com/ing-bank/lion/issues/753)) ([d86cfc5](https://github.com/ing-bank/lion/commit/d86cfc59018a2e5dcff0b2f5728683fc4e4861e6))

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.4...@lion/form-integrations@0.1.5) (2020-06-08)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.3...@lion/form-integrations@0.1.4) (2020-06-08)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.2...@lion/form-integrations@0.1.3) (2020-06-03)

**Note:** Version bump only for package @lion/form-integrations

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.1...@lion/form-integrations@0.1.2) (2020-06-03)

### Bug Fixes

- define side effects for demo files ([1d40567](https://github.com/ing-bank/lion/commit/1d405671875c1c9c5518a3b7f57814337b3a67d6))

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/form-integrations@0.1.0...@lion/form-integrations@0.1.1) (2020-06-02)

**Note:** Version bump only for package @lion/form-integrations

# 0.1.0 (2020-05-29)

### Features

- merge field/validate/choice-input/form-group into @lion/form-core ([6170374](https://github.com/ing-bank/lion/commit/6170374ee8c058cb95fff79b4953b0535219e9b4))
