# @lion/ui

## 0.0.5

### Patch Changes

- 9b4cbb1d: [lion-input-tel] upgrade to awesome-phonenumber v4
- e090d2d8: adds support for reduced motion capabilities in overlay manager by disabling the opacity transition when a modal is opened/closed
- 2572012d: [lion-input-tel(-dropdown)] polish / cleanup code
- 53459451: [overlays] scroll issues on mac safari fixed when dialog are openend

## 0.0.4

### Patch Changes

- 11436fc0: [core] SlotMixin: allow rerenders of templates
- eee83cca: Export types that are useful for subclassers
- d7938ef6: [input-tel] Align with SlotMixin rerender functionality
  [input-tel-dropdown] Align with SlotMixin rerender functionality + fix interaction state synchronization
- bc252703: expose docs via export map

## 0.0.3

### Patch Changes

- 4708fe94: Include documentation in the npm package so it can be reused
- da057efc: [localize] simplify and fix parseMode check

## 0.0.2

### Patch Changes

- c7ea0357: [core]: replaced import('lit-element') with import('lit') to fix tests, fixed test for SlotMixin
- c7ea0357: [drawer]: implemented initial version of lion-drawer
- Updated dependencies [faa26f12]
  - singleton-manager@1.6.1

## 0.0.1

### Patch Changes

- e08b6bec: This introduces a new package `@lion/ui` which is a collection of UI components that can be used in your application. It contains all the components/systems that used to be distributed via separate `@lion/*` packages.

  This is a breaking as you will need to import all components from `@lion/ui` instead of `@lion/*` packages now.

  ```diff
  - import { LionAccordion } from '@lion/accordion';
  + import { LionAccordion } from '@lion/ui/accordion.js';
  ```

  This is also true for element registrations

  ```diff
  - import '@lion/accordion/define';
  + import '@lion/ui/define/lion-accordion.js';
  ```

  Essentially the whole public API e.g. all the available exports can be found in the [exports](https://github.com/ing-bank/lion/tree/master/packages/ui/exports) folder.

  The package only supports TS 4.7+ using `"moduleResolution": "Node16"` or `"moduleResolution": "NodeNext"` as described in the [TS 4.7 Announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#package-json-exports-imports-and-self-referencing).

  This package will have a new single CHANGELOG.md for the whole package. If you are interested the older individual changelogs then you can find them in the [\_legacy-changelogs folder](https://github.com/ing-bank/lion/tree/master/packages/ui/_legacy-changelogs).

  This new version also includes the following changes for it's containing components:

  - fix(switch): SwitchButton do not dispatch checked-change event when is disabled
  - fix(calendar): calendar translation de.js strings corrected

  Note: This package is considered alpha until extending docs and type exports are verified.

- Updated dependencies [e08b6bec]
  - singleton-manager@1.6.0
