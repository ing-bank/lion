---
'@lion/localize': minor
---

BREAKING: Fires localeChanged event (and as a result, invokes onLocaleChanged / onLocaleUpdated) after localize loading has completed. This means if the user switches the locale to a locale which has not loaded yet, it will load it first before sending the event. This will allow users to immediately call localize.msg and get the right output, without having to await localize.loadingComplete themselves. This is slightly breaking with regards to timing and might break tests in extensions. In that case, you probably need a `await localize.loadingComplete` statement in front of the failing assertion.
