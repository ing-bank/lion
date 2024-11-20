import { getDeepActiveElement } from '../src/getDeepActiveElement.js';
/**
 * Readable alternative for `expect(el).to.equal(document.activeElement);`.
 * While this is readable by itself, it makes Web Test Runner hang completelt in many occasions.
 * Therefore it's better to write:
 * `expect(isActiveElement(el)).to.be.true;`
 * @param {Element} el
 * @param {{deep?: boolean}} opts
 * @returns {boolean}
 */
export function isActiveElement(el, { deep = false } = {}) {
  const activeEl = deep ? getDeepActiveElement() : document.activeElement;
  return el === activeEl;
}
