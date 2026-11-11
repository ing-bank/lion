/**
 * @typedef {import('../types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 * @typedef {import('../types/validate/ValidateMixinTypes.js').ValidateHost} ValidateHost
 */

/**
 * Exposes private and protected FormControl members
 * @param {FormControlHost} el
 */
export function getFormControlMembers(el) {
  // @ts-ignore [allow-protected] in test
  // eslint-disable-next-line
  const { _inputNode, _helpTextNode, _labelNode, _feedbackNode, _allValidators } = el;
  return {
    _inputNode: /** @type {* & FormControlHost} */ (el)._inputNode,
    _helpTextNode,
    _labelNode,
    _feedbackNode,
    _allValidators: /** @type {* & ValidateHost} */ (el)._allValidators,
  };
}
