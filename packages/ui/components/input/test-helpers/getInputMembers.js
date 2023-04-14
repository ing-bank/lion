import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';

/**
 * @typedef {import('../src/LionInput.js').LionInput} LionInput
 * @typedef {import('../../form-core/types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 */

/**
 * @param { LionInput } el
 */
export function getInputMembers(el) {
  const obj = getFormControlMembers(/** @type { * & FormControlHost } */ (el));
  return {
    ...obj,
    _inputNode: /** @type {HTMLInputElement} */ (obj._inputNode),
  };
}
