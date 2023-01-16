# @lion/ui

## 0.0.13

### Patch Changes

- fd09f652: [select-rich] solve case of having singleOption and hasNoDefaultSelected as the same time
- af2e0293: [overlays]: fix adoptStyles fallback and make testable
- 9f6270b3: [select-rich] set focusableNode correctly so focused and focused-visible attributes are set when invoker gets focus
- 9fb14fa1: `accordion`: rearranging invokers and content for a correct tab order is now implemented by changing the slot attributes of both instead of moving them, changed css for this implementation, updated tests
- 9a43dc4d: [input-tel-dropdown] add translations for "All countries" and "Suggested countries" labels.

## 0.0.12

### Patch Changes

- 7ac0a422: [overlays] fixes (responsive backdrop/select-rich/tooltip)

## 0.0.11

### Patch Changes

- 5e707168: [tooltip] prevent infinite loops
- 49092c97: `accordion`: narrowed the scope of the selectors that query [slot=invoker] and [slot=content] to prevent that any nested elements with [slot=invoker] and [slot=content] are moved to slot=\_accordion as well
- fafd9222: overlays: add adopted stylesheets once; attach correctly to body

## 0.0.10

### Patch Changes

- 36910e5d: datepicker uses no calender-overlay-frame element anymore
- 64c0e26c: Overlay System uses `<dialog>` for top layer functionality of all overlays.
  This means overlays positioned relative to viewport won't be moved to the body.

  This has many benefits for the App Developer:

  - "context" will be kept:
    - css variables and parts/theme will work
    - events work without the need for "repropagation" (from body to original context)
    - accessibility relations between overlay content and its context do not get lost
  - initial renderings become more predictable (since we don't need multiple initializations on multiple connectedCallbacks)
  - performance: less initialization, thus better performance
  - maintainability: handling all edge cases involved in moving an overlay to the body grew out of hand
  - developer experience:
    - no extra container components like overlay-frame/calendar-frame needed that maintain styles
    - adding a contentWrapperNode is not needed anymore

  There could be small differences in timings though (usually we're done rendering quicker now).
  Code that relies on side effects could be affected. Like:

  - the existence of a global Root node)
  - the fact that global styles would reach a dialog placed in the body

  For most users using either OverlayController, OverlayMixin or an element that uses OverlayMixin (like LionInputDatepicker, LionRichSelect etc. etc.)
  nothing will change in the public api.

- 00063d73: depend on @popperjs/core

## 0.0.9

### Patch Changes

- f147024c: validate-messages without side effects

## 0.0.8

### Patch Changes

- f0e6ee92: BREAKING: remove setIcons, setOverlays, setLocalize.

  Recommended approach is to do below at the top of your app (before lion code runs):

  ```js
  import { singletonManager } from 'singleton-manager';
  import { LocalizeManager } from '@lion/ui/localize-no-side-effects.js';

  class MyLocalizeManager extends LocalizeManager {}

  singletonManager.set('@lion/ui::localize::0.x', new MyLocalizeManager());
  ```

- de51dae2: Use the correct names for singleton registrations

## 0.0.7

### Patch Changes

- 11f6f19a: Update `@open-wc/scoped-elements` to a version that exposes its types.

## 0.0.6

### Patch Changes

- 5dd5a848: [core] SlotMixin: conditional slots should not break init loop

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
