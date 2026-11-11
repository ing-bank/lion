/* eslint-disable no-bitwise */
const moveDownConditions = [
  Node.DOCUMENT_POSITION_PRECEDING,
  Node.DOCUMENT_POSITION_CONTAINS,
  Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING,
];

/**
 * Let the order of adding ids to aria element by DOM order, so that the screen reader
 * respects visual order when reading:
 * https://developers.google.com/web/fundamentals/accessibility/focus/dom-order-matters
 * @param {Element[]} descriptionElements - holds references to description or label elements whose
 * id should be returned
 * @param {Object} opts
 * @param {boolean} [opts.reverse]
 * @returns {Element[]} sorted set of elements based on dom order
 */
export function getAriaElementsInRightDomOrder(descriptionElements, { reverse } = {}) {
  /**
   * @param {Node} a
   * @param {Node} b
   * @returns {-1|1}
   */
  const putPrecedingSiblingsAndLocalParentsFirst = (a, b) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
    const pos = a.compareDocumentPosition(b);
    return moveDownConditions.includes(pos) ? 1 : -1;
  };

  const descriptionEls = descriptionElements.filter(el => el); // filter out null references
  descriptionEls.sort(putPrecedingSiblingsAndLocalParentsFirst);
  if (reverse) {
    descriptionEls.reverse();
  }
  return descriptionEls;
}
