import { Validator } from '../Validator.js';

/**
 * @typedef {import('../../../types/FormControlMixinTypes.js.js').FormControlHost} FormControlHost
 */

export class Required extends Validator {
  static get validatorName() {
    return 'Required';
  }

  /**
   * In order to prevent accessibility violations, the aria-required attribute will
   * be combined with compatible aria roles: https://www.w3.org/TR/wai-aria/#aria-required
   */
  static get _compatibleRoles() {
    return [
      'combobox',
      'gridcell',
      'input',
      'listbox',
      'radiogroup',
      'select',
      'spinbutton',
      'textarea',
      'textbox',
      'tree',
    ];
  }

  /**
   * In order to prevent accessibility violations, the aria-required attribute will
   * be combined with compatible platform input elements
   */
  static get _compatibleTags() {
    return ['input', 'select', 'textarea'];
  }

  /**
   * We don't have an execute function, since the Required validator is 'special'.
   * The outcome depends on the modelValue of the FormControl and
   * FormControl.__isEmpty / FormControl._isEmpty.
   */

  /**
   * @param {FormControlHost & HTMLElement} formControl
   */
  // @ts-ignore [allow-protected] we are allowed to know FormControl protcected props in form-core
  // eslint-disable-next-line class-methods-use-this
  onFormControlConnect({ _inputNode: inputNode }) {
    if (inputNode) {
      const role = inputNode.getAttribute('role') || '';
      const elementTagName = inputNode.tagName.toLowerCase();
      const ctor = /** @type {typeof Required} */ (this.constructor);
      if (ctor._compatibleRoles.includes(role) || ctor._compatibleTags.includes(elementTagName)) {
        inputNode.setAttribute('aria-required', 'true');
      }
    }
  }

  /**
   * @param {FormControlHost & HTMLElement} formControl
   */
  // @ts-ignore [allow-protected] we are allowed to know FormControl protcected props in form-core
  // eslint-disable-next-line class-methods-use-this
  onFormControlDisconnect({ _inputNode: inputNode }) {
    if (inputNode) {
      inputNode.removeAttribute('aria-required');
    }
  }
}
