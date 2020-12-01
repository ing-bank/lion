# Change Log

## 0.21.16

### Patch Changes

- Updated dependencies [5553e43e]
  - @lion/form-core@0.6.12
  - @lion/listbox@0.3.9
  - @lion/overlays@0.22.4

## 0.21.15

### Patch Changes

- Updated dependencies [aa8ad0e6]
- Updated dependencies [9142a53d]
- Updated dependencies [4bacc17b]
- Updated dependencies [3944c5e8]
  - @lion/form-core@0.6.11
  - @lion/overlays@0.22.3
  - @lion/listbox@0.3.8

## 0.21.14

### Patch Changes

- Updated dependencies [27020f12]
- Updated dependencies [c5c4d4ba]
  - @lion/button@0.8.5
  - @lion/form-core@0.6.10
  - @lion/listbox@0.3.7

## 0.21.13

### Patch Changes

- Updated dependencies [cf0967fe]
  - @lion/form-core@0.6.9
  - @lion/listbox@0.3.6

## 0.21.12

### Patch Changes

- Updated dependencies [b222fd78]
  - @lion/form-core@0.6.8
  - @lion/listbox@0.3.5
  - @lion/overlays@0.22.2

## 0.21.11

### Patch Changes

- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4
  - @lion/form-core@0.6.7
  - @lion/listbox@0.3.4
  - @lion/button@0.8.4
  - @lion/overlays@0.22.1

## 0.21.10

### Patch Changes

- Updated dependencies [9c3224b4]
- Updated dependencies [fff79915]
- Updated dependencies [4f1e6d0d]
  - @lion/overlays@0.22.0
  - @lion/listbox@0.3.3

## 0.21.9

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3
  - @lion/button@0.8.3
  - @lion/form-core@0.6.6
  - @lion/listbox@0.3.2
  - @lion/overlays@0.21.3

## 0.21.8

### Patch Changes

- 20ba0ca8: Type enhancements

  - LocalizeMixinTypes.d.ts extend from LitElement
  - Make `slots` a getter in SlotMixin types
  - selectedElement of type 'LionOption' in SelectRichInvoker

- 618f2698: Run tests also on webkit
- Updated dependencies [20ba0ca8]
- Updated dependencies [618f2698]
- Updated dependencies [16dd0cec]
  - @lion/core@0.13.2
  - @lion/form-core@0.6.5
  - @lion/listbox@0.3.1
  - @lion/button@0.8.2
  - @lion/overlays@0.21.2

## 0.21.7

### Patch Changes

- Updated dependencies [b910d6f7]
  - @lion/button@0.8.1

## 0.21.6

### Patch Changes

- 1671c705: Fix select rich to manually request update for the invoker selected element when it synchronizes, as the modelValue could be changed but would not trigger a change since the old and new value are both referenced from the updated node reference, meaning they will always be the same and never pass the dirty check.
- Updated dependencies [2907649b]
- Updated dependencies [c844c017]
- Updated dependencies [bdf1cfb2]
- Updated dependencies [68e3e749]
- Updated dependencies [fd297a28]
- Updated dependencies [9fcb67f0]
- Updated dependencies [247e64a3]
- Updated dependencies [e92b98a4]
- Updated dependencies [f7ab5391]
- Updated dependencies [26b60593]
  - @lion/form-core@0.6.4
  - @lion/listbox@0.3.0
  - @lion/overlays@0.21.1
  - @lion/core@0.13.1
  - @lion/button@0.8.0

## 0.21.5

### Patch Changes

- 17a0d6bf: add types
- 20469ce7: Change scrollTargetNode to listboxNode, same as parent and extention layer. The extention layer has a different overlayContentNode and had to set it back to listboxNode.
- Updated dependencies [d83f7fc5]
- Updated dependencies [d1c6b18c]
- Updated dependencies [d5faa459]
- Updated dependencies [17a0d6bf]
- Updated dependencies [a4c4f1ee]
- Updated dependencies [d5faa459]
- Updated dependencies [0aa4480e]
- Updated dependencies [6679fe77]
  - @lion/overlays@0.21.0
  - @lion/listbox@0.2.0
  - @lion/form-core@0.6.3
  - @lion/button@0.7.15

