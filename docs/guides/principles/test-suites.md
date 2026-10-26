---
parts:
  - Principles
  - Test suites
title: 'Test suites'
eleventyNavigation:
  key: 'Principles: Test suites'
  order: 60
  parent: Principles
  title: Test suites
---

# Test suites

A _test suite_ is a reusable function that registers a group of `it()` blocks on the current
test runner context. Lion writes its own component tests as suites so that a Subclasser (a team
building a design system on top of Lion) can run the exact same behavioural guarantees against
its own elements, instead of copying our `test/` folders and re-asserting them by hand.

## Contract

Every exported runner follows the same shape:

```js
// call it at describe level, never inside an it(); it returns nothing
describe('my-input', () => {
  // `host` is the element under test; the other keys are the roles the suite renders
  runInputSuite({ classes: { host: MyInput, field: MyField } });
});
```

0. **A suite holds the whole test file it came from.** Moving a test file into a suite means moving
   _all_ of its element tests, not only the ones that happened to be extracted the first time. A test
   that stays behind in `test/` is a guarantee the Subclasser silently does not get. Unit tests of
   plain functions (`utils/`, `validate/`, `formatters`, `parsers`, `validators`) stay in `test/` on
   purpose: they describe no element.

1. **A runner registers tests, it does not run them.** It must be called while the runner is
   collecting tests (at module level or inside `describe()`), never inside an `it()`. The return
   value is always `undefined`.
2. **The caller hands the suite its classes.** `host` is the element under test — the same key for
   every runner — and the other keys are the roles the suite renders, named after Lion's tag names
   without the `lion-` prefix (`option`, `options`, `fieldset`, `input-datepicker`, …). Values are
   constructors:

   ```js
   runComboboxSuite({ classes: { host: MyCombobox, option: MyOption } });
   ```

   Lion's own element is the implicit default, so passing nothing runs your suite against Lion. For
   a role you give a class for, the class's **registered tag** is used when it has one (that is what
   keeps a scoped child working), and a subclass element is defined on the fly when it does not.
   A suite is therefore never host-only: every element its fixtures render has a key, and the ones
   you leave out stay Lion's.

   `klass` (a single class) and `tagString` (a tag you registered yourself) still work as the
   **deprecated fallback** for a caller that has no class map yet:

   ```js
   runInputSuite({ tagString: 'my-input' }); // deprecated, prefer classes
   ```

3. **Role keys are the same language as Lion's tags.** A composite suite lists the roles it renders
   (`runFormSuite`: `checkbox-group`, `radio-group`, `fieldset`, `checkbox`, `listbox`, `option`,
   `radio`; `runSelectRichSuite`: `option`, `tabs`; `runRadioGroupSuite`: `radio`). The element under
   test is always `host`, and a role you do not pass keeps Lion's own element. The mixin suites name
   their subject `host` like every other runner and name the elements they assemble (`parent`,
   `child`, `portal`). The older
   role keys (`childTagString`, `groupTagString`, `optionTagString`, `datepickerTagName`,
   `calendarTagName`, …) remain as the deprecated fallback for those roles.
4. **The caller supplies the test framework.** Suites use the ambient Mocha globals
   (`describe`/`it`/`beforeEach`) and `@open-wc/testing` fixtures; your test file needs the same
   module graph as Lion's own `test/` files (see `web-test-runner.config.mjs`, including the
   scoped-custom-element-registry polyfill for the scoped registry setup).
5. **`classes` is the promised surface, and Lion uses it internally too.** Every suite in this repo is
   called with `classes` — `klass`, `tagString` and the role tag keys exist only so an external
   caller written against the old shape keeps working, and they carry a deprecation note in the
   JSDoc. Each suite has a `*-classes.test.js` next to it that hands it a subclasser's own classes and
   runs the whole suite against them, which is the path an extension layer takes. Those probes hand
   the suite Lion's own elements (the implicit default) rather than a made-up subclass: an extension
   layer hands its own elements there instead. The fallback has no test of its own - it is deprecated,
   kept for backwards compatibility and nothing more.
6. **A suite asserts through its page object, not through Lion's markup.** `runDatepickerSuite` takes
   `InputObject` (default `DatepickerInputObject`) and `runCalendarSuite` takes `CalendarObject`
   (default `CalendarObject`, both from the `*-test-helpers.js` entry points), and every node
   reference and user action goes through them — the suite itself never queries
   `.calendar-overlay…`, `.calendar__previous-button` or `#close-button`. An extension layer whose
   markup differs passes its own subclass overriding the node getters (`overlayRootEl`,
   `overlayHeaderEl`, `overlayHeadingEl`, `overlayCloseButtonEl`, `overlayEl`; `previousYearButtonEl`
   and friends for the calendar) instead of the suite learning about that markup. The datepicker's
   inner calendar comes from `InputObject.calendarEl` too - that getter reads the element's own
   `_calendarNode`, so no tag is needed there either, and `calendarTagName`/`classes.calendar` are
   only the deprecated fallback for that one lookup.
