/**
 * Determines whether element is visible within container
 *
 * @param {HTMLElement} container
 * @param {HTMLElement} element
 * @param {Boolean} [partial]
 */
export function isInView(container, element, partial = false) {
  const cTop = container.scrollTop;
  const cBottom = cTop + container.clientHeight;
  const eTop = element.offsetTop;
  const eBottom = eTop + element.clientHeight;
  const isTotal = eTop >= cTop && eBottom <= cBottom;
  let isPartial;

  if (partial === true) {
    isPartial = (eTop < cTop && eBottom > cTop) || (eBottom > cBottom && eTop < cBottom);
  } else if (typeof partial === 'number') {
    if (eTop < cTop && eBottom > cTop) {
      isPartial = ((eBottom - cTop) * 100) / element.clientHeight > partial;
    } else if (eBottom > cBottom && eTop < cBottom) {
      isPartial = ((cBottom - eTop) * 100) / element.clientHeight > partial;
    }
  }
  return isTotal || isPartial;
}
