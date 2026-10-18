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

## Two supported paths: consume, or subclass

This skill is written for an **app developer** consuming `@lion/ui` — you compose lion's components
into your application (and may wrap them in your own components) using the documented entrypoints,
attributes, properties and events. That is **path one: consume lion directly**, and it is what the
lion-ui skill tests measure.

**Path two is subclassing** — extending a lion base class to introduce your own tag names and your own
branding/styling. That belongs to a **subclasser** (the team that builds a design system on lion), not
to an app developer, and it is **out of scope for the lion-ui skill tests**: a subclass is graded
against the design system it belongs to, so testing it against lion's documented API measures the wrong
thing. If a task only asks you to use a lion component, do not subclass — compose the documented
component instead.

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

- [`Accordion`](references/components/accordion.md) — accordion, expandable headings, disclosure sections
- [`Button`](references/components/button.md) — button, action button
- [`Calendar`](references/components/calendar.md) — calendar, date grid
- [`Checkbox Group`](references/components/checkbox-group.md) — checkbox group, multiple choices
- [`Collapsible`](references/components/collapsible.md) — collapsible, expandable section
- [`Combobox`](references/components/combobox.md) — combobox, autocomplete, dropdown input
- [`Dialog`](references/components/dialog.md) — dialog, modal, popup
- [`Drawer`](references/components/drawer.md) — drawer, side panel, off-canvas
- [`Fieldset`](references/components/fieldset.md) — fieldset, field group
- [`Form`](references/components/form.md) — form, form wrapper
- [`Icon`](references/components/icon.md)
- [`Input`](references/components/input.md) — input, text field
- [`Input Amount`](references/components/input-amount.md) — amount input, money field
- [`Input Amount Dropdown`](references/components/input-amount-dropdown.md) — amount with currency, currency amount input
- [`Input Date`](references/components/input-date.md) — date input, date field
- [`Input Datepicker`](references/components/input-datepicker.md) — datepicker, date picker field
- [`Input Email`](references/components/input-email.md) — email input, email field
- [`Input File`](references/components/input-file.md) — file input, file picker, upload
- [`Input Iban`](references/components/input-iban.md) — IBAN field, bank account number input
- [`Input Range`](references/components/input-range.md) — range slider, slider
- [`Input Stepper`](references/components/input-stepper.md) — stepper, number stepper
- [`Input Tel`](references/components/input-tel.md) — phone input, tel field
- [`Input Tel Dropdown`](references/components/input-tel-dropdown.md) — phone with country code, tel dropdown
- [`Listbox`](references/components/listbox.md) — listbox, option list
- [`Menu`](references/components/menu.md) — menu, dropdown menu
- [`Pagination`](references/components/pagination.md) — pagination, pager, page numbers
- [`Progress Indicator`](references/components/progress-indicator.md) — progress bar, spinner, loading indicator
- [`Radio Group`](references/components/radio-group.md) — radio group, single choice
- [`Select`](references/components/select.md) — select, dropdown
- [`Select Rich`](references/components/select-rich.md) — rich select, custom dropdown
- [`Steps`](references/components/steps.md) — steps, step indicator, wizard steps
- [`Switch`](references/components/switch.md) — switch, toggle
- [`Tabs`](references/components/tabs.md) — tabs, tab panel
- [`Textarea`](references/components/textarea.md) — textarea, multi-line input
- [`Tooltip`](references/components/tooltip.md) — tooltip, hint popup

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

## Guides

Task-oriented how-to guides, generated from lion's own documentation:

<!-- lion-ui:guides:start -->

- [`Create A Custom Field`](references/guides/create-a-custom-field.md)
- [`Create A Form`](references/guides/create-a-form.md)
- [`Extend A Native Input`](references/guides/extend-a-native-input.md)
- [`Get Started`](references/guides/get-started.md)

<!-- lion-ui:guides:end -->

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
interaction-states), the [`create-a-form` guide](references/guides/create-a-form.md) for the
light-dom best practices that form registration depends on, and the reference doc for every form
control you plan to use.

#### Use `ScopedElementsMixin`; light DOM is a narrow exception

The default for a component you write is a normal shadow root with `ScopedElementsMixin`, which
registers the components it renders in its own registry:

```js
export class MyForm extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'lion-form': LionForm, 'lion-input-iban': LionInputIban };

  render() {
    return html`
      <lion-form>
        <form>
          <lion-input-iban name="account" label="Account"></lion-input-iban>
        </form>
      </lion-form>
    `;
  }
}
```

Do **not** override `createRenderRoot` on a lion component subclass to force light DOM: lion's form
controls rely on scoped elements for their own slot rendering, and with no shadow root that breaks
(measured — it throws inside `ScopedElementsMixin`).

A form and its controls share one DOM, and that gives the components you write one of two roles (see
`references/guides/create-a-form.md`):

- **the overarching component** - it applies `ScopedElementsMixin` and registers the lion components it
  renders in `static scopedElements` - **may** have a shadow root. Its scoped registry, not global
  registration, is what makes the controls upgrade;
- **sub forms** - components living _inside_ the form that carry controls - **must not** have a shadow
  root, so they share the DOM with `lion-form` and `<form>`. Registration travels up the DOM, so a
  shadow root in between makes the controls inside it stop registering to their parents.

Prefer a **shared template** over a sub form when you only need to split a large form into files: a
template renders in the overarching component's context, where its scoped registry resolves every tag.
Everything else (a leaf component, a component holding no form control) keeps the normal shadow root
with `ScopedElementsMixin`.

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
- **Never import a `@lion/ui/define/...` entrypoint.** It registers a tag globally, which opts out of
  your host's scoped registry. Register the class in `static scopedElements` instead.
- **The valid entrypoints are a fixed, generated list** — `references/entrypoints.md`, built from
  `packages/ui/exports` on every regeneration. Check it instead of deriving a specifier from a name.
- **Import from the module an API is documented under — never from a name you infer.** `@lion/ui/`
  ships a fixed set of entrypoints, so a specifier you reason your way to from an element or a
  concept is a guess that fails at load: `<lion-checkbox>` comes from `@lion/ui/checkbox-group.js`
  and `@lion/ui/checkbox.js` does not exist; `LionOption` comes from the listbox module, not
  `option.js`; the validators come from the form module that documents them, not `validate.js`. See
  `references/systems/core.md`.
- **Assume a scoped-elements host.** Usage examples are rendered inside a host `LitElement` that
  applies `ScopedElementsMixin` and registers every component it renders, e.g.
  `static scopedElements = { 'lion-input-iban': LionInputIban }`. Import the component **class**
  from its `@lion/ui/<name>.js` entrypoint and map that class to the tag, so the element is
  resolved from the host's scoped registry. It is deliberately **not** registered globally, so
  `customElements.get('<tag>')` returns `undefined` and must not be used to detect it. See
  [`references/systems/core.md`](references/systems/core.md) for ScopedElementsMixin best practices.
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
