---
parts:
  - Principles
  - Scoped Elements
  - Declarative shadow DOM
title: 'Principles: Scoped Elements - server rendered shadow roots'
---

# Server rendered shadow roots (declarative shadow DOM)

A server can render a shadow root as a declarative template:

```html
<my-tag
  data-scoped-registry="my-tag-1a2b3c4d"
  polyfill-shadowrootcustomelementregistry
  scopedcustomelementregistry
  polyfill-scopedcustomelementregistry
>
  <template shadowrootmode="open" shadowrootcustomelementregistry>
    <span>server rendered</span>
    <lion-input name="field"></lion-input>
  </template>
</my-tag>
```

The parser turns that template into a real shadow root **before any script runs**. That root is the
hard part for scoped registries: a registry is a runtime object, it cannot be serialised into markup,
and a registry can only be handed over when a root is _created_ - which the parser did, not us.

## What was measured (Chromium, with native scoped registry support)

| question                                                            | result                                                                                                                                                                                                                     |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| is a parser created root assignable?                                | yes - with the markers above its registry is **null**, and a null registry can still be assigned                                                                                                                           |
| what creates it?                                                    | `setHTMLUnsafe` (and a real server response parsed as a document). **Not** `innerHTML`, `insertAdjacentHTML` or `DOMParser` - those use the fragment parser, which leaves the template as a plain element in the light DOM |
| how is a registry assigned?                                         | `registry.initialize(root)` - **the shadow root**, not the host: a host already has the registry of the tree it was created in, so `initialize` does not touch it                                                          |
| does it scope the parser's children?                                | yes - a `lion-input` the parser put inside that root upgrades against the assigned registry                                                                                                                                |
| what does `attachShadow` do on a host that already has such a root? | **it wipes the content**, without an error (native). The redesigned 1.x polyfill happens to reuse the root instead                                                                                                         |
| which contract can do this at all?                                  | only the 1.x/native one. The 0.x polyfill and a browser without scoped registries have no `initialize`, so a parser created root cannot be scoped there                                                                    |

## What Lion does about it

`packages/ui/components/core/src/scopedElementsHydration.js` is the layer (kept separate from the
mixin, so it can be retired when the platform does this itself):

1. `scopedRegistryHash({ tagName, version, build })` - the identity the server writes into
   `data-scoped-registry`. Deliberately **not** derived from a class or function: `Function.toString`
   changes under minification, and two copies of the _same_ version are two distinct constructors that
   must still resolve to one registry. Two versions of a tag get two hashes.
2. `scopedRegistryMarkupAttributes(hash)` - the exact marker set the server renders (the null registry
   markers for the parser, the polyfill and the element, plus the hash).
3. `registerScopedRegistry(hash, registry)` - the app declares, per version, which registry that hash
   means. The map lives on a page global, created idempotently, because **every version of Lion ships
   this code** and two copies have to agree on one map.
4. `hydrateScopedRegistries(root = document)` - resolves every `data-scoped-registry` host, claims its
   parser created root, and **throws** on a hash no version registered: that is a hydration mismatch
   (the markup names a version the bundle does not have), and rendering something else quietly would
   hide a deployment problem.
5. `ScopedElementsMixin` **reuses** an existing shadow root instead of calling `attachShadow`, and
   adopts that root's registry (or claims it when it has none). This is what makes a page behave the
   same natively and under the polyfill: natively the mixin's `attachShadow` call would have wiped the
   server rendered content, while the redesigned polyfill reused it.

`packages/ui/components/input/test/lion-input.dsd-two-versions.test.js` proves the two version case:
two hosts, the same tag name, one registry each, server rendered and hydrated, and the same
`<lion-input>` resolving to a different class per host - plus the fail loudly case.

## Still open

- The full server half is not wired up yet: the test reproduces the parser with `setHTMLUnsafe`, so
  what is missing is the server emitting `scopedRegistryMarkupAttributes()` (a `@lit-labs/ssr`
  renderer, or an app's own template) and a real end to end run of it.
- `@lit-labs/ssr` client hydration still has to be combined with this: our layer claims the root and
  its registry, lit then has to hydrate _into_ that root instead of rendering over it.
- Whether a page can express "this root belongs to version X" without the app's bundle running first
  is the same problem as the `formAssociated` tag capability: the identity has to be resolved by
  someone, and on the client that someone is the app.
