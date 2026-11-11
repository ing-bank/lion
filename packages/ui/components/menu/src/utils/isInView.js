/**
 * Determines whether element is fully visible within container
 *
 * @param {HTMLElement} container
 * @param {HTMLElement} element
 */
export function isInView(container, element) {
  const cTop = container.scrollTop;
  const cBottom = cTop + container.clientHeight;
  const eTop = element.offsetTop;
  const eBottom = eTop + element.clientHeight;
  return eTop >= cTop && eBottom <= cBottom;
}
