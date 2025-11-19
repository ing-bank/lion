# @lion/ui

## 0.15.3

### Patch Changes

- 579e42b: fix(LionInputStepper): improve handling of decimal step values and alignment closes #2615
- 9105f50: fix(ValidateMixin): no dispatch validators on readOnly form items
- b64f520: [lion-input-stepper]: add component label to aria-label of increase and decrease buttons

## 0.15.2

### Patch Changes

- e6a8fa7: [input-amount-dropdown] add translations
- abcc6fd: fix hidesOnEsc for nested overlays

## 0.15.1

### Patch Changes

- f8dda40: [listbox] fix rendering for lazy slottables

## 0.15.0

### Minor Changes

- 6e0ed97: Make the manager singletons get instantiated and registered lazily.

### Patch Changes

- 02d0106: [input-stepper] make decrement and increment functions protected instead of private
- Updated dependencies [6e0ed97]
  - singleton-manager@1.8.0

## 0.14.3

### Patch Changes

- 5360c5a: [select-rich] improve rendering by the `lit` `cache` function

## 0.14.2

### Patch Changes

- da22fdb: [overlays] allow the popup dialog to close when it is setup by `lit` `cache`

## 0.14.1

### Patch Changes

- f6860c4: exports amount-dropdown types

## 0.14.0

### Minor Changes

- 57800c4: adds the lion-input-amount-dropdown component

## 0.13.1

### Patch Changes

- 63454c2: add `@slot` and `@customElements` meta data for custom-elements manifest
- 63454c2: cleanup IE11 code in LionButton
- 713429a: adds configuration options to the success message validation

## 0.13.0

### Minor Changes

- fb0813b: [overlays]: don't use hidesOnOutsideEsc in configs, as it disallows nested overlays (a11y concern)
- da46980: [overlays]: avoid interference of native dialog escape handler and escape handlers defined by OverlayController.
  This is needed until we can configure `closedby="none"` on the native dialog for all browsers: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby.
  (We release this as a minor change, as we stop propagation of HTMLDialogElement 'cancel' and 'close' events, and some consumers might (ab)use them...)

### Patch Changes

- 9a80ba9: [form-core]: make focusableNode teardown defensive in case the node doesn't exist
- 9a80ba9: [overlays]: make sure that edge cases where overlays are connected and immediately disconnected, are covered well
- 4460db7: Fix @open-wc/dedupe-mixin version conflict
- 57eec5b: fix: make sure helpText and label respond to empty strings
- f19befe: [combobox] fix preselection in combobox when modelValue present
- 64b72a0: [form-core] make sure renamed Required validator are identified as such, while remaining compatible with multiple versions
- 765a1a2: Fixed disabled and readonly attribute handling for lion-combobox

## 0.12.0

### Minor Changes

- 9a4a873: Editing negative numbers in LionInputAmount become possible both with '-' and '\u2212'

## 0.11.6

### Patch Changes

- 85666d6: feat(input-tel): use first preferred region to set a default region
- dc5d224: fix(input-tel): use full locale to translate country names in dropdown

## 0.11.5

### Patch Changes

- a0d334d: Added initial Turkish (tr.js / tr-TR.js) translation files for the following components:
  - input-datepicker
  - calendar
  - form-core
  - overlays
  - pagination
  - validate-messages

- cbe8f86: [input-file] set buttonLabel initially
- f9f5519: LionInputFile: Customize the text content of the selected files for screen reader if uploadOnSelect is enabled
- cf4a8fd: [input-stepper] align value with step value
- 07b089e: [validate-mixin] determine if a required validator or result validator has been registered based on characteristics

## 0.11.4

### Patch Changes

- 3c77296: [form-core] make sure that slots with property fallbacks ignore initialization updates (not defined on firstUpdated). See https://stackblitz.com/edit/vitejs-vite-encdg2xd?file=lion-demo.js

## 0.11.3

### Patch Changes

- 1769e29: [combobox] do not submit form if overlay of combobox is opened and ENTER is hit

## 0.11.2

### Patch Changes

- a181a03: [localize] Fix bug that accepted 3 digit year
- 163af2e: prepared documentation for cross-compatibility rocket and astro

## 0.11.1

