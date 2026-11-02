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
2. **The caller hands the suite the elements it should run against.** Every runner takes one option
   object and destructures it, with Lion's own element declared as the default **on the role itself**:

   ```js
   // inside every runner: the default for a role is Lion's own element
   classes: { host = LionAccordion, invoker = 'h2', content = 'div' } = {},
   ```

   That is what keeps a call site short - you pass the roles you replaced and leave the rest alone:

   ```js
   runAccordionSuite({ classes: { host: MyAccordion } }); // the slots are still `h2` and `div`
   runCollapsibleSuite({ classes: { host: MyCollapsible, invoker: 'button' } });
   ```

   `host` is the element under test, the same key in every runner; the other keys are the roles the
   suite renders - the component's public slots plus the elements it assembles - named after Lion's tag
   names without the `lion-` prefix (`invoker`, `content`, `option`, `tabs`, `fieldset`, …). A role
   takes a **class** or, for a native element, its **tag**. For a class, the **registered tag** is used
   when it has one (that is what keeps a scoped child working); a subclass element is defined on the fly
   when it does not. A suite is never host-only: every element its fixtures render has a role.

3. **Every element a suite renders has a role.** A component's public slots are roles
   (`runAccordionSuite` and `runCollapsibleSuite`: `invoker`, `content`), a composite lists what it
   renders (`runFormSuite`: `checkbox-group`, `radio-group`, `fieldset`, `checkbox`, `listbox`,
   `option`, `radio`), and a suite that assembles its own subject names that subject `host` too and
   names what it assembles (`parent`, `child`, `portal`). The type is `SuiteConfig<Roles, Options>`
   from `@lion/ui/types/test-suites.js` - one type for every runner, narrowed to the roles and options
   that runner has. Everything the caller leaves out keeps Lion's own element for that role, which is
   the default inside the runner, not something a call site passes.
4. **The caller supplies the test framework.** Suites use the ambient Mocha globals
   (`describe`/`it`/`beforeEach`) and `@open-wc/testing` fixtures; your test file needs the same
   module graph as Lion's own `test/` files (see `web-test-runner.config.mjs`, including the
   scoped-custom-element-registry polyfill for the scoped registry setup).
5. **`classes` is the surface, and every suite is prefilled with it.** A runner starts from Lion's own
   elements for the roles it resolves, so calling it without arguments runs the guarantees against
   Lion; an extension layer hands its own elements for the roles it replaces.
6. **A suite asserts through its page object, not through Lion's markup.** `runDatepickerSuite` takes
   `InputObject` (default `DatepickerInputObject`) and `runCalendarSuite` takes `CalendarObject`
   (default `CalendarObject`, both from the `*-test-helpers.js` entry points), and every node
   reference and user action goes through them — the suite itself never queries
   `.calendar-overlay…`, `.calendar__previous-button` or `#close-button`. An extension layer whose
   markup differs passes its own subclass overriding the node getters (`overlayRootEl`,
   `overlayHeaderEl`, `overlayHeadingEl`, `overlayCloseButtonEl`, `overlayEl`; `previousYearButtonEl`
   and friends for the calendar) instead of the suite learning about that markup. The datepicker's
   inner calendar comes from `InputObject.calendarEl` too — that getter reads the element's own
   `_calendarNode`, so no tag is needed there either.
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
  element from Lion mixins; the map can only replace the outermost element.
- The `LionButtonSuite*`, `runLionMenuSuite` and `runMoreButtonMenuMixinSuite` runners are not
  exported yet, so they cannot be consumed from `@lion/ui/exports/*`.
- `runListboxMixinSuite` still queries the literal `lion-option` in a few places and
  `runChoiceGroupMixinSuite` hard-codes `<lion-fieldset>`; a subclasser that renames those tags will
  see those specific assertions fail.
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
- `runOverlayMixinSuite` and `runWithHoverInteractionSuite` take a prebuilt element (an `unsafeStatic`
  tag object) as _required_ input: the caller builds that element, so there is no Lion element for the
  suite to default to. Every other runner (59 of 61) takes `classes`.
- `fieldset` has no suite of its own because it has no behaviour of its own: its whole test file runs
  the two form-group runners against it.
- Unit tests of plain functions are deliberately not suites: `IconManager`, the file validators of
  `input-file`, and the `formatters`/`parsers`/`validators` files of `input-amount` and
  `input-iban` test exported functions, not elements.
- `input-amount`'s "override the currency label slot" test registers a fixed `my-input-amount` tag
  of its own; a suite runner for `input-amount` therefore cannot use that tag name for its own
  binding.