7. **Accessibility is Lion's; styling and markup are the extension layer's.** So the accessible
   _name_ is asserted, but not the attribute it lives on: the suite reads it from `title`,
   `aria-label` or a `label` attribute, and the copy stays Lion's (localized messages). Asserting
   `getAttribute('title') === 'Close'` forces one mechanism on every design system and is what made
   3 of my-ui's accessibility tests fail although its invoker is perfectly accessible.
8. **Fixtures set what they assert.** Assertions about a week layout (weekday headers, arrow-key row
   navigation, previous/next-month day counts) put `.firstDayOfWeek=${0}` on the fixture instead of
   relying on the element's default — a design system that starts the week on Monday is not wrong,
   and `firstDayOfWeek` is property-only (`attribute: false`), so the attribute form is ignored. Where
   the grid only exists after an overlay opened, pin it on the rendered element
   (`openedCalendarEl.firstDayOfWeek = 0`) — before opening, the property lands on an element that
   gets re-rendered. The same rule covers the invoker's accessible name: that fixture carries
   `label="date"`, because the assertion is that the invoker _names the field_.

## Public entry points

Only `@lion/ui/exports/*` is importable, so suites are reached through the suite entry points.
**A runner belongs in an entry point only if its subject is itself public**: exposing
`runXSuite` for a mixin or class that cannot be imported from `@lion/ui/exports/*` promises a
contract the Subclasser cannot use, because running a mixin suite means extending that same mixin.
A non-exported mixin keeps its runner inside the package next to its own tests.

