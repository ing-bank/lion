# Change Log

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
