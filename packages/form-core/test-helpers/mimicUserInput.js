// @ts-nocheck
/**
 * @param {HTMLElement} formControl
 * @param {?} newViewValue
 * @param {{caretIndex?:number}} config
 */
export function mimicUserInput(formControl, newViewValue, { caretIndex } = {}) {
  formControl.value = newViewValue; // eslint-disable-line no-param-reassign
  if (caretIndex) {
    // eslint-disable-next-line no-param-reassign
    formControl._inputNode.selectionStart = caretIndex;
    // eslint-disable-next-line no-param-reassign
    formControl._inputNode.selectionEnd = caretIndex;
  }
  formControl._inputNode.dispatchEvent(new Event('input', { bubbles: true }));
}
