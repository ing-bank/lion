# Change Log

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
