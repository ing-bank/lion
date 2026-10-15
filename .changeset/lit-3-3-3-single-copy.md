---
'@lion/ui': minor
---

Update lit to 3.3.3, with one copy of it for the astro side.

`lit` moves from `^3.1.2` to `^3.3.3`, and the portal's line is pinned to a single copy in the root
`overrides` (`lit` 3.3.3 with `lit-element` 4.2.2, `lit-html` 3.3.3, `@lit/reactive-element` 2.1.2).
Before this the install carried several lit lines at once - the root 3.x next to 2.8.0 copies inside
`@lion/*` and `@rocket/*` - and which one an Astro island's module graph resolved varied per page
load, while `@lit-labs/ssr-client`'s hydration support patches exactly one `LitElement`. When it had
patched a copy that the element did not extend, the island rendered a second copy of its template
beside the server-rendered shadow root instead of hydrating it: a duplicated table of contents on the
docs pages, on 3 out of 6 page loads. One copy for the portal means the support reaches its islands,
and server-rendered pages hydrate their markup the way they are meant to.

The lit 2 era packages keep the line they were built against. This repo still runs on rocket next to
astro, so `@lion/*` (except `@lion/ui`) and `@rocket/*` are scoped in the same `overrides` to `lit`
2.8.0 with `lit-html` 2.8.0, `lit-element` 3.3.3 and `@lit/reactive-element` 1.6.3 - upgrading those
to lit 3 is a migration of its own, not a side effect of this one. The resolution was checked for the
combination that would break them: 0 of the 8 lit copies in the tree pair a `lit` 2.8.0 with a
`lit-html` 3.x.
