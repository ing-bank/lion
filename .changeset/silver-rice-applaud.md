---
'@lion/ajax': minor
'@lion/core': minor
'@lion/icon': minor
'@lion/localize': minor
---

Removing LionSingleton as es modules are already guaranteed to be singletons.
This reduces complexity and means less code to ship to our users.