### Patch Changes

- 22b8f24: [lion-checkbox-indeterminate] Fix bugs regarding disabled and pre-checked children
- d86c1f7: [select-rich] block arrow key interaction when singleOption is set

## 0.11.0

### Minor Changes

- 29b729e: [input-amount] make sure that previous locale is not used for parsing on user-edit with <= 2 decimals

### Patch Changes

- b983379: [validate-messages] updated translation of the MinNumber and MaxNumber validation error messages, so that endpoint is included.
- 41fecd3: [select-rich] allow arrowLeft and arrowRight to change the value when navigateWithinInvoker is true and dropdown is closed

## 0.10.1

### Patch Changes

- dd59812: [dialog] add an option to set role="alertdialog" instead of the default role="dialog"
- 5344fde: [core] rerender direct host child with right slot attr when root is switched
- a1d6dd9: [button] set the 'aria-disabled' attribute to 'true' when disabled and remove it when not disabled
- 81e2a1d: [calendar] add translations for an information message for screen reader users when a date is disabled
- 795237d: [form-core] add aria-hidden=true to the graphic element of the choiceInput
- 2155e45: [overlays] add tabindex="-1" to prevent tooltips get focus in Safari and Firefox

## 0.10.0

### Minor Changes

- 35e6605: [form-core] add "user-edited" mode to formatOptions while editing existing value of a form control
- 8377e8d: [overlays]: rework setup and teardown logic of OverlayMixin (allow to reconnect offline dom nodes; allow moving dom nodes in performant way)

### Patch Changes

- 45f0666: [input-amount]: when an existing value is edited (preformatted), stick with the same heuristic for interpreting separators (commas, dots, spaces), namely: `withLocale`
- e5ff2b0: [overlays]: overlayController teardown cleanup (removes logs in test files)
- 8377e8d: [overlays]: allow Subclassers to teardown at the right moment
- d5258d5: [form-core] enhance formatter and parser meta with viewValueStates

## 0.9.1

### Patch Changes

- 67f5735: [input-stepper] move role="spinbutton" and relevant aria attributes to the inputNode
- 0652492: [input-datepicker] replace spanish literal for openDatepickerLabel
- a256f73: [input-tel-dropdown] remove the country telephone code from the modelValue on init, only have it as viewValue
- e117884: show overlay based on overridden "\_showOverlayCondition"

## 0.9.0

### Minor Changes

- 5dc2205: [input-stepper] add aria-valuemin, aria-valuemax and an option to set aria-valuetext

### Patch Changes

- 3d49a41: prevent click on disabled elements
- 382a9aa: make sure that voiceover + safari modals are accessible

## 0.8.8

### Patch Changes

- eac4312: [lion-pagination] announce current page

## 0.8.7

### Patch Changes

- a51e28d: fix(calendar): align central date with dynamic disabled dates
- 3e13ade: make web-test-runner statements checking `documentOrShadowRoot.activeElement` debuggable by exposing
  a test-helper method `isActiveElement`.

## 0.8.6

### Patch Changes

- faca191: no registration of same class twice w/o scoped-registries polyfill
- 86ca2e0: [overlays] Fixed memory leak caused adopted style cache and the `OverlayMixin` not releasing the `OverlayController` on teardown
- 2a989f4: [overlays] now closes when iframe loses focus

## 0.8.5

### Patch Changes

- 9b92fa2: Add unique ['_$isValidator$']

## 0.8.4

### Patch Changes

- 0582868: expand script that corrects types after build
- a4f654a: fix(ui/types): export FocusHost type from types/form-core.js

## 0.8.3

### Patch Changes

- 360641c: [overlays] no hiding of nested overlays having `hideOnEsc` configured
- 03a9b33: revert es version in tsconfig (as it was breaking types)

## 0.8.2

### Patch Changes

- 2c38a91: [core] make scoped-elements ssr-compatible
- da5ae67: [localize] make sure LocalizeManager does not crash with lit-ssr
- 1626dbd: improve test experience in dev-mode by limiting verbose warnings
- 7c2b469: [validation-feedback] do not display type of the validation feedback message, if there is no message

## 0.8.1

### Patch Changes

