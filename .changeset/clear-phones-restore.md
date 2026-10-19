---
'@lion/ui': major
---

**Breaking change for telephone test helpers:** `restorePhoneUtilManager()` now restores the
real `PhoneUtilManager.isLoaded` getter and original `loadComplete` promise. Its public name and
zero-argument signature are unchanged. Previously it restored a boolean captured at module import,
often `false`, accidentally leaving real parsing and formatting disabled after mock cleanup.

Tests using the real parser should await the real `PhoneUtilManager.loadComplete` before mocking
or after restoration and assert the actual normalized model/display values. For example, the
loaded parser normalizes `+32 6 12345678` to `+32612345678`, displayed as `(+32)612345678` with
parentheses formatting. Tests intentionally exercising the unloaded/no-parsing state should keep
an explicit `mockPhoneUtilManager()` scoped to those assertions and restore it afterward.

This helper correction does not change production parsing or formatting code and does not affect
production users who do not use these test helpers. The awesome-phonenumber/libphonenumber metadata
updates introduced in the 0.23.x line are separate: real-loaded comparisons for the fixtures above
produced identical results before and after the upgrade. Their changed test expectations are
exposed by fixing mock restoration, not evidence that all telephone outputs are identical across
metadata versions.
