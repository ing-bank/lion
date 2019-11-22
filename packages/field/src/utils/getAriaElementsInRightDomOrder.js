/**
 * @desc Let the order of adding ids to aria element by DOM order, so that the screen reader
 * respects visual order when reading:
 * https://developers.google.com/web/fundamentals/accessibility/focus/dom-order-matters
 * @param {array} descriptionElements - holds references to description or label elements whose
 * id should be returned
 * @returns {array} sorted set of elements based on dom order
 *
 */
export function getAriaElementsInRightDomOrder(descriptionElements, { reverse } = {}) {
  const putPrecedingSiblingsAndLocalParentsFirst = (a, b) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
    const pos = a.compareDocumentPosition(b);
    if (pos === Node.DOCUMENT_POSITION_PRECEDING || pos === Node.DOCUMENT_POSITION_CONTAINED_BY) {
      return 1;
    }
    return -1;
  };

  const descriptionEls = descriptionElements.filter(el => el); // filter out null references
  descriptionEls.sort(putPrecedingSiblingsAndLocalParentsFirst);
  if (reverse) {
    descriptionEls.reverse();
  }
  return descriptionEls;
}
