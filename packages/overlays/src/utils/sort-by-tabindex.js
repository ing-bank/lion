/**
 * Implementation based on:
 * https://github.com/PolymerElements/iron-overlay-behavior/blob/master/iron-focusables-helper.html
 * The original implementation does not work for non-Polymer web components, and contains several
 * bugs on IE11.
 */

/**
 * @param {HTMLElement} a
 * @param {HTMLElement} b
 * @returns {Boolean}
 */
function hasLowerTabOrder(a, b) {
  // Normalize tabIndexes
  // e.g. in Firefox `<div contenteditable>` has `tabIndex = -1`
  const ati = Math.max(a.tabIndex, 0);
  const bti = Math.max(b.tabIndex, 0);
  return ati === 0 || bti === 0 ? bti > ati : ati > bti;
}

/**
 * @param {HTMLElement[]} left
 * @param {HTMLElement[]} right
 * @returns {HTMLElement[]}
 */
function mergeSortByTabIndex(left, right) {
  /** @type {HTMLElement[]} */
  const result = [];
  while (left.length > 0 && right.length > 0) {
    if (hasLowerTabOrder(left[0], right[0])) {
      // @ts-ignore
      result.push(right.shift());
    } else {
      // @ts-ignore
      result.push(left.shift());
    }
  }

  return [...result, ...left, ...right];
}

/**
 * @param {HTMLElement[]} elements
 * @returns {HTMLElement[]}
 */
export function sortByTabIndex(elements) {
  // Implement a merge sort as Array.prototype.sort does a non-stable sort
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  const len = elements.length;
  if (len < 2) {
    return elements;
  }

  const pivot = Math.ceil(len / 2);
  const left = sortByTabIndex(elements.slice(0, pivot));
  const right = sortByTabIndex(elements.slice(pivot));
  return mergeSortByTabIndex(left, right);
}