## 0.21.4

### Patch Changes

- e2d772f5: The singleOption setting should only be true if there is exactly one option. This also needs to be true if there are dynamic additions or removals.
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

- 6394c080: Cleanup and remove shadow outlet slot. This should not be used anymore
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
  - @lion/button@0.7.14

## 0.21.3

### Patch Changes

- 7e02c39a: Remove public class field usage in Select Rich

## 0.21.2

### Patch Changes

- Updated dependencies [27bc8058]
  - @lion/listbox@0.1.1

## 0.21.1

### Patch Changes

- 0ec72ac3: Adds a new listbox package. A listbox widget presents a list of options and allows a user to select one or more of them.
- Updated dependencies [0ec72ac3]
- Updated dependencies [e42071d8]
- Updated dependencies [75107a4b]
- Updated dependencies [60d5d1d3]
  - @lion/listbox@0.1.0
  - @lion/button@0.7.13
  - @lion/overlays@0.19.0
  - @lion/core@0.12.0
  - @lion/form-core@0.6.1

## 0.21.0

### Minor Changes

- 26f683d0: - Make the OverlayController constructor phase synchronous.
  - Trigger a setup of the OverlayController on every connectedCallback
  - Execute a new OverlayController after (shadowDom) rendering of the element is done
  - Teardown the OverlayController on every disconnectedCallback
  - This means moving a dialog triggers teardown in the old location and setup in the new location
  - Restore the original light dom (if needed) in the teardown phase of the OverlayController

### Patch Changes

- 874ff483: Form-core typings

  #### Features

  Provided typings for the form-core package and core package.
  This also means that mixins that previously had implicit dependencies, now have explicit ones.

  #### Patches

  - lion-select-rich: invoker selectedElement now also clones text nodes (fix)
  - fieldset: runs a FormGroup suite

- Updated dependencies [874ff483]
- Updated dependencies [26f683d0]
  - @lion/form-core@0.6.0
  - @lion/core@0.11.0
  - @lion/overlays@0.18.0
  - @lion/button@0.7.12

## 0.20.0

### Minor Changes

- 65ecd432: Update to lit-element 2.4.0, changed all uses of \_requestUpdate into requestUpdateInterval

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0
  - @lion/form-core@0.5.0
  - @lion/overlays@0.17.0
  - @lion/button@0.7.11

## 0.19.6

### Patch Changes

- Updated dependencies [c347fce4]
  - @lion/form-core@0.4.4

## 0.19.5

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1
  - @lion/button@0.7.10
  - @lion/form-core@0.4.3
  - @lion/overlays@0.16.13

## 0.19.4

### Patch Changes

- dd021e43: Groups need a valid formattedValue representing the value of it's form elements
- Updated dependencies [dd021e43]
- Updated dependencies [07c598fd]
  - @lion/form-core@0.4.2

## 0.19.3

### Patch Changes

- Updated dependencies [fb236975]
  - @lion/form-core@0.4.1

## 0.19.2

### Patch Changes

- 7742e2ea: Clicking on a label of a rich select should focus the invoker button. This behavior is to mimic the native select.
- Updated dependencies [3c61fd29]
- Updated dependencies [5a48e69b]
- Updated dependencies [9ecab4d5]
  - @lion/form-core@0.4.0
  - @lion/core@0.9.0
  - @lion/overlays@0.16.12
  - @lion/button@0.7.9

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.19.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.19.0...@lion/select-rich@0.19.1) (2020-07-28)

**Note:** Version bump only for package @lion/select-rich

# [0.19.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.21...@lion/select-rich@0.19.0) (2020-07-27)

### Features