- 2d4fb0e: [form-core] make \_setFocusOnFirstErroneousFormElement work for checkbox-group, radio-group and nested fieldsets
- 7baecb5: [localize] make LocalizeManager ssr-compatible

## 0.8.0

### Minor Changes

- 27af6be: [combobox] change mimicUserTyping test helper function async and use sendKeys() internally

### Patch Changes

- 5530eef: fix(ui/calendar): use correct firstUpdated type signature
- dbb9640: [core] fix chromium detection
- 96b09e5: [accordion] make accordion closeable again

## 0.7.9

### Patch Changes

- 4696ad7: [accordion] new "exclusive" feature, allowing one opened collapsible at a time
- 5ce7fee: [validate-messages] set correct fieldName to required select validation message.

## 0.7.8

### Patch Changes

- 9f7935c: [input-datepicker] Fix a locale bug
- bb1f347: [calendar] Now central date would be nearest enabled date if today is disabled

## 0.7.7

### Patch Changes

- bca25bc: fix: [overlays] avoid growing margin when using `preventsScroll: false`
- 02a9427: [combobox] reset listbox options on click/enter for multiple-choice
- ac9d16b: [input-file] fix the bug that accept attribute in the input field didn't work properly
- e0ef676: opened-changed event detail exposes opened state
- 61bf8cb: [select-rich] sets and removes the button role and aria attributes on change of singleOption
- 719991f: add "aria-expanded" attribute only for the non-modal dialogs

## 0.7.6

### Patch Changes

- 58796de: improve deep-contains function so it works correctly with slots
- f9ba215: [overlays] prevent closing of a modal dialog on pressing Esc and hidesOnEsc is set to false
- cdf0a9e: [input-stepper] add parseNumber and formatNumber to format the value based on locale

## 0.7.5

### Patch Changes

- 1dce98d: fix focus first erroneous for listbox

## 0.7.4

### Patch Changes

- 3dbee0c: [FeedbackValidation] add a translation of the validation feedback type to the beginning of the validation message
- 08a1cb1: [tabs] make tab panels focusable
- 57597bb: [form-core] Updated behavior of name attribute in FormRegisteringMixin to convert values to string type
- 58d56b2: [input-file] add files more than once doesn't overwrite model value anymore
- b2d7d9b: [input-file] improve a11y labels
- b50b960: [combobox] update the code to when show and hide the overlay, to be more robust

## 0.7.3

### Patch Changes

- 08d13e1: Now prints console error when shadowRoot is not found

## 0.7.2

### Patch Changes

- 36f0bbce: [select-rich] only close the overlay on tab when trapsKeyboardFocus is false

## 0.7.1

### Patch Changes

- 3a1482f7: Fix [ArrowUp]/[ArrowDown] not registering as user interaction when done directly on the select-rich component
- a53ded7e: [localize] make use of formatDate locale option to parse the date correctly, which prevents day and month jumping in the input-amount when e.g. en-GB is used on the html tag and en-US is used to format the date.

## 0.7.0

### Minor Changes

- 3cef9164: [select-rich] fix readonly keyboard interaction
- 3cef9164: [select-rich] export getSelectRichMembers test helper

### Patch Changes

- 3cef9164: [input-amount] returns Unparseable as a modelValue if a wrong value has been entered
- 3cef9164: [core] allow browserDetection to be run in ssr context
- 3cef9164: [lion-input-tel-dropdown] Focus input fieled after dropdown menu is closed

## 0.6.1

### Patch Changes

- 37deecd2: Added support for cross-root registration by adding a flag to composed property of form-element-register event.
- f0333bbc: [core/SlotMixin] allow to (re)render scoped elements as direct light dom child

## 0.6.0

BREAKING:

- [form] set focus to the first erroneous form element on submit (mildly breaking, since it could conflict with custom focus management)
- Update to lit version 3
- Moved to scoped-elements v3

### Patch Changes

