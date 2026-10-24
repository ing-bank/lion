# The compatibility layer ships as subpath exports inside `@lion/ui`

Status: accepted

Extensions import overlays through `@lion/ui/overlays.js`, so that path must keep resolving to a
module with the legacy names, events and config keys. The compatibility layer therefore lives inside
`@lion/ui` (`packages/ui/components/overlays/`), next to the clean layer in
`packages/ui/components/disclosure-system/`, and both are published through the existing subpath
exports.

## Considered Options

- A separate package (for example `@lion/ui-overlays-compat`): rejected — the old path would have to
  re-export it anyway, so consumers pay an extra indirection and we pay an extra release unit
  without gaining a boundary.
- Putting the legacy quirks in the main bundle of `overlays.js`: rejected — new consumers would carry
  code they never execute; the behavioural shims are dynamically imported only when a legacy key or
  method is used.

## Consequences

New consumers can import the clean layer and pay for nothing but the core; existing extensions keep
their entry point and get the adapter for free. Removing the duplicate legacy implementation later is
a separate, reviewable step.
