# Change Log

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