- [input-tel-dropdown] use ScopedElementsMixin in to run test-suite with select-rich
- [core] add Firefox to browserDetection
- [textarea] set box-sizing in tests to make it work cross browser
- [input-stepper] fix the toggling of the disabled state for the buttons
- [core] update types for ScopedElementsMixin
- [form-core] order aria-labelledby and aria-describedby based on slot order instead of dom order
- [input-range] add screen-reader labels for minimum and maximum value
- [form-core] remove fieldset label/helpt-text from input-field aria-labelledby/aria-describedby. See https://github.com/ing-bank/lion/issues/1576
- [validation-messages] get correct validation min and max dates in French
- [form-core]: set aria-disabled next to the disabled attribute for NVDA screen reader
- [input-stepper] a11y enhancement & added translations
- [checkbox-group] add role="list" and role="listitem" to checkbox-indeterminate and its children

## 0.5.6

### Patch Changes

- e6b8dd14: [@lion/ui]: Fix "Multiple versions of Lit loaded." by pinning `@open-wc/scoped-elements` version.
- 8b7cc43f: feat: allow SlotRerenderObject to first render on connectedCallback via `firstRenderOnConnected`

## 0.5.5

### Patch Changes

- e72fd6d6: [form-core] add operationMode to ValidateMixin, to create specific select and upload required messages
- 36bf8c6f: Uncommented a previously commented line since this is probably a mistake and breaks functionality
- 91fad701: fix: only use elementToFocusAfterHide when provided as HTMLElement
- cf616e1e: [input-tel-dropdown] prevent jumping to input field on each arrow key in windows/linux

## 0.5.4

### Minor Changes

- aeab467c: [input-stepper] a11y enhancement & added translations

### Patch Changes

- aeab467c: [checkbox-group] add role="list" and role="listitem" to checkbox-indeterminate and its children
- aeab467c: migrate deprecated `performUpdate` api to `scheduleUpdate`
- aeab467c: [form-core]: set aria-disabled next to the disabled attribute for NVDA screen reader
- aeab467c: [form-core] remove fieldset label/helpt-text from input-field aria-labelledby/aria-describedby. See https://github.com/ing-bank/lion/issues/1576
- aeab467c: [input-range] add screen-reader labels for minimum and maximum value
- aeab467c: feat: split validate-messages-no-side-effects methods, so they can be bundled along with entrypoints.

  For optimized bundling, it's reccommended to load feedback messages per entrypoint. For instance, when you only use form-core in your app:

  ```js
  import { LionInputTel } from '@lion/ui/input-tel.js';
  import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
  import { loadInputTelMessagesNoSideEffects } from '@lion/ui/validate-messages-no-side-effects.js';

  export class MyInputTel extends LionInputTel {
    constructor() {
      super();
      loadInputTelMessagesNoSideEffects({ localize: getLocalizeManager() });
    }
  }
  ```

  This prevents you from loading unused entrypoints like input-tel (which loads a full phone validation library) etc.

- aeab467c: [form-core] order aria-labelledby and aria-describedby based on slot order instead of dom order

## 0.5.3

### Patch Changes

- 69c9da8f: [validation-messages] get correct validation min and max dates in French

## 0.5.2

### Patch Changes

- d997e523: [tooltip] hide tooltip if the invoker gets disabled
- c80bca7c: Fix scroll behavior when closing an overlay
- db96e8cc: fix(tabs): set selectedIndex only if value differ from previous value

## 0.5.1

### Patch Changes

- 9b5edf30: [localize] parseDate by default to 2000 instead of 1900 when date is below 49
- bf782223: do not run disabled property reflection unless it was part of the changeset in LionSwitchButton
- 322b0652: Export isIOS and isMacSafari functions as part of browserDetection utility
- 322b0652: Use traditional styleSheet on IOS for overlays
- bf782223: reuse uuid function from the core in LionButton and LionInputDatepicker
- bf782223: invoke parent class updated callback in LionCollapsible, LionDrawer and LionSwitchButton
- cb25a603: fix: DE locale typo for validation messages
- Updated dependencies [ef9b1e4c]
  - singleton-manager@1.7.0

## 0.5.0

### Minor Changes

- 7f644cd7: feat: [combobox] add `allow-custom-choice` (former requireOptionMatch=false) and make it compatible with `multiple-choice`

### Patch Changes

