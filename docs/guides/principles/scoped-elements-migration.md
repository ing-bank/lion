---
parts:
  - Principles
  - Scoped Elements
  - Migration
title: 'Migrating to the 1.x model'
---

# Migrating to the 1.x model

Staged, each step gated by a measurement. The order matters: the mixin must be able to speak both
contracts _before_ any page switches, and form association is a separate, later decision.

**0. Inventory, per app.** Which versions of the library can be on one page, where the polyfill script
sits relative to the library's scripts, and who else ships a polyfill. In this repository the docs
portal ships its own copy (`docs/_assets/scoped-custom-element-registry.min.js`) and the skill-tester
harness injects the npm one — both are migration sites beyond `@lion/ui`.

**1. Ship the compat mixin in a minor of every version in use.** `ScopedElementsMixinV4` speaks both
contracts; `ScopedElementsMixin` re-exports it, so the name, the emitted types and the dedupe identity
are unchanged and nothing has to change for consumers or extension layers. Gate: the whole suite green
on the 0.x polyfill _and_ on the redesign and natively (see the compatibility page for the numbers).

**2. Retire hand-rolled 0.x idioms.** Grep for `ShadowRoot.prototype`, `shadowRoot.createElement`, and
`customElements:` inside an `attachShadow` init. `core/src/SlotMixin.js` had one; extension layers are
the likely other place.

**3. Prove 1.x-readiness per app before switching anything.** Run the redesign forced over the app's own
suite while production still loads 0.x (`npm run test:browser:scoped-v1` is the template). Then flip the
polyfill behind a canary and keep the 0.x script for rollback. Hard constraint: every version on the page
must carry the compat mixin — a 0.x-contract version cannot scope under the redesign.

**4. Drop the polyfill where native support exists**, if the app wants to.

**5. Adopt `formAssociated` in a later major, additively** (publish through internals when granted, keep
the light-DOM input), and only drop the input where the capability is guaranteed — see the
form-associated page.

**6. Retire the fixture** when the redesign ships on npm: delete
`packages/ui/components/core/test/scoped-registry-v1/` and the `v1`/`v1-reserved`/`v0+v1` test modes,
point at the dependency.

## Do not do

Each of these is a measured failure, not a preference:

- load both polyfills (see the compatibility page);
- rely on the define order for a tag-level capability such as `formAssociated`;
- send more than one registry spelling in `attachShadow`;
- assume `shadowRoot.createElement` exists;
- call `document.importNode(node, deep, options)`;
- assume `attachShadow({ customElements })` still hands over a registry under the redesign (it is
  ignored, without an error).
