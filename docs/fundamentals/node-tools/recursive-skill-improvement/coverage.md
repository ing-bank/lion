---
parts:
  - Node Tools
title: 'recursive-skill-improvement: use-case coverage'
eleventyNavigation:
  key: Node Tools >> recursive-skill-improvement use-case coverage
  parent: Node Tools >> recursive-skill-improvement
  title: Use-case coverage
  order: 40
---

# recursive-skill-improvement: use-case coverage

> **Generated — do not edit by hand.** Regenerate with:
>
> `npm run coverage:use-cases -w packages-node/recursive-skill-improvement`
>
> The script is `packages-node/recursive-skill-improvement/scripts/report-use-case-coverage.mjs`. It reads the
> `docs/components/*/use-cases.md` files, the scenario registry and `scenario-docs.json`.

Totals: **34** components with documented use cases, **170** documented
use cases, **34** components with a scenario, **32** with a behaviour
test, **167** documented use cases reachable from a scenario.

"Reachable" means the scenario declares the use-case file, so a docs change re-runs it. It does not
mean a use case is asserted: scenarios are one per component, so this page is the gap list.

| Component | Documented use cases | Scenario | Behaviour test | Reachable from a scenario |
| --- | ---: | --- | --- | ---: |
| `accordion` | 6 | `component/accordion` | yes | 6 |
| `button` | 8 | `component/button` | yes | 8 |
| `calendar` | 4 | `component/calendar` | yes | 4 |
| `checkbox-group` | 9 | `component/checkbox-group` | yes | 9 |
| `collapsible` | 3 | `component/collapsible` | yes | 3 |
| `combobox` | 12 | `component/combobox` | yes | 12 |
| `dialog` | 4 | `component/dialog` | yes | 4 |
| `drawer` | 4 | `component/drawer` | yes | 4 |
| `fieldset` | 4 | `component/fieldset` | yes | 4 |
| `form` | 3 | `component/form` | yes | 3 |
| `icon` | 3 | `system/icon` | no | 0 |
| `input` | 6 | `component/input` | yes | 6 |
| `input-amount` | 7 | `component/input-amount` | yes | 7 |
| `input-amount-dropdown` | 4 | `component/input-amount-dropdown` | yes | 4 |
| `input-date` | 5 | `component/input-date` | yes | 5 |
| `input-datepicker` | 7 | `component/input-datepicker` | yes | 7 |
| `input-email` | 2 | `component/input-email` | yes | 2 |
| `input-file` | 4 | `component/input-file` | yes | 4 |
| `input-iban` | 4 | `component/input-iban` | yes | 4 |
| `input-range` | 5 | `component/input-range` | yes | 5 |
| `input-stepper` | 2 | `component/input-stepper` | yes | 2 |
| `input-tel` | 4 | `component/input-tel` | yes | 4 |
| `input-tel-dropdown` | 4 | `component/input-tel-dropdown` | yes | 4 |
| `listbox` | 6 | `component/listbox` | yes | 6 |
| `menu` | 3 | `component/menu` | yes | 3 |
| `pagination` | 2 | `component/pagination` | yes | 2 |
| `radio-group` | 7 | `component/radio-group` | yes | 7 |
| `select` | 4 | `component/select` | yes | 4 |
| `select-rich` | 11 | `component/select-rich` | no | 11 |
| `steps` | 4 | `component/steps` | yes | 4 |
| `switch` | 3 | `component/switch` | yes | 3 |
| `tabs` | 5 | `component/tabs` | yes | 5 |
| `textarea` | 6 | `component/textarea` | yes | 6 |
| `tooltip` | 5 | `component/tooltip` | yes | 5 |

Scenarios with no documented use-case file: `component/accordion-run`, `component/progress-indicator`, `integration/mortgage-calculator`, `integration/native-form-to-lion-form`, `system/core`, `system/icon`.
