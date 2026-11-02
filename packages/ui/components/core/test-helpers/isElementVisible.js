/**
 * Visibility check that works on every engine in our matrix.
 *
 * `Element.checkVisibility()` only exists in Chromium 105+, Firefox 125+ and Safari 17.4+ - the older
 * end of the matrix (Firefox 113, WebKit 16.4, the Safari 16 generation) throws on it. Those engines
 * answer the same question through layout: a node that is not rendered has no client rects.
 *
 * @param {Element | null | undefined} el
 * @returns {boolean}
 */
export function isElementVisible(el) {
  if (!el) {
    return false;
  }
  // @ts-ignore [checkVisibility lives on the polyfilled dialog in some suites]
  if (typeof el.checkVisibility === 'function') {
    // @ts-ignore
    return el.checkVisibility();
  }
  return el.getClientRects().length > 0;
}
