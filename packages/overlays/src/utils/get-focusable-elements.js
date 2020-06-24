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
 * @param {HTMLElement} element
 */
function getChildNodes(element) {
  if (element.localName === 'slot') {
    /** @type {HTMLSlotElement} */
    const slot = element;
    return slot.assignedNodes({ flatten: true });
  }

  const { children } = element.shadowRoot || element;
  // On IE11, SVGElement.prototype.children is undefined
  return children || [];
}

/**
 * @param {Node} node
 * @returns {boolean}
 */
function isVisibleElement(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  // A slot is not visible, but it's children might so we need
  // to treat is as such.
  if (node.localName === 'slot') {
    return true;
  }

  return isVisible(/** @type {HTMLElement} */ (node));
}

/**
 * Recursive function that traverses the children of the target node and finds
 * elements that can receive focus. Mutates the nodes property for performance.
 *
 * @param {Node} node
 * @param {HTMLElement[]} nodes
 * @returns {boolean} whether the returned node list should be sorted. This happens when
 *                    there is an element with tabindex > 0
 */
function collectFocusableElements(node, nodes) {
  // If not an element or not visible, no need to explore children.
  if (!isVisibleElement(node)) {
    return false;
  }

  /** @type {HTMLElement} */
  const element = node;

  const tabIndex = getTabindex(element);
  let needsSort = tabIndex > 0;
  if (tabIndex >= 0) {
    nodes.push(element);
  }

  const childNodes = getChildNodes(element);
  for (let i = 0; i < childNodes.length; i += 1) {
    needsSort = collectFocusableElements(childNodes[i], nodes) || needsSort;
  }
  return needsSort;
}

/**
 * @param {Node} node
 * @returns {HTMLElement[]}
 */
export function getFocusableElements(node) {
  /** @type {HTMLElement[]} */
  const nodes = [];

  const needsSort = collectFocusableElements(node, nodes);
  return needsSort ? sortByTabIndex(nodes) : nodes;
}
