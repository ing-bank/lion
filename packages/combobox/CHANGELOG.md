## 0.1.0

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
