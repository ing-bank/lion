/**
 * Implementation based on: https://github.com/PolymerElements/iron-overlay-behavior/blob/master/iron-focusables-helper.html
 * The original implementation does not work for non-Polymer web components,
 * and contains several bugs on IE11.
 */

import { isVisible } from './is-visible.js';
import { sortByTabIndex } from './sort-by-tabindex.js';

// IE11 supports matches as 'msMatchesSelector'
const matchesFunc = 'matches' in Element.prototype ? 'matches' : 'msMatchesSelector';

/**
 * @param {HTMLElement} element
 * @returns {boolean} Whether the element matches
 */
function isFocusable(element) {
  // Elements that cannot be focused if they have [disabled] attribute.
  if (element[matchesFunc]('input, select, textarea, button, object')) {
    return element[matchesFunc](':not([disabled])');
  }

  // Elements that can be focused even if they have [disabled] attribute.
  return element[matchesFunc]('a[href], area[href], iframe, [tabindex], [contentEditable]');
}

/**
 * @param {HTMLElement} element
 * @returns {Number}
 */
function getTabindex(element) {
  if (isFocusable(element)) {
    return Number(element.getAttribute('tabindex') || 0);
  }
  return -1;
}

/**
 * @param {HTMLElement|HTMLSlotElement} element
 */
function getChildNodes(element) {
  if (element.localName === 'slot') {
    const slot = /** @type {HTMLSlotElement} */ (element);
    return slot.assignedNodes({ flatten: true });
  }

  const { children } = element.shadowRoot || element;
  // On IE11, SVGElement.prototype.children is undefined
  return children || [];
}

/**
 * @param {Element} element
 * @returns {boolean}
 */
function isVisibleElement(element) {
  if (element.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  // A slot is not visible, but it's children might so we need
  // to treat is as such.
  if (element.localName === 'slot') {
    return true;
  }

  return isVisible(/** @type {HTMLElement} */ (element));
}

/**
 * Recursive function that traverses the children of the target node and finds
 * elements that can receive focus. Mutates the nodes property for performance.
 *
 * @param {Element} element
 * @param {HTMLElement[]} nodes
 * @returns {boolean} whether the returned node list should be sorted. This happens when
 *                    there is an element with tabindex > 0
 */
function collectFocusableElements(element, nodes) {
  // If not an element or not visible, no need to explore children.
  if (!isVisibleElement(element)) {
    return false;
  }

  const el = /** @type {HTMLElement} */ (element);
  const tabIndex = getTabindex(el);
  let needsSort = tabIndex > 0;
  if (tabIndex >= 0) {
    nodes.push(el);
  }

  const childNodes = /** @type {Element[]} */ (getChildNodes(el));
  for (let i = 0; i < childNodes.length; i += 1) {
    needsSort = collectFocusableElements(childNodes[i], nodes) || needsSort;
  }
  return needsSort;
}

/**
 * @param {Element} element
 * @returns {HTMLElement[]}
 */
export function getFocusableElements(element) {
  /** @type {HTMLElement[]} */
  const nodes = [];

  const needsSort = collectFocusableElements(element, nodes);
  return needsSort ? sortByTabIndex(nodes) : nodes;
}
