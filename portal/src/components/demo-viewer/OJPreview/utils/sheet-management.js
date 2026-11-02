import { supportsAdoptingStyleSheets } from '../constants.js';
import { replaceTxtWithModifierDemoClasses } from './css-modifier.js';

/**
 * @param {HTMLElement & {shadowRoot: ShadowRoot}} el
 * @param {{ strategy?: 'web-component' | 'css-component' }} opts
 */
export function getSheetsForEl(el, { strategy = 'web-component' } = {}) {
  // @ts-expect-error
  const searchRoot = el.parentElement || el.getRootNode()?.host;
  const elsFound = [el];
  if (strategy === 'css-component') {
    elsFound.push(searchRoot);
  } else {
    const scopedElNames = Object.keys({
      ...searchRoot.constructor?.scopedElements,
      // @ts-expect-error
      ...el.constructor?.scopedElements,
    });
    const childrenToConsider = scopedElNames.filter(
      scopedEl => scopedEl.startsWith('lion-') || scopedEl.startsWith('ing-'),
    );
    for (const child of childrenToConsider) {
      let childEl = el.shadowRoot.querySelector(child);
      if (!childEl) {
        childEl = el.querySelector(child);
      }
      if (childEl) {
        // @ts-expect-error
        elsFound.push(childEl);
      }
    }
  }

  const sheetsOrStyles = [];
  for (const element of elsFound) {
    if (supportsAdoptingStyleSheets) {
      sheetsOrStyles.push(...element.shadowRoot.adoptedStyleSheets);
    } else {
      sheetsOrStyles.push(...Array.from(element.shadowRoot?.querySelectorAll('style') || []));
    }
  }

  return sheetsOrStyles;
}

/**
 *
 * @param {(CSSStyleSheet|HTMLStyleElement)[]} sheetsOrStyles
 * @param {string[]} states
 */
export function replaceInSheets(sheetsOrStyles, states) {
  for (const sheetOrStyle of sheetsOrStyles) {
    if (sheetOrStyle instanceof CSSStyleSheet) {
      const sheet = sheetOrStyle;

      const cssTxt = Array.from(sheet.cssRules)
        .map(rule => rule.cssText)
        .join('\n');
      sheet.replaceSync(replaceTxtWithModifierDemoClasses(cssTxt, states));
    } else {
      const style = sheetOrStyle;

      const cssTxt = style.innerHTML;
      style.innerHTML = replaceTxtWithModifierDemoClasses(cssTxt, states);
    }
  }
}
