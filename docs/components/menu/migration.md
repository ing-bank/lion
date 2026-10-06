---
title: 'Menu: Migration from the prerelease'
parts:
  - Menu
  - Migration
eleventyNavigation:
  key: 'Menu: Migration'
  order: 30
  parent: Menu
  title: Migration
---

# Menu: Migration from the prerelease

The menu shipped as prereleases of `@lion/ui` (dist-tag `menu-system`, versions
`0.16.1-menu-system.N`, driven by the `.changeset/pre.json` pre-mode of the same name). It now lands
as a regular minor of `@lion/ui`: pre-mode is left behind and `@lion/menu` (the `0.0.0` scratch
manifest of the 2021 branch) is gone. Everything below is about moving an implementation from those
prereleases to this version.

## 1. Package and entry points

| prerelease                                                                            | now                                                                                                                                             |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `@lion/ui@0.16.1-menu-system.N`                                                       | the released `@lion/ui` minor                                                                                                                   |
| `@lion/ui/exports/menu.js`                                                            | same path; exports `LionMenu`, `LionItem`, `LionMenuitem`                                                                                       |
| `@lion/ui/define/lion-menu.js`                                                        | unchanged                                                                                                                                       |
| `@lion/ui/define/lion-item.js`                                                        | unchanged                                                                                                                                       |
| `@lion/ui/define/lion-menuitem.js`                                                    | new entry (see 3)                                                                                                                               |
| `@lion/ui/define/lion-menu-overlay.js`, `.../lion-toolbar.js`, `.../lion-tree.js`     | removed                                                                                                                                         |
| `@lion/ui/exports/menu-test-suites.js`                                                | same path; exports `runInteractiveListMixinSuite`, `runMultiLevelListMixinSuite`, `runLionMenuInteractionsSuite` (was `runLionMenuHybridSuite`) |
| `@lion/ui/components/menu/index.js`, `.../menu/lion-menu.js`, `.../menu/package.json` | removed                                                                                                                                         |

Only `@lion/ui/exports/*` and `@lion/ui/define/*` are in the package `exports` map, so the
component paths (`@lion/ui/components/...`) were never importable — that has not changed.

## 2. Components that left the package

| prerelease          | now                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `LionMenuOverlay`   | the overlay integration (`OverlayWithListInvokerMixin`) lives on `LionMenu` itself: `openable-mode="overlay"` |
| `LionMenuHybrid`    | same as above; `openable-mode="disclosure"` (the default) is the old disclosure behaviour                     |
| `LionToolbar`       | `docs/components/menu/src/DemoToolbar.js` (`<demo-toolbar>`, a `LionMenu` with `bar`)                         |
| `LionTree`          | `docs/components/menu/src/DemoTree.js` (`<demo-tree>`, a `MultiLevelListMixin` host with `role="tree"`)       |
| `LionSpinbutton`    | `docs/components/menu/src/DemoSpinButton.js` (`<demo-spin-button>`)                                           |
| `LionNavigationBar` | `docs/components/menu/src/DemoNavigationBar.js` (`<demo-navigation-bar>`)                                     |

The tags `lion-tree`, `lion-toolbar`, `lion-spinbutton`, `lion-menu-overlay` and
`lion-navigation-bar` are no longer registered anywhere. If you used one of those elements, either
copy the demo implementation into your project (they are configuration on top of the same mixins) or
configure the mixin yourself (`_listRole`, `_activeMode`, `bar`).

## 3. Element definitions

- `<lion-menu>`, `<lion-item>` and `<lion-menuitem>` keep their tag names.
- `lion-menuitem` now has its own define entry. Before, importing
  `components/menu/src/InteractiveListMixin.js` registered it as a side effect; importing the mixin no
  longer defines any element.
- Put your `customElements.define` calls (or the `@lion/ui/define/*` imports) in one place, as
  before: the package's `sideEffects` list only covers the define entries.

## 4. Api that did not change

