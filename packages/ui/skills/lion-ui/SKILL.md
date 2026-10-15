---
name: lion-ui
description: lion-ui covers @lion/ui, ing-bank/lion's headless/white-label web component library built on Lit. Use when building or reasoning about buttons, inputs, selects, checkboxes, radios, comboboxes, dialogs, drawers, tabs, tooltips, forms, accordions, calendars, steps, pagination, or any other UI built with @lion/ui web components.
metadata:
  author: ing-bank/lion
compatibility: Works in modern browsers. Built on Lit. Framework-agnostic (usable from plain HTML/JS, React, Vue, Angular, etc.) since @lion/ui components are native custom elements.
---

# lion-ui

Explore the project first, then use this skill whenever you touch an `@lion/ui` component or
system (forms, validation, overlays, localization, icons).

## MANDATORY: read each component's reference doc before using it

**Before writing markup for an `@lion/ui` component, open and read its reference doc under
`references/components/<name>.md` (or `references/systems/<name>.md` for cross-cutting systems)
for _every_ component you intend to use.** These docs contain the exact import paths, attributes,
properties, methods, and usage examples generated straight from lion's own documentation and
`custom-elements.json` — do not guess an import path or API from the tag/class name alone.

Every reference doc is self-contained: it inlines the current API table (attributes, properties,
methods) for the classes it documents, so you never need to inspect a separately-built
`custom-elements.json` or `docs/**/api-table.md` file.

## Core Concepts

`@lion/ui` is unstyled/headless by design: components ship behavior, accessibility, and form
integration, not visual styling. Consumers are expected to extend/style lion components (see
`references/systems/core.md`) or use them as-is for prototyping.

### Basic usage

```js
import '@lion/ui/define/lion-button.js';
```

```html
<lion-button>Click me</lion-button>
```

Prefer the `define/*` entrypoints (`@lion/ui/define/lion-x.js`) when you just need the custom
element registered; import the class directly (e.g. `@lion/ui/button.js`) only when you need to
extend or reference the class itself. **Copy the exact import path from the component's reference
doc — never infer it from the tag name.**

## Form Controls

lion forms are built from composable form controls (`lion-input`, `lion-select`, `lion-checkbox`,
`lion-radio-group`, `lion-fieldset`, `lion-form`, ...) that all share the same model:

- `.modelValue` — the parsed/typed value (not the raw string the native `<input>` would give you)
- `.validators` — an array of `Validator` instances (see `references/systems/form.md`)
- Form-wide submission and validation is coordinated by `lion-form` / `lion-fieldset`

## Components

<!-- lion-ui:components:start -->

- [`Accordion`](references/components/accordion.md)
- [`Button`](references/components/button.md)
- [`Calendar`](references/components/calendar.md)
- [`Checkbox Group`](references/components/checkbox-group.md)
- [`Collapsible`](references/components/collapsible.md)
- [`Combobox`](references/components/combobox.md)
- [`Dialog`](references/components/dialog.md)
- [`Drawer`](references/components/drawer.md)
- [`Fieldset`](references/components/fieldset.md)
- [`Form`](references/components/form.md)
- [`Icon`](references/components/icon.md)
- [`Input`](references/components/input.md)
- [`Input Amount`](references/components/input-amount.md)
- [`Input Amount Dropdown`](references/components/input-amount-dropdown.md)
- [`Input Date`](references/components/input-date.md)
- [`Input Datepicker`](references/components/input-datepicker.md)
- [`Input Email`](references/components/input-email.md)
- [`Input File`](references/components/input-file.md)
- [`Input Iban`](references/components/input-iban.md)
- [`Input Range`](references/components/input-range.md)
- [`Input Stepper`](references/components/input-stepper.md)
- [`Input Tel`](references/components/input-tel.md)
- [`Input Tel Dropdown`](references/components/input-tel-dropdown.md)
- [`Listbox`](references/components/listbox.md)
- [`Pagination`](references/components/pagination.md)
- [`Progress Indicator`](references/components/progress-indicator.md)
- [`Radio Group`](references/components/radio-group.md)
- [`Select`](references/components/select.md)
- [`Select Rich`](references/components/select-rich.md)
- [`Steps`](references/components/steps.md)
- [`Switch`](references/components/switch.md)
- [`Tabs`](references/components/tabs.md)
- [`Textarea`](references/components/textarea.md)
- [`Tooltip`](references/components/tooltip.md)

