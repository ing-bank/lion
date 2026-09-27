# @lion/integrations (PRIVATE)

Proof, not prose: a **versioned, testable interop matrix** for Lion form components.

## Why this package exists

The Form System claims: *one control, any framework.* That claim is currently
untested and unversioned. This package turns it into a **failing-or-passing matrix**
so that when a framework release breaks property/event binding, CI tells us — instead
of a consumer discovering it in production.

## The matrix

Each cell is a runnable test (`test/<adapter>.test.js`). A red cell is a documented,
tracked gap — never a silent one.

| Adapter | Property binding | Attribute binding | `model-value-changed` event | Form submit / `FormData` | SSR / hydration |
| :--- | :--- | :--- | :--- | :--- | :--- |
| vanilla | ☐ | ☐ | ☐ | ☐ | n/a |
| React (18/19) | ☐ | ☐ | ☐ | ☐ | ☐ |
| Preact | ☐ | ☐ | ☐ | ☐ | ☐ |
| Vue 3 | ☐ | ☐ | ☐ | ☐ | ☐ |
| Angular | ☐ | ☐ | ☐ | ☐ | ☐ |

Pinned framework versions live in `package.json`; when a version bumps, the matrix is
re-run. A cell may be marked **`known-gap`** (with a link) rather than green-washed.

## Known framework frictions this matrix must encode

- **React synthetic events** do not fire for custom-element-dispatched events the way
  React's own events do; listeners that bubble out of a custom element need
  `addEventListener`/refs, or the React 19 custom-element support path.
- **Property vs attribute**: `.modelValue` is a *property*; setting it as an attribute
  binds a string. The matrix must assert the difference explicitly.
- **Angular `FormsModule`** does not see a custom element as a form control without a
  `ControlValueAccessor` bridge — this is a PrimeNG/ANGULAR adapter row.

## Status

Scaffold only. See the parent [roadmap](../../../docs/fundamentals/systems/form/roadmap.md)
§6. Owner TBD.
