# @lion/listbox

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