- be4e25a1: fix: [combobox] single choice with `allow-custom-choice`(former requireOptionMatch=false) doesn't clear selection
- e923ba40: fix: [radio-group] resetting a radio-group containing options with formatters doesn't check the default value
- 7235a4f7: fix: [combobox] model-value-changed event emitted when clearing a combobox sends stale value
- c459ded9: fix: [combobox] autocomplete feature for the lion-combobox component. It used to autoselect a wrong item

## 0.4.2

### Patch Changes

- b1320a9a: avoid calling push in iterable object to avoid error loading overlays in old chromium versions
- dcf3a4b0: Fix search issues when modifying the middle of the input word in LionCombobox.
- be36bf3b: Fix accessibility currency linking to label after setting currency from undefined in LionInputAmount.
- 63a8e725: lion-calendar: when determining if user interacted with a day button, use event.composedPath()[0] instead of event.target to fix Firefox 111+ issue

## 0.4.1

### Patch Changes

- a58d8ce0: export more type definitions

## 0.4.0

### Minor Changes

- a3738b50: Bypass the requirement to support export & import map to consume @lion/ui

### Patch Changes

- ebe13e14: fix: undefined document.body
- b0a74f28: fix(progress-indicator): accept 0 as a valid value
- b89d889f: Render exactly 6 weeks in every months.
- 9b9485db: [calendar] focusCentralDate function should only use buttons inside the dates table
- d1f92a3a: Make disabled date buttons not selectable via keyboard navigation in LionCalendar.
- d597c077: [localize] with localizeNameSpaces type
- 6ccfb278: [input-datepicker] only disable dates is the validator type is "error"
- 4cc72b12: feat: allow Required validator on Fieldset and Form;
- cecf5ed5: lion-accordion now replaces expanded with a copy when it changes on click of an invoker button.
- 857d47a9: Handle focusin event in invokers in LionAccordion. Fix tabbing issues.

## 0.4.0-prerelease-bypass-export-map.0

### Minor Changes

- Bypass the requirement to support export & import map to consume @lion/ui

## 0.3.5

### Patch Changes

- 5eafa1ff: hide overlay arrow from screen readers

## 0.3.4

### Patch Changes

- b44bfc5d: [calendar] updates:
  - Enables focus to disabled dates to make it more reasonable for screen readers
  - Do not automatically force selection of a valid date
  - Add helper functions to find next/previous/nearest enabled date

- 137a1b6c: lion-input-file: added isDragging property

## 0.3.3

### Patch Changes

- ecf853db: fixed exporting types of lion-input-file

## 0.3.2

### Patch Changes

- 259e0dd4: lion-selected-filelist: removed composed: true and bubbles: true and set eventlistener directly on lion-selected-file-list inside lion-input-file

## 0.3.1

### Patch Changes

- 7ec90dcb: add CheckboxIndeterminate test suite
- 1ea5730a: [localize] align currency symbol usage for all browsers
- 33c0ff13: Added vs-code json file to enable auto-completion
- dbc3fc2d: [combobox] submits form on [Enter]

## 0.3.0

### Minor Changes

- e310c08a: fix: LionInputDatePicker enters an endless loop on InvalidDate modelValue
- d2de984f: [input-file] Create input-file component
- 68934217: fix(ui): align light dom with internal [reactivity cycle of LitElement/ReactiveElement](https://lit.dev/docs/components/lifecycle/#reactive-update-cycle).
  Since light dom render is now aligned inside `update` instead of `updated` (like it already was for shadow dom),
  we can rely on the fact that all dom (light and shadow) has rendered inside our `updated` loop.

### Patch Changes

- bdc74556: Allow customization of currency label's slot in Input Amount
- 2683a730: [FocusMixin] now syncs autofocus between host and the focusable node.

## 0.2.2

### Patch Changes

- 88e6ca03: [localize] parseNumbers as heuristic if there is only 1 separator and 2 or less decimals e.g. 12.34

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
    ] marker to identify Validator instances across different lion versions.
    It's meant to be used as a replacement for an `instanceof` check.

## 0.8.4

### Patch Changes

- 0582868: expand script that corrects types after build
- a4f654a: fix(ui/types): export FocusHost type from types/form-core.js

## 0.8.3

### Patch Changes

- 360641c: [overlays] no hiding of nested overlays having `hideOnEsc` configured
- 03a9b33: revert es version in tsconfig (as it was breaking types)

