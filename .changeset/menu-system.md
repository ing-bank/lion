---
'@lion/ui': minor
---

Add the menu system to `@lion/ui`: `<lion-menu>`, `<lion-item>` and `<lion-menuitem>`, built on the
shared `InteractiveListMixin`, plus the `MultiLevelListMixin` and `MoreButtonMenuMixin` building
blocks. Menus, listboxes, toolbars and trees now share one keyboard-navigable interactive-list
implementation (roving tabindex, activedescendant, type-ahead, wrap-around, multi-level lists and
the "more" button pattern).

Consumers get `LionMenu`, `LionItem` and `LionMenuitem` from `@lion/ui/exports/menu.js`, the
`lion-menu`/`lion-item`/`lion-menuitem` element definitions, and `runInteractiveListMixinSuite`,
`runMultiLevelListMixinSuite` and `runLionMenuInteractionsSuite` for their own test suites.

Overlays gained the pieces the menu builds on:

- `OverlayConfig` accepts `placementMode: 'custom'`, `syncChildrenCloseState`,
  `elementToFocusOnShow`, `isActivated` and `requireConnectedNodes`; the unused internal
  `_noDialogEl` flag is gone.
- `withClickInteraction` and `withHoverInteraction` are exported from
  `@lion/ui/exports/overlays.js` (they were internal visibility-trigger partials).