<!-- lion-ui:components:end -->

## Systems

Cross-cutting `@lion/ui` APIs that most components rely on:

<!-- lion-ui:systems:start -->

- [`Core`](references/systems/core.md)
- [`Form`](references/systems/form.md)
- [`Icon`](references/systems/icon.md)
- [`Localize`](references/systems/localize.md)
- [`Overlays`](references/systems/overlays.md)

<!-- lion-ui:systems:end -->

## Code Structure & Standards

### Dependency policy (important)

- Import only from `@lion/ui/*`. Never deep-import from `@lion/ui/components/<x>/src/*` — that is
  internal package structure and can change without notice.
- Use `@lion/ui/define/lion-x.js` to register a custom element; import the class (e.g.
  `LionInput` from `@lion/ui/input.js`) only when you need to reference/extend it.

#### Common import patterns

```js
// Register the custom element only
import '@lion/ui/define/lion-input.js';

// Import the class (e.g. to extend it, or use validators)
import { LionInput } from '@lion/ui/input.js';
import { Required, MinLength } from '@lion/ui/validate.js';
```

### Forms

#### Pre-flight: read the control docs first (MANDATORY)

Before wiring a form, read `references/systems/form.md` (validation, model-value,
interaction-states) and the reference doc for every form control you plan to use.

#### Native element -> required `@lion/ui` replacement

| Instead of...             | Use...                                 |
| ------------------------- | -------------------------------------- |
| `<input>`                 | `<lion-input>`                         |
| `<input type="checkbox">` | `<lion-checkbox>`                      |
| `<input type="radio">`    | `<lion-radio>`                         |
| `<select>`                | `<lion-select>` / `<lion-select-rich>` |
| `<textarea>`              | `<lion-textarea>`                      |
| `<form>`                  | `<lion-form>`                          |
| `<fieldset>`              | `<lion-fieldset>`                      |

#### Wiring events (use the lion model, not native DOM)

Use `.modelValue` and the `model-value-changed` event rather than reading `.value` off the native
control; see `references/systems/form.md` (`model-value`) for details and edge cases.

#### Validation: use validator classes, not hand-rolled checks

```js
import { Required, MinLength } from '@lion/ui/validate.js';

html`
  <lion-input
    label="Username"
    name="username"
    .validators="${[new Required(), new MinLength(3)]}"
  ></lion-input>
`;
```

## Rules

- Always read the component's reference doc before using it.
- Never deep-import from `@lion/ui/components/<x>/src/*`.
- Use validator classes for validation, not hand-rolled checks.
- Use `.modelValue`, not the native `.value`, for form controls.

## Example: Creating a Login Form

```js
import { html } from 'lit';
import '@lion/ui/define/lion-form.js';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-input.js';
import { Required, MinLength, IsEmail } from '@lion/ui/validate.js';

html`
  <lion-form>
    <form>
      <lion-fieldset name="login">
        <lion-input
          name="email"
          label="Email"
          .validators="${[new Required(), new IsEmail()]}"
        ></lion-input>
        <lion-input
          type="password"
          name="password"
          label="Password"
          .validators="${[new Required(), new MinLength(8)]}"
        ></lion-input>
      </lion-fieldset>
    </form>
  </lion-form>
`;
```

## Framework Support

`@lion/ui` components are plain custom elements, so they work in any framework. For
React/Vue/Angular wrappers or SSR considerations, see `references/systems/core.md`.

## Checklist

- [ ] Read the reference doc for every `@lion/ui` component/system you use
- [ ] Imports copied verbatim from the reference doc (no deep imports)
- [ ] Form controls use `.modelValue`, not native `.value`
- [ ] Validation uses `Validator` classes from `@lion/ui/validate.js`
- [ ] Checked `references/systems/localize.md` if the UI needs translations