| entry point                                     | runners                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@lion/ui/accordion-test-suites.js`             | `runAccordionSuite`                                                                                                                                                                                                                                                                      |
| `@lion/ui/calendar-suites.js`                   | `runCalendarSuite`                                                                                                                                                                                                                                                                       |
| `@lion/ui/checkbox-group-test-suites.js`        | `runCheckboxIndeterminateSuite`                                                                                                                                                                                                                                                          |
| `@lion/ui/collapsible-test-suites.js`           | `runCollapsibleSuite`                                                                                                                                                                                                                                                                    |
| `@lion/ui/combobox-test-suites.js`              | `runComboboxSuite`                                                                                                                                                                                                                                                                       |
| `@lion/ui/dialog-test-suites.js`                | `runDialogSuite`                                                                                                                                                                                                                                                                         |
| `@lion/ui/drawer-test-suites.js`                | `runDrawerSuite`                                                                                                                                                                                                                                                                         |
| `@lion/ui/form-core-test-suites.js`             | `runFormatMixinSuite`, `runInteractionStateMixinSuite`, `runNativeTextFieldMixinSuite`, `runValidateMixinSuite`, `runValidateMixinFeedbackPart`, `runRegistrationSuite`, `runChoiceGroupMixinSuite`, `runChoiceInputMixinSuite`, `runFormGroupMixinSuite`, `runFormGroupMixinInputSuite` |
| `@lion/ui/form-test-suites.js`                  | `runFormSuite`                                                                                                                                                                                                                                                                           |
| `@lion/ui/icon-test-suites.js`                  | `runIconSuite`                                                                                                                                                                                                                                                                           |
| `@lion/ui/input-amount-dropdown-test-suites.js` | `runInputAmountDropdownSuite`                                                                                                                                                                                                                                                            |
| `@lion/ui/input-amount-test-suites.js`          | `runInputAmountSuite`                                                                                                                                                                                                                                                                    |
| `@lion/ui/input-date-test-suites.js`            | `runInputDateSuite`                                                                                                                                                                                                                                                                      |
| `@lion/ui/input-datepicker-suites.js`           | `runDatepickerSuite`                                                                                                                                                                                                                                                                     |
| `@lion/ui/input-email-test-suites.js`           | `runInputEmailSuite`                                                                                                                                                                                                                                                                     |
| `@lion/ui/input-file-test-suites.js`            | `runInputFileSuite`                                                                                                                                                                                                                                                                      |
| `@lion/ui/input-iban-test-suites.js`            | `runInputIbanSuite`                                                                                                                                                                                                                                                                      |
| `@lion/ui/input-range-test-suites.js`           | `runInputRangeSuite`                                                                                                                                                                                                                                                                     |
| `@lion/ui/input-stepper-suites.js`              | `runInputStepperSuites` (runs the stepper suite plus its form-core integrations)                                                                                                                                                                                                         |
| `@lion/ui/input-tel-dropdown-test-suites.js`    | `runInputTelDropdownSuite`, `runInputTelDropdownParenthesesSuite`                                                                                                                                                                                                                        |
| `@lion/ui/input-tel-test-suites.js`             | `runInputTelSuite`                                                                                                                                                                                                                                                                       |
| `@lion/ui/input-test-suites.js`                 | `runInputSuite`                                                                                                                                                                                                                                                                          |
| `@lion/ui/listbox-test-suites.js`               | `runListboxMixinSuite`                                                                                                                                                                                                                                                                   |
| `@lion/ui/menu-test-suites.js`                  | `runInteractiveListMixinSuite`, `runMultiLevelListMixinSuite`, `runLionMenuInteractionsSuite`                                                                                                                                                                                            |
| `@lion/ui/overlays-test-suites.js`              | `runOverlayMixinSuite`, `runWithHoverInteractionSuite`                                                                                                                                                                                                                                   |
| `@lion/ui/pagination-test-suites.js`            | `runPaginationSuite`                                                                                                                                                                                                                                                                     |
| `@lion/ui/progress-indicator-test-suites.js`    | `runProgressIndicatorSuite`                                                                                                                                                                                                                                                              |
| `@lion/ui/radio-group-test-suites.js`           | `runRadioSuite`, `runRadioGroupSuite`                                                                                                                                                                                                                                                    |
| `@lion/ui/select-rich-test-suites.js`           | `runSelectRichSuite`, `runSelectRichInteractionSuite`, `runSelectInvokerSuite`                                                                                                                                                                                                           |
| `@lion/ui/select-test-suites.js`                | `runSelectSuite`                                                                                                                                                                                                                                                                         |
| `@lion/ui/steps-test-suites.js`                 | `runStepSuite`                                                                                                                                                                                                                                                                           |
| `@lion/ui/switch-test-suites.js`                | `runSwitchSuite`                                                                                                                                                                                                                                                                         |
| `@lion/ui/tabs-test-suites.js`                  | `runTabsSuite`                                                                                                                                                                                                                                                                           |
| `@lion/ui/textarea-test-suites.js`              | `runTextareaSuite`                                                                                                                                                                                                                                                                       |
| `@lion/ui/tooltip-test-suites.js`               | `runTooltipSuite`                                                                                                                                                                                                                                                                        |

The fixtures a suite needs from the caller are the exported `*-test-helpers.js` entry points
(`@lion/ui/form-core-test-helpers.js`, `@lion/ui/listbox-test-helpers.js`,
`@lion/ui/input-test-helpers.js`, …). Helpers that live in a component's internal
`test-helpers/` folder are private to Lion and are not part of this contract.

## Not yet covered

- `runValidateMixinFeedbackPart`, `runRegistrationSuite` and the `form-group` runners build their
  element from Lion mixins; passing `tagString` only replaces the outermost element.
- The `LionButtonSuite*`, `runLionMenuSuite` and `runMoreButtonMenuMixinSuite` runners are not
  exported yet, so they cannot be consumed from `@lion/ui/exports/*`.
- `runListboxMixinSuite` still queries the literal `lion-option` in a few places instead of
  `optionTagString`, and `runChoiceGroupMixinSuite` hard-codes `<lion-fieldset>`; a subclasser that
  renames those tags will see those specific assertions fail.
- `runInteractiveListMixinSuite` and `runMultiLevelListMixinSuite` are exported from
  `@lion/ui/menu-test-suites.js` while `InteractiveListMixin` and `MultiLevelListMixin` are not
  re-exported from `@lion/ui/menu.js`, so a Subclasser cannot extend the mixin those suites
  describe. Either the mixins become public or these two runners move back into the package.
  `runMoreButtonMenuMixinSuite` and `runCustomChoiceGroupMixinSuite` are already internal, which is
  the right shape for a mixin that is not exported.
- Replacing a **child** element (`classes: { option: MyOption }`) only works when your own element
  registers that child in its own scope — its markup and lookups have to know the tag. A plain Lion
  subclass does not, which is why the in-repo probe passes the host only and the extension layer
  that motivated the feature exercises the child role in its own repository.
- `runOverlayMixinSuite` and `runWithHoverInteractionSuite` take `{ tagString, tag }` as a _required_
  input: the caller builds the element and hands over an `unsafeStatic` tag object, so there is no
  Lion element to default to and no deprecated key to fold into `classes`. Every other runner (59 of 61) takes `classes`.
- `fieldset` has no suite of its own because it has no behaviour of its own: its whole test file is
  `runFormGroupMixinSuite({ tagString: 'lion-fieldset' })` plus
  `runFormGroupMixinInputSuite({ tagString: 'lion-fieldset' })`.
- Unit tests of plain functions are deliberately not suites: `IconManager`, the file validators of
  `input-file`, and the `formatters`/`parsers`/`validators` files of `input-amount` and
  `input-iban` test exported functions, not elements.
- `input-amount`'s "override the currency label slot" test registers a fixed `my-input-amount` tag
  of its own; a suite runner for `input-amount` therefore cannot use that tag name for its own
  binding.
