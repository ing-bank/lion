---
parts:
  - Roadmap
  - Form
  - Systems
title: 'Form: Roadmap and Known Limitations'
eleventyNavigation:
  key: Systems >> Form >> Roadmap
  title: Roadmap
  order: 6
  parent: Systems >> Form
---

# Form: Roadmap and Known Limitations

Our gaps, written down. Everything below is a **high-level direction**, and every item is
**additive**: the published API must not change. Where a change would be observable, it lands
behind an opt-in/flag first, or in a centralised compat layer — never as a silent default.

## 1. Native form participation (the big one)

**Today.** The system predates the platform form APIs and reimplements form semantics in JS:
it maintains `aria-invalid` / `aria-required`, but does **not** participate in native
submission (`FormData`), native constraint validation (`setValidity` / `validationMessage` /
`:user-invalid`) or browser state restore. Controls that wrap a **native element in light DOM**
(or a hidden one) can get this cheaply; controls that do not, cannot.

**Direction — two tiers, both additive.**
- **Tier 1 (no `ElementInternals`):** decorate the inner native element with
  `setCustomValidity` / `reportValidity` and drive show-timing from `:user-invalid`. The
  standalone [`enhanceForm`](#reference-implementation-enhanceform) reference proves this end
  to end; it needs no shadow root and no form association.
- **Tier 2 (opt-in FACE):** `formAssociated` + `attachInternals()` for controls not backed by
  a native element — enabled per control, disabled by default, guarded for SSR.
  `ElementInternals` does **not** require a shadow root.

### Reference implementation: `enhanceForm`

The Tier-1 direction is not speculative — it already exists as a standalone, framework-free
function: [`enhanceForm`](https://github.com/tlouisse/wp-jet-to-grib-plugin/tree/master/js/enhancedForms)
(a private repo; ~400 LOC, with tests). Its signature is
`enhanceForm(formControlConfigList, { formEl, messageMapObj, customMessageReporter })`, and it
takes a plain `<form>` and enriches the **native controls inside it** — no components, no shadow
root, no form association. It demonstrates the whole feature set on the platform:

- **Validity through the Constraint Validation API.** `setCustomValidity` for custom rules, an
  *extended* `ValidityState` (native + custom keys) taken from `checkValidity`, and the standard
  `invalid` event — instead of a re-implemented validity model.
- **Show-timing delegated to the platform.** `:user-invalid` / `:user-valid` decide *when* a
  message may appear; validation itself runs on every `input` (debounced, ~100 ms) but only
  surfaces when the interaction state allows it.
- **Cancellable async validators.** Each control keeps an `AbortController`; a new run aborts
  the previous one and passes `{ signal }` to the validator, so a stale API response can never
  win a race.
- **Formatting on blur, only once valid** (`formatWhenValid`) — the value is never rewritten
  under a user who is still typing.
- **A `MessageReporter` seam for a11y.** Messages are wired with `aria-describedby`; `aria-live`
  is switched *polite* on `focusin` and *assertive* on `focusout`, so a message appearing on blur
  is announced before the next field's.
- **A `restore()` inverse** (it unregisters its listeners), mirroring the platform's
  state-restore story. It runs client-side **and** server-side.

We do **not** intend to vendor this module. It is the **source of the patterns** we will adopt
behind our existing API — and the evidence that Tier 1 is reachable without `ElementInternals`
and without regressing the ARIA wiring we already ship. (Its own docblock anticipates splitting
it into `@enhanceform/validate`, `/format`, `/custom-type-validators` and
`/form-associated-custom-control`.)

**Open constraint.** Multi-shadow-root ARIA reference resolution is unresolved at the spec
level (Accessibility Object Model / "reference target" work). Tier 2 must not regress the ARIA
wiring we already ship.

## 2. Wire format: one serialization projection

**Today.** `modelValue` preserves types; `serializedValue` is type-preserving by default
(identity) and overridden only for dates (ISO string) — so the wire object is **heterogeneous**,
and array groups are keyed by the raw `name` (`'addresses[]'`), because the registration
contract (mirroring native `HTMLFormControlsCollection`) uses `[]` as input syntax.

**Direction.** Introduce a single, explicitly-named **serialization projection** that is the
one place where the *internal model* becomes a *wire model*:
- **`serializedValue` is always a string** (numbers, dates, booleans stringified for the wire).
- **Array keys are normalised** (`addresses[]` → `addresses`).
- **Round-trip invariant:** deserializing a projected value yields a `modelValue` of the *same
  type* as the original (`deserialize(serialize(mv))` ≙ `mv`).

Because this changes observable output for some fields (e.g. a number today), it ships as a
**new projection API**, not by mutating the existing `serializedValue` — so it is fully
non-breaking. Promoting it to the default would be a future major.

## 3. Schema-based validation

**Today.** Validators are bespoke classes; teams that own a Zod / Valibot / JSON-Schema
contract must duplicate it.

**Direction.** An **adapter** validator that wraps a Standard-Schema / JSON-Schema source and
maps its issues onto our `error` / `warning` / `info` feedback. Purely additive; existing
class-based validators are untouched.

## 4. Declarative cross-field validation

**Today.** Cross-field logic is either a fieldset validator or sibling DOM references captured
in `firstUpdated` (imperative, fragile under re-render/scoped elements).

**Direction.** A **declarative dependency** mechanism: a validator names the sibling fields it
depends on, and the group re-runs it on change. It ships with a documented set of expectations —
timing, which field shows the error, cycle handling, async staleness, reset, a11y, SSR
determinism — because an undefined cross-field contract becomes a defect generator. Additive.

## 5. Live formatting coverage

**Today.** Caret-aware live formatting (`liveFormatPhoneNumber`) is real and tested, but it is
the **only** field using it.

**Direction.** Generalise the mechanism (date masks, IBAN) or scope the public claim to what
ships. Documentation + optional new preprocessors.

## 6. Proof and polish (do first — cheapest)

- **Interop matrix.** A versioned, tested matrix (vanilla / React / Vue / Angular × property
  binding, events, submit, SSR) does not exist; it is the missing proof of the framework-free
  claim. Package scaffold: `packages/integrations` (private).
- **Doc defects.** A `DefaultSuccess` sample with a syntax error, a `new Number(...)`
  anti-pattern, a "pure functions" vs "classes" contradiction, a duplicated overview paragraph,
  and a deserialization note that passes the wrong value.
- **Value-contract tests.** `serializedValue` typing, `Unparseable` on the wire, choice-group
  serialization, and `[]`-key normalisation each need a test that pins the intended contract.
