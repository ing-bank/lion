---
parts:
  - Node Tools
title: 'skill-tester: skill index'
eleventyNavigation:
  key: Node Tools >> skill-tester skill index
  parent: Node Tools >> skill-tester
  title: Skill index
  order: 30
---

# The lion-ui skill: what it contains

> Generated from `packages/ui/skills/lion-ui/references` by `npm run skill:index`. Do not edit by hand.

The `lion-ui` skill routes an agent from `SKILL.md` into the reference it needs. This page is the
human- and machine-readable equivalent of that index: every generated reference, its kind, and its path
inside the skills package, so finding `where something is documented` does not depend on reading the
skill's own index.

## Two paths

The skill distinguishes two flows (the form guide has the detail):

- **consumption** - app developers compose `@lion/ui` components directly through their documented
  entrypoints; this is what the regular references (and the skill-tester scenarios) measure;
- **subclassing** - extending a component for your own tag names, branding or styling. That surface
  (protected/private members and extension points) lives in the `*.subclasser.md` companions
  (37 of them), reachable only when a task is explicitly about subclassing.

## References

| Kind | Reference | Path in `packages/ui/skills/lion-ui` |
| --- | --- | --- |
| Component | `accordion` | `references/components/accordion.md` |
| Component | `button` | `references/components/button.md` |
| Component | `calendar` | `references/components/calendar.md` |
| Component | `checkbox-group` | `references/components/checkbox-group.md` |
| Component | `collapsible` | `references/components/collapsible.md` |
| Component | `combobox` | `references/components/combobox.md` |
| Component | `dialog` | `references/components/dialog.md` |
| Component | `drawer` | `references/components/drawer.md` |
| Component | `fieldset` | `references/components/fieldset.md` |
| Component | `form` | `references/components/form.md` |
| Component | `icon` | `references/components/icon.md` |
| Component | `input-amount-dropdown` | `references/components/input-amount-dropdown.md` |
| Component | `input-amount` | `references/components/input-amount.md` |
| Component | `input-date` | `references/components/input-date.md` |
| Component | `input-datepicker` | `references/components/input-datepicker.md` |
| Component | `input-email` | `references/components/input-email.md` |
| Component | `input-file` | `references/components/input-file.md` |
| Component | `input-iban` | `references/components/input-iban.md` |
| Component | `input-range` | `references/components/input-range.md` |
| Component | `input-stepper` | `references/components/input-stepper.md` |
| Component | `input-tel-dropdown` | `references/components/input-tel-dropdown.md` |
| Component | `input-tel` | `references/components/input-tel.md` |
| Component | `input` | `references/components/input.md` |
| Component | `listbox` | `references/components/listbox.md` |
| Component | `menu` | `references/components/menu.md` |
| Component | `pagination` | `references/components/pagination.md` |
| Component | `progress-indicator` | `references/components/progress-indicator.md` |
| Component | `radio-group` | `references/components/radio-group.md` |
| Component | `select-rich` | `references/components/select-rich.md` |
| Component | `select` | `references/components/select.md` |
| Component | `steps` | `references/components/steps.md` |
| Component | `switch` | `references/components/switch.md` |
| Component | `tabs` | `references/components/tabs.md` |
| Component | `textarea` | `references/components/textarea.md` |
| Component | `tooltip` | `references/components/tooltip.md` |
| System | `core` | `references/systems/core.md` |
| System | `form` | `references/systems/form.md` |
| System | `icon` | `references/systems/icon.md` |
| System | `localize` | `references/systems/localize.md` |
| System | `overlays` | `references/systems/overlays.md` |
| Guide | `create-a-custom-field` | `references/guides/create-a-custom-field.md` |
| Guide | `create-a-form` | `references/guides/create-a-form.md` |
| Guide | `extend-a-native-input` | `references/guides/extend-a-native-input.md` |
| Guide | `get-started` | `references/guides/get-started.md` |

The entrypoints list (`references/entrypoints.md`) is the authoritative set of `@lion/ui`
specifiers; anything not in it does not exist and must not be guessed.
