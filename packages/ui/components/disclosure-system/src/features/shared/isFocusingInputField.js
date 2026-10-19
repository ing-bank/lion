/**
 * @param {KeyboardEvent} event
 * @returns {boolean}
 */
export function isFocusingInputField(event) {
  const { target } = /** @type {{ target: HTMLElement | null }} */ (event);
  if (!target) {
    return false;
  }
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable ||
    target.getAttribute('role') === 'textbox'
  );
}
