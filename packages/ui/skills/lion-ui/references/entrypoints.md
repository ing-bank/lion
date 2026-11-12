# Entrypoints

> Generated from `packages/ui/exports` by `npm run skills:generate`. Do not edit by hand.

These 101 specifiers are the ones that exist. A specifier reasoned from an
element or a concept name will not be among them — `<lion-checkbox>` comes from `checkbox-group`,
not from `checkbox` — and importing one that does not exist fails at load.

## Importing a class

- `@lion/ui/accordion.js`
- `@lion/ui/button.js`
- `@lion/ui/calendar.js`
- `@lion/ui/checkbox-group.js`
- `@lion/ui/collapsible.js`
- `@lion/ui/combobox.js`
- `@lion/ui/core.js`
- `@lion/ui/dialog.js`
- `@lion/ui/drawer.js`
- `@lion/ui/fieldset.js`
- `@lion/ui/form-core.js`
- `@lion/ui/form.js`
- `@lion/ui/icon.js`
- `@lion/ui/input-amount-dropdown.js`
- `@lion/ui/input-amount.js`
- `@lion/ui/input-date.js`
- `@lion/ui/input-datepicker.js`
- `@lion/ui/input-email.js`
- `@lion/ui/input-file.js`
- `@lion/ui/input-iban.js`
- `@lion/ui/input-range.js`
- `@lion/ui/input-stepper.js`
- `@lion/ui/input-tel-dropdown.js`
- `@lion/ui/input-tel.js`
- `@lion/ui/input.js`
- `@lion/ui/listbox.js`
- `@lion/ui/localize.js`
- `@lion/ui/menu.js`
- `@lion/ui/overlays.js`
- `@lion/ui/pagination.js`
- `@lion/ui/progress-indicator.js`
- `@lion/ui/radio-group.js`
- `@lion/ui/select-rich.js`
- `@lion/ui/select.js`
- `@lion/ui/steps.js`
- `@lion/ui/switch.js`
- `@lion/ui/tabs.js`
- `@lion/ui/textarea.js`
- `@lion/ui/tooltip.js`
- `@lion/ui/types/calendar.ts`
- `@lion/ui/types/combobox.ts`
- `@lion/ui/types/core.ts`
- `@lion/ui/types/form-core.ts`
- `@lion/ui/types/input-amount-dropdown.ts`
- `@lion/ui/types/input-file.ts`
- `@lion/ui/types/input-tel-dropdown.ts`
- `@lion/ui/types/input-tel.ts`
- `@lion/ui/types/listbox.ts`
- `@lion/ui/types/localize.ts`
- `@lion/ui/types/overlays.ts`
- `@lion/ui/validate-messages.js`

## Do not use these: global `define` entrypoints

Listed because they exist on disk, not because the skill uses them. Registering a tag globally opts
out of the host's scoped registry; register the class in `static scopedElements` instead.

- `@lion/ui/accordion.js`
- `<lion-button-reset>`
- `<lion-button-submit>`
- `@lion/ui/button.js`
- `@lion/ui/calendar.js`
- `@lion/ui/checkbox-group.js`
- `<lion-checkbox-indeterminate>`
- `<lion-checkbox>`
- `@lion/ui/collapsible.js`
- `@lion/ui/combobox.js`
- `@lion/ui/dialog.js`
- `@lion/ui/drawer.js`
- `<lion-field>`
- `@lion/ui/fieldset.js`
- `@lion/ui/form.js`
- `@lion/ui/icon.js`
- `@lion/ui/input-amount-dropdown.js`
- `@lion/ui/input-amount.js`
- `@lion/ui/input-date.js`
- `@lion/ui/input-datepicker.js`
- `@lion/ui/input-email.js`
- `@lion/ui/input-file.js`
- `@lion/ui/input-iban.js`
- `@lion/ui/input-range.js`
- `@lion/ui/input-stepper.js`
- `@lion/ui/input-tel-dropdown.js`
- `@lion/ui/input-tel.js`
- `@lion/ui/input.js`
- `<lion-item>`
- `@lion/ui/listbox.js`
- `@lion/ui/menu.js`
- `<lion-menuitem>`
- `<lion-option>`
- `<lion-options>`
- `@lion/ui/pagination.js`
- `@lion/ui/progress-indicator.js`
- `@lion/ui/radio-group.js`
- `<lion-radio>`
- `<lion-select-invoker>`
- `@lion/ui/select-rich.js`
- `@lion/ui/select.js`
- `<lion-selected-file-list>`
- `<lion-step>`
- `@lion/ui/steps.js`
- `<lion-switch-button>`
- `@lion/ui/switch.js`
- `@lion/ui/tabs.js`
- `@lion/ui/textarea.js`
- `@lion/ui/tooltip.js`
- `<lion-validation-feedback>`
