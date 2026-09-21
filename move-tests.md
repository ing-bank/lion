## 2. Not ported — `hides when window is blurred inside iframe`

Renamed/rewritten from `hides when window is blurred (useful for iframes)`. The new version only. 2 reasons:

1. `expect(ctrl.isShown).to.be.true;` is different
2. relies on `_mockable`. Let's not use yet the it in this PR

## 3. Not ported — `elementToFocusOnShow` (was `focusContentOnOpen`)

The `describe('focusContentOnOpen', ...)` block was renamed to `describe('elementToFocusOnShow', ...)`
and a new config test uses `elementToFocusOnShow: cfg.contentNode`.

Concern: `OverlayController.js` on `feat/menu-system` only supports the boolean
`focusContentOnOpen` option — there is no `elementToFocusOnShow` config API. Porting this test
would fail against the current implementation. This is an API surface change (new config option,
possibly replacing/complementing the old boolean), not just a test fix, so it needs the
corresponding `OverlayController.js` change (and a call on whether `focusContentOnOpen` is kept,
deprecated, or removed) before the test can be ported.
