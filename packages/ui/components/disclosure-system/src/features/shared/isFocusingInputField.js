/**
 * @param {KeyboardEvent} event
 * @returns {boolean}
 */
export function isFocusingInputField(event) {
  const target = /** @type {HTMLElement} */ (event.target);
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable ||
    target.getAttribute('role') === 'textbox'
  );
}
