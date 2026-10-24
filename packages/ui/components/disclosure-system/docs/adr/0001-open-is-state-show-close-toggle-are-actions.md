# `open` is a state; `show`, `close` and `toggle` are actions

Status: accepted

`open` names the state of a disclosure and is exposed as a property, an `[open]` attribute and the
`:open` pseudo class — never as a method. The actions that change it are `show`, `close` and
`toggle`, matching the platform's `showPopover()`/`hidePopover()`/`togglePopover()`, `showModal()`/
`close()` and the Invoker Commands (`show-popover`, `hide-popover`, `show-modal`, `close`,
`toggle-popover`), which deliberately contain no `open` command. This keeps one word per concept
across elements, controllers, docs and the platform — and it removes the collision between an
`open()` method and an `open` state.

## Considered Options

- `<dialog>`-style verbs (`show()`, `close()`, no state word): rejected, because the state is read
  constantly and would end up with a second name (`opened`).
- `open()`/`hide()` as verbs: rejected — `open` would then be both a method and a state, and
  `hide` has no platform counterpart.

## Consequences

The legacy adapter maps `opened` → `open` and `hide()` → `close()`. Public code keeps working,
new code reads like the platform.

## Amendment

The action pair is `show()` / `hide()`, not `show()` / `close()`: `closed` is a state, and an action must
be a true opposite of another action (`show`/`hide`, `open`/`close`). The core therefore exposes
`hide()` as the canonical action, and `close()` stays as a deprecated alias so code that already calls it
keeps working. See `docs/guides/principles/terminology.md`.
