/**
 * @typedef {HTMLSelectElement|HTMLElement & {modelValue:string}} DropdownElement
 */

/**
 * @param {DropdownElement} dropdownEl
 * @param {string} value
 */
export function mimicUserChangingDropdown(dropdownEl, value) {
  if ('modelValue' in dropdownEl) {
    // eslint-disable-next-line no-param-reassign
    dropdownEl.modelValue = value;
    dropdownEl.dispatchEvent(
      new CustomEvent('model-value-changed', { detail: { isTriggeredByUser: true } }),
    );
  } else {
    // eslint-disable-next-line no-param-reassign
    dropdownEl.value = value;
    dropdownEl.dispatchEvent(new Event('change'));
    dropdownEl.dispatchEvent(new Event('input'));
  }
}