## 0.8.2

### Patch Changes

- 2c38a91: [core] make scoped-elements ssr-compatible
- da5ae67: [localize] make sure LocalizeManager does not crash with lit-ssr
- 1626dbd: improve test experience in dev-mode by limiting verbose warnings
- 7c2b469: [validation-feedback] do not display type of the validation feedback message, if there is no message

## 0.8.1

### Patch Changes

- 2d4fb0e: [form-core] make \_setFocusOnFirstErroneousFormElement work for checkbox-group, radio-group and nested fieldsets
- 7baecb5: [localize] make LocalizeManager ssr-compatible

## 0.8.0

### Minor Changes

- 27af6be: [combobox] change mimicUserTyping test helper function async and use sendKeys() internally

### Patch Changes

- 5530eef: fix(ui/calendar): use correct firstUpdated type signature
- dbb9640: [core] fix chromium detection
- 96b09e5: [accordion] make accordion closeable again

## 0.7.9

### Patch Changes

- 4696ad7: [accordion] new "exclusive" feature, allowing one opened collapsible at a time
- 5ce7fee: [validate-messages] set correct fieldName to required select validation message.

## 0.7.8

### Patch Changes

- 9f7935c: [input-datepicker] Fix a locale bug
- bb1f347: [calendar] Now central date would be nearest enabled date if today is disabled

## 0.7.7

### Patch Changes

- bca25bc: fix: [overlays] avoid growing margin when using `preventsScroll: false`
- 02a9427: [combobox] reset listbox options on click/enter for multiple-choice
- ac9d16b: [input-file] fix the bug that accept attribute in the input field didn't work properly
- e0ef676: opened-changed event detail exposes opened state
- 61bf8cb: [select-rich] sets and removes the button role and aria attributes on change of singleOption
- 719991f: add "aria-expanded" attribute only for the non-modal dialogs

## 0.7.6

### Patch Changes

- 58796de: improve deep-contains function so it works correctly with slots
- f9ba215: [overlays] prevent closing of a modal dialog on pressing Esc and hidesOnEsc is set to false
- cdf0a9e: [input-stepper] add parseNumber and formatNumber to format the value based on locale

## 0.7.5

### Patch Changes

- 1dce98d: fix focus first erroneous for listbox

## 0.7.4

### Patch Changes

- 3dbee0c: [FeedbackValidation] add a translation of the validation feedback type to the beginning of the validation message
- 08a1cb1: [tabs] make tab panels focusable
- 57597bb: [form-core] Updated behavior of name attribute in FormRegisteringMixin to convert values to string type
- 58d56b2: [input-file] add files more than once doesn't overwrite model value anymore
- b2d7d9b: [input-file] improve a11y labels
- b50b960: [combobox] update the code to when show and hide the overlay, to be more robust

## 0.7.3

### Patch Changes

- 08d13e1: Now prints console error when shadowRoot is not found

## 0.7.2

### Patch Changes

- 36f0bbce: [select-rich] only close the overlay on tab when trapsKeyboardFocus is false

## 0.7.1

### Patch Changes

- 3a1482f7: Fix [ArrowUp]/[ArrowDown] not registering as user interaction when done directly on the select-rich component
- a53ded7e: [localize] make use of formatDate locale option to parse the date correctly, which prevents day and month jumping in the input-amount when e.g. en-GB is used on the html tag and en-US is used to format the date.

## 0.7.0

### Minor Changes

- 3cef9164: [select-rich] fix readonly keyboard interaction
- 3cef9164: [select-rich] export getSelectRichMembers test helper

### Patch Changes

- 3cef9164: [input-amount] returns Unparseable as a modelValue if a wrong value has been entered
- 3cef9164: [core] allow browserDetection to be run in ssr context
- 3cef9164: [lion-input-tel-dropdown] Focus input fieled after dropdown menu is closed

## 0.6.1

### Patch Changes

- 37deecd2: Added support for cross-root registration by adding a flag to composed property of form-element-register event.
- f0333bbc: [core/SlotMixin] allow to (re)render scoped elements as direct light dom child

## 0.6.0

BREAKING:

