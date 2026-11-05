---
'@lion/ui': patch
---

Make the combobox and steps suites work with renamed children, and let pagination suites query custom navigation elements and await deferred click handlers.

Allow combobox suites to configure label-property options before their values are formatted, including dynamically rendered options.

Make collapsible suite height fixtures independent of text wrapping and await switch host updates before asserting inner button events.

Configure pagination, calendar and datepicker suite page objects consistently through `pageObjects: { host: MyPageObject }`.

Build shared-suite fixtures from constructors without importing definition entry points or registering fixed global custom-element names.
