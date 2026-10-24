---
parts:
  - Principles
  - Predictable timing
title: 'Predictable timing'
eleventyNavigation:
  key: 'Principles: Predictable timing'
  order: 90
  parent: Principles
  title: Predictable timing
---

# Predictable timing

Most "random" front-end bugs are timing bugs: a state that was already stale when it arrived, a value
set twice by two authors, an update that lands between a close and its completion. This principle lists
the rules we apply to every system that changes state over time — forms, overlays, navigation, data
fetching — so that behaviour is deterministic, cancellable and testable.

## Rules

1. **One transition at a time, and it is observable.** A state change flips the _observable_ part
   synchronously (the attribute, the property, the class). Anything expensive happens after that flip,
   never before it, so no caller can observe a half-applied change.
2. **Cancel before, never after.** A transition has a cancellable "before" phase (`beforetoggle`, cancelable)
   and a notification phase after it has happened (`toggle`). Asking permission happens before any side
   effect; undoing after the fact is not feedback.
3. **Requests carry the observation they came from.** Any value derived from an async observation may be
   stale on arrival. Stamp it with the version (epoch) it was read at, and drop it if the system has moved
   on. This is the rule that stops "it closed, then a late update reopened it".
4. **One writer per piece of state.** The DOM is a projection of the state, never a second source of it.
   Two writers are how a flag and the rendered result start disagreeing.
5. **No implicit ordering.** `setTimeout(0)`, `requestAnimationFrame`, `queueMicrotask` and un-awaited
   promises are not sequencing tools: they make order depend on the environment. Observable ordering is
   synchronous; where a consumer needs completion, that is an explicit, awaited contract.
6. **A suppressed transition must not hang anyone.** Completion promises exist for compatibility, but
   consistency may never depend on them: if a transition is refused, the promise settles anyway. A promise
   that only settles on the happy path turns a cancellation into a deadlock.
7. **Controller-originated changes are marked.** When the state owner writes a value that a consumer
   mirrors, that mirror must not read the write back as a new user intent. Mark the write, or route it
   through a dedicated path.
8. **Teardown is a phase, and it can arrive mid-transition.** Disconnecting, closing a page or destroying a
   component releases everything acquired: listeners, document-wide effects, scroll locks, open modal
   elements. Anything that traps focus or blocks input document-wide is _always_ released.
9. **Determinism over convenience.** The same sequence of inputs produces the same sequence of events —
   no dependency on tab order, test order, or which of two copies of a module happened to load first.
10. **Time is observable in tests.** Tests drive events explicitly and never sleep. If a test is
    order-dependent, the root cause is in the source: fix it there, not with a skip or a retry.

## Evidence from the overlay work

| symptom                                                                                                    | measured cause                                                                                                                      | rule it violated |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `display` was written 184 times while the layer was shown ~52 times (≈3.5 re-initialisations per instance) | display and the logical flag were two writers, each re-syncing the other                                                            | 4, 7             |
| a disclosure reopened right after closing                                                                  | an update derived from an older observation was applied late                                                                        | 3                |
| one flaky test in two runs: `Nested hidesOnEsc` closed the parent while the child stayed visible           | a focus-trapping modal `<dialog>` was never torn down, so later `focus()` calls were ignored and Escape landed on the wrong element | 8                |
| sync tests hung once the mirror was suppressed                                                             | the tests `await` a completion promise that only settled on the happy path                                                          | 6                |
| 12 changed test lines turned out not to be needed                                                          | the failures were symptoms; the source fix removed all of them                                                                      | 9                |

## How to check a system against this principle

- Can you name, for every transition, what is observable synchronously and what happens after?
- Does every async-derived request carry the version it was derived from?
- Is there exactly one place that writes the DOM (or the rendered state) from the state?
- Are all cancelable decisions taken _before_ side effects?
- Can teardown happen mid-transition without leaving a document-wide effect behind?
- Does the suite pass repeatedly, in any order, without retries?

## Reference

`docs/guides/principles/controller-to-mixin.md` (who owns the timing),
`docs/guides/principles/terminology.md` (what the states and actions are called), and ADR 0002 of the
disclosure system (`docs/fundamentals/systems/overlays/research.md` for the measurements).