- [form] set focus to the first erroneous form element on submit (mildly breaking, since it could conflict with custom focus management)
- Update to lit version 3
- Moved to scoped-elements v3

### Patch Changes

- [input-tel-dropdown] use ScopedElementsMixin in to run test-suite with select-rich
- [core] add Firefox to browserDetection
- [textarea] set box-sizing in tests to make it work cross browser
- [input-stepper] fix the toggling of the disabled state for the buttons
- [core] update types for ScopedElementsMixin
- [form-core] order aria-labelledby and aria-describedby based on slot order instead of dom order
- [input-range] add screen-reader labels for minimum and maximum value
- [form-core] remove fieldset label/helpt-text from input-field aria-labelledby/aria-describedby. See https://github.com/ing-bank/lion/issues/1576
- [validation-messages] get correct validation min and max dates in French
- [form-core]: set aria-disabled next to the disabled attribute for NVDA screen reader
- [input-stepper] a11y enhancement & added translations
- [checkbox-group] add role="list" and role="listitem" to checkbox-indeterminate and its children

## 0.5.6

### Patch Changes

- e6b8dd14: [@lion/ui]: Fix "Multiple versions of Lit loaded." by pinning `@open-wc/scoped-elements` version.
- 8b7cc43f: feat: allow SlotRerenderObject to first render on connectedCallback via `firstRenderOnConnected`

## 0.5.5

### Patch Changes

- e72fd6d6: [form-core] add operationMode to ValidateMixin, to create specific select and upload required messages
- 36bf8c6f: Uncommented a previously commented line since this is probably a mistake and breaks functionality
- 91fad701: fix: only use elementToFocusAfterHide when provided as HTMLElement
- cf616e1e: [input-tel-dropdown] prevent jumping to input field on each arrow key in windows/linux

## 0.5.4

### Minor Changes

- aeab467c: [input-stepper] a11y enhancement & added translations

### Patch Changes

- aeab467c: [checkbox-group] add role="list" and role="listitem" to checkbox-indeterminate and its children
- aeab467c: migrate deprecated `performUpdate` api to `scheduleUpdate`
- aeab467c: [form-core]: set aria-disabled next to the disabled attribute for NVDA screen reader
- aeab467c: [form-core] remove fieldset label/helpt-text from input-field aria-labelledby/aria-describedby. See https://github.com/ing-bank/lion/issues/1576
- aeab467c: [input-range] add screen-reader labels for minimum and maximum value
- aeab467c: feat: split validate-messages-no-side-effects methods, so they can be bundled along with entrypoints.

  For optimized bundling, it's reccommended to load feedback messages per entrypoint. For instance, when you only use form-core in your app:

  ```js
  import { LionInputTel } from '@lion/ui/input-tel.js';
  import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
  import { loadInputTelMessagesNoSideEffects } from '@lion/ui/validate-messages-no-side-effects.js';

  export class MyInputTel extends LionInputTel {
    constructor() {
      super();
      loadInputTelMessagesNoSideEffects({ localize: getLocalizeManager() });
    }
  }
  ```

  This prevents you from loading unused entrypoints like input-tel (which loads a full phone validation library) etc.

- aeab467c: [form-core] order aria-labelledby and aria-describedby based on slot order instead of dom order

## 0.5.3

### Patch Changes

- 69c9da8f: [validation-messages] get correct validation min and max dates in French

## 0.5.2

### Patch Changes

- d997e523: [tooltip] hide tooltip if the invoker gets disabled
- c80bca7c: Fix scroll behavior when closing an overlay
- db96e8cc: fix(tabs): set selectedIndex only if value differ from previous value

## 0.5.1

### Patch Changes

- 9b5edf30: [localize] parseDate by default to 2000 instead of 1900 when date is below 49
- bf782223: do not run disabled property reflection unless it was part of the changeset in LionSwitchButton
- 322b0652: Export isIOS and isMacSafari functions as part of browserDetection utility
- 322b0652: Use traditional styleSheet on IOS for overlays
- bf782223: reuse uuid function from the core in LionButton and LionInputDatepicker
- bf782223: invoke parent class updated callback in LionCollapsible, LionDrawer and LionSwitchButton
- cb25a603: fix: DE locale typo for validation messages
- Updated dependencies [ef9b1e4c]
  - singleton-manager@1.7.0