- synchronous form registration system ([8698f73](https://github.com/ing-bank/lion/commit/8698f734186eb88c4669bbadf8d5ae461f1c27f5))

## [0.18.21](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.20...@lion/select-rich@0.18.21) (2020-07-27)

### Bug Fixes

- **select-rich:** add serializedValue setter due to getter override ([23f61eb](https://github.com/ing-bank/lion/commit/23f61eb81379523087aa67c329352a9d99cd556a))

## [0.18.20](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.19...@lion/select-rich@0.18.20) (2020-07-16)

**Note:** Version bump only for package @lion/select-rich

## [0.18.19](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.18...@lion/select-rich@0.18.19) (2020-07-13)

**Note:** Version bump only for package @lion/select-rich

## [0.18.18](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.17...@lion/select-rich@0.18.18) (2020-07-13)

### Bug Fixes

- **select-rich:** align teardown phase with OverlayMixin ([97922df](https://github.com/ing-bank/lion/commit/97922df18117812aa816bf2658d162bf29b0b998))

## [0.18.17](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.16...@lion/select-rich@0.18.17) (2020-07-13)

**Note:** Version bump only for package @lion/select-rich

## [0.18.16](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.15...@lion/select-rich@0.18.16) (2020-07-09)

**Note:** Version bump only for package @lion/select-rich

## [0.18.15](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.14...@lion/select-rich@0.18.15) (2020-07-09)

**Note:** Version bump only for package @lion/select-rich

## [0.18.14](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.13...@lion/select-rich@0.18.14) (2020-07-09)

**Note:** Version bump only for package @lion/select-rich

## [0.18.13](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.12...@lion/select-rich@0.18.13) (2020-07-09)

### Bug Fixes

- **select-rich:** instantiation after first update ([184898c](https://github.com/ing-bank/lion/commit/184898c111dcb81f269fffc6b82688cc6f25aac2))

## [0.18.12](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.11...@lion/select-rich@0.18.12) (2020-07-07)

**Note:** Version bump only for package @lion/select-rich

## [0.18.11](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.10...@lion/select-rich@0.18.11) (2020-07-06)

**Note:** Version bump only for package @lion/select-rich

## [0.18.10](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.9...@lion/select-rich@0.18.10) (2020-06-24)

**Note:** Version bump only for package @lion/select-rich

## [0.18.9](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.8...@lion/select-rich@0.18.9) (2020-06-24)

**Note:** Version bump only for package @lion/select-rich

## [0.18.8](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.7...@lion/select-rich@0.18.8) (2020-06-23)

**Note:** Version bump only for package @lion/select-rich

## [0.18.7](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.6...@lion/select-rich@0.18.7) (2020-06-18)

**Note:** Version bump only for package @lion/select-rich

## [0.18.6](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.5...@lion/select-rich@0.18.6) (2020-06-10)

**Note:** Version bump only for package @lion/select-rich

## [0.18.5](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.4...@lion/select-rich@0.18.5) (2020-06-09)

**Note:** Version bump only for package @lion/select-rich

## [0.18.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.3...@lion/select-rich@0.18.4) (2020-06-08)

**Note:** Version bump only for package @lion/select-rich

## [0.18.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.2...@lion/select-rich@0.18.3) (2020-06-08)

**Note:** Version bump only for package @lion/select-rich

## [0.18.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.1...@lion/select-rich@0.18.2) (2020-06-03)

### Bug Fixes

- **overlays:** change dropdownConfig inheritsReferenceWidth to min ([16f7afb](https://github.com/ing-bank/lion/commit/16f7afbbdc8316c8da16f6f177c85af0cde4f70d))
- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))

## [0.18.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.18.0...@lion/select-rich@0.18.1) (2020-06-02)

**Note:** Version bump only for package @lion/select-rich

# [0.18.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.17.5...@lion/select-rich@0.18.0) (2020-05-29)

### Features

- merge field/validate/choice-input/form-group into @lion/form-core ([6170374](https://github.com/ing-bank/lion/commit/6170374ee8c058cb95fff79b4953b0535219e9b4))
- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

## [0.17.5](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.17.4...@lion/select-rich@0.17.5) (2020-05-27)

### Bug Fixes

- **select-rich:** prevent scrolling when focused ([dd3053a](https://github.com/ing-bank/lion/commit/dd3053a7bcab59b2c7736e2fa13a53a154953f02))

## [0.17.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.17.3...@lion/select-rich@0.17.4) (2020-05-27)

**Note:** Version bump only for package @lion/select-rich

## [0.17.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.17.2...@lion/select-rich@0.17.3) (2020-05-25)

**Note:** Version bump only for package @lion/select-rich

## [0.17.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.17.1...@lion/select-rich@0.17.2) (2020-05-20)

**Note:** Version bump only for package @lion/select-rich

## [0.17.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.17.0...@lion/select-rich@0.17.1) (2020-05-19)

**Note:** Version bump only for package @lion/select-rich

# [0.17.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.16.0...@lion/select-rich@0.17.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

# [0.16.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.15.4...@lion/select-rich@0.16.0) (2020-05-18)

### Bug Fixes

- **overlays:** local backdrop outlet ([e19a0f4](https://github.com/ing-bank/lion/commit/e19a0f483c65a8a758da78b86e3723e9270e5bd3))

### Features

- **overlays:** enhance content projection for styling purposes ([f33ea6b](https://github.com/ing-bank/lion/commit/f33ea6b0b0dca88d006762ec5110e5845a73d219))

## [0.15.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.15.3...@lion/select-rich@0.15.4) (2020-05-06)

**Note:** Version bump only for package @lion/select-rich

## [0.15.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.15.2...@lion/select-rich@0.15.3) (2020-04-29)

### Bug Fixes

- add display:none for hidden ([#692](https://github.com/ing-bank/lion/issues/692)) ([9731771](https://github.com/ing-bank/lion/commit/9731771c23a5ed8661558e62cb5e34b62cc2b8b7))

## [0.15.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.15.1...@lion/select-rich@0.15.2) (2020-04-20)

**Note:** Version bump only for package @lion/select-rich

## [0.15.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.15.0...@lion/select-rich@0.15.1) (2020-04-15)

**Note:** Version bump only for package @lion/select-rich

# [0.15.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.14.2...@lion/select-rich@0.15.0) (2020-04-14)

### Features

- **select-rich:** added signleoption functionality ([7c37418](https://github.com/ing-bank/lion/commit/7c3741854d75d841a613717761c433cb868f5c49))

## [0.14.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.14.1...@lion/select-rich@0.14.2) (2020-04-07)

**Note:** Version bump only for package @lion/select-rich

## [0.14.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.14.0...@lion/select-rich@0.14.1) (2020-04-02)

### Bug Fixes

- **select-rich:** wait until mixin overlay is ready before doing setup ([53a21f2](https://github.com/ing-bank/lion/commit/53a21f2baaf048d2138ace5efcb586d0e6d49c31))

# [0.14.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.13.0...@lion/select-rich@0.14.0) (2020-03-26)

### Bug Fixes

- **select-rich:** consider no default select for inheritsReferenceWidth ([e636ce1](https://github.com/ing-bank/lion/commit/e636ce1f9c12c35a0885aa6e991d9554c944def5))

### Features

- **select-rich:** add has no default selection feature ([975a01a](https://github.com/ing-bank/lion/commit/975a01aca91d11f25f7391fff3bca692a67681b8))

# [0.13.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.12.4...@lion/select-rich@0.13.0) (2020-03-25)

### Bug Fixes

- **select-rich:** allow hoverable content inside content-wrapper ([eadb0fd](https://github.com/ing-bank/lion/commit/eadb0fd9714207e015862bb7e2f8d623515c2837))

### Features

- update to stable @open-wc/scoped-elements ([10bac56](https://github.com/ing-bank/lion/commit/10bac5672b406d3f08a89a795ee295f5028ca6d0))

## [0.12.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.12.3...@lion/select-rich@0.12.4) (2020-03-20)

**Note:** Version bump only for package @lion/select-rich

## [0.12.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.12.2...@lion/select-rich@0.12.3) (2020-03-19)

**Note:** Version bump only for package @lion/select-rich

## [0.12.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.12.1...@lion/select-rich@0.12.2) (2020-03-19)

### Bug Fixes

- normalization model-value-changed events ([1b6c3a4](https://github.com/ing-bank/lion/commit/1b6c3a44c820b9d61c26849b91bbb1bc8d6c772b))

## [0.12.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.12.0...@lion/select-rich@0.12.1) (2020-03-12)

**Note:** Version bump only for package @lion/select-rich

# [0.12.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.11.4...@lion/select-rich@0.12.0) (2020-03-05)

### Features

- use Scoped Elements ([15b4a5e](https://github.com/ing-bank/lion/commit/15b4a5ebb388e158f6dc2529954ba6a23f325eb3))

## [0.11.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.11.3...@lion/select-rich@0.11.4) (2020-03-04)

**Note:** Version bump only for package @lion/select-rich

## [0.11.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.11.2...@lion/select-rich@0.11.3) (2020-03-02)

### Bug Fixes

- normalize subclasser apis ([ce0630f](https://github.com/ing-bank/lion/commit/ce0630f32b2206813e5cfd2c7842b2faa5141591))

## [0.11.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.11.1...@lion/select-rich@0.11.2) (2020-03-01)

**Note:** Version bump only for package @lion/select-rich

## [0.11.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.11.0...@lion/select-rich@0.11.1) (2020-02-26)

**Note:** Version bump only for package @lion/select-rich

# [0.11.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.10.4...@lion/select-rich@0.11.0) (2020-02-20)

### Features

- api normalisation formElements and values ([9b905c4](https://github.com/ing-bank/lion/commit/9b905c492a0c0d2226cc1d75c73e2e70dc97815a))

## [0.10.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.10.3...@lion/select-rich@0.10.4) (2020-02-19)

### Bug Fixes

- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.10.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.10.2...@lion/select-rich@0.10.3) (2020-02-14)

**Note:** Version bump only for package @lion/select-rich

## [0.10.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.10.1...@lion/select-rich@0.10.2) (2020-02-13)

**Note:** Version bump only for package @lion/select-rich

## [0.10.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.10.0...@lion/select-rich@0.10.1) (2020-02-10)

**Note:** Version bump only for package @lion/select-rich

# [0.10.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.11...@lion/select-rich@0.10.0) (2020-02-06)

### Features

- flatten modelValue and remove checkedValue ([848ff06](https://github.com/ing-bank/lion/commit/848ff06887c86532e60d33d2db67d1152910d9cb))

## [0.9.11](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.10...@lion/select-rich@0.9.11) (2020-02-06)

**Note:** Version bump only for package @lion/select-rich

## [0.9.10](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.9...@lion/select-rich@0.9.10) (2020-02-06)

**Note:** Version bump only for package @lion/select-rich

## [0.9.9](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.8...@lion/select-rich@0.9.9) (2020-02-05)

**Note:** Version bump only for package @lion/select-rich

## [0.9.8](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.7...@lion/select-rich@0.9.8) (2020-02-05)

**Note:** Version bump only for package @lion/select-rich

## [0.9.7](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.6...@lion/select-rich@0.9.7) (2020-02-03)

**Note:** Version bump only for package @lion/select-rich

## [0.9.6](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.5...@lion/select-rich@0.9.6) (2020-01-30)

**Note:** Version bump only for package @lion/select-rich

## [0.9.5](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.4...@lion/select-rich@0.9.5) (2020-01-29)

### Bug Fixes

- **select-rich:** set activeIndex also when checkedIndex = 0 ([03c58fd](https://github.com/ing-bank/lion/commit/03c58fdafdde846fc8249cc0c6e9ceb0ada8dfbd))

## [0.9.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.3...@lion/select-rich@0.9.4) (2020-01-23)

**Note:** Version bump only for package @lion/select-rich

## [0.9.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.2...@lion/select-rich@0.9.3) (2020-01-23)

**Note:** Version bump only for package @lion/select-rich

## [0.9.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.1...@lion/select-rich@0.9.2) (2020-01-20)

**Note:** Version bump only for package @lion/select-rich

## [0.9.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.9.0...@lion/select-rich@0.9.1) (2020-01-17)

### Bug Fixes

- update storybook and use main.js ([e61e0b9](https://github.com/ing-bank/lion/commit/e61e0b938ff72cc18cc0b3aa1560f2cece0c9fe6))

# [0.9.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.8.9...@lion/select-rich@0.9.0) (2020-01-13)

### Features

- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))

## [0.8.9](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.8.8...@lion/select-rich@0.8.9) (2020-01-08)

**Note:** Version bump only for package @lion/select-rich

## [0.8.8](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.8.7...@lion/select-rich@0.8.8) (2019-12-30)

### Bug Fixes

- **select-rich:** add aria-invalid when invalid ([db5f2ef](https://github.com/ing-bank/lion/commit/db5f2ef38c97a7130a1f20540821f4237706e7c7))

## [0.8.7](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.8.6...@lion/select-rich@0.8.7) (2019-12-17)

**Note:** Version bump only for package @lion/select-rich

## [0.8.6](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.8.5...@lion/select-rich@0.8.6) (2019-12-16)

**Note:** Version bump only for package @lion/select-rich

## [0.8.5](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.8.4...@lion/select-rich@0.8.5) (2019-12-13)

**Note:** Version bump only for package @lion/select-rich

## [0.8.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.8.3...@lion/select-rich@0.8.4) (2019-12-11)

**Note:** Version bump only for package @lion/select-rich

## [0.8.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.8.2...@lion/select-rich@0.8.3) (2019-12-11)

**Note:** Version bump only for package @lion/select-rich

## [0.8.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.8.1...@lion/select-rich@0.8.2) (2019-12-06)

**Note:** Version bump only for package @lion/select-rich

## [0.8.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.8.0...@lion/select-rich@0.8.1) (2019-12-04)

**Note:** Version bump only for package @lion/select-rich

# [0.8.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.7.2...@lion/select-rich@0.8.0) (2019-12-04)

### Features

- integrate and pass automated a11y testing ([e1a417b](https://github.com/ing-bank/lion/commit/e1a417b041431e4e25a5b6a63e23ba0a3974f5a5))

## [0.7.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.7.1...@lion/select-rich@0.7.2) (2019-12-03)

### Bug Fixes

- let lerna publish fixed versions ([bc7448c](https://github.com/ing-bank/lion/commit/bc7448c694deb3c05fd3d083a9acb5365b26b7ab))

## [0.7.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.7.0...@lion/select-rich@0.7.1) (2019-12-02)

### Bug Fixes

- use strict versions to get correct deps on older versions ([8645c13](https://github.com/ing-bank/lion/commit/8645c13b1d77e488713f2e5e0e4e00c4d30ea1ee))

# [0.7.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.6.5...@lion/select-rich@0.7.0) (2019-12-01)

### Bug Fixes

- no longer use overlay templates ([49974bd](https://github.com/ing-bank/lion/commit/49974bd2b86d7f02e8c19aa51a0a79779b897384))

### Features

- refactor the overlay system implementations, docs and demos ([a5a9f97](https://github.com/ing-bank/lion/commit/a5a9f975a61649cd1f861a80923c678c5f4d51be))
- **overlays:** improve API for overriding controller config in mixin ([45f5571](https://github.com/ing-bank/lion/commit/45f557183d7bef95ea9685d751e90ba12a4eb2d8))

## [0.6.5](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.6.4...@lion/select-rich@0.6.5) (2019-11-28)

**Note:** Version bump only for package @lion/select-rich

## [0.6.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.6.3...@lion/select-rich@0.6.4) (2019-11-27)

**Note:** Version bump only for package @lion/select-rich

## [0.6.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.6.2...@lion/select-rich@0.6.3) (2019-11-27)

**Note:** Version bump only for package @lion/select-rich

## [0.6.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.6.1...@lion/select-rich@0.6.2) (2019-11-26)

**Note:** Version bump only for package @lion/select-rich

## [0.6.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.6.0...@lion/select-rich@0.6.1) (2019-11-22)

### Bug Fixes

- **select-rich:** keyboard navigation should handle scrolling ([0dad105](https://github.com/ing-bank/lion/commit/0dad10510929d849f8fb2997cb7231abcf279e32))

# [0.6.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.5.2...@lion/select-rich@0.6.0) (2019-11-22)

### Features

- **field:** order aria attributes based on nodes ([95d553e](https://github.com/ing-bank/lion/commit/95d553e23994181b827a091b724572678bea3b2f))

## [0.5.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.5.1...@lion/select-rich@0.5.2) (2019-11-20)

### Bug Fixes

- **select-rich:** sync selected el after add item on selected index ([1298b7b](https://github.com/ing-bank/lion/commit/1298b7b0500d305074bdc075b6eaefd21226d4fe))

## [0.5.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.5.0...@lion/select-rich@0.5.1) (2019-11-19)

**Note:** Version bump only for package @lion/select-rich

# [0.5.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.4.1...@lion/select-rich@0.5.0) (2019-11-18)

### Features

- finalize validation and adopt it everywhere ([396deb2](https://github.com/ing-bank/lion/commit/396deb2e3b4243f102a5c98e9b0518fa0f31a6b1))

## [0.4.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.4.0...@lion/select-rich@0.4.1) (2019-11-15)

### Bug Fixes

- refactor slot selection ([5999ea9](https://github.com/ing-bank/lion/commit/5999ea956967b449f3f04935c7facb19e2889dc9))

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.14...@lion/select-rich@0.4.0) (2019-11-13)

### Features

- remove all deprecations from lion ([66d3d39](https://github.com/ing-bank/lion/commit/66d3d390aebeaa61b6effdea7d5f7eea0e89c894))

## [0.3.14](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.13...@lion/select-rich@0.3.14) (2019-11-12)

**Note:** Version bump only for package @lion/select-rich

## [0.3.13](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.12...@lion/select-rich@0.3.13) (2019-11-06)

**Note:** Version bump only for package @lion/select-rich

## [0.3.12](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.11...@lion/select-rich@0.3.12) (2019-11-01)

**Note:** Version bump only for package @lion/select-rich

## [0.3.11](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.10...@lion/select-rich@0.3.11) (2019-10-25)

**Note:** Version bump only for package @lion/select-rich

## [0.3.10](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.9...@lion/select-rich@0.3.10) (2019-10-23)

**Note:** Version bump only for package @lion/select-rich

## [0.3.9](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.8...@lion/select-rich@0.3.9) (2019-10-23)

**Note:** Version bump only for package @lion/select-rich

## [0.3.8](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.7...@lion/select-rich@0.3.8) (2019-10-21)

**Note:** Version bump only for package @lion/select-rich

## [0.3.7](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.6...@lion/select-rich@0.3.7) (2019-10-21)

**Note:** Version bump only for package @lion/select-rich

## [0.3.6](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.5...@lion/select-rich@0.3.6) (2019-10-14)

**Note:** Version bump only for package @lion/select-rich

## [0.3.5](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.4...@lion/select-rich@0.3.5) (2019-10-11)

### Bug Fixes

- **select-rich:** make readonly work ([6a15ba1](https://github.com/ing-bank/lion/commit/6a15ba1))

## [0.3.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.3...@lion/select-rich@0.3.4) (2019-10-11)

**Note:** Version bump only for package @lion/select-rich

## [0.3.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.2...@lion/select-rich@0.3.3) (2019-10-11)

### Bug Fixes

- **select-rich:** set dynamically name prop on child option elements ([b9ba3db](https://github.com/ing-bank/lion/commit/b9ba3db))

## [0.3.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.1...@lion/select-rich@0.3.2) (2019-10-11)

**Note:** Version bump only for package @lion/select-rich

## [0.3.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.3.0...@lion/select-rich@0.3.1) (2019-10-11)

**Note:** Version bump only for package @lion/select-rich

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.2.5...@lion/select-rich@0.3.0) (2019-10-10)

### Features

- update to latest overlay system ([4c26bef](https://github.com/ing-bank/lion/commit/4c26bef))

## [0.2.5](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.2.4...@lion/select-rich@0.2.5) (2019-10-09)

**Note:** Version bump only for package @lion/select-rich

## [0.2.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.2.3...@lion/select-rich@0.2.4) (2019-10-07)

**Note:** Version bump only for package @lion/select-rich

## [0.2.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.2.2...@lion/select-rich@0.2.3) (2019-09-30)

**Note:** Version bump only for package @lion/select-rich

## [0.2.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.2.1...@lion/select-rich@0.2.2) (2019-09-27)

**Note:** Version bump only for package @lion/select-rich

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.2.0...@lion/select-rich@0.2.1) (2019-09-27)

**Note:** Version bump only for package @lion/select-rich

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.21...@lion/select-rich@0.2.0) (2019-09-26)

### Features

- **select-rich:** provide generic mechanism for overrifing overlay type ([ac33804](https://github.com/ing-bank/lion/commit/ac33804))

## [0.1.21](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.20...@lion/select-rich@0.1.21) (2019-09-26)

**Note:** Version bump only for package @lion/select-rich

## [0.1.20](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.19...@lion/select-rich@0.1.20) (2019-09-25)

**Note:** Version bump only for package @lion/select-rich

## [0.1.19](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.18...@lion/select-rich@0.1.19) (2019-09-20)

**Note:** Version bump only for package @lion/select-rich

## [0.1.18](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.17...@lion/select-rich@0.1.18) (2019-09-19)

**Note:** Version bump only for package @lion/select-rich

## [0.1.17](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.16...@lion/select-rich@0.1.17) (2019-09-17)

**Note:** Version bump only for package @lion/select-rich

## [0.1.16](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.15...@lion/select-rich@0.1.16) (2019-09-13)

**Note:** Version bump only for package @lion/select-rich

## [0.1.15](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.14...@lion/select-rich@0.1.15) (2019-08-29)

**Note:** Version bump only for package @lion/select-rich

## [0.1.14](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.13...@lion/select-rich@0.1.14) (2019-08-23)

**Note:** Version bump only for package @lion/select-rich

## [0.1.13](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.12...@lion/select-rich@0.1.13) (2019-08-21)

**Note:** Version bump only for package @lion/select-rich

## [0.1.12](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.11...@lion/select-rich@0.1.12) (2019-08-17)

**Note:** Version bump only for package @lion/select-rich

## [0.1.11](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.10...@lion/select-rich@0.1.11) (2019-08-15)

**Note:** Version bump only for package @lion/select-rich

## [0.1.10](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.9...@lion/select-rich@0.1.10) (2019-08-15)

**Note:** Version bump only for package @lion/select-rich

## [0.1.9](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.8...@lion/select-rich@0.1.9) (2019-08-14)

**Note:** Version bump only for package @lion/select-rich

## [0.1.8](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.7...@lion/select-rich@0.1.8) (2019-08-07)

**Note:** Version bump only for package @lion/select-rich

## [0.1.7](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.6...@lion/select-rich@0.1.7) (2019-08-07)

**Note:** Version bump only for package @lion/select-rich

## [0.1.6](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.5...@lion/select-rich@0.1.6) (2019-08-01)

**Note:** Version bump only for package @lion/select-rich

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.4...@lion/select-rich@0.1.5) (2019-07-30)

**Note:** Version bump only for package @lion/select-rich

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.3...@lion/select-rich@0.1.4) (2019-07-30)

**Note:** Version bump only for package @lion/select-rich

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.2...@lion/select-rich@0.1.3) (2019-07-29)

**Note:** Version bump only for package @lion/select-rich

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.1...@lion/select-rich@0.1.2) (2019-07-26)

**Note:** Version bump only for package @lion/select-rich

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/select-rich@0.1.0...@lion/select-rich@0.1.1) (2019-07-26)

### Bug Fixes

- **select-rich:** add index.js with class export ([7d0aeb1](https://github.com/ing-bank/lion/commit/7d0aeb1))

# 0.1.0 (2019-07-25)

### Features

- add lion-select-rich ([66b7880](https://github.com/ing-bank/lion/commit/66b7880))
