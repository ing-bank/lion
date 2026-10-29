---
parts:
  - Principles
  - Performance and modularity
title: 'Performance and modularity'
eleventyNavigation:
  key: 'Principles: Performance and modularity'
  order: 100
  parent: Principles
  title: Performance and modularity
---

# Performance and modularity

Performance is a budget, not an intention. This principle fixes how we keep it: measure per chunk, load
capabilities only when they are asked for, ship the platform route first, and keep every module
side-effect free so a bundler can drop what an application does not use.

## Rules

1. **Write the budget down, then gate on it.** Every system states its numbers (entry chunk, per-feature
   chunk, what may never appear in the entry) and a command that checks them. A budget that is only
   mentioned in a review comment is a wish.
2. **Nothing on first paint.** A closed overlay, an unmounted form, an inactive route: zero features, zero
   layout, zero listeners. Initialisation happens when the capability is used, and expensive work happens
   after the observable state flip, never before it.
3. **Platform first, polyfill lazy.** If the platform can do the job, use it and pay nothing: CSS anchor
   positioning instead of a positioning library, `<dialog showModal()>` instead of a custom focus trap,
   `popover` instead of a stacking manager. The fallback is a **dynamic import**, so it costs bytes only on
   the engines that need it. Measured: the polyfill is 7.8 KB gzip in its own chunk and never enters the
   entry chunk.
4. **Capabilities are registered, not imported.** A feature is a small module behind a registry, loaded
   only when the description asks for it (`{ when, load }`). Consumers can register their own without
   pulling in ours, and an unused capability is never fetched.
5. **Modules are side-effect free.** No top-level DOM access, no top-level listeners, no top-level
   element creation. A module with import side effects cannot be tree-shaken, and it runs on pages that
   never use it.
6. **Split entry points by capability, not by convenience.** Ship focused entry points (`overlays.js`,
   `overlays-no-side-effects.js`, a subpath per layer) so an application imports the surface it uses. The
   public path is a contract; the file behind it can move.
7. **One implementation.** Duplicated source trees with a dedupe-mixin are loaded by load order, which
   costs bytes twice and makes behaviour depend on which copy won. Deleting them is a performance change
   as well as a correctness one (here: 8,020 lines removed).
8. **Measure with splitting, not with a single bundle.** A bundler that inlines dynamic imports hides
   exactly what you are trying to prove. Report gzip per chunk, and _grep the entry chunk_ for the heavy
   dependency instead of trusting the design (`grep -c popper entry-core.js` → 0).
9. **Modularity is the mechanism, not a side effect.** Small modules with one responsibility are what make
   lazy loading, tree-shaking and testability possible; a monolith can only be minified.
10. **Re-measure when the platform moves.** A polyfill's cost is temporary; when an engine catches up, the
    feature switches route and the budget is re-stated. Support matrices are re-checked per release.

## Measured budget of the overlay layer

| target                                                 | budget                   | measured                                                                                            |
| ------------------------------------------------------ | ------------------------ | --------------------------------------------------------------------------------------------------- |
| entry chunk (state machine, projection, epoch, loader) | < 1 KB gzip              | **0.88 KB**                                                                                         |
| registry                                               | < 1 KB gzip              | 0.37 KB                                                                                             |
| each feature                                           | ≤ 2 KB gzip              | a11y 0.36 · backdrop 0.36 · dismiss 0.31 · esc 0.34 · focus 0.45 · position 0.37 · scroll-lock 0.26 |
| positioning polyfill                                   | never in the entry chunk | 7.8 KB in its own chunk, 0 occurrences in the entry                                                 |
| a closed overlay                                       | 0 KB features, 0 layout  | by design                                                                                           |
| the layer it replaces                                  | —                        | 20.5 KB gzip, of which 7.5 KB positioning                                                           |

Numbers come from `esbuild --bundle --splitting --minify --format=esm` plus `gzip -9`, per chunk; the
entry-chunk check is a `grep`, and a test in the package asserts that the positioning feature keeps its
polyfill behind a dynamic import. The side-effect-free rule is verified the same way: every module of the
layer imports cleanly in Node with no DOM present (`node --input-type=module -e "await import('./…')"`).

## How to check a system against this principle

- Is there a written budget and a command that fails when it is exceeded?
- Does the entry chunk contain zero occurrences of the heavy optional dependency?
- Is every capability behind a registry condition, and does a descriptor that asks for nothing load
  nothing (except what is genuinely always needed — here: the accessibility feature)?
- Do the modules import cleanly in Node without a DOM, i.e. are they side-effect free?
- Is there exactly one implementation of every layer?

## Reference

`docs/guides/principles/predictable-timing.md` (what stays observable when work is deferred),
`docs/guides/principles/controller-to-mixin.md` (the surface that keeps the entry chunk small), and the
research section `docs/fundamentals/systems/overlays/research.md` for the measurements and the roadmap
gate per step.
