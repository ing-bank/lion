# Porting tests from `DisclosureController.test.js` to `OverlayController.test.js`

Context: comparing `packages/ui/components/disclosure-system/test/DisclosureController.test.js`
(on `origin/feat/menu-system--visibilityToggleController-rebased`) against
`packages/ui/components/overlays/test/OverlayController.test.js` (on `feat/menu-system`).

Beyond the `OverlayController` → `DisclosureController` renaming churn, there are 3 substantive
differences. Test 1 has already been ported (see below). Tests 2 and 3 need a decision because
porting them requires porting behavior/API changes that don't exist yet on `feat/menu-system`.

## 1. Done — `on [Escape] press in child overlay: parent hides, child stays shown`

Was `it.skip(...)` on `feat/menu-system` with a `TODO` about flakiness. The rebased branch fixed
it by awaiting `_showComplete`/`_hideComplete` promises (which already exist on `OverlayController.js`
on `feat/menu-system`) instead of racing on `waitUntil`. Ported as-is and un-skipped;
verified green on Firefox/Chromium/Webkit (111 passed, 0 failed, 4 skipped).

## 2. Not ported — `hides when window is blurred inside iframe`

Renamed/rewritten from `hides when window is blurred (useful for iframes)`. The new version only
expects the overlay to hide on window blur when
`_mockableCloseOnOutsideClick.isInsideIframe` is true, importing this mock from a new
`closeOnOutsideClickHandler.js` feature module.

Concern: `OverlayController.js` on `feat/menu-system` has no such module/mock and no
`isInsideIframe` guard around its blur-handling logic. Porting the test as-is would fail
immediately (or require inlining a partial reimplementation), and quietly changes behavior
(overlays would stop closing on window blur unless embedded in an iframe). This needs the
corresponding source behavior change ported first, or a product decision on whether
`OverlayController` should adopt that "only close on blur inside iframe" restriction at all.

## 3. Not ported — `elementToFocusOnShow` (was `focusContentOnOpen`)

The `describe('focusContentOnOpen', ...)` block was renamed to `describe('elementToFocusOnShow', ...)`
and a new config test uses `elementToFocusOnShow: cfg.contentNode`.

Concern: `OverlayController.js` on `feat/menu-system` only supports the boolean
`focusContentOnOpen` option — there is no `elementToFocusOnShow` config API. Porting this test
would fail against the current implementation. This is an API surface change (new config option,
possibly replacing/complementing the old boolean), not just a test fix, so it needs the
corresponding `OverlayController.js` change (and a call on whether `focusContentOnOpen` is kept,
deprecated, or removed) before the test can be ported.

## Recommendation

Decide per item:

- (2) whether to port the iframe-blur behavior change into `OverlayController.js`, or leave
  `OverlayController` behavior as-is and treat this as Disclosure-system-only behavior.
- (3) whether to add `elementToFocusOnShow` to `OverlayController.js`'s config (and decide the
  relationship with `focusContentOnOpen`), or leave it as a Disclosure-system-only addition.

Once a decision is made, the corresponding source changes should land first, then the tests can
be ported the same way test 1 was.
