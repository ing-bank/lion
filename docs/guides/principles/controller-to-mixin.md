---
parts:
  - Principles
  - Controller to mixin
title: 'A minimal controller to mixin contract'
eleventyNavigation:
  key: 'Principles: Controller to mixin'
  order: 60
  parent: Principles
  title: Controller to mixin
---

# A minimal controller to mixin contract

An interaction with timing — opening, closing, positioning, focus, escape handling — belongs in a
**controller**: one object that owns the state, the transitions and every side effect. A **mixin** is
then only the declarative surface of that controller on a class: properties, attributes and events.

The contract between the two stays small enough to enumerate, and it is one-directional. This page is
the principle; the overlay/disclosure work is the first place it is applied (see
`packages/ui/components/disclosure-system/docs/adr/`).

## The interface

Everything a mixin may do with the controller:

| member                                     | direction    | meaning                                                                                |
| ------------------------------------------ | ------------ | -------------------------------------------------------------------------------------- |
| `open`                                     | read         | state, read from the controller — never derived from the DOM                           |
| `show()`, `hide()`, `toggle()`             | call         | actions; they decide _whether_ a transition may happen                                 |
| `descriptor` / config object               | data in      | a plain, serializable object describing behaviour (roles, closure policy, positioning) |
| `toggle` event (and state-specific events) | out          | the controller notifies; the mixin reflects it into properties/attributes              |
| `controller` accessor                      | escape hatch | for the rare consumer that needs the machine itself, e.g. `sync()`                     |

Nothing else. A mixin that needs a sixth member is usually a sign that state is being duplicated or
that the controller is reaching into rendering.

## Rules

1. **One owner of state and timing.** The controller decides when a transition happens; the mixin
   reflects it. Two authors of one truth is how "logical flag says open, DOM says closed" appears.
2. **The mixin never schedules work.** No `requestAnimationFrame`, no `setTimeout`, no microtask
   deferrals, no `await` inside a handler before writing state. Timing that lives in a mixin is timing
   you cannot test and cannot reason about.
3. **Reflect, do not re-derive.** The mixin writes a property _because_ the controller said so;
   it does not compute "should this be open" from its own inputs.
4. **No echo loops.** When the controller notifies a change, the mixin must not treat the resulting
   property update as a new user intent. Either the controller marks its own writes, or the mixin
   routes controller-originated changes through a dedicated path (in the overlay work:
   `_setOpenedWithoutPropertyEffects` plus a marker for the value the controller just set).
5. **Requests carry an epoch.** Any value a consumer derives from an async observation can arrive
   stale; the controller discards it instead of resurrecting a state it already left
   (`sync(open, observedEpoch)`).
6. **Teardown is a first-class phase.** Disconnecting or destroying must release everything the
   controller acquired — listeners, scroll locks, an open modal `<dialog>`, a wrapping element. A
   teardown that skips that phase leaks state into later tests and later pages.
7. **No implicit completion promises as contracts.** Existing consumers `await _showComplete` /
   `_hideComplete`. Those may stay as compatibility, but they must not be the mechanism a mixin relies
   on to stay consistent: a promise that only settles on the happy path turns a suppressed transition
   into a hang.

## Why the mixin should be generated

A hand-written mixin next to a controller has to repeat the controller's members and its types, and the
two drift. The target direction is a **transform**: the controller is the source of truth, and the
mixin plus its types are produced from it.

Two acceptable shapes, in the order we would evaluate them:

1. **Controller → mixin, generated.** The transform emits a mixin that implements the members above and
   wraps the controller. Types come from the controller's own declarations, so a renamed property is a
   compile error in consumers and a diff in the generated mixin, never a silent mismatch.
2. **Controller → Lit class, generated.** The transform adds reactive properties to a class and adds the
   corresponding types to its host. Useful where a mixin would be overkill and the component is the only
   consumer.

Requirements in both shapes: the output is deterministic (same input, same bytes), the members are
enumerable from one generated list, the contract above is the _only_ surface, and the generated mixin
stays tree-shakable. A gate per step: the same behavioural suites that guard today's implementation must
pass unchanged against the generated surface.

## How to tell the principle is being kept

- You can list a mixin's whole contract with the controller in one table, and every member has one
  direction.
- A test can drive the controller directly, without a DOM, and cover the timing.
- Suppressing a transition, tearing down mid-transition, or losing a race cannot silently hang a
  consumer.
- Renaming a controller member breaks the build instead of the runtime.

## Reference

The measured cases behind these rules — a consumer mirror that re-entered `show()` after its own
close, sync tests that awaited `_hideComplete`, a wrapping modal `<dialog>` that survived teardown and
redirected later Escape presses to the wrong element — are recorded in the research section
(`docs/fundamentals/systems/overlays/research.md`) and in ADR 0001–0003 of the disclosure system.
