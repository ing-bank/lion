---
'@lion/ui': minor
---

[test-suites] make every component's tests reusable: 35 public `*-test-suites.js` entry points and a `classes` map per runner, so a subclasser or extension layer hands the suite its own classes for the host (and, for composites, for each child role) and runs Lion's guarantees against them; injectable page objects and a documented contract included. `klass`, `tagString` and the older role tag keys keep working as deprecated fallbacks
