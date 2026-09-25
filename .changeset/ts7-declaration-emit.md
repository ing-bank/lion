---
'@lion/ui': patch
---

Fix emitted type declarations so they stay valid under TypeScript 7: hoist `popperModule` and
`__globalStyleNode` into their class bodies (they previously produced an invalid
`export { undefined as X }` in `dist-types`), correct the `Popper` typedef to
`typeof import('@popperjs/core').createPopper`, and reference `PropertyValues` from `lit`
instead of the transitive `lit-element` dependency.
