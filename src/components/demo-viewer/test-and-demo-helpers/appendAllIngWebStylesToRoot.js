// @ts-nocheck
import { cardStyle } from 'ing-web/card.js';
import { headlineStyle } from 'ing-web/headline.js';
import { imageStyle } from 'ing-web/image.js';
import { linkStyle, linkCTAStyle } from 'ing-web/link.js';
import { listOrderedStyle } from 'ing-web/list-ordered.js';
import { listUnorderedStyle } from 'ing-web/list-unordered.js';
import { paragraphStyle } from 'ing-web/paragraph.js';
import { surfaceStyle } from 'ing-web/surface.js';

const supportsAdoptingStyleSheets =
  window.ShadowRoot &&
  // @ts-ignore
  (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
  'adoptedStyleSheets' in Document.prototype &&
  'replace' in CSSStyleSheet.prototype;

/**
 * @param {DocumentOrShadowRoot} documentOrShadowRoot
 * @param {CSSStyleSheet|import('ing-web/core.js').CSSResult[]} sheets
 */
export function appendStylesToRoot(documentOrShadowRoot, sheets) {
  if (supportsAdoptingStyleSheets) {
    for (const sheet of sheets) {
      documentOrShadowRoot.adoptedStyleSheets.push(sheet);
    }
  } else {
    for (const sheet of sheets) {
      const styleEl = document.createElement('style');
      // @ts-ignore
      styleEl.textContent = sheet.cssText;
      if (documentOrShadowRoot === document) {
        /** @type {Document} */ (documentOrShadowRoot).head.appendChild(styleEl);
      } else {
        /** @type {ShadowRoot} */ (documentOrShadowRoot).appendChild(styleEl);
      }
    }
  }
}

/**
 * @param {DocumentOrShadowRoot} documentOrShadowRoot
 */
export function appendAllIngWebStylesToRoot(documentOrShadowRoot) {
  appendStylesToRoot(documentOrShadowRoot, [
    cardStyle,
    headlineStyle,
    surfaceStyle,
    imageStyle,
    linkStyle,
    linkCTAStyle,
    listOrderedStyle,
    listUnorderedStyle,
    paragraphStyle,
  ]);
}
