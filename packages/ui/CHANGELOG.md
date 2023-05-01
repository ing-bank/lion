# @lion/ui

## 0.2.1

### Patch Changes

- 5b8d655f: OverlayController: fixed check to determine if native dialog is supported, fixed check to determine if user has moved focus while dialog is open, added test to assert if element specified in dialog config key `elementToFocusAfterHide` is in viewport when dialog is closed
- a5f35158: feat(@lion/ui): add \_previousIconTemplate and \_nextIconTemplate to LionCalendar
- ddea63b3: [combobox] update option list after clear
- 12f18008: lion-calendar: when determining if user interacted with a day button we no longer examine event.target but event.composedPath()[0] since it otherwise fails in Firefox 111+

## 0.2.0

### Minor Changes

- 183c86af: Changed spelling/grammar of the german error message for an invalid IBAN.

### Patch Changes

- adfa29a0: [switch] remove one of the two role="switch" (nested-interactive). Only leave it on the switch-button.
- 0d4c42ab: [listbox] allow use of arrow keys when focus is not on listbox
- 42a463ee: Set padding of <dialog> to 0 so it doesn't show a weird 1em width/height box due to user agent styles.
- 3256892c: lion-switch: checked-changed event is no longer fired on element initialization when checked is set through attribute
- 3f1c83a1: lion-accordion: changed selectors for invokers and content to only select slotted elements that are direct descendants. This is to prevent that slotted elements in accordion content and invokers are also selected and the amount of invokers and content is incorrect
- a2b81b26: [combobox] Multiple improvements:

  - Allow textbox values to be entered that do not match a listbox option, via `requireOptionMatch` flag.
  - Added an `MatchesOption` validator to check if the value is matching an option.
  - Exports combobox test helpers

- 1f018baf: feat(@lion/ui): add \_invokerIconTemplate to LionInputDatepicker

## 0.1.5

### Patch Changes

- 943618fd: [combobox] fix direct open and closing of the overlay on focus of empty input when `showAllOnEmpty`
- 4226a014: [combobox] add translations

## 0.1.4

### Patch Changes

- 1c18057c: [combobox] make the first occurrence of a string highlighted, instead of the last.
- 974e9ea4: fix(@lion/ui): declare sideEffects in package.json

## 0.1.3

### Patch Changes

- e871fe67: fix(@lion/ui): export types necessary for type inference of core.js

## 0.1.2

### Patch Changes

- 9ff7cd77: fix(@lion/ui): export types necessary for type inference of mixins (fixes #1903)
- 74b4b686: don't set unparseable for negative timezones
- eff3259e: LocalizeManager: added `allowOverridesForExistingNamespaces` option to `constructor` argument to allow for changing data in a namespace for a given locale
- 84173cdb: lion-select-rich: when the overlay is shown, the "autofocus" attribute is added to \_listboxNode (\_inputNode) to make sure that keyboard navigation continues to work when the element is inside a an element with `trapsKeyboardFocus:true`, like the bottomsheet created via `withBottomSheetConfig()`. When the overlay is closed the attribute is removed.

## 0.1.1

### Patch Changes

- cee40e55: Side-effect-free alternative for `localize` (the globally shared instance of LocalizeManager).
  When this function is imported, no side-effect happened yet, i.e. no global instance was registered yet.
  The side effect-free approach generates:

  - smaller, optimized bundles
  - a predictable loading order, that allows for:
    - deduping strategies when multiple instances of the localizeManager are on a page
    - providing a customized extension of LocalizeManager

  Also see: https://github.com/ing-bank/lion/discussions/1861

  Use it like this:

  ```js
  function myFunction() {
    // note that 'localizeManager' is the same as former 'localize'
    const localizeManager = getLocalizeManger();
    // ...
  }
  ```

  In a class, we advise a shared instance:

  ```js
  class MyClass {
    constructor() {
      this._localizeManager = getLocalizeManger();
    }
    // ...
  }
  ```

  Make sure to always call this method inside a function or class (otherwise side effects are created)

  Do you want to register your own LocalizeManager?
  Make sure it's registered before anyone called `getLocalizeManager()`

  ```js
  import { singletonManager } from 'singleton-manager';
  import { getLocalizeManger } from '@lion/ui/localize-no-side-effects.js';

  // First register your own LocalizeManager (for deduping or other reasons)
  singletonManager.set('lion/ui::localize::0.x', class MyLocalizeManager extends LocalizeManager {});

  // Now, all your code gets the right instance
  export function myFn() {
    const localizeManager = getLocalizeManager();
    // ...
  }

  export class myClass() {
    constructor() {
      this._localizeManager = getLocalizeManager();
      // ...
    }
  }
  ```

- 0efce8e1: [localize] parse negative numbers
- a47a6e61: lion-select: added test to assert that modelValue of lion-select is updated when the value or text of one or more options are changed

## 0.1.0

### Minor Changes

- a4ffebbd: Release `@lion/ui` beta 0.1.0

### Patch Changes

- 851329ee: [localize] Correct msgLit return type to include DirectiveResult

## 0.0.14

### Patch Changes

- a5330c92: Unresolved icons to not cause a fatal error, but console.error instead. Missing assets shouldn't prevent the rest of the application from rendering.
- d204195c: Updated the return type of `localizeNamespaces()` of the localize mixin to allow `NamespaceObject[]`
- 87e565ca: fix: overlay docs error: 'return' outside of function

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
