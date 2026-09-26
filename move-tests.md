Not ported

- `hides when window is blurred inside iframe`

  Renamed/rewritten from `hides when window is blurred (useful for iframes)`. The new version only. 2 reasons:
  1. `expect(ctrl.isShown).to.be.true;` is different. The opposit behaviour
  2. relies on `_mockable`. Let's not use yet the it in this PR

- `elementToFocusOnShow` (was `elementToFocusOnShow`)

  The `describe('elementToFocusOnShow', ...)` block was renamed to `describe('elementToFocusOnShow', ...)`
  and a new config test uses `elementToFocusOnShow: cfg.contentNode`.

  Test is the same, but the naming is different.