## 0.5.0

### Minor Changes

- 7f644cd7: feat: [combobox] add `allow-custom-choice` (former requireOptionMatch=false) and make it compatible with `multiple-choice`

### Patch Changes

- be4e25a1: fix: [combobox] single choice with `allow-custom-choice`(former requireOptionMatch=false) doesn't clear selection
- e923ba40: fix: [radio-group] resetting a radio-group containing options with formatters doesn't check the default value
- 7235a4f7: fix: [combobox] model-value-changed event emitted when clearing a combobox sends stale value
- c459ded9: fix: [combobox] autocomplete feature for the lion-combobox component. It used to autoselect a wrong item

## 0.4.2

### Patch Changes

- b1320a9a: avoid calling push in iterable object to avoid error loading overlays in old chromium versions
- dcf3a4b0: Fix search issues when modifying the middle of the input word in LionCombobox.
- be36bf3b: Fix accessibility currency linking to label after setting currency from undefined in LionInputAmount.
- 63a8e725: lion-calendar: when determining if user interacted with a day button, use event.composedPath()[0] instead of event.target to fix Firefox 111+ issue

## 0.4.1

### Patch Changes

- a58d8ce0: export more type definitions

## 0.4.0

### Minor Changes

- a3738b50: Bypass the requirement to support export & import map to consume @lion/ui

### Patch Changes

- ebe13e14: fix: undefined document.body
- b0a74f28: fix(progress-indicator): accept 0 as a valid value
- b89d889f: Render exactly 6 weeks in every months.
- 9b9485db: [calendar] focusCentralDate function should only use buttons inside the dates table
- d1f92a3a: Make disabled date buttons not selectable via keyboard navigation in LionCalendar.
- d597c077: [localize] with localizeNameSpaces type
- 6ccfb278: [input-datepicker] only disable dates is the validator type is "error"
- 4cc72b12: feat: allow Required validator on Fieldset and Form;
- cecf5ed5: lion-accordion now replaces expanded with a copy when it changes on click of an invoker button.
- 857d47a9: Handle focusin event in invokers in LionAccordion. Fix tabbing issues.

## 0.4.0-prerelease-bypass-export-map.0

### Minor Changes

- Bypass the requirement to support export & import map to consume @lion/ui

## 0.3.5

### Patch Changes

- 5eafa1ff: hide overlay arrow from screen readers

## 0.3.4

### Patch Changes

- b44bfc5d: [calendar] updates:
  - Enables focus to disabled dates to make it more reasonable for screen readers
  - Do not automatically force selection of a valid date
  - Add helper functions to find next/previous/nearest enabled date

- 137a1b6c: lion-input-file: added isDragging property

## 0.3.3

### Patch Changes

- ecf853db: fixed exporting types of lion-input-file

## 0.3.2

### Patch Changes

- 259e0dd4: lion-selected-filelist: removed composed: true and bubbles: true and set eventlistener directly on lion-selected-file-list inside lion-input-file

## 0.3.1

### Patch Changes

- 7ec90dcb: add CheckboxIndeterminate test suite
- 1ea5730a: [localize] align currency symbol usage for all browsers
- 33c0ff13: Added vs-code json file to enable auto-completion
- dbc3fc2d: [combobox] submits form on [Enter]

## 0.3.0

### Minor Changes

- e310c08a: fix: LionInputDatePicker enters an endless loop on InvalidDate modelValue
- d2de984f: [input-file] Create input-file component
- 68934217: fix(ui): align light dom with internal [reactivity cycle of LitElement/ReactiveElement](https://lit.dev/docs/components/lifecycle/#reactive-update-cycle).
  Since light dom render is now aligned inside `update` instead of `updated` (like it already was for shadow dom),
  we can rely on the fact that all dom (light and shadow) has rendered inside our `updated` loop.

### Patch Changes

- bdc74556: Allow customization of currency label's slot in Input Amount
- 2683a730: [FocusMixin] now syncs autofocus between host and the focusable node.

## 0.2.2

### Patch Changes

- 88e6ca03: [localize] parseNumbers as heuristic if there is only 1 separator and 2 or less decimals e.g. 12.34

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