`LionMenu`, `LionItem` and `LionMenuitem` keep their tag names and the following properties, so
implementations that only read or set those keep working: `selectionFollowsFocus`, `noPreselect`,
`itemWrap`, `activeIndex`, `checkedIndex`, `listItems`, `_activeMode`, `_listRole` (all from
`InteractiveListMixin`), plus `bar` and `openableMode` on `LionMenu`.

## 5. Renamed api: this component now speaks the focusgroup vocabulary

The old names came from the 2021 branch; they are replaced by the
[focusgroup](https://open-ui.org/components/focusgroup.explainer/) vocabulary, so implementations
that follow the platform proposal find the same names here. This is a hard rename: the old names are
gone.

| prerelease | now | note |
| --- | --- | --- |
| `orientation="vertical"` / `orientation="horizontal"` | `axis="block"` / `axis="inline"` | `block` is the default; the attribute reflects |
| `rotateKeyboardNavigation` | `wrap` | the focusgroup axis/wrap modifiers |
| `multipleChoice` | `multiple` | the platform name (`<select multiple>`) |

```html
<lion-menu axis="inline" wrap multiple>
  <lion-menuitem>Item 1</lion-menuitem>
  <lion-menuitem>Item 2</lion-menuitem>
</lion-menu>
```

Tokens of the focusgroup *attribute* that are not part of this api: the behavior token (`menu`,
`menubar`, `toolbar`, `listbox`, `tablist`, ...) is the role/active mode configuration
(`_listRole`/`_activeMode`), `nomemory` has no counterpart (there is no focus-memory api here), and
`focusgroupstart` / `focusgroup="none"` are not mapped. The platform attribute itself is not read by
this component: on Chrome 150 and newer the browser acts on it when it is present in the dom, so do
not put it on a lion element together with the properties below (native focusgroup behavior and this
mixin's keyboard handling would both apply).

## 6. Api that is new

| api | change |
| --- | --- |
| `OverlayConfig` | accepts `placementMode: 'custom'`, `syncChildrenCloseState`, `elementToFocusOnShow`, `isActivated`, `requireConnectedNodes` |
| `@lion/ui/exports/overlays.js` | exports `withClickInteraction` and `withHoverInteraction` |
| types | `components/menu/types/*` are emitted `.ts` now; in the prerelease `InteractiveListMixinTypes.d.ts` was an input file that never reached `dist-types`, so editors could not resolve it |

## 7. Migration checklist

1. Replace the prerelease dependency with the released `@lion/ui` version and drop any
   `menu-system` dist-tag pin.
2. Keep the `@lion/ui/exports/menu.js` and `@lion/ui/define/*` imports; no element was renamed.
3. Rename the properties: `orientation` -> `axis` (value `vertical` -> `block`, `horizontal` ->
   `inline`), `rotateKeyboardNavigation` -> `wrap`, `multipleChoice` -> `multiple`. The attribute
   names follow the property names.
4. Replace `LionMenuHybrid`/`LionMenuOverlay` usage with `LionMenu` + `openable-mode`, and
   `LionToolbar`/`LionTree`/`LionSpinbutton`/`LionNavigationBar` with your own copy of the demo
   implementations.
5. Import `@lion/ui/define/lion-menuitem.js` if you relied on the side-effect definition of
   `lion-menuitem`.
6. If you called `runLionMenuHybridSuite`, call `runLionMenuInteractionsSuite` instead.

## 8. Not covered yet

- The mixins themselves (`InteractiveListMixin`, `MultiLevelListMixin`, `MoreButtonMenuMixin`,
  `OverlayWithListInvokerMixin`) are not re-exported from `@lion/ui/exports/menu.js`, and deep
  component paths are not in the package `exports` map. If you extend one of them, the test suites in
  `@lion/ui/exports/menu-test-suites.js` are the supported surface; your own copy of the mixin is the
  workaround until that is decided.
- The `MoreButtonMenuMixin` item-wrap strategy is still "more-menu" only (`itemWrap`).
