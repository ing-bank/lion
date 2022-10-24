import { getFormControlMembers } from '@lion/components/form-core-test-helpers.js';

/**
 * @typedef {import('../src/LionInput').LionInput} LionInput
 * @typedef {import('@lion/form-core/types/FormControlMixinTypes').FormControlHost} FormControlHost
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
