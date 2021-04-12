import { getFormControlMembers } from '@lion/form-core/test-helpers';

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
