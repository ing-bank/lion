---
'@lion/ui': patch
---

### Overlays & Performance Optimization

- **Reverse Width Inheritance in `OverlayController`**: Added declarative `inheritsContentWidth` (`'max'` | `'full'` | `'min'` | `'none'`) and `widthOffset` options to `OverlayController`. Width inheritance is monitored asynchronously via `ResizeObserver` with frame-batched updates (`requestAnimationFrame`), eliminating synchronous geometry reads (`getBoundingClientRect()`) and forced layout flushes.
- **Refactored `LionSelectRich`**: Refactored `LionSelectRich` to configure `inheritsContentWidth: 'full'` and `widthOffset: this._arrowWidth` on `OverlayController`. Removed legacy forced layout measurement code from `_alignInvokerWidth()`.
- **Eliminated Body Layout Flush in `OverlaysManager`**: Moved body scrollbar dimension calculations in `requestToKeepBodySize` to the `before-show` phase _before_ `overlays-scroll-lock` (`overflow: hidden`) is added to `document.body`. This prevents forced document layout recalculations when opening overlays.
- **Modern `checkVisibility()` in `isVisible`**: Updated `isVisible()` utility to use `element.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true })` on supporting browsers, avoiding layout flushes caused by accessing geometry properties (`offsetWidth`, `offsetHeight`, `getClientRects()`).
- **CSS Containment Best Practices**: Applied `contain: layout` and `contain: content` across core component containers (`overlayShadowDomStyle.js`, `drawerStyle.js`, `LionOption.js`, `LionSelectInvoker.js`, `LionAccordion.js`, `LionCombobox.js`, `LionCollapsible.js`, `LionSelectedFileList.js`) to isolate layout and paint calculations from the rest of the page.
