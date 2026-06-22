/**
 * @param {HTMLElement} el
 * @param {string} key
 * @param {string} code
 */
export function mimicKeyPress(el, key, code = '') {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, code }));
  el.dispatchEvent(new KeyboardEvent('keyup', { key, code }));
}
