# A state machine owns the truth; the DOM is only a projection

Status: accepted

A disclosure's state lives in an explicit machine (`closed | opening | open | closing`) that
increments an epoch on every transition and writes the DOM from exactly one place. `open` reads from
the machine, never from computed display, and `sync(open, observedEpoch)` discards any request whose
observation predates the current epoch.

## Considered Options

- Deriving state from the DOM (`display !== 'none'`), as the current implementation does: rejected —
  a logical flag and the DOM are two authors of one truth, and every race we reproduced lived in a
  window where they disagreed.
- Rejecting stale mirrors with a timing window, a sticky flag or a value comparison: rejected after
  measuring all three; each one either failed to fix the consumer or broke another consumer
  (`lion-select-rich > overlay`, the `syncs opened to overlayController` tests).

## Consequences

A stale consumer update can no longer resurrect a closed overlay, and there is no ordering in which
the projection and the state disagree. `beforetoggle`/`toggle` flip synchronously, so completion
promises resolve on the terminal state instead of on animation.
