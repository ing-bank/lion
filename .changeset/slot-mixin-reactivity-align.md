---
'@lion/ui': minor
---

fix(ui): align light dom with internal [reactivity cycle of LitElement/ReactiveElement](https://lit.dev/docs/components/lifecycle/#reactive-update-cycle).
Since light dom render is now aligned inside `update` instead of `updated` (like it already was for shadow dom),
we can rely on the fact that all dom (light and shadow) has rendered inside our `updated` loop.
