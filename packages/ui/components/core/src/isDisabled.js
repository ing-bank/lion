/**
 * @param {HTMLElement|undefined} elem
 */
export function isDisabled(elem) {
  return elem && (elem.hasAttribute('disabled') || elem.getAttribute('aria-disabled') === 'true');
}
